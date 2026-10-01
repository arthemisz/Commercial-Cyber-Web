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

const getSeverityDot = (severity: string) => {
  switch (severity.toLowerCase()) {
    case 'critical': return 'bg-kill';
    case 'high': return 'bg-amber';
    case 'medium': return 'bg-cyan';
    case 'low': return 'bg-ash';
    case 'info': return 'bg-cobalt';
    default: return 'bg-steel';
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
    <div className="bg-bunker border border-steel flex flex-col font-mono">
      <div className="p-4 border-b border-steel flex flex-col sm:flex-row gap-4 justify-between items-center bg-obsidian">
        <div className="flex-1 w-full">
          <input 
            type="text" 
            placeholder="SEARCH VULNERABILITIES..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gunmetal border border-steel text-chalk px-3 py-2 text-[10px] uppercase placeholder:text-ash/50 focus:outline-none focus:border-amber transition-colors"
          />
        </div>
        <div className="w-full sm:w-48">
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-gunmetal border border-steel text-chalk px-3 py-2 text-[10px] uppercase focus:outline-none focus:border-amber transition-colors"
          >
            <option value="">ALL STATUSES</option>
            <option value="REPORTED">REPORTED</option>
            <option value="ACKNOWLEDGED">ACKNOWLEDGED</option>
            <option value="FIX COMMITTED">FIX COMMITTED</option>
            <option value="RETEST VERIFIED">RETEST VERIFIED</option>
            <option value="CLOSED">CLOSED</option>
          </select>
        </div>
      </div>

      {filteredFindings.length === 0 ? (
        <div className="p-12 text-center flex flex-col items-center bg-obsidian">
          <p className="font-mono text-xs text-ash uppercase tracking-widest">No vulnerabilities reported</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gunmetal border-b border-steel">
                <th className="py-2.5 px-4 text-[10px] uppercase tracking-wider text-ash cursor-pointer hover:text-frost" onClick={() => handleSort('severity')}>
                  SEV {sortField === 'severity' && (sortDir === 'asc' ? '↑' : '↓')}
                </th>
                <th className="py-2.5 px-4 text-[10px] uppercase tracking-wider text-ash cursor-pointer hover:text-frost" onClick={() => handleSort('title')}>
                  TITLE {sortField === 'title' && (sortDir === 'asc' ? '↑' : '↓')}
                </th>
                <th className="py-2.5 px-4 text-[10px] uppercase tracking-wider text-ash cursor-pointer hover:text-frost" onClick={() => handleSort('cweIdentifier')}>
                  CWE {sortField === 'cweIdentifier' && (sortDir === 'asc' ? '↑' : '↓')}
                </th>
                <th className="py-2.5 px-4 text-[10px] uppercase tracking-wider text-ash text-right cursor-pointer hover:text-frost" onClick={() => handleSort('cvssScore')}>
                  CVSS {sortField === 'cvssScore' && (sortDir === 'asc' ? '↑' : '↓')}
                </th>
                <th className="py-2.5 px-4 text-[10px] uppercase tracking-wider text-ash cursor-pointer hover:text-frost" onClick={() => handleSort('status')}>
                  STATUS {sortField === 'status' && (sortDir === 'asc' ? '↑' : '↓')}
                </th>
                <th className="py-2.5 px-4 text-[10px] uppercase tracking-wider text-ash cursor-pointer hover:text-frost" onClick={() => handleSort('updatedAt')}>
                  UPDATED {sortField === 'updatedAt' && (sortDir === 'asc' ? '↑' : '↓')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-bunker divide-y divide-steel/50">
              {filteredFindings.map(f => (
                <tr 
                  key={f.id} 
                  onClick={() => onRowClick?.(f.id)}
                  className="hover:bg-gunmetal/30 cursor-pointer transition-colors"
                >
                  <td className="py-2.5 px-4">
                    <div className="flex items-center gap-2">
                      <div className={cn("w-2 h-2 shrink-0", getSeverityDot(f.severity))} />
                      <span className="text-[11px] uppercase text-chalk">{f.severity}</span>
                    </div>
                  </td>
                  <td className="py-2.5 px-4 text-[11px] text-chalk truncate max-w-[200px]">{f.title}</td>
                  <td className="py-2.5 px-4 text-[11px] text-ash">{f.cweIdentifier}</td>
                  <td className="py-2.5 px-4 text-[11px] font-bold text-chalk text-right">{f.cvssScore.toFixed(1)}</td>
                  <td className="py-2.5 px-4">
                    <span className="border border-steel bg-obsidian px-1.5 py-0.5 text-[9px] uppercase text-ash">
                      {f.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 text-[11px] text-ash/80">{new Date(f.updatedAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
