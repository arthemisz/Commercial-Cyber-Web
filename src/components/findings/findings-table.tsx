'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';

export type FindingStatus = 'REPORTED' | 'ACKNOWLEDGED' | 'FIX COMMITTED' | 'RETEST VERIFIED' | 'CLOSED';
export type Severity = 'Critical' | 'High' | 'Medium' | 'Low' | 'Info';

export interface Finding {
  id: string;
  title: string;
  cweIdentifier: string;
  cvssVector: string;
  cvssScore: number;
  severity: Severity | string;
  status: FindingStatus | string;
  updatedAt: string;
}

interface Props {
  findings: Finding[];
  onRowClick?: (id: string) => void;
}

const getSeverityColor = (severity: string) => {
  switch (severity.toLowerCase()) {
    case 'critical': return 'bg-kill text-white border-kill';
    case 'high': return 'bg-kill/80 text-white border-kill/80';
    case 'medium': return 'bg-caution text-void border-caution';
    case 'low': return 'bg-signal text-void border-signal';
    default: return 'bg-ash text-void border-ash';
  }
};

type SortField = 'title' | 'severity' | 'cweIdentifier' | 'cvssScore' | 'status' | 'updatedAt';
type SortDir = 'asc' | 'desc';

export function FindingsTable({ findings, onRowClick }: Props) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortField, setSortField] = useState<SortField>('cvssScore');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  const filteredFindings = findings.filter(f => {
    if (search && !f.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter && f.status !== statusFilter) return false;
    return true;
  }).sort((a, b) => {
    let valA: any = a[sortField];
    let valB: any = b[sortField];
    
    if (sortField === 'severity') {
      const sevMap: Record<string, number> = { 'critical': 5, 'high': 4, 'medium': 3, 'low': 2, 'info': 1 };
      valA = sevMap[a.severity.toLowerCase()] || 0;
      valB = sevMap[b.severity.toLowerCase()] || 0;
    }

    if (valA < valB) return sortDir === 'asc' ? -1 : 1;
    if (valA > valB) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <div className="bg-slate-surface rounded-lg border border-graphite/50 overflow-hidden flex flex-col">
      <div className="p-4 border-b border-graphite flex flex-col sm:flex-row gap-4 justify-between items-center bg-void/30">
        <div className="flex-1 w-full relative">
          <input 
            type="text" 
            placeholder="Search vulnerabilities..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-void border border-graphite text-frost rounded px-4 py-2 font-mono text-sm focus:outline-none focus:border-signal"
          />
        </div>
        <div className="w-full sm:w-48">
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-void border border-graphite text-frost rounded px-4 py-2 font-mono text-sm focus:outline-none focus:border-signal"
          >
            <option value="">All Statuses</option>
            <option value="REPORTED">REPORTED</option>
            <option value="ACKNOWLEDGED">ACKNOWLEDGED</option>
            <option value="FIX COMMITTED">FIX COMMITTED</option>
            <option value="RETEST VERIFIED">RETEST VERIFIED</option>
            <option value="CLOSED">CLOSED</option>
          </select>
        </div>
      </div>

      {filteredFindings.length === 0 ? (
        <div className="p-12 text-center text-ash flex flex-col items-center">
          <div className="w-12 h-12 mb-4 text-graphite">
            <svg fill="currentColor" viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 2.18l7.53 3.35v4.47c0 4.67-2.93 8.97-7.53 10.15-4.6-.1.08-7.53-4.47-10.15-2.93-8.97V6.53L12 3.18z"/></svg>
          </div>
          <p className="font-mono text-lg">No vulnerabilities reported</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-graphite/30 text-ash text-sm font-mono border-b border-graphite">
                <th className="p-4 cursor-pointer hover:text-frost" onClick={() => handleSort('severity')}>
                  Severity {sortField === 'severity' && (sortDir === 'asc' ? '↑' : '↓')}
                </th>
                <th className="p-4 cursor-pointer hover:text-frost" onClick={() => handleSort('title')}>
                  Title {sortField === 'title' && (sortDir === 'asc' ? '↑' : '↓')}
                </th>
                <th className="p-4 cursor-pointer hover:text-frost" onClick={() => handleSort('cweIdentifier')}>
                  CWE {sortField === 'cweIdentifier' && (sortDir === 'asc' ? '↑' : '↓')}
                </th>
                <th className="p-4 cursor-pointer hover:text-frost" onClick={() => handleSort('cvssScore')}>
                  CVSS {sortField === 'cvssScore' && (sortDir === 'asc' ? '↑' : '↓')}
                </th>
                <th className="p-4 cursor-pointer hover:text-frost" onClick={() => handleSort('status')}>
                  Status {sortField === 'status' && (sortDir === 'asc' ? '↑' : '↓')}
                </th>
                <th className="p-4 cursor-pointer hover:text-frost" onClick={() => handleSort('updatedAt')}>
                  Updated {sortField === 'updatedAt' && (sortDir === 'asc' ? '↑' : '↓')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-graphite/50 text-frost text-sm">
              {filteredFindings.map(f => (
                <tr 
                  key={f.id} 
                  onClick={() => onRowClick?.(f.id)}
                  className="hover:bg-graphite/20 cursor-pointer transition-colors"
                >
                  <td className="p-4 whitespace-nowrap">
                    <span className={cn("px-2 py-1 text-xs rounded border font-mono uppercase font-bold", getSeverityColor(f.severity))}>
                      {f.severity}
                    </span>
                  </td>
                  <td className="p-4 font-medium">{f.title}</td>
                  <td className="p-4 font-mono text-ash">{f.cweIdentifier}</td>
                  <td className="p-4 font-mono font-bold">{f.cvssScore.toFixed(1)}</td>
                  <td className="p-4 font-mono text-xs text-ash">{f.status}</td>
                  <td className="p-4 text-ash">{new Date(f.updatedAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
