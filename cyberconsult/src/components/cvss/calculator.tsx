'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export type CVSSVector = {
  AV: 'N' | 'A' | 'L' | 'P';
  AC: 'L' | 'H';
  PR: 'N' | 'L' | 'H';
  UI: 'N' | 'R';
  S: 'U' | 'C';
  C: 'N' | 'L' | 'H';
  I: 'N' | 'L' | 'H';
  A: 'N' | 'L' | 'H';
};

const metricWeights = {
  AV: { N: 0.85, A: 0.62, L: 0.55, P: 0.20 },
  AC: { L: 0.77, H: 0.44 },
  PR: {
    U: { N: 0.85, L: 0.62, H: 0.27 },
    C: { N: 0.85, L: 0.68, H: 0.50 }
  },
  UI: { N: 0.85, R: 0.62 },
  C: { N: 0, L: 0.22, H: 0.56 },
  I: { N: 0, L: 0.22, H: 0.56 },
  A: { N: 0, L: 0.22, H: 0.56 }
};

const roundup = (val: number) => {
  return Math.ceil(val * 10) / 10;
};

const calculateScore = (vector: CVSSVector) => {
  const { AV, AC, PR, UI, S, C, I, A } = vector;
  const iss = 1 - ((1 - metricWeights.C[C]) * (1 - metricWeights.I[I]) * (1 - metricWeights.A[A]));
  
  let impact = 0;
  if (S === 'U') {
    impact = 6.42 * iss;
  } else {
    impact = 7.52 * (iss - 0.029) - 3.25 * Math.pow(iss - 0.02, 15);
  }

  const prWeight = metricWeights.PR[S][PR];
  const exploitability = 8.22 * metricWeights.AV[AV] * metricWeights.AC[AC] * prWeight * metricWeights.UI[UI];

  if (impact <= 0) return 0;

  let baseScore = 0;
  if (S === 'U') {
    baseScore = roundup(Math.min(impact + exploitability, 10));
  } else {
    baseScore = roundup(Math.min(1.08 * (impact + exploitability), 10));
  }
  return baseScore;
};

const getSeverity = (score: number) => {
  if (score === 0) return 'None';
  if (score < 4.0) return 'Low';
  if (score < 7.0) return 'Medium';
  if (score < 9.0) return 'High';
  return 'Critical';
};

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'Critical': return 'text-kill font-bold';
    case 'High': return 'text-kill/80 font-bold';
    case 'Medium': return 'text-caution font-bold';
    case 'Low': return 'text-signal font-bold';
    default: return 'text-ash';
  }
};

const parseVector = (vectorString: string): CVSSVector => {
  const parts = vectorString.replace('CVSS:3.1/', '').split('/');
  const defaultVector: CVSSVector = { AV: 'N', AC: 'L', PR: 'N', UI: 'N', S: 'U', C: 'N', I: 'N', A: 'N' };
  parts.forEach(part => {
    const [key, val] = part.split(':');
    if (key && val && key in defaultVector) {
      (defaultVector as any)[key] = val;
    }
  });
  return defaultVector;
};

const buildVectorString = (vector: CVSSVector) => {
  return `CVSS:3.1/AV:${vector.AV}/AC:${vector.AC}/PR:${vector.PR}/UI:${vector.UI}/S:${vector.S}/C:${vector.C}/I:${vector.I}/A:${vector.A}`;
};

interface Props {
  initialVector?: string;
  onChange?: (vector: string, score: number, severity: string) => void;
}

export function CVSSCalculator({ initialVector, onChange }: Props) {
  const [vector, setVector] = useState<CVSSVector>(() => {
    if (initialVector) return parseVector(initialVector);
    return { AV: 'N', AC: 'L', PR: 'N', UI: 'N', S: 'U', C: 'N', I: 'N', A: 'N' };
  });

  const score = calculateScore(vector);
  const severity = getSeverity(score);
  const vectorString = buildVectorString(vector);

  useEffect(() => {
    if (onChange) onChange(vectorString, score, severity);
  }, [vectorString, score, severity, onChange]);

  const updateMetric = (metric: keyof CVSSVector, value: string) => {
    setVector(prev => ({ ...prev, [metric]: value }));
  };

  const MetricGroup = ({ label, metric, options }: { label: string, metric: keyof CVSSVector, options: { label: string, val: string }[] }) => (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
      <div className="text-ash text-sm w-40 font-mono">{label}</div>
      <div className="flex flex-wrap gap-1">
        {options.map(opt => (
          <button
            key={opt.val}
            onClick={() => updateMetric(metric, opt.val)}
            className={cn(
              "px-3 py-1 text-sm font-mono rounded transition-colors",
              vector[metric] === opt.val 
                ? "bg-signal text-white" 
                : "bg-graphite hover:bg-signal/20 text-frost"
            )}
          >
            {opt.label} ({opt.val})
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="bg-slate-surface p-6 rounded-lg border border-graphite/50 w-full max-w-3xl">
      <h3 className="text-frost text-lg font-mono mb-4">CVSS v3.1 Calculator</h3>
      <div className="space-y-4">
        <MetricGroup label="Attack Vector" metric="AV" options={[{ label: 'Network', val: 'N' }, { label: 'Adjacent', val: 'A' }, { label: 'Local', val: 'L' }, { label: 'Physical', val: 'P' }]} />
        <MetricGroup label="Attack Complexity" metric="AC" options={[{ label: 'Low', val: 'L' }, { label: 'High', val: 'H' }]} />
        <MetricGroup label="Privileges Required" metric="PR" options={[{ label: 'None', val: 'N' }, { label: 'Low', val: 'L' }, { label: 'High', val: 'H' }]} />
        <MetricGroup label="User Interaction" metric="UI" options={[{ label: 'None', val: 'N' }, { label: 'Required', val: 'R' }]} />
        <MetricGroup label="Scope" metric="S" options={[{ label: 'Unchanged', val: 'U' }, { label: 'Changed', val: 'C' }]} />
        <MetricGroup label="Confidentiality" metric="C" options={[{ label: 'None', val: 'N' }, { label: 'Low', val: 'L' }, { label: 'High', val: 'H' }]} />
        <MetricGroup label="Integrity" metric="I" options={[{ label: 'None', val: 'N' }, { label: 'Low', val: 'L' }, { label: 'High', val: 'H' }]} />
        <MetricGroup label="Availability" metric="A" options={[{ label: 'None', val: 'N' }, { label: 'Low', val: 'L' }, { label: 'High', val: 'H' }]} />
      </div>

      <div className="mt-8 pt-6 border-t border-graphite">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <div className="text-ash text-sm mb-1">Vector String</div>
            <div className="font-mono bg-graphite/50 p-2 rounded text-frost text-sm break-all">
              {vectorString}
            </div>
          </div>
          <div className="text-right">
            <div className="text-ash text-sm mb-1">Base Score</div>
            <div className="flex items-baseline gap-3">
              <span className={cn("text-5xl font-mono tracking-tighter", getSeverityColor(severity))}>
                {score.toFixed(1)}
              </span>
              <span className={cn("text-xl font-bold uppercase tracking-wide", getSeverityColor(severity))}>
                {severity}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
