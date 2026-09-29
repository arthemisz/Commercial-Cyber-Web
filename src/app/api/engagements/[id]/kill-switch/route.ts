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
    const { reason } = body;

    const engagement = await prisma.engagement.findUnique({
      where: { id: engagementId },
    });

    if (!engagement) {
      return NextResponse.json({ error: 'Not Found' }, { status: 404 });
    }

    if (engagement.clientId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    if (engagement.status !== 'TESTING_ACTIVE') {
      return NextResponse.json({ error: 'Conflict: Invalid status' }, { status: 409 });
    }

    const updatedEngagement = await prisma.engagement.update({
      where: { id: engagementId },
      data: {
        status: 'ABORTED_KILL_SWITCH',
        killSwitchTriggeredAt: new Date(),
        killSwitchReason: reason || 'No reason provided',
      },
    });

    const ipAddress = request.headers.get('x-forwarded-for') || 'unknown';

    await createAuditLog({
      action: AuditActions.KILL_SWITCH_ENGAGED,
      userId: user.id,
      resourceType: 'ENGAGEMENT',
      resourceId: engagementId,
      ipAddress: ipAddress,
      metadata: { reason },
    });

    return NextResponse.json({ data: updatedEngagement });
  } catch (error: unknown) {
    console.error('Kill switch error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
