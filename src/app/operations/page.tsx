'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Shield,
  PowerOff,
  Terminal,
  Activity,
  AlertTriangle,
  Lock,
  CheckCircle2,
  Cpu,
  Layers,
  Zap,
  Globe,
  Radio,
  FileCheck2,
  ChevronRight,
  Skull,
} from 'lucide-react';
import { PublicHeader } from '@/components/public/public-header';
import { PublicFooter } from '@/components/public/public-footer';
import { StatusIndicator } from '@/components/ui/status-indicator';
import { cn } from '@/lib/utils';

export default function OperationsPage() {
  const [simulatedKill, setSimulatedKill] = useState(false);
  const [simulatedPackets, setSimulatedPackets] = useState(14820);
  const [rateLimit, setRateLimit] = useState(15);

  const handleSimulateKill = () => {
    setSimulatedKill(true);
  };

  const handleResetSimulation = () => {
    setSimulatedKill(false);
    setSimulatedPackets(14820);
  };

  return (
    <div className="min-h-screen bg-obsidian text-chalk selection:bg-amber selection:text-obsidian flex flex-col font-sans">
      <PublicHeader />

      <main className="flex-1 flex flex-col">
        {/* 1. HERO SECTION */}
        <section className="relative w-full py-20 px-6 border-b border-steel bg-bunker/30 overflow-hidden">
          <span className="absolute top-4 left-6 text-[10px] font-mono text-ash/40 uppercase tracking-[0.3em]">
            SEC_OPS_01 // OPERATIONAL_FRAMEWORK
          </span>

          <div className="max-w-[1400px] mx-auto mt-6">
            <div className="inline-flex items-center gap-2 border border-amber/30 bg-amber/5 text-amber font-mono text-[10px] px-2.5 py-1 mb-6">
              <span className="w-1.5 h-1.5 bg-amber animate-pulse"></span>
              <span>DETERMINISTIC OFFENSIVE OPERATIONS</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-7">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-frost font-mono leading-[1.08]">
                  Zero Collateral Damage. <br />
                  Cryptographic Control.
                </h1>
                <p className="text-chalk text-base md:text-lg leading-relaxed max-w-2xl mt-6">
                  Cyberthink replaces handshake agreements with mathematically bounded offensive testing. Every packet, proxy hop, and exploit vector is constrained by digital parameters, verified through continuous telemetry, and subject to instantaneous abort commands.
                </p>

                <div className="flex flex-wrap items-center gap-4 mt-8 font-mono text-xs">
                  <Link
                    href="/client/engagements"
                    className="bg-amber text-obsidian px-6 py-3 font-semibold hover:bg-frost transition-colors uppercase tracking-wider inline-flex items-center gap-2"
                  >
                    Authorize New Operation →
                  </Link>
                  <a
                    href="#kill-switch"
                    className="border border-steel text-chalk px-6 py-3 hover:border-frost hover:text-frost transition-colors uppercase tracking-wider"
                  >
                    Inspect Kill Switch Engine
                  </a>
                </div>
              </div>

              {/* Real-time telemetry tile */}
              <div className="lg:col-span-5 bg-bunker border border-steel p-6 font-mono text-xs shadow-2xl">
                <div className="flex items-center justify-between border-b border-steel pb-3 mb-4">
                  <span className="text-[10px] text-ash uppercase tracking-wider">
                    OPERATIONAL TELEMETRY FEED
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-verified animate-pulse"></span>
                    <span className="text-[10px] text-verified">ACTIVE PROXIES: 4</span>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <div className="flex justify-between py-1 border-b border-steel/50">
                    <span className="text-ash">PROXY PIPELINE:</span>
                    <span className="text-frost">WireGuard Encrypted Mesh</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-steel/50">
                    <span className="text-ash">AVERAGE LATENCY:</span>
                    <span className="text-verified">18.4ms (Cross-Regional)</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-steel/50">
                    <span className="text-ash">KILL SWITCH RESPONSE:</span>
                    <span className="text-amber">&lt; 85ms WAL Propagation</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-steel/50">
                    <span className="text-ash">TRAFFIC CONCURRENCY:</span>
                    <span className="text-frost">15 req/sec (Auto-Capped)</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-ash">CANONICAL ROE HASH:</span>
                    <span className="text-amber truncate max-w-[180px]">e3b0c44298fc1c14...</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. THE EMERGENCY KILL SWITCH ARCHITECTURE */}
        <section id="kill-switch" className="py-20 px-6 border-b border-steel bg-obsidian relative">
          <span className="absolute top-4 left-6 text-[10px] font-mono text-ash/40 uppercase tracking-[0.3em]">
            SEC_OPS_02 // EMERGENCY_ABORT_MECHANISM
          </span>

          <div className="max-w-[1400px] mx-auto mt-6">
            <div className="max-w-2xl mb-12">
              <h2 className="text-3xl font-bold text-frost font-mono tracking-tight">
                Sub-100ms Live Emergency Kill Switch
              </h2>
              <p className="text-sm text-ash font-mono mt-2 leading-relaxed">
                If testing destabilizes mission-critical infrastructure, clients retain an unrevokable single-click abort trigger that severs authorized consultant access in under 100 milliseconds.
              </p>
            </div>

            {/* Interactive Kill Switch Simulator */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-6 bg-bunker border border-steel p-6 font-mono text-xs">
                <div className="flex items-center justify-between border-b border-steel pb-4 mb-6">
                  <div className="flex items-center gap-2">
                    <Skull className={cn("w-4 h-4", simulatedKill ? "text-kill" : "text-amber")} />
                    <span className="font-bold text-frost uppercase tracking-wider">
                      Interactive Abort Simulator
                    </span>
                  </div>
                  <span className="text-[10px] text-ash border border-steel px-2 py-0.5">
                    SUPABASE REALTIME WAL BROADCAST
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-obsidian border border-steel space-y-2">
                    <div className="flex justify-between">
                      <span className="text-ash">OPERATION STATUS:</span>
                      <span className={cn("font-bold uppercase", simulatedKill ? "text-kill" : "text-verified")}>
                        {simulatedKill ? 'ABORTED // KILL SWITCH TRIGGERED' : 'OPERATIONAL // ACTIVE SCANNING'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-ash">EGRESS PACKETS TRANSMITTED:</span>
                      <span className="text-frost">{simulatedKill ? '0 req/sec (DROPPED)' : `${simulatedPackets.toLocaleString()} reqs`}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-ash">PROXY TUNNEL STATE:</span>
                      <span className={simulatedKill ? "text-kill" : "text-verified"}>
                        {simulatedKill ? 'SEVERED (TCP RST INJECTED)' : 'BOUNDED & ROUTED'}
                      </span>
                    </div>
                  </div>

                  {!simulatedKill ? (
                    <button
                      onClick={handleSimulateKill}
                      className="w-full py-3 bg-kill/20 border border-kill text-kill hover:bg-kill hover:text-frost font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2"
                    >
                      <PowerOff className="w-4 h-4" />
                      TRIGGER EMERGENCY KILL SWITCH (DEMO)
                    </button>
                  ) : (
                    <div className="space-y-3">
                      <div className="p-3 border border-kill/40 bg-kill/10 text-kill text-[11px]">
                        [SYSTEM HALT] Client abort broadcast confirmed. All proxy tunnels severed within 42ms. Consultant notified via automated webhook and SMS dispatch.
                      </div>
                      <button
                        onClick={handleResetSimulation}
                        className="w-full py-2.5 bg-gunmetal border border-steel text-chalk hover:text-frost hover:border-amber uppercase tracking-wider transition-colors"
                      >
                        Reset Simulator State
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Technical Mechanics List */}
              <div className="lg:col-span-6 space-y-4 font-mono text-xs">
                <div className="border border-steel bg-bunker p-5">
                  <h3 className="text-frost font-bold text-sm mb-1 uppercase flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber" />
                    1. PostgreSQL WAL Logical Decoding
                  </h3>
                  <p className="text-ash leading-relaxed mt-1">
                    When the client triggers the abort command, an atomic state change is committed to the write-ahead log. Supabase Realtime picks up the CDC event instantly.
                  </p>
                </div>

                <div className="border border-steel bg-bunker p-5">
                  <h3 className="text-frost font-bold text-sm mb-1 uppercase flex items-center gap-2">
                    <Radio className="w-4 h-4 text-cyan" />
                    2. Edge Proxy Tunnel Dropping
                  </h3>
                  <p className="text-ash leading-relaxed mt-1">
                    Edge WireGuard gateway nodes subscribe directly to WebSocket broadcast channels. Within milliseconds, active iptables rules drop all consultant traffic and inject TCP resets.
                  </p>
                </div>

                <div className="border border-steel bg-bunker p-5">
                  <h3 className="text-frost font-bold text-sm mb-1 uppercase flex items-center gap-2">
                    <FileCheck2 className="w-4 h-4 text-verified" />
                    3. Immutable Cryptographic Incident Log
                  </h3>
                  <p className="text-ash leading-relaxed mt-1">
                    The abort timestamp, actor signature, and IP telemetry are immutably appended to the WORM audit ledger, providing indisputable evidence for post-incident review.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. SCOPE BOUNDING & METHODOLOGY */}
        <section id="scope-bounding" className="relative py-20 px-6 border-b border-steel bg-bunker">
          <span className="absolute top-4 left-6 text-[10px] font-mono text-ash/40 uppercase tracking-[0.3em]">
            SEC_OPS_03 // SCOPE_BOUNDING
          </span>

          <div className="max-w-[1400px] mx-auto mt-6">
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-frost font-mono tracking-tight">
                Cryptographic Scope Bounding & Enforcement
              </h2>
              <p className="text-sm text-ash font-mono mt-2">
                Multi-vector parameter isolation to guarantee consultants only touch authorized assets.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
              <div className="bg-obsidian border border-steel p-6 flex flex-col justify-between">
                <div>
                  <div className="w-8 h-8 bg-steel/30 border border-steel flex items-center justify-center text-amber mb-4">
                    <Globe className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-frost uppercase mb-2">Network & IP Boundaries</h3>
                  <p className="text-ash leading-relaxed text-[11px]">
                    CIDR ranges (/24, /28), public hostnames, and AWS VPC peering interfaces are digitally hashed. Any egress attempt to unapproved IP spaces triggers immediate automated proxy blacklisting.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-steel text-amber text-[10px]">
                  ENFORCEMENT: BGP / IPTABLES
                </div>
              </div>

              <div className="bg-obsidian border border-steel p-6 flex flex-col justify-between">
                <div>
                  <div className="w-8 h-8 bg-steel/30 border border-steel flex items-center justify-center text-cyan mb-4">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-frost uppercase mb-2">Adaptive Rate Limiting</h3>
                  <p className="text-ash leading-relaxed text-[11px]">
                    Automated request throttling caps payload velocity to prevent accidental Denial of Service or load balancer saturation. Burst windows are customizable per engagement tier.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-steel text-cyan text-[10px]">
                  DEFAULT: 10 - 25 REQ/SEC
                </div>
              </div>

              <div className="bg-obsidian border border-steel p-6 flex flex-col justify-between">
                <div>
                  <div className="w-8 h-8 bg-steel/30 border border-steel flex items-center justify-center text-kill mb-4">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-frost uppercase mb-2">Explicit Exemptions</h3>
                  <p className="text-ash leading-relaxed text-[11px]">
                    Production relational databases, payment processor webhooks, and third-party SaaS integrations can be marked strictly off-limits with explicit criminal liability waivers.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-steel text-kill text-[10px]">
                  POLICY: ZERO EXPLOITATION
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. ENGAGEMENT PHASES */}
        <section className="py-20 px-6 border-b border-steel bg-obsidian">
          <div className="max-w-[1400px] mx-auto">
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-frost font-mono tracking-tight">
                Standard Four-Stage Operational Lifecycle
              </h2>
              <p className="text-sm text-ash font-mono mt-2">
                Predictable milestones tied directly to cryptographic fund release.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 font-mono text-xs">
              {[
                { stage: 'PHASE 01', title: 'Reconnaissance & Scope Attestation', pct: '20%', desc: 'Passive OSINT, port enumeration, threat surface mapping, and bilateral RoE signing.' },
                { stage: 'PHASE 02', title: 'Vulnerability Analysis & PoC', pct: '30%', desc: 'Identification of flaws, initial exploitation attempts, and CVSS vector modeling.' },
                { stage: 'PHASE 03', title: 'Exploitation & Lateral Movement', pct: '30%', desc: 'Safe privilege escalation, impact validation, and sanitized proof-of-concept capture.' },
                { stage: 'PHASE 04', title: 'Debrief & Retest Verification', pct: '20%', desc: 'SARIF 2.1.0 report generation, executive debrief, patch validation, and escrow release.' },
              ].map((p, idx) => (
                <div key={idx} className="bg-bunker border border-steel p-6 flex flex-col justify-between relative">
                  <span className="text-[10px] text-amber font-bold">{p.stage}</span>
                  <div className="my-4">
                    <h3 className="text-sm font-bold text-frost mb-2">{p.title}</h3>
                    <p className="text-ash text-[11px] leading-relaxed">{p.desc}</p>
                  </div>
                  <div className="border-t border-steel pt-3 flex justify-between items-center text-[10px]">
                    <span className="text-ash">ESCROW DISBURSAL:</span>
                    <span className="text-verified font-bold">{p.pct}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 p-6 bg-bunker border border-steel flex flex-col sm:flex-row items-center justify-between gap-4 font-mono">
              <div>
                <h4 className="text-frost font-bold text-sm">Ready to deploy authorized offensive testing?</h4>
                <p className="text-ash text-xs mt-1">Configure your boundary parameters in the RoE builder in under 3 minutes.</p>
              </div>
              <Link
                href="/client/engagements"
                className="bg-amber text-obsidian px-6 py-2.5 font-semibold text-xs uppercase tracking-wider hover:bg-frost transition-colors shrink-0"
              >
                Launch Engagement Scope →
              </Link>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
