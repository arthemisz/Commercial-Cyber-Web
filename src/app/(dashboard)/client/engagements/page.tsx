import prisma from '@/lib/prisma';
import { ClientEngagementsHub } from '@/components/engagements/client-engagements-hub';

export const dynamic = 'force-dynamic';

export default async function ClientEngagementsPage() {
  let engagements: any[] = [];
  try {
    engagements = await prisma.engagement.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        consultant: {
          include: { user: true }
        },
        findings: true,
        milestones: true
      }
    });
  } catch (err) {
    console.warn('Prisma query failed, using mock data:', err);
    engagements = [
      {
        id: 'eng-demo-acme-q3',
        title: 'Acme Corp Q3 External Network Penetration Test',
        status: 'TESTING_ACTIVE',
        totalEscrowAmount: 1500000,
        roeDocumentHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        consultant: {
          fullName: 'Jane Doe',
          user: { email: 'hacker.one@cyberconsult.com' }
        },
        findings: [
          { id: 'f-1', severity: 'CRITICAL', title: 'SQL Injection in Login Portal' },
          { id: 'f-2', severity: 'HIGH', title: 'IDOR in Invoices' },
          { id: 'f-3', severity: 'MEDIUM', title: 'Stored XSS in Dashboard' }
        ],
        milestones: [
          { id: 'm-1', title: 'Scoping & Threat Modeling', amountCents: 500000, isApproved: true },
          { id: 'm-2', title: 'Vulnerability Identification', amountCents: 500000, isApproved: false },
          { id: 'm-3', title: 'Retest & Debrief', amountCents: 500000, isApproved: false }
        ]
      },
      {
        id: 'eng-beta-web-audit',
        title: 'Beta Inc Web Application Architecture Audit',
        status: 'DRAFT_SCOPE',
        totalEscrowAmount: 2000000,
        roeDocumentHash: null,
        consultant: {
          fullName: 'John Smith',
          user: { email: 'sec.expert@cyberconsult.com' }
        },
        findings: [],
        milestones: [
          { id: 'm-4', title: 'Architecture Scoping', amountCents: 500000, isApproved: false },
          { id: 'm-5', title: 'Threat Vector Modeling', amountCents: 1000000, isApproved: false },
          { id: 'm-6', title: 'Executive Summary', amountCents: 500000, isApproved: false }
        ]
      }
    ];
  }

  return <ClientEngagementsHub initialEngagements={engagements} />;
}
