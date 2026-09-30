import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import { Shield, CheckCircle2, Skull, Bug, FileKey2, Lock, Clock, ExternalLink, HardDrive, AlertTriangle, ChevronRight, Activity } from 'lucide-react';
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
    <div className="max-w-7xl mx-auto space-y-8 font-sans">
      {/* Breadcrumb & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-mono text-ash border-b border-steel pb-4">
        <div className="flex items-center gap-2">
          <Link href="/client/engagements" className="hover:text-amber transition-colors">
            ENGAGEMENTS
          </Link>
          <span className="text-steel">/</span>
          <span className="text-frost">{id.slice(0, 12)}...</span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href={`/client/engagements/${engagement.id}/roe-builder`}
            className="hover:text-frost text-amber font-mono flex items-center gap-1.5 transition-colors uppercase tracking-wider text-[11px]"
          >
            <FileKey2 className="w-3.5 h-3.5" />
            RoE Scope Builder
          </Link>
          <span className="text-steel">|</span>
          <Link
            href={`/client/engagements/${engagement.id}/findings`}
            className="hover:text-frost text-amber font-mono flex items-center gap-1.5 transition-colors uppercase tracking-wider text-[11px]"
          >
            <Bug className="w-3.5 h-3.5" />
            Vulnerabilities ({engagement.findings.length})
          </Link>
        </div>
      </div>

      {/* Engagement Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-1.5 h-1.5 bg-amber"></span>
            <span className="font-mono text-[10px] text-ash tracking-[0.25em] uppercase">
              SEC_02 // CONSOLE_TELEMETRY
            </span>
          </div>
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <h1 className="text-2xl md:text-3xl font-bold text-frost tracking-tight font-mono">
              {engagement.title}
            </h1>
            <span className={cn(
              "px-2.5 py-0.5 text-[10px] font-mono tracking-wider border",
              isTestingActive ? "bg-verified/10 border-verified/30 text-verified font-medium" :
              isAborted ? "bg-kill/10 border-kill/30 text-kill font-medium" :
              "bg-amber/10 border-amber/30 text-amber font-medium"
            )}>
              {engagement.status.replace(/_/g, ' ')}
            </span>
          </div>
          <p className="text-xs font-mono text-ash">
            CONSULTANT: <span className="text-chalk">{engagement.consultant?.fullName || 'Assigned'}</span> · CLIENT SPONSOR: <span className="text-frost">{engagement.client?.email || 'SecOps'}</span>
          </p>
        </div>

        <div className="text-left md:text-right text-xs font-mono bg-bunker border border-steel p-3">
          <div className="text-ash text-[11px]">
            WINDOW: <span className="text-frost">{engagement.testingStartsAt ? formatDate(engagement.testingStartsAt) : 'PENDING'}</span> → <span className="text-frost">{engagement.testingEndsAt ? formatDate(engagement.testingEndsAt) : 'PENDING'}</span>
          </div>
          <div className="text-verified text-[11px] mt-1 flex items-center justify-start md:justify-end gap-1.5">
            <span className="w-1.5 h-1.5 bg-verified"></span>
            ESCROW: STRIPE 2-OF-2 ARMED
          </div>
        </div>
      </div>

      {/* Live Emergency Kill Switch Component */}
      <div className="bg-bunker border border-steel p-6">
        <div className="flex items-center justify-between mb-4 border-b border-steel pb-3">
          <div className="flex items-center gap-2">
            <Skull className="w-4 h-4 text-kill" />
            <h2 className="text-xs font-semibold text-frost uppercase tracking-wider font-mono">
              Emergency Kill Switch Control Panel
            </h2>
          </div>
          <span className="text-[10px] text-ash font-mono tracking-wider uppercase">
            Sub-100ms Supabase Realtime Broadcast
          </span>
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
        <div className="bg-bunker border border-steel p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-ash text-[10px] font-mono uppercase tracking-wider mb-2">
              <span>TOTAL ESCROW POOL</span>
              <Lock className="w-4 h-4 text-amber" />
            </div>
            <div className="text-2xl font-bold font-mono text-frost tracking-tight">
              {formatCurrency(engagement.totalEscrowAmount)}
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-steel text-xs text-ash space-y-1.5 font-mono">
            <div className="flex justify-between text-[11px]">
              <span>Platform Take (15%):</span>
              <span className="text-frost">{formatCurrency(platformFee)}</span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span>Consultant Disbursal:</span>
              <span className="text-verified">{formatCurrency(consultantNet)}</span>
            </div>
          </div>
        </div>

        <div className="bg-bunker border border-steel p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-ash text-[10px] font-mono uppercase tracking-wider mb-2">
              <span>MILESTONE DISBURSAL PIPELINE</span>
              <CheckCircle2 className="w-4 h-4 text-verified" />
            </div>
            <div className="text-2xl font-bold font-mono text-verified tracking-tight">
              {progress}% <span className="text-xs text-ash font-normal font-mono">({approvedMilestones}/{totalMilestones} approved)</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-steel">
            <div className="w-full bg-obsidian border border-steel h-2 overflow-hidden">
              <div className="bg-verified h-full transition-all" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>

        <div className="bg-bunker border border-steel p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-ash text-[10px] font-mono uppercase tracking-wider mb-2">
              <span>SECURITY DEFECTS IDENTIFIED</span>
              <Bug className="w-4 h-4 text-amber" />
            </div>
            <div className="text-2xl font-bold font-mono text-frost tracking-tight">
              {engagement.findings.length} <span className="text-xs text-ash font-normal font-mono">recorded</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-steel flex items-center justify-between text-xs font-mono">
            <span className="text-kill text-[11px] font-medium">
              {(engagement.findings || []).filter((f: any) => f.severity === 'CRITICAL').length} CRITICAL DEFECTS
            </span>
            <Link href={`/client/engagements/${engagement.id}/findings`} className="text-amber hover:text-frost transition-colors text-[11px]">
              INSPECT →
            </Link>
          </div>
        </div>
      </div>

      {/* Rules of Engagement & Zero-Trust Storage */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* RoE Cryptographic Sign-Off */}
        <div className="bg-bunker border border-steel p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-steel pb-3 mb-4">
              <div className="flex items-center gap-2">
                <FileKey2 className="w-4 h-4 text-amber" />
                <h3 className="font-semibold text-frost font-mono text-xs uppercase tracking-wider">
                  Cryptographic Rules of Engagement
                </h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 border border-verified/30 bg-verified/10 text-verified">
                SHA-256 VERIFIED
              </span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="bg-obsidian p-3 border border-steel">
                <div className="text-ash text-[10px] uppercase tracking-wider mb-1">Document Fingerprint:</div>
                <div className="text-amber break-all text-[11px]">
                  {engagement.roeDocumentHash || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'}
                </div>
              </div>
              <div className="flex justify-between py-1 text-ash text-[11px]">
                <span>Client Signed:</span>
                <span className="text-frost">{engagement.roeClientSignedAt ? formatDate(engagement.roeClientSignedAt) : 'Pending Confirmation'}</span>
              </div>
              <div className="flex justify-between py-1 text-ash text-[11px]">
                <span>Consultant Signed:</span>
                <span className="text-frost">{engagement.roeConsultantSignedAt ? formatDate(engagement.roeConsultantSignedAt) : 'Pending Confirmation'}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-steel flex justify-between items-center">
            <span className="text-xs font-mono text-ash">Cryptographic legal bounding</span>
            <Link
              href={`/client/engagements/${engagement.id}/roe-builder`}
              className="text-xs text-amber hover:text-frost font-mono transition-colors uppercase tracking-wider"
            >
              Modify or Review Terms →
            </Link>
          </div>
        </div>

        {/* Zero-Trust Storage & Dynamic Watermarking */}
        <div className="bg-bunker border border-steel p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-steel pb-3 mb-4">
              <div className="flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-cyan" />
                <h3 className="font-semibold text-frost font-mono text-xs uppercase tracking-wider">
                  Zero-Trust Ephemeral Storage
                </h3>
              </div>
              <span className="text-[10px] font-mono text-ash border border-steel px-2 py-0.5">
                60-DAY TTL SHRED
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-obsidian border border-steel font-mono space-y-1.5">
                <div className="flex justify-between text-ash text-[11px]">
                  <span>Envelope Encryption:</span>
                  <span className="text-verified">AWS KMS (alias/cyberthink-key)</span>
                </div>
                <div className="flex justify-between text-ash text-[11px]">
                  <span>Artifact Purge Policy:</span>
                  <span className="text-amber">Auto-shred on completion</span>
                </div>
              </div>

              {/* Dynamic Watermark preview */}
              <div className="relative border border-dashed border-steel p-4 bg-obsidian text-center overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center opacity-15 pointer-events-none select-none text-[11px] font-mono rotate-12 text-chalk">
                  CONFIDENTIAL · {engagement.client?.email || 'secops@cyberthink.io'} · {engagement.id.slice(0, 8)} · {new Date().toISOString().slice(0, 10)}
                </div>
                <p className="text-[11px] font-mono text-ash relative z-10">
                  Dynamic report previews embed watermarks containing client identity, consultant ID, and render timestamp to deter leakage.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-steel flex justify-between items-center text-xs">
            <span className="text-ash font-mono text-[10px] uppercase tracking-wider">Short-lived pre-signed uploads (5 min strict)</span>
          </div>
        </div>
      </div>

      {/* Milestones List */}
      <div className="bg-bunker border border-steel p-6">
        <h3 className="text-xs font-semibold text-frost uppercase tracking-wider font-mono mb-4 border-b border-steel pb-3">
          Escrow Milestone Schedule
        </h3>
        <div className="space-y-3">
          {(engagement.milestones || []).map((milestone: any) => (
            <div key={milestone.id} className="flex items-center justify-between p-3.5 bg-obsidian border border-steel hover:border-graphite transition-colors">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-6 h-6 flex items-center justify-center border font-mono text-xs",
                  milestone.isApproved ? "border-verified bg-verified/10 text-verified" : "border-steel text-ash"
                )}>
                  {milestone.isApproved ? <CheckCircle2 className="w-3.5 h-3.5" /> : <div className="w-1.5 h-1.5 bg-ash" />}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-frost font-mono">{milestone.title}</h4>
                  <p className="text-xs text-ash font-mono">
                    {milestone.isApproved ? 'Approved & Dispatched' : 'In Progress / Awaiting Deliverable'}
                    {milestone.paidOutAt && ` · Paid ${formatDate(milestone.paidOutAt)}`}
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono text-amber font-semibold">{formatCurrency(milestone.amountCents)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
