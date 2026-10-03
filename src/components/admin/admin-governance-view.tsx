'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Users,
  Shield,
  Database,
  Activity,
  Terminal,
  Download,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import { StatusIndicator } from '@/components/ui/status-indicator';

interface AdminGovernanceViewProps {
  userCount: number;
  activeEngagements: number;
  engagements: any[];
  auditLogs: any[];
}

export function AdminGovernanceView({
  userCount,
  activeEngagements,
  engagements,
  auditLogs,
}: AdminGovernanceViewProps) {
  const [logSearch, setLogSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('ALL');
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  const totalEscrowCents = engagements.reduce(
    (sum: number, e: any) => sum + (e.totalEscrowAmount || 0),
    0
  );
  const platformRevenueCents = Math.round(totalEscrowCents * 0.15);

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
      !logSearch ||
      log.action.toLowerCase().includes(logSearch.toLowerCase()) ||
      (log.userId || '').toLowerCase().includes(logSearch.toLowerCase()) ||
      (log.resourceType || '').toLowerCase().includes(logSearch.toLowerCase());

    const matchesAction =
      actionFilter === 'ALL' || log.action === actionFilter;

    return matchesSearch && matchesAction;
  });

  const handleExportAudit = () => {
    const exportData = {
      exportTimestamp: new Date().toISOString(),
      standard: 'RFC 3161 Immutability WORM Specification',
      totalRecords: auditLogs.length,
      records: auditLogs,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cyberthink-worm-audit-log-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setExportNotice('Cryptographic WORM audit ledger exported to JSON.');
    setTimeout(() => setExportNotice(null), 4000);
  };

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto font-sans">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-steel pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-1.5 h-1.5 bg-amber animate-pulse"></span>
            <span className="font-mono text-[10px] text-ash tracking-[0.25em] uppercase">
              SEC_08 // GOVERNANCE_TELEMETRY
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-frost font-mono">
            PLATFORM GOVERNANCE & TELEMETRY
          </h1>
          <p className="text-ash text-xs font-mono mt-1">
            Zero-trust state inspection, append-only cryptographic audit logs, and escrow telemetry.
          </p>
        </div>
        <div className="flex items-center gap-3 self-start md:self-auto">
          <StatusIndicator status="online" blink label="WORM LEDGER: ARMED" />
          <button
            onClick={handleExportAudit}
            className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-mono border border-steel bg-bunker hover:border-amber text-frost uppercase tracking-wider transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-amber" />
            Export Ledger
          </button>
        </div>
      </div>

      {exportNotice && (
        <div className="p-3 bg-verified/10 border border-verified/30 text-verified font-mono text-xs flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{exportNotice}</span>
        </div>
      )}

      {/* Metric Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-bunker border border-steel p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-ash mb-3 text-[10px] font-mono uppercase tracking-wider">
            <span>VERIFIED IDENTITIES</span>
            <Users className="w-4 h-4 text-cyan" />
          </div>
          <span className="text-3xl font-bold font-mono text-frost tracking-tight">{userCount}</span>
          <p className="text-[10px] font-mono text-ash mt-2">Enterprise & consultant accounts</p>
        </div>

        <div className="bg-bunker border border-steel p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-ash mb-3 text-[10px] font-mono uppercase tracking-wider">
            <span>ACTIVE OPERATIONS</span>
            <Shield className="w-4 h-4 text-verified" />
          </div>
          <span className="text-3xl font-bold font-mono text-verified tracking-tight">{activeEngagements}</span>
          <p className="text-[10px] font-mono text-ash mt-2">Live testing authorizations</p>
        </div>

        <div className="bg-bunker border border-steel p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-ash mb-3 text-[10px] font-mono uppercase tracking-wider">
            <span>HELD IN ESCROW</span>
            <Database className="w-4 h-4 text-amber" />
          </div>
          <span className="text-3xl font-bold font-mono text-frost tracking-tight">
            {formatCurrency(totalEscrowCents)}
          </span>
          <p className="text-[10px] font-mono text-ash mt-2">Stripe Connect multi-sig hold</p>
        </div>

        <div className="bg-bunker border border-steel p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-ash mb-3 text-[10px] font-mono uppercase tracking-wider">
            <span>PLATFORM TAKE (15%)</span>
            <Activity className="w-4 h-4 text-amber" />
          </div>
          <span className="text-3xl font-bold font-mono text-amber tracking-tight">
            {formatCurrency(platformRevenueCents)}
          </span>
          <p className="text-[10px] font-mono text-ash mt-2">Net protocol fee</p>
        </div>
      </div>

      {/* Engagements Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold text-frost uppercase tracking-wider font-mono">
            Platform Engagements Overview
          </h2>
          <span className="text-xs text-ash font-mono">{engagements.length} RECORDED</span>
        </div>
        <div className="overflow-x-auto border border-steel bg-bunker">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-obsidian border-b border-steel text-[10px] font-medium text-ash uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">ENGAGEMENT SCOPE</th>
                <th className="px-4 py-3">CLIENT SPONSOR</th>
                <th className="px-4 py-3">ASSIGNED CONSULTANT</th>
                <th className="px-4 py-3">STATUS</th>
                <th className="px-4 py-3">ESCROW VALUE</th>
                <th className="px-4 py-3">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-steel">
              {engagements.map((eng: any) => (
                <tr key={eng.id} className="hover:bg-gunmetal/30 transition-colors">
                  <td className="px-4 py-3 text-frost font-medium">
                    <Link
                      href={`/client/engagements/${eng.id}`}
                      className="hover:text-amber transition-colors underline-offset-2 hover:underline"
                    >
                      {eng.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-ash font-mono">{eng.client?.email || 'N/A'}</td>
                  <td className="px-4 py-3 text-chalk font-mono">
                    {eng.consultant?.fullName || eng.consultant?.user?.email || 'Unassigned'}
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex px-2 py-0.5 text-[10px] font-mono border border-verified/30 bg-verified/10 text-verified uppercase tracking-wider">
                      {eng.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-amber font-semibold">
                    {formatCurrency(eng.totalEscrowAmount)}
                  </td>
                  <td className="px-4 py-3 text-ash font-mono text-[11px]">
                    <Link
                      href={`/client/engagements/${eng.id}`}
                      className="text-amber hover:text-frost font-mono text-xs uppercase tracking-wider"
                    >
                      Inspect →
                    </Link>
                  </td>
                </tr>
              ))}
              {engagements.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-ash font-mono">
                    No engagements found in registry.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Immutable Security Audit Trail */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-amber" />
            <h2 className="text-xs font-semibold text-frost uppercase tracking-wider font-mono">
              Immutable Cryptographic Audit Trail
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-3 h-3 absolute left-2.5 top-2 text-ash" />
              <input
                type="text"
                placeholder="SEARCH TRAIL..."
                value={logSearch}
                onChange={(e) => setLogSearch(e.target.value)}
                className="bg-obsidian border border-steel pl-8 pr-3 py-1 text-[11px] font-mono text-frost uppercase placeholder:text-ash/50 focus:outline-none focus:border-amber transition-colors"
              />
            </div>
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="bg-obsidian border border-steel px-2 py-1 text-[11px] font-mono text-chalk uppercase focus:outline-none focus:border-amber transition-colors"
            >
              <option value="ALL">ALL ACTIONS</option>
              <option value="ROE_SIGNED">ROE_SIGNED</option>
              <option value="KILL_SWITCH_TEST">KILL_SWITCH_TEST</option>
              <option value="KILL_SWITCH_ENGAGED">KILL_SWITCH_ENGAGED</option>
              <option value="ENGAGEMENT_CREATED">ENGAGEMENT_CREATED</option>
              <option value="FINDING_CREATED">FINDING_CREATED</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto border border-steel bg-bunker">
          <table className="w-full text-left font-mono text-xs">
            <thead className="bg-obsidian border-b border-steel text-[10px] font-medium text-ash uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">TIMESTAMP</th>
                <th className="px-4 py-3">ACTION SIGNATURE</th>
                <th className="px-4 py-3">ACTOR ID</th>
                <th className="px-4 py-3">RESOURCE TARGET</th>
                <th className="px-4 py-3">METADATA PAYLOAD</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-steel">
              {filteredLogs.map((log: any) => (
                <tr key={log.id} className="hover:bg-gunmetal/30 transition-colors">
                  <td className="px-4 py-3 text-ash whitespace-nowrap text-[11px]">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-amber font-semibold">{log.action}</td>
                  <td className="px-4 py-3 text-chalk">
                    {log.userId ? log.userId.slice(0, 10) + '...' : 'SYSTEM'}
                  </td>
                  <td className="px-4 py-3 text-frost">
                    {log.resourceType} ({log.resourceId ? log.resourceId.slice(0, 8) : 'N/A'})
                  </td>
                  <td className="px-4 py-3 text-ash max-w-xs truncate font-mono text-[11px]">
                    {log.metadata ? JSON.stringify(log.metadata) : '—'}
                  </td>
                </tr>
              ))}
              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-ash font-mono">
                    No cryptographic audit records matching query.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
