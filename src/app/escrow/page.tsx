'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Lock,
  DollarSign,
  Shield,
  CheckCircle2,
  ArrowRight,
  Calculator,
  Layers,
  Scale,
  CreditCard,
  Building,
  Key,
  HelpCircle,
} from 'lucide-react';
import { PublicHeader } from '@/components/public/public-header';
import { PublicFooter } from '@/components/public/public-footer';
import { StatusIndicator } from '@/components/ui/status-indicator';
import { formatCurrency } from '@/lib/utils';
import { cn } from '@/lib/utils';

export default function EscrowPage() {
  const [budgetUSD, setBudgetUSD] = useState(25000);

  const budgetCents = budgetUSD * 100;
  const platformFeeCents = Math.round(budgetCents * 0.15);
  const consultantNetCents = budgetCents - platformFeeCents;

  const milestone1 = Math.round(budgetCents * 0.25);
  const milestone2 = Math.round(budgetCents * 0.50);
  const milestone3 = budgetCents - milestone1 - milestone2;

  return (
    <div className="min-h-screen bg-obsidian text-chalk selection:bg-amber selection:text-obsidian flex flex-col font-sans">
      <PublicHeader />

      <main className="flex-1 flex flex-col">
        {/* 1. HERO SECTION */}
        <section className="relative w-full py-20 px-6 border-b border-steel bg-bunker/30 overflow-hidden">
          <span className="absolute top-4 left-6 text-[10px] font-mono text-ash/40 uppercase tracking-[0.3em]">
            SEC_FIN_01 // ESCROW_PIPELINE
          </span>

          <div className="max-w-[1400px] mx-auto mt-6">
            <div className="inline-flex items-center gap-2 border border-amber/30 bg-amber/5 text-amber font-mono text-[10px] px-2.5 py-1 mb-6">
              <span className="w-1.5 h-1.5 bg-amber animate-pulse"></span>
              <span>STRIPE CONNECT 2-OF-2 MULTI-SIG ESCROW</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-7">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-frost font-mono leading-[1.08]">
                  Zero Counterparty Risk. <br />
                  Programmatic Payouts.
                </h1>
                <p className="text-chalk text-base md:text-lg leading-relaxed max-w-2xl mt-6">
                  Cyberthink eliminates financial disputes in penetration testing. Upfront enterprise funds are locked into isolated Stripe Connect multi-signature escrows, automatically released in progressive tranches upon cryptographic client sign-off.
                </p>

                <div className="flex flex-wrap items-center gap-4 mt-8 font-mono text-xs">
                  <a
                    href="#calculator"
                    className="bg-amber text-obsidian px-6 py-3 font-semibold hover:bg-frost transition-colors uppercase tracking-wider inline-flex items-center gap-2"
                  >
                    Launch Escrow Calculator →
                  </a>
                  <Link
                    href="/client/engagements"
                    className="border border-steel text-chalk px-6 py-3 hover:border-frost hover:text-frost transition-colors uppercase tracking-wider"
                  >
                    Open Active Escrows
                  </Link>
                </div>
              </div>

              {/* Escrow Pipeline Status Box */}
              <div className="lg:col-span-5 bg-bunker border border-steel p-6 font-mono text-xs shadow-2xl">
                <div className="flex items-center justify-between border-b border-steel pb-3 mb-4">
                  <span className="text-[10px] text-ash uppercase tracking-wider">
                    ESCROW MULTI-SIG TELEMETRY
                  </span>
                  <StatusIndicator status="online" blink label="SECURE 2-OF-2 ARMED" />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between py-1.5 border-b border-steel/50">
                    <span className="text-ash">CUSTODIAN:</span>
                    <span className="text-frost">Stripe Payments Europe / US LLC</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-steel/50">
                    <span className="text-ash">RELEASE PROTOCOL:</span>
                    <span className="text-verified font-bold">Dual Client/Contractor Sign-off</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-steel/50">
                    <span className="text-ash">CONSULTANT TAKE:</span>
                    <span className="text-verified font-bold">85% Net Disbursal</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-steel/50">
                    <span className="text-ash">PLATFORM PROTOCOL TAKE:</span>
                    <span className="text-amber">15% Fee (Includes WORM & Telemetry)</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-ash">DISPUTE FALLBACK:</span>
                    <span className="text-cyan">Cryptographic Arbiter / Full Refund</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. INTERACTIVE ESCROW CALCULATOR */}
        <section id="calculator" className="py-20 px-6 border-b border-steel bg-obsidian">
          <span className="absolute top-4 left-6 text-[10px] font-mono text-ash/40 uppercase tracking-[0.3em]">
            SEC_FIN_02 // FINANCIAL_MODELER
          </span>

          <div className="max-w-[1400px] mx-auto mt-6">
            <div className="mb-10">
              <h2 className="text-3xl font-bold text-frost font-mono tracking-tight">
                Interactive Escrow Pipeline Calculator
              </h2>
              <p className="text-sm text-ash font-mono mt-2">
                Simulate enterprise funding allocations, milestone release tranches, and net specialist disbursals.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Budget Controls */}
              <div className="lg:col-span-5 bg-bunker border border-steel p-6 font-mono text-xs space-y-6">
                <div>
                  <label className="text-[10px] text-ash uppercase tracking-wider block mb-2 font-semibold">
                    Engagement Escrow Pool Allocation (USD)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-3 text-ash font-bold text-base">$</span>
                    <input
                      type="number"
                      min="2000"
                      max="250000"
                      step="1000"
                      value={budgetUSD}
                      onChange={(e) => setBudgetUSD(Math.max(1000, parseInt(e.target.value, 10) || 0))}
                      className="w-full bg-obsidian border border-steel pl-8 pr-4 py-2.5 text-lg font-bold text-amber focus:outline-none focus:border-amber transition-colors"
                    />
                  </div>
                </div>

                {/* Quick Presets */}
                <div>
                  <span className="text-[10px] text-ash uppercase tracking-wider block mb-2">
                    Quick Preset Budgets
                  </span>
                  <div className="grid grid-cols-4 gap-2">
                    {[10000, 25000, 50000, 100000].map((preset) => (
                      <button
                        key={preset}
                        onClick={() => setBudgetUSD(preset)}
                        className={cn(
                          "py-2 px-2 border text-[11px] font-bold transition-colors cursor-pointer text-center",
                          budgetUSD === preset
                            ? "bg-amber text-obsidian border-amber"
                            : "bg-obsidian border-steel text-ash hover:text-frost hover:border-chalk"
                        )}
                      >
                        ${preset / 1000}k
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-obsidian border border-steel space-y-2 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-ash">Consultant Disbursal (85%):</span>
                    <span className="text-verified font-bold">{formatCurrency(consultantNetCents)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ash">Cyberthink Protocol Take (15%):</span>
                    <span className="text-amber font-bold">{formatCurrency(platformFeeCents)}</span>
                  </div>
                  <div className="flex justify-between border-t border-steel/60 pt-2 font-bold text-frost">
                    <span>Total Multi-Sig Hold:</span>
                    <span>{formatCurrency(budgetCents)}</span>
                  </div>
                </div>

                <Link
                  href="/client/engagements"
                  className="w-full py-3 bg-amber text-obsidian font-bold text-center block uppercase tracking-wider hover:bg-frost transition-colors"
                >
                  Initialize This Engagement Escrow →
                </Link>
              </div>

              {/* Right Column: Progressive Milestone Breakdown */}
              <div className="lg:col-span-7 space-y-4 font-mono text-xs">
                <div className="border border-steel bg-bunker p-5">
                  <div className="flex items-center justify-between border-b border-steel pb-3 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-amber/10 border border-amber/30 text-amber font-bold text-[10px]">
                        MILESTONE 1 (25%)
                      </span>
                      <h3 className="font-bold text-frost text-sm">Scoping & Threat Modeling Acceptance</h3>
                    </div>
                    <span className="font-bold text-amber text-sm">{formatCurrency(milestone1)}</span>
                  </div>
                  <p className="text-ash leading-relaxed">
                    Triggered upon mutual client & consultant cryptographic signature over canonical Rules of Engagement (RoE) parameters. Validates network boundaries and ensures non-repudiation.
                  </p>
                </div>

                <div className="border border-steel bg-bunker p-5">
                  <div className="flex items-center justify-between border-b border-steel pb-3 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-amber/10 border border-amber/30 text-amber font-bold text-[10px]">
                        MILESTONE 2 (50%)
                      </span>
                      <h3 className="font-bold text-frost text-sm">Vulnerability Discovery & Proof-of-Concept</h3>
                    </div>
                    <span className="font-bold text-amber text-sm">{formatCurrency(milestone2)}</span>
                  </div>
                  <p className="text-ash leading-relaxed">
                    Triggered when primary findings and reproducible, sanitized PoCs are logged in the platform defect ledger and verified against CVSS v3.1 / v4.0 metrics.
                  </p>
                </div>

                <div className="border border-steel bg-bunker p-5">
                  <div className="flex items-center justify-between border-b border-steel pb-3 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-amber/10 border border-amber/30 text-amber font-bold text-[10px]">
                        MILESTONE 3 (25%)
                      </span>
                      <h3 className="font-bold text-frost text-sm">Remediation Retest & Final Debrief</h3>
                    </div>
                    <span className="font-bold text-amber text-sm">{formatCurrency(milestone3)}</span>
                  </div>
                  <p className="text-ash leading-relaxed">
                    Triggered upon delivery of the final executive debrief report, automated SARIF export validation, and retesting confirmation of remediated defect states.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. DISPUTE ARBITRATION & REFUND GUARANTEE */}
        <section className="py-20 px-6 border-b border-steel bg-bunker">
          <div className="max-w-[1400px] mx-auto">
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-frost font-mono tracking-tight">
                Objective Dispute Arbitration & Guarantees
              </h2>
              <p className="text-sm text-ash font-mono mt-2">
                Predictable protection encoded into platform smart escrows.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
              <div className="bg-obsidian border border-steel p-6 flex flex-col justify-between">
                <div>
                  <div className="w-8 h-8 bg-steel/30 border border-steel flex items-center justify-center text-kill mb-4">
                    <Scale className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-frost uppercase mb-2">Scope Breach Protection</h3>
                  <p className="text-ash leading-relaxed text-[11px]">
                    If a consultant attacks out-of-scope targets or violates signed rate limits, the client emergency kill switch instantly freezes all remaining escrow funds and initiates an automatic refund claim.
                  </p>
                </div>
                <div className="mt-6 pt-3 border-t border-steel text-kill text-[10px]">
                  POLICY: 100% UNSPENT REFUND
                </div>
              </div>

              <div className="bg-obsidian border border-steel p-6 flex flex-col justify-between">
                <div>
                  <div className="w-8 h-8 bg-steel/30 border border-steel flex items-center justify-center text-cyan mb-4">
                    <Shield className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-frost uppercase mb-2">Deliverable Quality Arbiter</h3>
                  <p className="text-ash leading-relaxed text-[11px]">
                    Deliverables must meet objective technical taxonomy criteria (valid CWE classification, reproducible PoC, and CVSS vector calculation). Inadequate reports cannot trigger milestone release.
                  </p>
                </div>
                <div className="mt-6 pt-3 border-t border-steel text-cyan text-[10px]">
                  BENCHMARK: MITRE CWE / CVSS
                </div>
              </div>

              <div className="bg-obsidian border border-steel p-6 flex flex-col justify-between">
                <div>
                  <div className="w-8 h-8 bg-steel/30 border border-steel flex items-center justify-center text-verified mb-4">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-frost uppercase mb-2">Enterprise Payment Rails</h3>
                  <p className="text-ash leading-relaxed text-[11px]">
                    Fund engagements seamlessly via ACH debit, wire transfers (USD, EUR, GBP), or corporate credit cards. Automated VAT/sales tax invoices and W-9/W-8BEN compliant disbursements.
                  </p>
                </div>
                <div className="mt-6 pt-3 border-t border-steel text-verified text-[10px]">
                  CURRENCIES: USD, EUR, GBP
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
