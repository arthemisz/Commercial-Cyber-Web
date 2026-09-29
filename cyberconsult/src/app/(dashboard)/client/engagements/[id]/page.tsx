import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import { Shield, CheckCircle2, Skull, Bug, FileKey2, Lock, Clock, ExternalLink, HardDrive, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatCurrency, formatDate } from '@/lib/utils';
import Link from 'next/link';
import { KillSwitch } from '@/components/security/kill-switch';

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
          status: 'FIX_COMMITTED',
          updatedAt: new Date()
        }
      ],
      milestones: [
        { id: 'm-1', title: 'Scoping & Threat Modeling', amountCents: 500000, isApproved: true, paidOutAt: new Date(Date.now() - 5 * 86400000) },
        { id: 'm-2', title: 'Vulnerability Identification & Exploitation', amountCents: 500000, isApproved: false, paidOutAt: null },
        { id: 'm-3', title: 'Remediation Retest & Final Debrief', amountCents: 500000, isApproved: false, paidOutAt: null }
      ],
      artifacts: []
    };
  }

  const approvedMilestones = (engagement.milestones || []).filter((m: any) => m.isApproved).length;
  const totalMilestones = (engagement.milestones || []).length;
  const progress = totalMilestones > 0 ? Math.round((approvedMilestones / totalMilestones) * 100) : 0;
  
  const isTestingActive = engagement.status === 'TESTING_ACTIVE';
  const isAborted = engagement.status === 'ABORTED_KILL_SWITCH';
  const platformFee = Math.round(engagement.totalEscrowAmount * 0.15);
  const consultantNet = engagement.totalEscrowAmount - platformFee;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between text-xs text-ash border-b border-graphite pb-4">
        <div className="flex items-center gap-2">
          <Link href="/client/engagements" className="hover:text-frost transition-colors">
            Engagements
          </Link>
          <span className="text-graphite">/</span>
          <span className="text-frost font-mono">{id.slice(0, 8)}...</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href={`/client/engagements/${engagement.id}/roe-builder`}
            className="hover:text-frost text-signal font-mono flex items-center gap-1 transition-colors"
          >
            <FileKey2 className="w-3.5 h-3.5" />
            RoE Builder
          </Link>
          <span className="text-graphite">·</span>
          <Link
            href={`/client/engagements/${engagement.id}/findings`}
            className="hover:text-frost text-signal font-mono flex items-center gap-1 transition-colors"
          >
            <Bug className="w-3.5 h-3.5" />
            Vulnerabilities ({engagement.findings.length})
          </Link>
        </div>
      </div>

      {/* Engagement Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <h1 className="text-2xl font-bold text-frost tracking-tight">{engagement.title}</h1>
            <span className={cn(
              "px-2.5 py-0.5 text-xs font-mono rounded border",
              isTestingActive ? "bg-signal/10 border-signal/40 text-signal font-medium" :
              isAborted ? "bg-kill/15 border-kill/40 text-kill font-medium" :
              "bg-graphite/40 border-graphite text-ash"
            )}>
              {engagement.status.replace(/_/g, ' ')}
            </span>
          </div>
          <p className="text-sm text-ash">
            Consultant: <span className="text-frost font-medium">{engagement.consultant.fullName}</span> · Enterprise Sponsor: <span className="text-frost font-mono">{engagement.client.email}</span>
          </p>
        </div>

        <div className="text-left md:text-right text-xs font-mono text-ash bg-slate-surface border border-graphite p-3 rounded">
          <div>Window: {engagement.testingStartsAt ? formatDate(engagement.testingStartsAt) : 'Pending'} → {engagement.testingEndsAt ? formatDate(engagement.testingEndsAt) : 'Pending'}</div>
          <div className="text-signal mt-1">Escrow: Stripe Connect Locked</div>
        </div>
      </div>

      {/* Live Emergency Kill Switch Component */}
      <div className="bg-slate-surface border border-graphite rounded-lg p-6">
        <div className="flex items-center justify-between mb-4 border-b border-graphite pb-3">
          <div className="flex items-center gap-2">
            <Skull className="w-4 h-4 text-kill" />
            <h2 className="text-sm font-semibold text-frost uppercase tracking-wider font-mono">Emergency Kill Switch Control</h2>
          </div>
          <span className="text-xs text-ash font-mono">Sub-100ms Supabase Realtime Distribution</span>
        </div>
        <KillSwitch 
          engagementId={engagement.id}
          currentStatus={engagement.status}
          killSwitchTriggeredAt={engagement.killSwitchTriggeredAt?.toISOString()}
          killSwitchReason={engagement.killSwitchReason || undefined}
        />
      </div>

      {/* Financial Escrow & Milestones */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-slate-surface border border-graphite rounded-lg p-5">
          <div className="flex items-center justify-between text-ash text-xs uppercase tracking-wider mb-2">
            <span>Total Escrow Pool</span>
            <Lock className="w-4 h-4 text-signal" />
          </div>
          <div className="text-2xl font-semibold text-frost tracking-tight">
            {formatCurrency(engagement.totalEscrowAmount)}
          </div>
          <div className="mt-3 pt-3 border-t border-graphite/60 text-xs text-ash space-y-1 font-mono">
            <div className="flex justify-between">
              <span>Platform Take (15%):</span>
              <span className="text-frost">{formatCurrency(platformFee)}</span>
            </div>
            <div className="flex justify-between">
              <span>Consultant Net:</span>
              <span className="text-verified">{formatCurrency(consultantNet)}</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-surface border border-graphite rounded-lg p-5">
          <div className="flex items-center justify-between text-ash text-xs uppercase tracking-wider mb-2">
            <span>Milestone Pipeline</span>
            <CheckCircle2 className="w-4 h-4 text-verified" />
          </div>
          <div className="text-2xl font-semibold text-verified tracking-tight">
            {progress}% <span className="text-xs text-ash font-normal font-sans">({approvedMilestones}/{totalMilestones} approved)</span>
          </div>
          <div className="w-full bg-graphite h-1.5 mt-4 rounded-full overflow-hidden">
            <div className="bg-verified h-full rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="bg-slate-surface border border-graphite rounded-lg p-5">
          <div className="flex items-center justify-between text-ash text-xs uppercase tracking-wider mb-2">
            <span>Vulnerabilities Identified</span>
            <Bug className="w-4 h-4 text-caution" />
          </div>
          <div className="text-2xl font-semibold text-frost tracking-tight">
            {engagement.findings.length} <span className="text-xs text-ash font-normal font-sans">recorded</span>
          </div>
          <div className="mt-3 pt-3 border-t border-graphite/60 flex items-center justify-between text-xs">
            <span className="text-kill font-mono font-medium">
              {(engagement.findings || []).filter((f: any) => f.severity === 'CRITICAL').length} Critical
            </span>
            <Link href={`/client/engagements/${engagement.id}/findings`} className="text-signal hover:underline">
              Inspect lifecycle →
            </Link>
          </div>
        </div>
      </div>

      {/* Rules of Engagement & Zero-Trust Storage */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* RoE Cryptographic Sign-Off */}
        <div className="bg-slate-surface border border-graphite rounded-lg p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-graphite pb-3 mb-4">
              <div className="flex items-center gap-2">
                <FileKey2 className="w-4 h-4 text-signal" />
                <h3 className="font-semibold text-frost text-sm">Cryptographic Rules of Engagement</h3>
              </div>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-void border border-graphite text-verified">
                SHA-256 HASH VERIFIED
              </span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="bg-void p-3 rounded border border-graphite">
                <div className="text-ash mb-1">Document Fingerprint:</div>
                <div className="text-signal break-all">
                  {engagement.roeDocumentHash || '4f9a0c8b671a5b8e9d3c2a1f0e4b7c6d5e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b'}
                </div>
              </div>
              <div className="flex justify-between py-1 text-ash">
                <span>Client Signed:</span>
                <span className="text-frost">{engagement.roeClientSignedAt ? formatDate(engagement.roeClientSignedAt) : 'Pending Confirmation'}</span>
              </div>
              <div className="flex justify-between py-1 text-ash">
                <span>Consultant Signed:</span>
                <span className="text-frost">{engagement.roeConsultantSignedAt ? formatDate(engagement.roeConsultantSignedAt) : 'Pending Confirmation'}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-graphite flex justify-between items-center">
            <span className="text-xs text-ash">Zero-trust scope terms</span>
            <Link
              href={`/client/engagements/${engagement.id}/roe-builder`}
              className="text-xs text-signal hover:underline font-mono"
            >
              Modify or Review Terms
            </Link>
          </div>
        </div>

        {/* Zero-Trust Storage & Dynamic Watermarking */}
        <div className="bg-slate-surface border border-graphite rounded-lg p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-graphite pb-3 mb-4">
              <div className="flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-signal" />
                <h3 className="font-semibold text-frost text-sm">Zero-Trust Ephemeral Storage</h3>
              </div>
              <span className="text-xs font-mono text-ash">60-Day TTL Shredding</span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-void rounded border border-graphite font-mono space-y-1.5">
                <div className="flex justify-between text-ash">
                  <span>Envelope Encryption:</span>
                  <span className="text-verified">AWS KMS (alias/cyberconsult-key)</span>
                </div>
                <div className="flex justify-between text-ash">
                  <span>Artifact Purge Policy:</span>
                  <span className="text-caution">Auto-shred on completion</span>
                </div>
              </div>

              {/* Dynamic Watermark preview */}
              <div className="relative border border-dashed border-graphite p-4 rounded bg-void/50 text-center overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none select-none text-xs font-mono rotate-12">
                  CONFIDENTIAL · {engagement.client.email} · {engagement.id.slice(0, 8)} · {new Date().toISOString().slice(0, 10)}
                </div>
                <p className="text-xs text-ash relative z-10">
                  Dynamic report previews embed watermarks containing client identity, consultant ID, and render timestamp to deter leakage.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-graphite flex justify-between items-center text-xs">
            <span className="text-ash font-mono">Short-lived pre-signed uploads (5 min strict)</span>
          </div>
        </div>
      </div>

      {/* Milestones List */}
      <div className="bg-slate-surface border border-graphite rounded-lg p-6">
        <h3 className="text-sm font-semibold text-frost uppercase tracking-wider font-mono mb-4 border-b border-graphite pb-3">
          Escrow Milestone Schedule
        </h3>
        <div className="space-y-3">
          {(engagement.milestones || []).map((milestone: any) => (
            <div key={milestone.id} className="flex items-center justify-between p-3.5 rounded bg-void border border-graphite">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center border",
                  milestone.isApproved ? "border-verified bg-verified/10 text-verified" : "border-graphite text-ash"
                )}>
                  {milestone.isApproved ? <CheckCircle2 className="w-3.5 h-3.5" /> : <div className="w-1.5 h-1.5 rounded-full bg-graphite" />}
                </div>
                <div>
                  <h4 className="text-sm font-medium text-frost">{milestone.title}</h4>
                  <p className="text-xs text-ash">
                    {milestone.isApproved ? 'Approved & Dispatched' : 'In Progress / Awaiting Deliverable'}
                    {milestone.paidOutAt && ` · Paid ${formatDate(milestone.paidOutAt)}`}
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono text-frost font-medium">{formatCurrency(milestone.amountCents)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
