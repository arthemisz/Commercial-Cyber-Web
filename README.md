## CyberConsult

CyberConsult is a marketplace and consultation platform connecting enterprise clients with vetted cybersecurity specialists. From compliance audits and penetration testing to incident triage, the platform streamlines expert matching, secure scoping, and direct consultation scheduling.

---

## Key Features

* **Targeted Expert Matching:** Match organizations with certified professionals based on domain (AppSec, Cloud Security, Compliance, Threat Hunting, Red/Blue Teaming).
* **Vetted Specialist Network:** Profiles backed by verified credentials (CISSP, OSCP, CEH, CISM) and domain histories.
* **Encrypted Communication:** End-to-end encrypted messaging and document sharing for scope definitions, NDAs, and audit logs.
* **Integrated Booking & Escrow:** Milestone-based billing, calendar synchronization, and automated invoicing.
* **Role-Based Access Control (RBAC):** Distinct dashboards for clients, consultants, and platform administrators.

---

## Tech Stack

* **Frontend:** Next.js (App Router), React, Tailwind CSS, Lucide Icons
* **Backend:** Node.js / Express or Next.js API Routes
* **Database:** PostgreSQL (via Prisma ORM)
* **Authentication:** NextAuth.js / Supabase Auth (MFA enforced)
* **Storage & Encryption:** AWS S3 (AES-256 server-side encryption) for artifacts and NDAs
* **Payments:** Stripe Connect (for consultant marketplace payouts)

---

## Getting Started

### Prerequisites

* Node.js (v18.0.0 or higher)
* PostgreSQL instance (local or hosted)
* npm, yarn, or pnpm
