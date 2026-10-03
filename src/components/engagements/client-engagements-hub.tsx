'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Shield,
  ArrowRight,
  Plus,
  FileCheck2,
  AlertTriangle,
  Lock,
  DollarSign,
  Activity,
  Search,
  Filter,
  X,
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';

interface ClientEngagementsHubProps {
  initialEngagements: any[];
}

export function ClientEngagementsHub({ initialEngagements }: ClientEngagementsHubProps) {
  const router = useRouter();
  const [engagements, setEngagements] = useState<any[]>(initialEngagements);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [modalOpen, setModalOpen] = useState(false);

  // New Engagement Form State
  const [newTitle, setNewTitle] = useState('');
  const [newEscrow, setNewEscrow] = useState('15000');
  const [newConsultant, setNewConsultant] = useState('Jane Doe (Senior Offensive Specialist)');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredEngagements = engagements.filter((eng) => {
    const matchesSearch =
      !search ||
      eng.title.toLowerCase().includes(search.toLowerCase()) ||
      (eng.consultant?.fullName || '').toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === 'ALL' ||
      eng.status === statusFilter ||
      (statusFilter === 'ACTIVE' && eng.status === 'TESTING_ACTIVE');

    return matchesSearch && matchesStatus;
  });

  const totalEscrow = engagements.reduce((acc, eng) => acc + (eng.totalEscrowAmount || 0), 0);
  const activeCount = engagements.filter((eng) => eng.status === 'TESTING_ACTIVE').length;
  const totalFindings = engagements.reduce((acc, eng) => acc + (eng.findings?.length || 0), 0);

  const handleCreateScope = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setIsSubmitting(true);
    const newId = `eng-${Date.now().toString(36)}`;
    const escrowCents = (parseInt(newEscrow, 10) || 10000) * 100;

    const newEngagement = {
      id: newId,
      title: newTitle.trim(),
      status: 'DRAFT_SCOPE',
      totalEscrowAmount: escrowCents,
      roeDocumentHash: null,
      testingStartsAt: new Date(),
      testingEndsAt: new Date(Date.now() + 14 * 86400000),
      consultant: {
        fullName: newConsultant.split('(')[0].trim(),
        user: { email: 'specialist@cyberthink.io' },
      },
      findings: [],
      milestones: [
        { id: `m1-${newId}`, title: 'Scoping & Threat Modeling', amountCents: Math.round(escrowCents * 0.25), isApproved: false },
        { id: `m2-${newId}`, title: 'Active Penetration Testing', amountCents: Math.round(escrowCents * 0.5), isApproved: false },
        { id: `m3-${newId}`, title: 'Remediation Review & Final Report', amountCents: Math.round(escrowCents * 0.25), isApproved: false },
      ],
    };

    setEngagements([newEngagement, ...engagements]);
    setIsSubmitting(false);
    setModalOpen(false);

    // Navigate to RoE builder for the newly initialized scope
    router.push(`/client/engagements/${newId}/roe-builder`);
  };

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto font-sans">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-steel pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-1.5 h-1.5 bg-amber"></span>
            <span className="font-mono text-[10px] text-ash tracking-[0.25em] uppercase">
              SEC_01 // CLIENT_OPERATIONS
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-frost font-mono">
            ENTERPRISE ENGAGEMENTS
          </h1>
          <p className="text-ash text-xs font-mono mt-1">
            Manage authorized scope boundaries, cryptographic RoE attestations, and milestone escrows.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 bg-amber text-obsidian font-mono text-xs font-semibold px-4 py-2 hover:bg-frost transition-colors uppercase tracking-wider"
          >
            <Plus className="w-3.5 h-3.5" />
            INITIALIZE NEW SCOPE
          </button>
        </div>
      </div>

      {/* Metric Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-bunker border border-steel p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-ash text-[10px] font-mono uppercase tracking-wider mb-2">
            <span>ACTIVE OPERATIONS</span>
            <Activity className="w-3.5 h-3.5 text-verified" />
          </div>
          <div className="text-2xl font-mono font-bold text-frost">
            {String(activeCount).padStart(2, '0')}
            <span className="text-xs text-ash font-normal ml-2">/ {engagements.length} TOTAL</span>
          </div>
          <div className="text-[10px] font-mono text-verified mt-2">● LIVE TESTING AUTHORIZED</div>
        </div>

        <div className="bg-bunker border border-steel p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-ash text-[10px] font-mono uppercase tracking-wider mb-2">
            <span>TOTAL ESCROW ALLOCATED</span>
            <DollarSign className="w-3.5 h-3.5 text-amber" />
          </div>
          <div className="text-2xl font-mono font-bold text-amber">
            {formatCurrency(totalEscrow)}
          </div>
          <div className="text-[10px] font-mono text-ash mt-2">STRIPE CONNECT 2-OF-2 MULTI-SIG</div>
        </div>

        <div className="bg-bunker border border-steel p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-ash text-[10px] font-mono uppercase tracking-wider mb-2">
            <span>DISCLOSED DEFECTS</span>
            <Shield className="w-3.5 h-3.5 text-cyan" />
          </div>
          <div className="text-2xl font-mono font-bold text-frost">
            {String(totalFindings).padStart(2, '0')}
          </div>
          <div className="text-[10px] font-mono text-ash mt-2">CVSS v3.1 / v4.0 VERIFIED</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-bunker border border-steel p-3 flex flex-col sm:flex-row gap-3 justify-between items-center font-mono text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-ash" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="FILTER BY TITLE OR SPECIALIST..."
            className="w-full bg-obsidian border border-steel pl-9 pr-3 py-1.5 text-xs text-frost uppercase placeholder:text-ash/50 focus:outline-none focus:border-amber transition-colors"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-ash shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-obsidian border border-steel px-3 py-1.5 text-xs text-chalk uppercase focus:outline-none focus:border-amber transition-colors w-full sm:w-auto"
          >
            <option value="ALL">ALL STATUSES</option>
            <option value="ACTIVE">TESTING ACTIVE</option>
            <option value="DRAFT_SCOPE">DRAFT SCOPE</option>
            <option value="COMPLETED">COMPLETED</option>
            <option value="ABORTED_KILL_SWITCH">ABORTED</option>
          </select>
        </div>
      </div>

      {/* Engagements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredEngagements.map((eng) => {
          const isActive = eng.status === 'TESTING_ACTIVE';
          const isKillSwitch = eng.status === 'ABORTED_KILL_SWITCH' || eng.status === 'ABORTED';
          const criticalCount = (eng.findings || []).filter(
            (f: any) => f.severity === 'CRITICAL' || f.severity === 'Critical'
          ).length;
          const highCount = (eng.findings || []).filter(
            (f: any) => f.severity === 'HIGH' || f.severity === 'High'
          ).length;
          const approvedMilestones = (eng.milestones || []).filter((m: any) => m.isApproved).length;
          const totalMilestones = (eng.milestones || []).length;

          return (
            <div
              key={eng.id}
              className="bg-bunker border border-steel flex flex-col justify-between hover:border-amber/50 transition-colors group relative"
            >
              <div className="p-6">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <span
                    className={`px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider border ${
                      isActive
                        ? 'bg-verified/10 text-verified border-verified/30'
                        : isKillSwitch
                        ? 'bg-kill/10 text-kill border-kill/30'
                        : 'bg-amber/10 text-amber border-amber/30'
                    }`}
                  >
                    {eng.status.replace(/_/g, ' ')}
                  </span>
                  <span className="font-mono text-xs text-amber font-semibold">
                    {formatCurrency(eng.totalEscrowAmount)}
                  </span>
                </div>

                <Link href={`/client/engagements/${eng.id}`} className="block">
                  <h3 className="text-base font-bold text-frost group-hover:text-amber transition-colors line-clamp-2 mb-2 font-mono">
                    {eng.title}
                  </h3>
                </Link>

                <div className="text-[11px] font-mono text-ash mb-4 flex items-center gap-1.5">
                  <span>SPECIALIST:</span>
                  <span className="text-chalk truncate">{eng.consultant?.fullName || 'Assigned Specialist'}</span>
                </div>

                <div className="space-y-2 border-t border-steel pt-4 text-xs font-mono text-ash">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-[11px]">
                      <FileCheck2 className="w-3.5 h-3.5 text-amber" />
                      RoE Hash:
                    </span>
                    <span className="text-frost font-mono text-[11px]">
                      {eng.roeDocumentHash ? eng.roeDocumentHash.slice(0, 10) + '...' : 'PENDING SIGNATURE'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span>Defects:</span>
                    <span className="text-chalk font-mono">
                      {(eng.findings || []).length} total
                      {criticalCount > 0 && <span className="text-kill ml-1.5">({criticalCount} CRIT)</span>}
                      {highCount > 0 && <span className="text-amber ml-1">({highCount} HIGH)</span>}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span>Escrow Milestones:</span>
                    <span className="text-frost font-mono">
                      {approvedMilestones} / {totalMilestones} approved
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Action Footer */}
              <div className="p-3 bg-obsidian border-t border-steel flex items-center justify-between gap-2">
                <Link
                  href={`/client/engagements/${eng.id}/roe-builder`}
                  className="text-[11px] text-ash hover:text-amber font-mono uppercase tracking-wider transition-colors px-2 py-1"
                >
                  RoE Scope
                </Link>
                <Link
                  href={`/client/engagements/${eng.id}/findings`}
                  className="text-[11px] text-ash hover:text-amber font-mono uppercase tracking-wider transition-colors px-2 py-1"
                >
                  Findings ({(eng.findings || []).length})
                </Link>
                <Link
                  href={`/client/engagements/${eng.id}`}
                  className="inline-flex items-center gap-1 text-[11px] font-mono text-amber hover:text-frost font-semibold uppercase tracking-wider px-2 py-1 transition-colors"
                >
                  Console →
                </Link>
              </div>
            </div>
          );
        })}

        {filteredEngagements.length === 0 && (
          <div className="col-span-full p-12 text-center bg-bunker border border-steel text-ash font-mono text-xs">
            NO ENGAGEMENTS MATCHING SEARCH PARAMETERS.
          </div>
        )}
      </div>

      {/* Modal: Initialize New Scope */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian/85 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg bg-bunker border border-steel shadow-2xl font-mono text-xs">
            <div className="flex items-center justify-between p-4 bg-obsidian border-b border-steel">
              <span className="text-[10px] uppercase tracking-widest text-ash">
                PROVISIONING_TERMINAL // NEW_SCOPE_INITIALIZATION
              </span>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 border border-steel text-ash hover:text-amber hover:border-amber transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateScope} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase text-ash tracking-wider block">
                  Engagement Title & Attack Surface
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Fintech Core Banking API & Cloud Pen Test"
                  className="w-full bg-obsidian border border-steel px-3 py-2 text-frost focus:outline-none focus:border-amber transition-colors text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase text-ash tracking-wider block">
                  Escrow Pool Allocation (USD)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-ash">$</span>
                  <input
                    type="number"
                    required
                    min="1000"
                    step="500"
                    value={newEscrow}
                    onChange={(e) => setNewEscrow(e.target.value)}
                    className="w-full bg-obsidian border border-steel pl-7 pr-3 py-2 text-amber font-semibold focus:outline-none focus:border-amber transition-colors text-xs"
                  />
                </div>
                <p className="text-[10px] text-ash/60">
                  Subject to 15% platform take, disbursed through 3 cryptographic milestone releases.
                </p>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase text-ash tracking-wider block">
                  Assigned Offensive Security Specialist
                </label>
                <select
                  value={newConsultant}
                  onChange={(e) => setNewConsultant(e.target.value)}
                  className="w-full bg-obsidian border border-steel px-3 py-2 text-frost focus:outline-none focus:border-amber transition-colors text-xs"
                >
                  <option value="Jane Doe (Senior Offensive Specialist)">Jane Doe — OSCP / CISSP / CRTO</option>
                  <option value="John Smith (Cloud Penetration Specialist)">John Smith — GPEN / GXPN / CCSP</option>
                  <option value="Alex Vance (Red Team Operator)">Alex Vance — OSWE / CRTE / CISM</option>
                </select>
              </div>

              <div className="pt-4 border-t border-steel flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-steel text-ash hover:text-frost hover:border-chalk uppercase tracking-wider transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !newTitle.trim()}
                  className="px-5 py-2 bg-amber text-obsidian font-semibold hover:bg-frost transition-colors uppercase tracking-wider disabled:opacity-50"
                >
                  {isSubmitting ? 'INITIALIZING...' : 'INITIALIZE & LAUNCH ROE BUILDER →'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
