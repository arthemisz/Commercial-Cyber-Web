import prisma from '@/lib/prisma';
import { ConsultantConsoleView } from '@/components/consultant/consultant-console-view';

export const dynamic = 'force-dynamic';

export default async function ConsultantDashboard() {
  let profile: any = null;
  let engagements: any[] = [];
  let auditLogs: any[] = [];

  try {
    profile = await prisma.consultantProfile.findFirst({
      include: { 
        user: true,
        engagements: {
          include: {
            client: true,
            milestones: true,
            _count: { select: { findings: true } }
          }
        }
      }
    });

    engagements = profile?.engagements || await prisma.engagement.findMany({
      include: {
        client: true,
        milestones: true,
        _count: { select: { findings: true } }
      }
    });
    
    auditLogs = await prisma.auditLog.findMany({
      take: 5,
      orderBy: { timestamp: 'desc' }
    });
  } catch (err) {
    console.warn('Prisma query failed on consultant page, using mock data:', err);
    profile = {
      fullName: 'Jane Doe',
      certifications: ['OSCP', 'CISSP', 'CRTO'],
      user: { email: 'hacker.one@cyberconsult.com' }
    };
    engagements = [
      {
        id: 'eng-demo-acme-q3',
        title: 'Acme Corp Q3 External Network Penetration Test',
        status: 'TESTING_ACTIVE',
        totalEscrowAmount: 1500000,
        testingStartsAt: new Date(Date.now() - 7 * 86400000),
        testingEndsAt: new Date(Date.now() + 7 * 86400000),
        client: { email: 'secops@acme.corp' },
        milestones: [
          { amountCents: 500000, isApproved: true, paidOutAt: new Date(Date.now() - 5 * 86400000) },
          { amountCents: 500000, isApproved: false, paidOutAt: null },
          { amountCents: 500000, isApproved: false, paidOutAt: null }
        ],
        _count: { findings: 3 }
      },
      {
        id: 'eng-beta-web-audit',
        title: 'Beta Inc Web Application Architecture Audit',
        status: 'DRAFT_SCOPE',
        totalEscrowAmount: 2000000,
        testingStartsAt: new Date(),
        testingEndsAt: new Date(Date.now() + 14 * 86400000),
        client: { email: 'security@beta.inc' },
        milestones: [
          { amountCents: 500000, isApproved: false, paidOutAt: null },
          { amountCents: 1000000, isApproved: false, paidOutAt: null },
          { amountCents: 500000, isApproved: false, paidOutAt: null }
        ],
        _count: { findings: 0 }
      }
    ];
    auditLogs = [
      { id: 'log-1', action: 'ROE_SIGNED', resourceType: 'ENGAGEMENT', resourceId: 'eng-demo-acme-q3', timestamp: new Date() },
      { id: 'log-2', action: 'FINDING_CREATED', resourceType: 'FINDING', resourceId: 'f-1', timestamp: new Date(Date.now() - 3600000) },
      { id: 'log-3', action: 'ESCROW_FUNDED', resourceType: 'ENGAGEMENT', resourceId: 'eng-demo-acme-q3', timestamp: new Date(Date.now() - 7200000) },
    ];
  }

  return (
    <ConsultantConsoleView
      profile={profile}
      engagements={engagements}
      auditLogs={auditLogs}
    />
  );
}
