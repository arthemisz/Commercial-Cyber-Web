'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Shield,
  FileCheck2,
  Lock,
  CheckCircle2,
  FileText,
  Download,
  Terminal,
  Layers,
  Database,
  ExternalLink,
  ChevronRight,
  HardDrive,
  Trash2,
  Key,
} from 'lucide-react';
import { PublicHeader } from '@/components/public/public-header';
import { PublicFooter } from '@/components/public/public-footer';
import { StatusIndicator } from '@/components/ui/status-indicator';
import { cn } from '@/lib/utils';

interface FrameworkControl {
  code: string;
  title: string;
  desc: string;
}

interface FrameworkDefinition {
  name: string;
  controls: FrameworkControl[];
}

const FRAMEWORKS: Record<'SOC2' | 'ISO27001' | 'PCIDSS' | 'NIST' | 'HIPAA', FrameworkDefinition> = {
  SOC2: {
    name: 'SOC 2 Type II (AICPA Trust Services Criteria)',
    controls: [
      { code: 'CC6.1 / CC6.2', title: 'Logical Access Controls', desc: 'Consultant access restricted by cryptographic key pairs and bounded WireGuard tunnels.' },
      { code: 'CC6.6 / CC6.8', title: 'Vulnerability Management & Defense', desc: 'Identified vulnerabilities mapped to CVSS v3.1 / v4.0 metrics with full remediation verification.' },
      { code: 'CC7.1 / CC7.2', title: 'Threat Monitoring & Anomaly Detection', desc: 'Real-time WAL streaming and continuous audit logging for all operational probe events.' },
      { code: 'CC8.1', title: 'Change Governance & Verification', desc: 'Retest workflow verifies committed fixes before final milestone escrow disbursal.' }
    ]
  },
  ISO27001: {
    name: 'ISO/IEC 27001:2022 Information Security',
    controls: [
      { code: 'Control A.5.24', title: 'Information Security Incident Management', desc: 'Sub-100ms emergency kill switch enables instant mitigation if adverse conditions arise.' },
      { code: 'Control A.8.8', title: 'Management of Technical Vulnerabilities', desc: 'Structured defect ingestion adhering to MITRE CWE taxonomy and structured SARIF exports.' },
      { code: 'Control A.8.29', title: 'Security Testing in Development and Acceptance', desc: 'Independent offensive validation executed within digitally signed, non-repudiated RoE parameters.' },
      { code: 'Control A.8.31', title: 'Separation of Development, Test, and Production', desc: 'Rigorous out-of-scope exemptions preventing destructive testing on critical production datastores.' }
    ]
  },
  PCIDSS: {
    name: 'PCI-DSS v4.0 Requirement 11.3',
    controls: [
      { code: 'Req 11.3.1', title: 'External Penetration Testing', desc: 'Annual and post-major-change perimeter testing backed by cryptographic scope attestation.' },
      { code: 'Req 11.3.2', title: 'Internal Network Penetration Testing', desc: 'Segmentation validation testing proving strict network layer isolation around cardholder data.' },
      { code: 'Req 11.3.3', title: 'Remediation Retest Verification', desc: 'Milestone escrow structures require verified patch retests before consultant payout authorization.' }
    ]
  },
  NIST: {
    name: 'NIST SP 800-53 Rev. 5 / FedRAMP Moderate & High',
    controls: [
      { code: 'CA-8', title: 'Penetration Testing Standard', desc: 'Independent red team assessment adhering strictly to authorized rules of engagement.' },
      { code: 'AU-2 / AU-9', title: 'Audit Generation & Protection of Audit Information', desc: 'Immutable WORM audit ledger complying with RFC 3161 trusted timestamping.' },
      { code: 'SC-28', title: 'Protection of Information at Rest', desc: 'AWS KMS envelope encryption with AES-256-GCM ensuring evidence zero-leakage.' }
    ]
  },
  HIPAA: {
    name: 'HIPAA Security Rule 45 CFR § 164.308',
    controls: [
      { code: '§ 164.308(a)(1)', title: 'Security Management Process - Risk Analysis', desc: 'Comprehensive technical attack surface vulnerability discovery without exposing ePHI.' },
      { code: '§ 164.308(a)(8)', title: 'Periodic Evaluation & Technical Audits', desc: 'Verifiable technical compliance documentation suitable for OCR and third-party auditors.' },
      { code: '§ 164.312(a)(2)(iv)', title: 'Encryption and Decryption (ePHI Protection)', desc: 'Zero-knowledge client-side encryption and 60-day ephemeral auto-shredding TTLs.' }
    ]
  }
};

