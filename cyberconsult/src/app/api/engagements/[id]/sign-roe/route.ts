import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { createAuditLog, AuditActions } from '@/lib/audit';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: engagementId } = await params;
    const body = await request.json();
    const { hash, role } = body;

    if (!hash || !['client', 'consultant'].includes(role)) {
      return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
    }

    const engagement = await prisma.engagement.findUnique({
      where: { id: engagementId },
      include: { consultant: true },
    });

    if (!engagement) {
      return NextResponse.json({ error: 'Not Found' }, { status: 404 });
    }

    if (role === 'client' && engagement.clientId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    if (role === 'consultant' && engagement.consultant?.userId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    if (role === 'client' && engagement.roeClientSignedAt) {
      return NextResponse.json({ error: 'Already signed by client' }, { status: 400 });
    }
    if (role === 'consultant' && engagement.roeConsultantSignedAt) {
      return NextResponse.json({ error: 'Already signed by consultant' }, { status: 400 });
    }

    const storedHash = engagement.roeDocumentHash;
    if (storedHash && storedHash !== hash) {
      return NextResponse.json({ error: 'Hash mismatch' }, { status: 400 });
    }

    const updateData: Record<string, unknown> = {};
    if (!storedHash) {
      updateData.roeDocumentHash = hash;
    }

    if (role === 'client') {
      updateData.roeClientSignedAt = new Date();
    } else {
      updateData.roeConsultantSignedAt = new Date();
    }

    const isClientSigning = role === 'client';
    const hasOtherSigned = isClientSigning ? !!engagement.roeConsultantSignedAt : !!engagement.roeClientSignedAt;

    if (hasOtherSigned) {
      updateData.status = 'ROE_SIGNED';
    }

    const updatedEngagement = await prisma.engagement.update({
      where: { id: engagementId },
      data: updateData,
    });

    await createAuditLog({
      action: AuditActions.ROE_SIGNED,
      userId: user.id,
      resourceType: 'ENGAGEMENT',
      resourceId: engagementId,
      ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
      metadata: { role, hash },
    });

    return NextResponse.json({ data: updatedEngagement });
  } catch (error: unknown) {
    console.error('Sign ROE error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
