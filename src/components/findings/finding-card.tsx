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

const getSeverityStyles = (severity: string) => {
  switch (severity.toLowerCase()) {
    case 'critical': return 'bg-kill text-white border-kill';
    case 'high': return 'bg-kill/80 text-white border-kill/80';
    case 'medium': return 'bg-caution text-void border-caution';
    case 'low': return 'bg-signal text-void border-signal';
    default: return 'bg-ash text-void border-ash';
  }
};

const getSeverityTextColor = (severity: string) => {
  switch (severity.toLowerCase()) {
    case 'critical': return 'text-kill';
    case 'high': return 'text-kill/80';
    case 'medium': return 'text-caution';
    case 'low': return 'text-signal';
    default: return 'text-ash';
  }
};

export function FindingCard({ finding }: Props) {
  return (
    <div className="bg-slate-surface rounded-lg border border-graphite/50 overflow-hidden text-frost flex flex-col gap-6 p-6">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className={cn("px-2 py-1 text-xs rounded border font-mono uppercase font-bold", getSeverityStyles(finding.severity))}>
              {finding.severity}
            </span>
            <span className="font-mono text-ash text-sm">{finding.cweIdentifier}</span>
          </div>
          <h2 className="text-2xl font-bold">{finding.title}</h2>
        </div>
        <div className="bg-void border border-graphite rounded-lg p-3 text-right">
          <div className="text-xs text-ash font-mono mb-1">CVSS Base Score</div>
          <div className="flex items-center justify-end gap-2">
            <span className={cn("text-3xl font-mono font-bold tracking-tighter", getSeverityTextColor(finding.severity))}>
              {finding.cvssScore.toFixed(1)}
            </span>
          </div>
          <div className="text-[10px] text-ash font-mono mt-1 break-all max-w-[200px]">
            {finding.cvssVector}
          </div>
        </div>
      </div>

      <div className="py-4 border-y border-graphite">
        <StatusStepper currentStatus={finding.status} />
      </div>

      <div>
        <h3 className="text-lg font-mono text-ash mb-2 border-b border-graphite/50 pb-1">Description</h3>
        <div className="prose prose-invert max-w-prose text-frost text-sm leading-relaxed">
          <p>{finding.description}</p>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-mono text-ash mb-2 border-b border-graphite/50 pb-1">Proof of Concept</h3>
        <pre className="bg-void p-4 rounded-lg font-mono text-sm overflow-x-auto border border-graphite text-frost">
          <code>{finding.proofOfConcept}</code>
        </pre>
      </div>

      <div>
        <h3 className="text-lg font-mono text-ash mb-2 border-b border-graphite/50 pb-1">Remediation</h3>
        <div className="prose prose-invert max-w-prose text-frost text-sm leading-relaxed">
          <p>{finding.remediation}</p>
        </div>
      </div>
    </div>
  );
}
