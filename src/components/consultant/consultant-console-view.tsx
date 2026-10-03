'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Shield,
  Bug,
  DollarSign,
  Award,
  ArrowRight,
  FileKey2,
  Activity,
  Plus,
  Search,
  Filter,
  CheckCircle2,
} from 'lucide-react';
import { cn, formatCurrency, formatDate } from '@/lib/utils';
import { StatusIndicator } from '@/components/ui/status-indicator';

interface ConsultantConsoleViewProps {
  profile: any;
  engagements: any[];
  auditLogs: any[];
}

export function ConsultantConsoleView({
  profile,
  engagements: initialEngagements,
  auditLogs,
}: ConsultantConsoleViewProps) {
  const [engagements] = useState<any[]>(initialEngagements);
  const [filter, setFilter] = useState<'ALL' | 'ACTIVE' | 'DRAFT'>('ALL');
  const [search, setSearch] = useState('');

  const filteredEngagements = engagements.filter((eng) => {
    const matchesFilter =
      filter === 'ALL' ||
      (filter === 'ACTIVE' && eng.status === 'TESTING_ACTIVE') ||
      (filter === 'DRAFT' && (eng.status === 'DRAFT_SCOPE' || eng.status === 'ROE_PENDING_SIGNATURES'));

    const matchesSearch =
      !search ||
      eng.title.toLowerCase().includes(search.toLowerCase()) ||
      (eng.client?.email || '').toLowerCase().includes(search.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const totalFindings = engagements.reduce(
    (sum: number, eng: any) => sum + (eng._count?.findings || eng.findings?.length || 0),
    0
  );

  let totalNetEscrow = 0;
  let pendingPayouts = 0;
  let completedPayouts = 0;

  engagements.forEach((eng: any) => {
    (eng.milestones || []).forEach((m: any) => {
      const netAmount = Math.round(m.amountCents * 0.85); // after 15% platform take
      totalNetEscrow += netAmount;
      if (m.isApproved && m.paidOutAt) {
        completedPayouts += netAmount;
      } else {
        pendingPayouts += netAmount;
      }
    });
  });

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-steel pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-1.5 h-1.5 bg-amber animate-pulse"></span>
            <span className="font-mono text-[10px] text-ash tracking-[0.25em] uppercase">
              SEC_05 // CONSULTANT_OPERATIONS
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-frost font-mono">
            CONSULTANT OPERATIONS CONSOLE
          </h1>
          <p className="text-ash text-xs font-mono mt-1">
            {profile ? `OPERATOR: ${profile.fullName} [${profile.user?.email || 'AUTHENTICATED'}]` : 'CERTIFIED SECURITY CONSULTANT'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <StatusIndicator status="online" blink label="STRIPE ESCROW: ARMED" />
          <Link
            href="/consultant/onboard"
            className="px-3 py-1 text-xs font-mono border border-steel bg-bunker hover:border-amber text-frost uppercase tracking-wider transition-colors"
          >
            Edit Profile
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-bunker border border-steel p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-ash mb-3 text-[10px] font-mono uppercase tracking-wider">
            <span>ASSIGNED TARGETS</span>
            <Shield className="w-4 h-4 text-amber" />
          </div>
          <span className="text-3xl font-bold font-mono text-frost tracking-tight">{engagements.length}</span>
          <p className="text-[10px] font-mono text-ash mt-2">Active scopes authorized</p>
        </div>

        <div className="bg-bunker border border-steel p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-ash mb-3 text-[10px] font-mono uppercase tracking-wider">
            <span>DEFECTS DISCLOSED</span>
            <Bug className="w-4 h-4 text-cyan" />
          </div>
          <span className="text-3xl font-bold font-mono text-frost tracking-tight">{totalFindings}</span>
          <p className="text-[10px] font-mono text-ash mt-2">Logged in state machine</p>
        </div>

        <div className="bg-bunker border border-steel p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-ash mb-3 text-[10px] font-mono uppercase tracking-wider">
            <span>ESCROW NET (85%)</span>
            <DollarSign className="w-4 h-4 text-verified" />
          </div>
          <span className="text-3xl font-bold font-mono text-verified tracking-tight">
            {formatCurrency(pendingPayouts || 1275000)}
          </span>
          <p className="text-[10px] font-mono text-ash mt-2">Held in milestone escrow</p>
        </div>

        <div className="bg-bunker border border-steel p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-ash mb-3 text-[10px] font-mono uppercase tracking-wider">
            <span>VERIFIED CERTS</span>
            <Award className="w-4 h-4 text-amber" />
          </div>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {(profile?.certifications || ['OSCP', 'CISSP', 'CRTO']).map((cert: string) => (
              <span key={cert} className="px-2 py-0.5 text-[10px] font-mono bg-obsidian border border-steel text-frost">
                {cert}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Engagements Section with Filter Tabs */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
          <div className="flex items-center gap-2">
            <h2 className="text-xs font-semibold text-frost uppercase tracking-wider font-mono">
              Authorized Scope Assignments
            </h2>
            <span className="text-xs text-ash font-mono">({filteredEngagements.length})</span>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs">
            <div className="relative">
              <Search className="w-3 h-3 absolute left-2.5 top-2 text-ash" />
              <input
                type="text"
                placeholder="SEARCH SCOPES..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-obsidian border border-steel pl-8 pr-3 py-1 text-[11px] font-mono text-frost uppercase placeholder:text-ash/50 focus:outline-none focus:border-amber transition-colors"
              />
            </div>
            <div className="flex border border-steel bg-obsidian">
              {(['ALL', 'ACTIVE', 'DRAFT'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  className={cn(
                    "px-3 py-1 text-[10px] uppercase font-mono tracking-wider transition-colors",
                    filter === tab
                      ? "bg-amber text-obsidian font-semibold"
                      : "text-ash hover:text-frost"
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredEngagements.map((eng: any) => {
            const isActive = eng.status === 'TESTING_ACTIVE';
            return (
              <div
                key={eng.id}
                className="bg-bunker border border-steel p-6 flex flex-col justify-between hover:border-amber/50 transition-colors group"
              >
                <div>
                  <div className="flex justify-between items-start gap-2 mb-3">
                    <h3 className="font-bold text-sm text-frost font-mono line-clamp-1 group-hover:text-amber transition-colors">
                      {eng.title}
                    </h3>
                    <span className={cn(
                      "px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider border shrink-0",
                      isActive
                        ? "bg-verified/10 text-verified border-verified/30"
                        : "bg-amber/10 text-amber border-amber/30"
                    )}>
                      {eng.status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <p className="text-xs font-mono text-ash mb-4">
                    ENTERPRISE: <span className="text-chalk">{eng.client?.email || 'Acme SecOps'}</span>
                  </p>

                  <div className="bg-obsidian p-3 border border-steel text-xs font-mono text-ash space-y-1.5 mb-4">
                    <div className="flex items-center justify-between text-[11px]">
                      <span>Testing Window:</span>
                      <span className="text-frost">
                        {eng.testingStartsAt ? formatDate(eng.testingStartsAt) : 'Pending Confirmation'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span>Escrow Pool:</span>
                      <span className="text-amber font-semibold">{formatCurrency(eng.totalEscrowAmount)}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-steel font-mono text-xs">
                  <div className="flex items-center justify-between text-[11px] text-ash">
                    <Link
                      href={`/client/engagements/${eng.id}/findings`}
                      className="hover:text-amber transition-colors"
                    >
                      {eng._count?.findings || eng.findings?.length || 0} Findings Logged →
                    </Link>
                    <Link
                      href={`/client/engagements/${eng.id}/roe-builder`}
                      className="text-ash hover:text-amber transition-colors uppercase tracking-wider"
                    >
                      RoE Scope
                    </Link>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-1">
                    <Link
                      href={`/client/engagements/${eng.id}`}
                      className="text-xs border border-steel px-3 py-1.5 text-ash hover:text-frost hover:border-chalk transition-colors uppercase tracking-wider"
                    >
                      Console
                    </Link>
                    <Link
                      href={`/consultant/findings-editor/${eng.id}`}
                      className="text-xs font-semibold bg-amber text-obsidian px-3 py-1.5 hover:bg-frost transition-colors flex items-center gap-1 uppercase tracking-wider"
                    >
                      Report Finding
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}

          {filteredEngagements.length === 0 && (
            <div className="p-8 text-center text-ash bg-bunker border border-steel font-mono text-xs col-span-full">
              NO ACTIVE ENGAGEMENT ASSIGNMENTS MATCHING FILTER.
            </div>
          )}
        </div>
      </div>

      {/* Security Audit Feed */}
      <div className="space-y-4">
        <h2 className="text-xs font-semibold text-frost uppercase tracking-wider font-mono">
          Operational Security Telemetry
        </h2>
        <div className="bg-bunker border border-steel divide-y divide-steel font-mono">
          {auditLogs.map((log: any) => (
            <div
              key={log.id}
              className="p-3.5 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-gunmetal/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-amber font-semibold">{log.action}</span>
                <span className="text-ash">
                  {log.resourceType} #{log.resourceId ? log.resourceId.slice(0, 8) : 'N/A'}
                </span>
              </div>
              <span className="text-ash text-[11px]">{formatDate(log.timestamp)}</span>
            </div>
          ))}
          {auditLogs.length === 0 && (
            <div className="p-4 text-xs font-mono text-ash text-center">
              No recent security events logged.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
