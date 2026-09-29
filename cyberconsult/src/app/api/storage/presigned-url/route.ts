import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { createAuditLog, AuditActions } from '@/lib/audit';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { engagementId, fileName, contentType, fileSize } = body;

    if (!engagementId || !fileName || !contentType || !fileSize) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
    if (fileSize > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'File size exceeds maximum limit of 100MB' }, { status: 400 });
    }

    const engagement = await prisma.engagement.findUnique({
      where: { id: engagementId },
      include: { consultant: true },
    });

    if (!engagement) {
      return NextResponse.json({ error: 'Engagement not found' }, { status: 404 });
    }

    const isClient = engagement.clientId === user.id;
    const isConsultant = engagement.consultant?.userId === user.id;

    if (!isClient && !isConsultant) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const uuid = crypto.randomUUID();
    const storageKey = `engagements/${engagementId}/${uuid}/${fileName}`;

    const presignedUrlResponse = {
      uploadUrl: `https://s3.amazonaws.com/${process.env.AWS_S3_BUCKET_NAME || 'cyberconsult-artifacts'}/${storageKey}?X-Amz-Expires=300`,
      storageKey,
      expiresIn: 300,
    };

    await createAuditLog({
      action: AuditActions.ARTIFACT_UPLOADED,
      userId: user.id,
      resourceType: 'ARTIFACT',
      resourceId: storageKey,
      ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
      metadata: { fileName, contentType, fileSize, engagementId },
    });

    return NextResponse.json({ data: presignedUrlResponse });
  } catch (error: unknown) {
    console.error('Presigned URL error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
