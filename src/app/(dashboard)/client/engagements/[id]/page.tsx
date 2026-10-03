import prisma from '@/lib/prisma';
import { EngagementDetailView } from '@/components/engagements/engagement-detail-view';

export const dynamic = 'force-dynamic';

export default async function EngagementDetailPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;

  let engagement: any = null;
  try {
    engagement = await prisma.engagement.findUnique({
      where: { id },
      include: {
        client: true,
        consultant: {
          include: {
            user: true
          }
        },
        milestones: true,
        findings: {
          orderBy: { cvssScore: 'desc' },
        },
        artifacts: true,
      }
    });
  } catch (err) {
    console.warn('Prisma query failed, using mock data:', err);
  }

  if (!engagement) {
    engagement = {
      id,
      title: 'Acme Corp Q3 External Network Penetration Test',
      status: 'TESTING_ACTIVE',
      totalEscrowAmount: 1500000,
      testingStartsAt: new Date(Date.now() - 7 * 86400000),
      testingEndsAt: new Date(Date.now() + 7 * 86400000),
      roeDocumentHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      roeClientSignedAt: new Date(Date.now() - 8 * 86400000),
      roeConsultantSignedAt: new Date(Date.now() - 8 * 86400000),
      killSwitchTriggeredAt: null,
      killSwitchReason: null,
      client: { email: 'secops@acme.corp' },
      consultant: {
        fullName: 'Jane Doe',
        user: { email: 'hacker.one@cyberconsult.com' }
      },
      findings: [
        {
          id: 'f-1',
          title: 'SQL Injection in Login Portal',
          cweIdentifier: 'CWE-89',
          cvssVector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H',
          cvssScore: 9.8,
          severity: 'CRITICAL',
          description: 'Time-based blind SQL injection in username parameter.',
          proofOfConcept: `POST /api/v1/auth/login HTTP/1.1\nHost: portal.acme.corp\nContent-Type: application/json\n\n{\n  "username": "admin' AND (SELECT 1 FROM (SELECT(SLEEP(5)))a)-- -",\n  "password": "test"\n}`,
          remediation: 'Use parameterized queries / prepared statements with ORM or typed SQL bindings.',
          status: 'REPORTED',
          updatedAt: new Date()
        },
        {
          id: 'f-2',
          title: 'Insecure Direct Object Reference (IDOR) on Invoices',
          cweIdentifier: 'CWE-639',
          cvssVector: 'CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:N/A:N',
          cvssScore: 6.5,
          severity: 'HIGH',
          description: 'Authenticated users can access arbitrary invoices.',
          proofOfConcept: `GET /api/billing/invoices/inv_998124/download HTTP/1.1\nAuthorization: Bearer <low_priv_token>`,
          remediation: 'Enforce tenant-level authorization checks before retrieving invoice entities.',
          status: 'FIX_COMMITTED',
          updatedAt: new Date()
        }
      ],
      milestones: [
        { id: 'm-1', title: 'Scoping & Threat Modeling', amountCents: 500000, isApproved: true, paidOutAt: new Date(Date.now() - 5 * 86400000) },
        { id: 'm-2', title: 'Vulnerability Identification & Exploitation', amountCents: 500000, isApproved: false, paidOutAt: null },
        { id: 'm-3', title: 'Remediation Retest & Final Debrief', amountCents: 500000, isApproved: false, paidOutAt: null }
      ],
      artifacts: [
        {
          id: 'art-1',
          fileName: 'roe-cryptographic-attestation.pdf.enc',
          fileSize: '412 KB',
          kmsKeyAlias: 'alias/cyberthink-master',
          uploadedAt: new Date(Date.now() - 4 * 86400000).toISOString(),
          ttlRemaining: '56 days',
        },
        {
          id: 'art-2',
          fileName: 'sanitized-network-pcaps-q3.tar.gz.enc',
          fileSize: '14.8 MB',
          kmsKeyAlias: 'alias/cyberthink-master',
          uploadedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
          ttlRemaining: '58 days',
        },
      ]
    };
  }

  return <EngagementDetailView engagement={engagement} />;
}
