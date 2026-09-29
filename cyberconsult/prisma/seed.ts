import { PrismaClient, UserRole, EngagementStatus, SeverityLevel, VulnStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // 1. Create Users
  const client1 = await prisma.user.create({
    data: {
      email: 'alice.chen@example-client.com',
      role: UserRole.CLIENT,
      mfaEnabled: true,
    },
  });

  const client2 = await prisma.user.create({
    data: {
      email: 'bob.martinez@example-client.com',
      role: UserRole.CLIENT,
      mfaEnabled: true,
    },
  });

  const consultantUser1 = await prisma.user.create({
    data: {
      email: 'hacker.one@cyberconsult.com',
      role: UserRole.CONSULTANT,
      mfaEnabled: true,
      consultantProfile: {
        create: {
          fullName: 'Jane Doe',
          bio: 'Offensive security researcher with 10 years of experience.',
          certifications: ['OSCP', 'CISSP', 'CRTO'],
          hourlyRateCents: 15000, // $150/hr
          payoutsEnabled: true,
        },
      },
    },
    include: { consultantProfile: true },
  });

  const consultantUser2 = await prisma.user.create({
    data: {
      email: 'sec.expert@cyberconsult.com',
      role: UserRole.CONSULTANT,
      mfaEnabled: true,
      consultantProfile: {
        create: {
          fullName: 'John Smith',
          bio: 'Cloud security specialist and penetration tester.',
          certifications: ['OSCP', 'CISM', 'AWS Certified Security'],
          hourlyRateCents: 20000, // $200/hr
          payoutsEnabled: true,
        },
      },
    },
    include: { consultantProfile: true },
  });

  const admin = await prisma.user.create({
    data: {
      email: 'admin@cyberconsult.com',
      role: UserRole.PLATFORM_ADMIN,
      mfaEnabled: true,
    },
  });

  // 2. Create Engagements
  const engagement1 = await prisma.engagement.create({
    data: {
      title: 'Acme Corp Q3 External Network Penetration Test',
      clientId: client1.id,
      consultantId: consultantUser1.consultantProfile!.id,
      status: EngagementStatus.TESTING_ACTIVE,
      scopeTargetJSON: {
        inScope: ['192.168.1.0/24', 'https://api.acme.corp'],
        outOfScope: ['192.168.2.0/24'],
        methodology: 'Black Box',
      },
      totalEscrowAmount: 1500000, // $15,000
      testingStartsAt: new Date(new Date().setDate(new Date().getDate() - 7)), // 7 days ago
      testingEndsAt: new Date(new Date().setDate(new Date().getDate() + 7)), // 7 days from now
      milestones: {
        create: [
          {
            title: 'Initial Reconnaissance and Threat Modeling',
            amountCents: 500000,
            isApproved: true,
            paidOutAt: new Date(new Date().setDate(new Date().getDate() - 5)),
          },
          {
            title: 'Vulnerability Identification and Exploitation',
            amountCents: 500000,
            isApproved: false,
          },
          {
            title: 'Final Report Delivery and Debrief',
            amountCents: 500000,
            isApproved: false,
          },
        ],
      },
    },
  });

  const engagement2 = await prisma.engagement.create({
    data: {
      title: 'Beta Inc Web Application Assessment',
      clientId: client2.id,
      consultantId: consultantUser2.consultantProfile!.id,
      status: EngagementStatus.DRAFT_SCOPE,
      scopeTargetJSON: {
        inScope: ['https://app.beta.inc'],
        methodology: 'Grey Box',
        credentialsProvided: true,
      },
      totalEscrowAmount: 2000000, // $20,000
      milestones: {
        create: [
          {
            title: 'Pre-Engagement Planning and Setup',
            amountCents: 500000,
            isApproved: false,
          },
          {
            title: 'Active Scanning and Manual Testing',
            amountCents: 1000000,
            isApproved: false,
          },
          {
            title: 'Reporting and Remediation Guidance',
            amountCents: 500000,
            isApproved: false,
          },
        ],
      },
    },
  });

  // 3. Create Findings for Active Engagement
  await prisma.finding.create({
    data: {
      engagementId: engagement1.id,
      title: 'SQL Injection in Login Portal',
      cweIdentifier: 'CWE-89',
      cvssVector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H',
      cvssScore: 9.8,
      severity: SeverityLevel.CRITICAL,
      description: 'The login endpoint at https://api.acme.corp/v1/auth is vulnerable to a time-based blind SQL injection in the `username` parameter.',
      proofOfConcept: `POST /v1/auth HTTP/1.1\nHost: api.acme.corp\n\n{"username": "admin' AND (SELECT 1234 FROM (SELECT(SLEEP(10)))OQbg)-- ", "password": "x"}`,
      remediation: 'Implement parameterized queries or use an ORM for all database access. Never concatenate user input directly into SQL statements.',
      status: VulnStatus.REPORTED,
    },
  });

  await prisma.finding.create({
    data: {
      engagementId: engagement1.id,
      title: 'Cross-Site Scripting (XSS) in Dashboard',
      cweIdentifier: 'CWE-79',
      cvssVector: 'CVSS:3.1/AV:N/AC:L/PR:L/UI:R/S:C/C:L/I:L/A:N',
      cvssScore: 5.4,
      severity: SeverityLevel.MEDIUM,
      description: 'Stored XSS vulnerability in the user profile "bio" field allowing arbitrary JavaScript execution in the context of other users viewing the profile.',
      proofOfConcept: 'Payload used: `<script>alert(document.cookie)</script>` in the bio field of user settings.',
      remediation: 'Implement context-aware output encoding. Use a modern framework that automatically escapes output, and implement a strict Content Security Policy (CSP).',
      status: VulnStatus.ACKNOWLEDGED,
    },
  });

  await prisma.finding.create({
    data: {
      engagementId: engagement1.id,
      title: 'Insecure Direct Object Reference (IDOR) on Invoice Downloads',
      cweIdentifier: 'CWE-639',
      cvssVector: 'CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:N/A:N',
      cvssScore: 6.5,
      severity: SeverityLevel.HIGH,
      description: 'Authenticated users can download invoices belonging to other organizations by modifying the `id` parameter in the `/api/invoices/download` endpoint.',
      proofOfConcept: '1. Log in as user A.\n2. Request `/api/invoices/download?id=1005` (belongs to user B).\n3. Server returns invoice PDF.',
      remediation: 'Implement robust access control checks to ensure the requesting user has permission to access the requested resource before returning data.',
      status: VulnStatus.FIX_COMMITTED,
    },
  });
  
  await prisma.finding.create({
    data: {
      engagementId: engagement1.id,
      title: 'Missing Security Headers',
      cweIdentifier: 'CWE-693',
      cvssVector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:N/A:N',
      cvssScore: 0.0,
      severity: SeverityLevel.INFORMATIONAL,
      description: 'The application is missing several security headers such as Strict-Transport-Security, X-Frame-Options, and X-Content-Type-Options.',
      proofOfConcept: 'Observe HTTP response headers from https://api.acme.corp.',
      remediation: 'Configure the web server or application to return recommended security headers.',
      status: VulnStatus.REPORTED,
    },
  });

  // 4. Create Audit Logs
  await prisma.auditLog.create({
    data: {
      userId: client1.id,
      action: 'LOGIN',
      resourceType: 'User',
      resourceId: client1.id,
      ipAddress: '203.0.113.45',
    },
  });
  
  await prisma.auditLog.create({
    data: {
      userId: admin.id,
      action: 'UPDATE_ENGAGEMENT_STATUS',
      resourceType: 'Engagement',
      resourceId: engagement1.id,
      metadata: { previousStatus: 'FUNDS_IN_ESCROW', newStatus: 'TESTING_ACTIVE' },
      ipAddress: '198.51.100.22',
    },
  });

  console.log('Seed completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
