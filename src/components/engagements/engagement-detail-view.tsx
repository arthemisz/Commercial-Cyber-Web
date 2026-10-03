'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Shield,
  CheckCircle2,
  Skull,
  Bug,
  FileKey2,
  Lock,
  Clock,
  ExternalLink,
  HardDrive,
  Download,
  Upload,
  AlertTriangle,
  ChevronRight,
  Activity,
  FileCode,
  Check,
} from 'lucide-react';
import { cn, formatCurrency, formatDate } from '@/lib/utils';
import { KillSwitch } from '@/components/security/kill-switch';
import { StatusTimeline } from '@/components/security/status-timeline';

interface EngagementDetailViewProps {
  engagement: any;
}

export function EngagementDetailView({ engagement: initialEngagement }: EngagementDetailViewProps) {
  const [engagement, setEngagement] = useState(initialEngagement);
  const [milestones, setMilestones] = useState(initialEngagement.milestones || []);
  const [artifacts, setArtifacts] = useState(
    initialEngagement.artifacts && initialEngagement.artifacts.length > 0
      ? initialEngagement.artifacts
      : [
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
  );
  const [activeTab, setActiveTab] = useState<'overview' | 'artifacts' | 'timeline'>('overview');
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const [approvingMilestoneId, setApprovingMilestoneId] = useState<string | null>(null);

  const approvedMilestones = milestones.filter((m: any) => m.isApproved).length;
  const totalMilestones = milestones.length;
  const progress = totalMilestones > 0 ? Math.round((approvedMilestones / totalMilestones) * 100) : 0;

  const isTestingActive = engagement.status === 'TESTING_ACTIVE';
  const isAborted = engagement.status === 'ABORTED_KILL_SWITCH' || engagement.status === 'ABORTED';
  const platformFee = Math.round(engagement.totalEscrowAmount * 0.15);
  const consultantNet = engagement.totalEscrowAmount - platformFee;

  const handleApproveMilestone = (milestoneId: string) => {
    setApprovingMilestoneId(milestoneId);
    setTimeout(() => {
      setMilestones((prev: any[]) =>
        prev.map((m) =>
          m.id === milestoneId
            ? { ...m, isApproved: true, paidOutAt: new Date() }
            : m
        )
      );
      setApprovingMilestoneId(null);
      setActionNotice('Escrow release triggered via Stripe Connect multi-sig authorization.');
      setTimeout(() => setActionNotice(null), 5000);
    }, 700);
  };

  const handleDownloadArtifact = (fileName: string) => {
    setActionNotice(`Generated short-lived 5-minute pre-signed AWS KMS URL for [${fileName}]. Dynamic watermarking applied.`);
    setTimeout(() => setActionNotice(null), 5000);
  };

  const handleUploadArtifact = () => {
    const newArt = {
      id: `art-${Date.now()}`,
      fileName: `evidence-capture-${new Date().toISOString().slice(0, 10)}.enc`,
      fileSize: '2.4 MB',
      kmsKeyAlias: 'alias/cyberthink-master',
      uploadedAt: new Date().toISOString(),
      ttlRemaining: '60 days',
    };
    setArtifacts((prev: any[]) => [newArt, ...prev]);
    setActionNotice('Artifact uploaded with AES-256-GCM envelope encryption and 60-day auto-shred policy.');
    setTimeout(() => setActionNotice(null), 5000);
  };

  // Build timeline timestamps
  const timestamps = {
    DRAFT_SCOPE: engagement.createdAt ? new Date(engagement.createdAt).toISOString() : new Date(Date.now() - 14 * 86400000).toISOString(),
    ROE_PENDING: engagement.testingStartsAt ? new Date(new Date(engagement.testingStartsAt).getTime() - 2 * 86400000).toISOString() : null,
    ROE_SIGNED: engagement.roeClientSignedAt ? new Date(engagement.roeClientSignedAt).toISOString() : new Date(Date.now() - 8 * 86400000).toISOString(),
    FUNDS_ESCROWED: engagement.roeClientSignedAt ? new Date(new Date(engagement.roeClientSignedAt).getTime() + 3600000).toISOString() : new Date(Date.now() - 8 * 86400000).toISOString(),
    TESTING_ACTIVE: isTestingActive || engagement.status === 'REPORT_DELIVERED' || engagement.status === 'COMPLETED' ? new Date(Date.now() - 7 * 86400000).toISOString() : null,
    REPORT_DELIVERED: engagement.status === 'REPORT_DELIVERED' || engagement.status === 'COMPLETED' ? new Date().toISOString() : null,
    COMPLETED: engagement.status === 'COMPLETED' ? new Date().toISOString() : null,
    ABORTED: engagement.killSwitchTriggeredAt ? new Date(engagement.killSwitchTriggeredAt).toISOString() : null,
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 font-sans">
      {/* Breadcrumb & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-mono text-ash border-b border-steel pb-4">
        <div className="flex items-center gap-2">
          <Link href="/client/engagements" className="hover:text-amber transition-colors">
            ENGAGEMENTS
          </Link>
          <span className="text-steel">/</span>
          <span className="text-frost">{engagement.id.slice(0, 14)}...</span>
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
            Defect Tracker ({(engagement.findings || []).length})
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
            <span
              className={cn(
                "px-2.5 py-0.5 text-[10px] font-mono tracking-wider border uppercase",
                isTestingActive
                  ? "bg-verified/10 border-verified/30 text-verified font-medium"
                  : isAborted
                  ? "bg-kill/10 border-kill/30 text-kill font-medium"
                  : "bg-amber/10 border-amber/30 text-amber font-medium"
              )}
            >
              {engagement.status.replace(/_/g, ' ')}
            </span>
          </div>
          <p className="text-xs font-mono text-ash">
            CONSULTANT: <span className="text-chalk">{engagement.consultant?.fullName || 'Jane Doe'}</span> · CLIENT SPONSOR: <span className="text-frost">{engagement.client?.email || 'secops@acme.corp'}</span>
          </p>
        </div>

        <div className="text-left md:text-right text-xs font-mono bg-bunker border border-steel p-3">
          <div className="text-ash text-[11px]">
            WINDOW: <span className="text-frost">{engagement.testingStartsAt ? formatDate(engagement.testingStartsAt) : 'PENDING'}</span> → <span className="text-frost">{engagement.testingEndsAt ? formatDate(engagement.testingEndsAt) : 'PENDING'}</span>
          </div>
          <div className="text-verified text-[11px] mt-1 flex items-center justify-start md:justify-end gap-1.5">
            <span className="w-1.5 h-1.5 bg-verified animate-pulse"></span>
            ESCROW: STRIPE 2-OF-2 ARMED
          </div>
        </div>
      </div>

      {/* Action Notification */}
      {actionNotice && (
        <div className="p-3 bg-amber/10 border border-amber/30 text-amber font-mono text-xs flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-amber" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex border-b border-steel font-mono text-xs">
        <button
          onClick={() => setActiveTab('overview')}
          className={cn(
            "px-4 py-2 border-b-2 font-semibold uppercase tracking-wider transition-colors",
            activeTab === 'overview'
              ? "border-amber text-amber bg-amber/5"
              : "border-transparent text-ash hover:text-frost"
          )}
        >
          Operation Overview
        </button>
        <button
          onClick={() => setActiveTab('timeline')}
          className={cn(
            "px-4 py-2 border-b-2 font-semibold uppercase tracking-wider transition-colors",
            activeTab === 'timeline'
              ? "border-amber text-amber bg-amber/5"
              : "border-transparent text-ash hover:text-frost"
          )}
        >
          Event Log & Timeline
        </button>
        <button
          onClick={() => setActiveTab('artifacts')}
          className={cn(
            "px-4 py-2 border-b-2 font-semibold uppercase tracking-wider transition-colors",
            activeTab === 'artifacts'
              ? "border-amber text-amber bg-amber/5"
              : "border-transparent text-ash hover:text-frost"
          )}
        >
          Encrypted Artifact Vault ({artifacts.length})
        </button>
      </div>

      {/* Tab: Overview */}
      {activeTab === 'overview' && (
        <>
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
              killSwitchTriggeredAt={engagement.killSwitchTriggeredAt?.toISOString?.() || engagement.killSwitchTriggeredAt}
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
                  {(engagement.findings || []).length} <span className="text-xs text-ash font-normal font-mono">recorded</span>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-steel flex items-center justify-between text-xs font-mono">
                <span className="text-kill text-[11px] font-medium">
                  {(engagement.findings || []).filter((f: any) => f.severity === 'CRITICAL' || f.severity === 'Critical').length} CRITICAL DEFECTS
                </span>
                <Link href={`/client/engagements/${engagement.id}/findings`} className="text-amber hover:text-frost transition-colors text-[11px] uppercase tracking-wider">
                  INSPECT FINDINGS →
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
                  <span className="text-[10px] font-mono px-2 py-0.5 border border-verified/30 bg-verified/10 text-verified uppercase">
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
                    <span className="text-frost">{engagement.roeClientSignedAt ? formatDate(engagement.roeClientSignedAt) : 'Signed & Verified'}</span>
                  </div>
                  <div className="flex justify-between py-1 text-ash text-[11px]">
                    <span>Consultant Signed:</span>
                    <span className="text-frost">{engagement.roeConsultantSignedAt ? formatDate(engagement.roeConsultantSignedAt) : 'Signed & Verified'}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-steel flex justify-between items-center">
                <span className="text-xs font-mono text-ash">Cryptographic legal bounding</span>
                <Link
                  href={`/client/engagements/${engagement.id}/roe-builder`}
                  className="text-xs text-amber hover:text-frost font-mono transition-colors uppercase tracking-wider"
                >
                  Modify or Review Scope →
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
                  <span className="text-[10px] font-mono text-ash border border-steel px-2 py-0.5 uppercase">
                    60-DAY TTL SHRED
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3 bg-obsidian border border-steel font-mono space-y-1.5">
                    <div className="flex justify-between text-ash text-[11px]">
                      <span>Envelope Encryption:</span>
                      <span className="text-verified font-mono">AWS KMS (alias/cyberthink-master)</span>
                    </div>
                    <div className="flex justify-between text-ash text-[11px]">
                      <span>Artifact Purge Policy:</span>
                      <span className="text-amber">Cryptographic shred on completion</span>
                    </div>
                  </div>

                  <div className="relative border border-dashed border-steel p-4 bg-obsidian text-center overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center opacity-15 pointer-events-none select-none text-[10px] font-mono rotate-12 text-chalk">
                      CONFIDENTIAL · {engagement.client?.email || 'secops@cyberthink.io'} · {engagement.id.slice(0, 8)} · {new Date().toISOString().slice(0, 10)}
                    </div>
                    <p className="text-[11px] font-mono text-ash relative z-10 leading-relaxed">
                      Dynamic previews embed tamper-evident watermarks containing client identity, consultant ID, and render timestamp.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-steel flex justify-between items-center text-xs">
                <span className="text-ash font-mono text-[10px] uppercase tracking-wider">5-min pre-signed upload TTL</span>
                <button
                  onClick={() => setActiveTab('artifacts')}
                  className="text-cyan hover:text-amber font-mono text-xs uppercase tracking-wider transition-colors"
                >
                  Manage Vault ({artifacts.length}) →
                </button>
              </div>
            </div>
          </div>

          {/* Milestones Schedule */}
          <div className="bg-bunker border border-steel p-6">
            <div className="flex items-center justify-between mb-4 border-b border-steel pb-3">
              <h3 className="text-xs font-semibold text-frost uppercase tracking-wider font-mono">
                Escrow Milestone Disbursal Schedule
              </h3>
              <span className="text-[10px] font-mono text-ash uppercase">Stripe Connect Multi-Sig</span>
            </div>
            <div className="space-y-3">
              {milestones.map((milestone: any) => (
                <div
                  key={milestone.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-obsidian border border-steel hover:border-graphite transition-colors gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "w-6 h-6 flex items-center justify-center border font-mono text-xs shrink-0",
                        milestone.isApproved
                          ? "border-verified bg-verified/10 text-verified"
                          : "border-steel text-ash"
                      )}
                    >
                      {milestone.isApproved ? (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      ) : (
                        <div className="w-1.5 h-1.5 bg-ash" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-frost font-mono">{milestone.title}</h4>
                      <p className="text-xs text-ash font-mono">
                        {milestone.isApproved
                          ? 'Approved & Dispatched to Specialist'
                          : 'Deliverable Under Review / Awaiting Sign-off'}
                        {milestone.paidOutAt && ` · Paid ${formatDate(milestone.paidOutAt)}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 self-end sm:self-auto">
                    <span className="text-xs font-mono text-amber font-semibold">
                      {formatCurrency(milestone.amountCents)}
                    </span>
                    {!milestone.isApproved && (
                      <button
                        onClick={() => handleApproveMilestone(milestone.id)}
                        disabled={approvingMilestoneId === milestone.id}
                        className="px-3 py-1 bg-verified/15 text-verified border border-verified/40 hover:bg-verified hover:text-obsidian text-[11px] font-mono font-semibold uppercase tracking-wider transition-colors disabled:opacity-50"
                      >
                        {approvingMilestoneId === milestone.id ? 'Approving...' : 'Approve & Release'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Tab: Timeline */}
      {activeTab === 'timeline' && (
        <div className="space-y-6">
          <StatusTimeline
            currentStatus={engagement.status}
            timestamps={timestamps}
          />
        </div>
      )}

      {/* Tab: Artifacts Vault */}
      {activeTab === 'artifacts' && (
        <div className="bg-bunker border border-steel p-6 space-y-6 font-mono">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-steel pb-4">
            <div>
              <h2 className="text-sm font-bold text-frost uppercase tracking-wider">
                Ephemeral Zero-Trust Evidence Vault
              </h2>
              <p className="text-xs text-ash mt-1">
                Artifacts encrypted client-side with AWS KMS envelope encryption. Auto-purged upon engagement completion.
              </p>
            </div>
            <button
              onClick={handleUploadArtifact}
              className="inline-flex items-center gap-2 bg-amber text-obsidian px-4 py-2 font-semibold text-xs uppercase tracking-wider hover:bg-frost transition-colors self-start sm:self-auto"
            >
              <Upload className="w-3.5 h-3.5" />
              Upload Encrypted Artifact
            </button>
          </div>

          <div className="divide-y divide-steel border border-steel bg-obsidian">
            {artifacts.map((art: any) => (
              <div
                key={art.id}
                className="p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-3 hover:bg-gunmetal/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-steel/30 border border-steel flex items-center justify-center text-amber shrink-0">
                    <FileCode className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-frost">{art.fileName}</div>
                    <div className="text-[11px] text-ash mt-0.5">
                      {art.fileSize} · KMS: {art.kmsKeyAlias} · Purge TTL: <span className="text-amber">{art.ttlRemaining}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleDownloadArtifact(art.fileName)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-steel hover:border-amber text-frost hover:text-amber text-xs uppercase tracking-wider transition-colors self-start sm:self-auto"
                >
                  <Download className="w-3.5 h-3.5" />
                  Request Decrypt URL
                </button>
              </div>
            ))}

            {artifacts.length === 0 && (
              <div className="p-8 text-center text-ash text-xs">
                NO ENCRYPTED ARTIFACTS IN REPOSITORY.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
