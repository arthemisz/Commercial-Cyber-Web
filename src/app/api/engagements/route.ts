import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { createAuditLog, AuditActions } from '@/lib/audit';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');

    const whereClause: Record<string, unknown> = {
      OR: [
        { clientId: user.id },
        { consultant: { userId: user.id } },
      ],
    };

    if (status) {
      whereClause.status = status;
    }

    const engagements = await prisma.engagement.findMany({
      where: whereClause,
      include: {
        consultant: {
          include: {
            user: true,
          }
        },
        milestones: true,
        _count: {
          select: { findings: true }
        }
      },
      orderBy: { updatedAt: 'desc' },
    });

    return NextResponse.json({ data: engagements });
  } catch (error: unknown) {
    console.error('Fetch engagements error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userRecord = await prisma.user.findUnique({ where: { id: user.id } });
    
    if (userRecord?.role !== 'CLIENT') {
      return NextResponse.json({ error: 'Forbidden: Only clients can create engagements' }, { status: 403 });
    }

    const body = await request.json();
    const { title, consultantId, scopeTargetJSON, totalEscrowAmount, testingStartsAt, testingEndsAt } = body;

    if (!title || !consultantId || !scopeTargetJSON || totalEscrowAmount === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const engagement = await prisma.engagement.create({
      data: {
        title,
        clientId: user.id,
        consultantId,
        scopeTargetJSON,
        totalEscrowAmount,
        testingStartsAt: testingStartsAt ? new Date(testingStartsAt) : undefined,
        testingEndsAt: testingEndsAt ? new Date(testingEndsAt) : undefined,
        status: 'DRAFT_SCOPE',
        milestones: {
          create: [
            { title: 'Scoping Accepted', amountCents: Math.round(totalEscrowAmount * 0.2) },
            { title: 'Initial Report Delivered', amountCents: Math.round(totalEscrowAmount * 0.5) },
            { title: 'Retest Verified', amountCents: Math.round(totalEscrowAmount * 0.3) },
          ],
        },
      },
      include: { milestones: true },
    });

    await createAuditLog({
      action: AuditActions.ENGAGEMENT_CREATED,
      userId: user.id,
      resourceType: 'ENGAGEMENT',
      resourceId: engagement.id,
      ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
      metadata: { title, consultantId },
    });

    return NextResponse.json({ data: engagement }, { status: 201 });
  } catch (error: unknown) {
    console.error('Create engagement error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
