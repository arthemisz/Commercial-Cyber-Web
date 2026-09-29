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
    case 'critical': return 'bg-kill text-white';
    case 'high': return 'bg-kill/80 text-white';
    case 'medium': return 'bg-caution text-void';
    case 'low': return 'bg-signal text-void';
    default: return 'bg-ash text-void';
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
    <div className="bg-slate-surface rounded-lg border border-graphite/50 p-4 font-mono">
      <div className="text-sm text-ash mb-3">Severity Breakdown ({total} Total)</div>
      <div className="flex gap-2 w-full h-4 rounded overflow-hidden mb-4 bg-void">
        {total > 0 ? SEVERITIES.map(sev => {
          const count = counts[sev];
          if (count === 0) return null;
          const percentage = (count / total) * 100;
          return (
            <div 
              key={sev} 
              className={cn("h-full", getSeverityColors(sev))}
              style={{ width: `${percentage}%` }}
              title={`${sev}: ${count}`}
            />
          );
        }) : (
          <div className="w-full h-full bg-graphite" />
        )}
      </div>
      <div className="grid grid-cols-5 gap-2 text-center text-xs">
        {SEVERITIES.map(sev => (
          <div key={sev} className="flex flex-col items-center">
            <span className={cn("inline-block w-3 h-3 rounded-full mb-1", getSeverityColors(sev))} />
            <span className="text-ash">{sev.charAt(0)}</span>
            <span className="font-bold text-frost">{counts[sev]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
