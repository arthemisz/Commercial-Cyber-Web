import React from 'react';
import { cn } from '@/lib/utils';

interface FindingSummary {
  severity: string;
}

interface Props {
  findings: FindingSummary[];
}

const SEVERITIES = ['Critical', 'High', 'Medium', 'Low', 'Info'];

const getSeverityColors = (severity: string) => {
  switch (severity.toLowerCase()) {
    case 'critical': return 'bg-kill';
    case 'high': return 'bg-amber';
    case 'medium': return 'bg-cyan';
    case 'low': return 'bg-ash';
    case 'info': return 'bg-cobalt';
    default: return 'bg-steel';
  }
};

export function SeverityBreakdown({ findings }: Props) {
  const counts = SEVERITIES.reduce((acc, sev) => {
    acc[sev] = 0;
    return acc;
  }, {} as Record<string, number>);

  findings.forEach(f => {
    const sev = f.severity.charAt(0).toUpperCase() + f.severity.slice(1).toLowerCase();
    if (counts[sev] !== undefined) {
      counts[sev]++;
    } else {
      counts['Info'] = (counts['Info'] || 0) + 1;
    }
  });

  const total = findings.length;

  return (
    <div className="bg-bunker border border-steel p-5 font-mono">
      <div className="text-[10px] uppercase tracking-[0.2em] text-ash mb-4 flex justify-between">
        <span>SEVERITY_BREAKDOWN</span>
        <span>TOTAL: {total}</span>
      </div>
      
      <div className="flex w-full h-3 mb-6 bg-obsidian border border-steel">
        {total > 0 ? SEVERITIES.map(sev => {
          const count = counts[sev];
          if (count === 0) return null;
          const percentage = (count / total) * 100;
          return (
            <div 
              key={sev} 
              className={cn("h-full border-r border-obsidian last:border-0", getSeverityColors(sev))}
              style={{ width: `${percentage}%` }}
              title={`${sev}: ${count}`}
            />
          );
        }) : (
          <div className="w-full h-full bg-obsidian" />
        )}
      </div>
      
      <div className="grid grid-cols-5 gap-2 text-center">
        {SEVERITIES.map(sev => (
          <div key={sev} className="flex flex-col items-center border border-steel bg-obsidian py-2">
            <span className={cn("w-2 h-2 mb-2", getSeverityColors(sev))} />
            <span className="text-[10px] text-ash uppercase mb-1">{sev.charAt(0)}</span>
            <span className="font-bold text-frost text-sm">{counts[sev]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
