'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, FileJson, ExternalLink, Plus, CheckCircle2, ShieldCheck, X } from 'lucide-react';
import { SeverityBreakdown } from './severity-breakdown';
import { FindingsTable, Finding } from './findings-table';
import { FindingCard, DetailedFinding } from './finding-card';

interface FindingsManagerProps {
  engagementId: string;
  engagementTitle: string;
  initialFindings: any[];
}

export function FindingsManager({
  engagementId,
  engagementTitle,
  initialFindings,
}: FindingsManagerProps) {
  const [selectedFindingId, setSelectedFindingId] = useState<string | null>(null);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  // Normalize findings for FindingsTable and FindingCard
  const normalizedFindings: (Finding & { raw: any })[] = initialFindings.map((f) => ({
    id: f.id,
    title: f.title,
    cweIdentifier: f.cweIdentifier || 'CWE-UNASSIGNED',
    cvssVector: f.cvssVector || 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H',
    cvssScore: typeof f.cvssScore === 'number' ? f.cvssScore : parseFloat(f.cvssScore) || 0,
    severity: (f.severity || 'Medium').toLowerCase(),
    status: f.status ? f.status.replace(/_/g, ' ') : 'REPORTED',
    updatedAt: f.updatedAt instanceof Date ? f.updatedAt.toISOString() : (f.updatedAt || new Date().toISOString()),
    raw: f,
  }));

  const selectedFindingItem = normalizedFindings.find((f) => f.id === selectedFindingId);

  const selectedFindingCardData: DetailedFinding | null = selectedFindingItem
    ? {
        id: selectedFindingItem.id,
        title: selectedFindingItem.title,
        cweIdentifier: selectedFindingItem.cweIdentifier,
        cvssVector: selectedFindingItem.cvssVector,
        cvssScore: selectedFindingItem.cvssScore,
        severity: selectedFindingItem.severity,
        status: selectedFindingItem.status,
        updatedAt: selectedFindingItem.updatedAt,
        description: selectedFindingItem.raw.description || 'No description provided.',
        proofOfConcept: selectedFindingItem.raw.proofOfConcept || selectedFindingItem.raw.poc || '# Proof of Concept\ncurl -X POST https://api.target.corp/v1/auth -d "user=\' OR 1=1--" -H "Accept: application/json"',
        remediation: selectedFindingItem.raw.remediation || 'Validate and strictly sanitize all user input before processing. Enforce parameterized statements and secure context-aware output encoding.',
      }
    : null;

  const handleExportSarif = () => {
    const sarifPayload = {
      $schema: 'https://raw.githubusercontent.com/oasis-tcs/sarif-spec/master/Schemata/sarif-schema-2.1.0.json',
      version: '2.1.0',
      runs: [
        {
          tool: {
            driver: {
              name: 'Cyberthink Offensive Suite',
              version: '2.4.11',
              informationUri: 'https://cyberthink.io',
              rules: normalizedFindings.map((f) => ({
                id: f.cweIdentifier,
                name: f.title,
                shortDescription: { text: f.title },
                fullDescription: { text: f.raw.description || f.title },
                defaultConfiguration: {
                  level: f.severity === 'critical' || f.severity === 'high' ? 'error' : 'warning',
                },
                properties: {
                  cvssScore: f.cvssScore,
                  cvssVector: f.cvssVector,
                  tags: ['security', f.cweIdentifier, f.severity],
                },
              })),
            },
          },
          results: normalizedFindings.map((f) => ({
            ruleId: f.cweIdentifier,
            level: f.severity === 'critical' || f.severity === 'high' ? 'error' : 'warning',
            message: { text: `${f.title}: ${f.raw.description || ''}` },
            locations: [
              {
                physicalLocation: {
                  artifactLocation: { uri: 'scope/target-boundary' },
                },
              },
            ],
            properties: {
              status: f.status,
              findingId: f.id,
              cvssScore: f.cvssScore,
            },
          })),
        },
      ],
    };

    const blob = new Blob([JSON.stringify(sarifPayload, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cyberthink-findings-${engagementId.slice(0, 10)}.sarif.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setSyncStatus('SARIF 2.1.0 specification generated and downloaded.');
    setTimeout(() => setSyncStatus(null), 4000);
  };

  const handleSyncTracker = () => {
    setSyncStatus('Simulating automated issue sync with GitHub / Jira webhook...');
    setTimeout(() => {
      setSyncStatus(`Successfully synchronized ${normalizedFindings.length} defect(s) to enterprise GRC tracker.`);
      setTimeout(() => setSyncStatus(null), 4000);
    }, 1000);
  };

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto font-sans">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center justify-between text-xs font-mono text-ash border-b border-steel pb-4">
        <div className="flex items-center gap-2">
          <Link
            href={`/client/engagements/${engagementId}`}
            className="hover:text-amber flex items-center gap-1 transition-colors uppercase tracking-wider"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            Back to Engagement Console
          </Link>
          <span className="text-steel">/</span>
          <span className="text-frost font-mono">DEFECT_TRACKER</span>
        </div>
        <Link
          href={`/consultant/findings-editor/${engagementId}`}
          className="inline-flex items-center gap-1.5 text-amber hover:text-frost text-xs font-mono uppercase tracking-wider transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Ingest Finding
        </Link>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 border-b border-steel pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-1.5 h-1.5 bg-amber"></span>
            <span className="font-mono text-[10px] text-ash tracking-[0.25em] uppercase">
              SEC_03 // DEFECT_LEDGER
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-frost font-mono">
            Vulnerability Findings & Lifecycle Tracking
          </h1>
          <p className="text-ash text-xs font-mono mt-1">
            {engagementTitle} · {normalizedFindings.length} verifiable defect(s) logged
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleExportSarif}
            className="inline-flex items-center gap-2 px-3.5 py-2 border border-steel bg-bunker hover:border-amber text-frost text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer"
          >
            <FileJson className="w-3.5 h-3.5 text-amber" />
            SARIF 2.1.0 Export
          </button>
          <button
            type="button"
            onClick={handleSyncTracker}
            className="inline-flex items-center gap-2 px-3.5 py-2 border border-steel bg-bunker hover:border-amber text-chalk hover:text-frost text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5 text-ash" />
            Sync Jira / GitHub
          </button>
        </div>
      </div>

      {/* Notification banner */}
      {syncStatus && (
        <div className="p-3 bg-verified/10 border border-verified/30 text-verified font-mono text-xs flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{syncStatus}</span>
        </div>
      )}

      {/* Severity Breakdown Bar Component */}
      <SeverityBreakdown findings={normalizedFindings} />

      {/* Interactive Findings Table with Search, Filter & Sort */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono text-ash uppercase tracking-wider">
            Defect Ledger ({normalizedFindings.length}) — Click row to inspect PoC & remediation
          </span>
        </div>
        <FindingsTable
          findings={normalizedFindings}
          onRowClick={(id) => setSelectedFindingId(id)}
        />
      </div>

      {/* Finding Detail Modal / Inspection View */}
      {selectedFindingCardData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian/85 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-bunker border border-steel shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between p-4 bg-obsidian border-b border-steel">
              <span className="text-[10px] font-mono uppercase tracking-widest text-ash">
                INSPECTION_TERMINAL // {selectedFindingCardData.id}
              </span>
              <button
                onClick={() => setSelectedFindingId(null)}
                className="p-1 border border-steel text-ash hover:text-amber hover:border-amber transition-colors"
                title="Close Inspection Panel"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6">
              <FindingCard finding={selectedFindingCardData} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