type FrameworkKey = keyof typeof FRAMEWORKS;

const SAMPLE_SARIF_JSON = `{
  "$schema": "https://docs.oasis-open.org/sarif/sarif/v2.1.0/cos02/schemas/sarif-schema-2.1.0.json",
  "version": "2.1.0",
  "runs": [
    {
      "tool": {
        "driver": {
          "name": "Cyberthink Offensive Platform",
          "semanticVersion": "2.4.11",
          "rules": [
            {
              "id": "CWE-89",
              "name": "SQL Injection in Login Portal",
              "properties": {
                "cvssScore": 9.8,
                "cvssVector": "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H",
                "severity": "CRITICAL"
              }
            }
          ]
        }
      },
      "results": [
        {
          "ruleId": "CWE-89",
          "level": "error",
          "message": { "text": "Time-based blind SQL injection detected on /api/v1/auth endpoint." }
        }
      ]
    }
  ]
}`;

export default function CompliancePage() {
  const [selectedFramework, setSelectedFramework] = useState<FrameworkKey>('SOC2');
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);

  const activeFramework = FRAMEWORKS[selectedFramework] || FRAMEWORKS.SOC2;

  const handleDownloadSpec = () => {
    if (typeof window === 'undefined') return;

    try {
      const spec = {
        title: 'Cyberthink Solutions Platform Compliance & GRC Attestation',
        version: '2024.4',
        date: new Date().toISOString(),
        standards: ['SOC 2 Type II', 'ISO/IEC 27001:2022', 'PCI-DSS 4.0 Req 11.3', 'NIST SP 800-53', 'HIPAA'],
        securityArchitecture: {
          roeIntegrity: 'SHA-256 Canonical Serialization + Dual ECDSA Signatures',
          auditTrail: 'RFC 3161 Append-Only WORM Ledger',
          encryptionAtRest: 'AWS KMS Envelope Encryption (AES-256-GCM)',
          ephemeralStorage: 'Enforced 30/60/90-Day TTL Cryptographic Shredding',
          telemetry: 'PostgreSQL WAL Stream Broadcast (<100ms)',
        }
      };

      const blob = new Blob([JSON.stringify(spec, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `cyberthink-compliance-spec-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setDownloadNotice('Compliance Specification manifest exported to JSON.');
      setTimeout(() => setDownloadNotice(null), 4000);
    } catch (err) {
      console.error('Failed to export compliance specification:', err);
    }
  };

  return (
    <div className="min-h-screen bg-obsidian text-chalk selection:bg-amber selection:text-obsidian flex flex-col font-sans">
      <PublicHeader />

      <main className="flex-1 flex flex-col">
        {/* 1. HERO SECTION */}
        <section className="relative w-full py-20 px-6 border-b border-steel bg-bunker/30 overflow-hidden">
          <span className="absolute top-4 left-6 text-[10px] font-mono text-ash/40 uppercase tracking-[0.3em]">
            SEC_GRC_01 // COMPLIANCE_AND_GOVERNANCE
          </span>

          <div className="max-w-[1400px] mx-auto mt-6">
            <div className="inline-flex items-center gap-2 border border-verified/30 bg-verified/5 text-verified font-mono text-[10px] px-2.5 py-1 mb-6">
              <span className="w-1.5 h-1.5 bg-verified animate-pulse"></span>
              <span>AUDIT-READY OFFENSIVE SECURITY TELEMETRY</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-7">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-frost font-mono leading-[1.08]">
                  Built for Enterprise GRC. <br />
                  Verified by Cryptography.
                </h1>
                <p className="text-chalk text-base md:text-lg leading-relaxed max-w-2xl mt-6">
                  Traditional penetration tests produce static, unverified PDFs that create liability during regulatory audits. Cyberthink generates tamper-proof evidence packages with non-repudiated RoE signatures, immutable WORM logs, and automated SARIF 2.1.0 telemetry.
                </p>

                <div className="flex flex-wrap items-center gap-4 mt-8 font-mono text-xs">
                  <button
                    onClick={handleDownloadSpec}
                    className="bg-amber text-obsidian px-6 py-3 font-semibold hover:bg-frost transition-colors uppercase tracking-wider inline-flex items-center gap-2 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    Download Compliance Spec (JSON)
                  </button>
                  <a
                    href="#frameworks"
                    className="border border-steel text-chalk px-6 py-3 hover:border-frost hover:text-frost transition-colors uppercase tracking-wider"
                  >
                    View Framework Mapping
                  </a>
                </div>
              </div>

              {/* GRC Certifications Grid */}
              <div className="lg:col-span-5 bg-bunker border border-steel p-6 font-mono text-xs shadow-2xl">
                <div className="flex items-center justify-between border-b border-steel pb-3 mb-4">
                  <span className="text-[10px] text-ash uppercase tracking-wider">
                    GRC FRAMEWORK COMPLIANCE SCORECARD
                  </span>
                  <StatusIndicator status="online" label="ACTIVE" />
                </div>

                <div className="space-y-3">
                  {[
                    { framework: 'SOC 2 Type II', status: 'COMPLIANT', scope: 'CC6.1, CC6.6, CC7.1' },
                    { framework: 'ISO/IEC 27001:2022', status: 'ALIGNED', scope: 'A.8.8, A.8.29, A.5.24' },
                    { framework: 'PCI-DSS v4.0', status: 'VERIFIED', scope: 'Req 11.3 External & Internal' },
                    { framework: 'NIST SP 800-53 Rev. 5', status: 'ALIGNED', scope: 'CA-8, AU-2, SC-28' },
                    { framework: 'HIPAA Security Rule', status: 'CERTIFIED', scope: '45 CFR § 164.308' },
                  ].map((row, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-steel/50 last:border-0 text-xs">
                      <div>
                        <div className="text-frost font-bold">{row.framework}</div>
                        <div className="text-[10px] text-ash mt-0.5">{row.scope}</div>
                      </div>
                      <span className="px-2 py-0.5 border border-verified/30 bg-verified/10 text-verified text-[10px] font-bold">
                        {row.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {downloadNotice && (
          <div className="bg-verified/10 border-b border-verified/30 p-3 text-center text-xs font-mono text-verified">
            {downloadNotice}
          </div>
        )}

        {/* 2. FRAMEWORK MAPPING MATRIX */}
        <section id="frameworks" className="relative py-20 px-6 border-b border-steel bg-obsidian">
          <span className="absolute top-4 left-6 text-[10px] font-mono text-ash/40 uppercase tracking-[0.3em]">
            SEC_GRC_02 // REGULATORY_CROSSWALK
          </span>

          <div className="max-w-[1400px] mx-auto mt-6">
            <div className="mb-10">
              <h2 className="text-3xl font-bold text-frost font-mono tracking-tight">
                Framework Cross-Walk & Control Mappings
              </h2>
              <p className="text-sm text-ash font-mono mt-2">
                Select a standard to inspect mapped platform safeguards and automated audit artifacts.
              </p>
            </div>

            {/* Framework Selector Tabs */}
            <div className="flex flex-wrap border border-steel bg-bunker p-1 font-mono text-xs mb-8">
              {(Object.keys(FRAMEWORKS) as Array<FrameworkKey>).map((key) => (
                <button
                  key={key}
                  onClick={() => setSelectedFramework(key)}
                  className={cn(
                    "flex-1 min-w-[140px] py-2.5 px-4 text-center uppercase tracking-wider transition-colors cursor-pointer",
                    selectedFramework === key
                      ? "bg-amber text-obsidian font-bold"
                      : "text-ash hover:text-frost hover:bg-gunmetal"
                  )}
                >
                  {key}
                </button>
              ))}
            </div>

            {/* Framework Details */}
            <div className="bg-bunker border border-steel p-6 md:p-8 font-mono">
              <div className="border-b border-steel pb-4 mb-6">
                <span className="text-[10px] text-amber uppercase tracking-wider font-semibold">Active Mapping</span>
                <h3 className="text-lg font-bold text-frost mt-1">{activeFramework.name}</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {activeFramework.controls.map((ctrl, i) => (
                  <div key={i} className="p-4 bg-obsidian border border-steel flex flex-col justify-between">
                    <div>
                      <span className="px-2 py-0.5 bg-steel/30 text-amber text-[10px] border border-steel inline-block mb-2">
                        {ctrl.code}
                      </span>
                      <h4 className="text-sm font-bold text-frost mb-1.5">{ctrl.title}</h4>
                      <p className="text-ash text-xs leading-relaxed">{ctrl.desc}</p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-steel text-[10px] text-verified flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>EVIDENCE LOGGED AUTOMATICALLY</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 3. FOUR CORE COMPLIANCE PILLARS */}
        <section id="worm-audit" className="relative py-20 px-6 border-b border-steel bg-bunker">
          <span className="absolute top-4 left-6 text-[10px] font-mono text-ash/40 uppercase tracking-[0.3em]">
            SEC_GRC_03 // GOVERNANCE_PILLARS
          </span>

          <div className="max-w-[1400px] mx-auto mt-6">
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-frost font-mono tracking-tight">
                Cryptographic Governance Architecture
              </h2>
              <p className="text-sm text-ash font-mono mt-2">
                Four engineering pillars that transform security operations into airtight compliance records.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 font-mono text-xs">
              {/* Pillar 1 */}
              <div className="bg-obsidian border border-steel p-6 flex flex-col justify-between">
                <div>
                  <div className="w-8 h-8 bg-steel/30 border border-steel flex items-center justify-center text-amber mb-4">
                    <FileCheck2 className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-frost uppercase mb-2">Dual-Signed RoE</h3>
                  <p className="text-ash leading-relaxed text-[11px]">
                    Bilateral ECDSA signatures over canonical SHA-256 parameter hashes. Establishes legal authorization and scope boundaries under the US ESIGN Act and eIDAS.
                  </p>
                </div>
                <div className="mt-6 pt-3 border-t border-steel text-amber text-[10px]">
                  STANDARD: SHA-256 / ECDSA
                </div>
              </div>

              {/* Pillar 2 */}
              <div className="bg-obsidian border border-steel p-6 flex flex-col justify-between">
                <div>
                  <div className="w-8 h-8 bg-steel/30 border border-steel flex items-center justify-center text-verified mb-4">
                    <Terminal className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-frost uppercase mb-2">RFC 3161 WORM Ledger</h3>
                  <p className="text-ash leading-relaxed text-[11px]">
                    Insert-only audit logging. Every RoE signature, kill-switch test, and defect report is timestamped with trusted RFC 3161 tokens preventing retroactive tampering.
                  </p>
                </div>
                <div className="mt-6 pt-3 border-t border-steel text-verified text-[10px]">
                  STORAGE: IMMUTABLE WRITE-ONCE
                </div>
              </div>

              {/* Pillar 3 */}
              <div className="bg-obsidian border border-steel p-6 flex flex-col justify-between">
                <div>
                  <div className="w-8 h-8 bg-steel/30 border border-steel flex items-center justify-center text-cyan mb-4">
                    <HardDrive className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-frost uppercase mb-2">Envelope Encryption</h3>
                  <p className="text-ash leading-relaxed text-[11px]">
                    Customer data encrypted client-side using AWS KMS AES-256-GCM DEK/KEK hierarchy. Keys are tied to customer AWS accounts for cryptographic sovereignty.
                  </p>
                </div>
                <div className="mt-6 pt-3 border-t border-steel text-cyan text-[10px]">
                  SECURITY: AES-256-GCM / AWS KMS
                </div>
              </div>

              {/* Pillar 4 */}
              <div className="bg-obsidian border border-steel p-6 flex flex-col justify-between">
                <div>
                  <div className="w-8 h-8 bg-steel/30 border border-steel flex items-center justify-center text-kill mb-4">
                    <Trash2 className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-frost uppercase mb-2">Ephemeral Auto-Shred</h3>
                  <p className="text-ash leading-relaxed text-[11px]">
                    Automated purge lifecycle enforcing 30, 60, or 90-day cryptographic destruction of engagement artifacts, raw PCAPs, and vulnerability PoC code.
                  </p>
                </div>
                <div className="mt-6 pt-3 border-t border-steel text-kill text-[10px]">
                  RETENTION: ENFORCED 60-DAY TTL
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. SARIF 2.1.0 INTEGRATION */}
        <section id="sarif" className="relative py-20 px-6 border-b border-steel bg-obsidian">
          <span className="absolute top-4 left-6 text-[10px] font-mono text-ash/40 uppercase tracking-[0.3em]">
            SEC_GRC_04 // PIPELINE_INGESTION
          </span>

          <div className="max-w-[1400px] mx-auto mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-6">
                <span className="text-[10px] font-mono text-amber uppercase tracking-wider font-semibold">
                  DEVSECOPS PIPELINE INGESTION
                </span>
                <h2 className="text-3xl font-bold text-frost font-mono tracking-tight mt-2">
                  Native SARIF 2.1.0 Telemetry
                </h2>
                <p className="text-sm text-ash font-mono mt-4 leading-relaxed">
                  Export findings directly into the OASIS Static Analysis Results Interchange Format (SARIF). Ingest penetration test discoveries straight into GitHub Advanced Security code scanning, GitLab Ultimate Security Dashboards, and Jira Service Desk without manual rekeying.
                </p>

                <div className="mt-6 space-y-3 font-mono text-xs">
                  <div className="flex items-center gap-2 text-frost">
                    <CheckCircle2 className="w-4 h-4 text-verified" />
                    <span>Compliant with OASIS SARIF v2.1.0 JSON Schema</span>
                  </div>
                  <div className="flex items-center gap-2 text-frost">
                    <CheckCircle2 className="w-4 h-4 text-verified" />
                    <span>MITRE CWE taxonomy & CVSS v3.1 / v4.0 metrics attached</span>
                  </div>
                  <div className="flex items-center gap-2 text-frost">
                    <CheckCircle2 className="w-4 h-4 text-verified" />
                    <span>Sanitized reproduction code blocks & remediation tags</span>
                  </div>
                </div>

                <div className="mt-8">
                  <Link
                    href="/client/engagements"
                    className="inline-flex items-center gap-2 bg-amber text-obsidian px-5 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider hover:bg-frost transition-colors"
                  >
                    View Live Findings Tracker →
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-6 bg-bunker border border-steel p-4 font-mono text-[11px] overflow-hidden">
                <div className="flex items-center justify-between border-b border-steel pb-2 mb-3 text-[10px] text-ash">
                  <span>SAMPLE // SARIF_PAYLOAD.JSON</span>
                  <span>OASIS v2.1.0</span>
                </div>
                <pre className="text-chalk overflow-x-auto p-3 bg-obsidian border border-steel max-h-80 leading-snug whitespace-pre font-mono text-xs">
                  {SAMPLE_SARIF_JSON}
                </pre>
              </div>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
