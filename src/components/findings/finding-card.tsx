import React from 'react';
import { cn } from '@/lib/utils';
import { StatusStepper } from './status-stepper';

export interface DetailedFinding {
  id: string;
  title: string;
  cweIdentifier: string;
  cvssVector: string;
  cvssScore: number;
  severity: string;
  status: string;
  updatedAt: string;
  description: string;
  proofOfConcept: string;
  remediation: string;
}

interface Props {
  finding: DetailedFinding;
}

const getSeverityBorder = (severity: string) => {
  switch (severity.toLowerCase()) {
    case 'critical': return 'border-l-kill';
    case 'high': return 'border-l-amber';
    case 'medium': return 'border-l-cyan';
    case 'low': return 'border-l-ash';
    case 'info': return 'border-l-cobalt';
    default: return 'border-l-steel';
  }
};

const getSeverityColor = (severity: string) => {
  switch (severity.toLowerCase()) {
    case 'critical': return 'text-kill';
    case 'high': return 'text-amber';
    case 'medium': return 'text-cyan';
    case 'low': return 'text-ash';
    case 'info': return 'text-cobalt';
    default: return 'text-steel';
  }
};

export function FindingCard({ finding }: Props) {
  return (
    <div className={cn("bg-bunker border border-steel border-l-[3px] text-frost flex flex-col gap-6 p-6", getSeverityBorder(finding.severity))}>
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <span className={cn("px-2 py-0.5 text-[10px] border border-steel font-mono uppercase bg-obsidian", getSeverityColor(finding.severity))}>
              {finding.severity}
            </span>
            <span className="font-mono text-ash text-[10px]">{finding.cweIdentifier}</span>
          </div>
          <h2 className="text-sm font-semibold">{finding.title}</h2>
        </div>
        
        <div className="bg-obsidian border border-steel p-3 text-right shrink-0 min-w-[120px]">
          <div className="text-[10px] text-ash font-mono mb-1 uppercase tracking-wider">CVSS Base Score</div>
          <div className="flex items-center justify-end gap-2">
            <span className={cn("text-xl font-mono font-bold tracking-tighter", getSeverityColor(finding.severity))}>
              {finding.cvssScore.toFixed(1)}
            </span>
          </div>
          <div className="text-[10px] text-ash/80 font-mono mt-2 break-all border-t border-steel pt-2">
            {finding.cvssVector}
          </div>
        </div>
      </div>

      <div className="py-5 border-y border-steel">
        <StatusStepper currentStatus={finding.status} />
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-[10px] uppercase tracking-wider font-mono text-ash mb-3 border-b border-steel pb-2">Description</h3>
          <div className="prose prose-invert max-w-none text-chalk text-[11px] leading-relaxed font-sans">
            <p>{finding.description}</p>
          </div>
        </div>

        <div>
          <h3 className="text-[10px] uppercase tracking-wider font-mono text-ash mb-3 border-b border-steel pb-2">Proof of Concept</h3>
          <pre className="bg-obsidian p-4 font-mono text-[11px] overflow-x-auto border border-steel text-frost">
            <code>{finding.proofOfConcept}</code>
          </pre>
        </div>

        <div>
          <h3 className="text-[10px] uppercase tracking-wider font-mono text-ash mb-3 border-b border-steel pb-2">Remediation</h3>
          <div className="prose prose-invert max-w-none text-chalk text-[11px] leading-relaxed font-sans">
            <p>{finding.remediation}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
