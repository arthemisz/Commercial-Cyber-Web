import Link from 'next/link'
import { 
  Shield, 
  Terminal, 
  Lock, 
  Skull, 
  Bug, 
  FileCheck2, 
  HardDrive, 
  Coins, 
  ArrowRight, 
  CheckCircle2, 
  Radio, 
  Activity,
  Layers,
  Key
} from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-void text-frost flex flex-col selection:bg-signal selection:text-void">
      {/* Navigation */}
      <header className="border-b border-graphite/80 bg-slate-surface/40 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-signal/15 border border-signal/40 flex items-center justify-center">
              <Shield className="w-4 h-4 text-signal" />
            </div>
            <div>
              <span className="font-bold text-base tracking-tight text-frost">CyberConsult</span>
              <span className="ml-2 text-[10px] font-mono px-2 py-0.5 rounded bg-graphite border border-graphite/80 text-ash">
                v2.4 ZERO-TRUST
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-ash">
            <a href="#features" className="hover:text-frost transition-colors">Architecture</a>
            <a href="#roe" className="hover:text-frost transition-colors">Cryptographic RoE</a>
            <a href="#kill-switch" className="hover:text-frost transition-colors">Kill Switch</a>
            <a href="#escrow" className="hover:text-frost transition-colors">Escrow Pipeline</a>
          </nav>

          <div className="flex items-center gap-3 text-xs">
            <Link 
              href="/consultant/onboard" 
              className="px-3.5 py-1.5 text-ash hover:text-frost transition-colors font-medium"
            >
              Consultant Apply
            </Link>
            <Link 
              href="/client/engagements" 
              className="px-4 py-1.5 rounded bg-signal hover:bg-signal/90 text-void font-semibold tracking-wide transition-colors"
            >
              Enter Console
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 px-6 border-b border-graphite overflow-hidden">
        {/* Subtle background ambient mesh */}
        <div className="absolute inset-0 bg-[radial-gradient(#1E293B_1px,transparent_1px)] [background-size:24px_24px] opacity-30 pointer-events-none" />
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-surface border border-graphite text-xs text-ash mb-6">
              <span className="w-2 h-2 rounded-full bg-verified animate-pulse" />
              <span>Cryptographic verification & emergency escrow safeguards</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-frost leading-[1.1] mb-6">
              Zero-Trust Marketplace for Enterprise Security Engagements
            </h1>

            <p className="text-ash text-base md:text-lg leading-relaxed mb-8 max-w-2xl font-normal">
              Connect with vetted offensive specialists for Penetration Testing, Cloud Security, and AppSec audits. Protected by client-side SHA-256 Rules of Engagement, real-time kill-switch controls, and milestone escrow.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link 
                href="/client/engagements" 
                className="px-6 py-3 rounded bg-signal hover:bg-signal/90 text-void font-semibold text-sm transition-colors flex items-center gap-2"
              >
                Access Active Engagements
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link 
                href="/admin" 
                className="px-6 py-3 rounded border border-graphite bg-slate-surface hover:bg-graphite/40 text-frost text-sm font-medium transition-colors"
              >
                Inspect Telemetry Ledger
              </Link>
            </div>
          </div>

          {/* Live System Enclave Preview Card */}
          <div className="mt-8 border border-graphite rounded-xl bg-slate-surface/90 shadow-2xl overflow-hidden">
            <div className="px-5 py-3 border-b border-graphite bg-void/60 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-kill/60" />
                <span className="w-2.5 h-2.5 rounded-full bg-caution/60" />
                <span className="w-2.5 h-2.5 rounded-full bg-verified/60" />
                <span className="text-ash ml-2">cyberconsult://enclave-guard.node.local</span>
              </div>
              <span className="text-verified">STATUS: WAL SYNCHRONIZED</span>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
              <div className="p-4 rounded bg-void border border-graphite flex flex-col justify-between">
                <div>
                  <div className="text-ash text-[11px] mb-1">RULES OF ENGAGEMENT HASH</div>
                  <div className="text-signal break-all">
                    e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-graphite text-verified flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Dual Digital Signature Validated
                </div>
              </div>

              <div className="p-4 rounded bg-void border border-graphite flex flex-col justify-between">
                <div>
                  <div className="text-ash text-[11px] mb-1">KILL SWITCH STATUS</div>
                  <div className="text-frost text-sm font-semibold">STANDBY · ARMED</div>
                  <p className="text-ash text-[11px] mt-1 font-sans">
                    Client trigger broadcasts instant halt via PostgreSQL WAL to consultant edge.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-graphite text-signal flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5" />
                  Latency &lt; 85ms WSS
                </div>
              </div>

              <div className="p-4 rounded bg-void border border-graphite flex flex-col justify-between">
                <div>
                  <div className="text-ash text-[11px] mb-1">STRIPE CONNECT ESCROW</div>
                  <div className="text-frost text-sm font-semibold">$35,000.00 CAPTURED</div>
                  <p className="text-ash text-[11px] mt-1 font-sans">
                    3 of 5 milestones verified. Automated 15% platform fee deduction on release.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-graphite text-verified flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" />
                  Funds In Escrow Hold
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Architectural Pillars */}
      <section id="features" className="py-20 px-6 border-b border-graphite">
        <div className="max-w-6xl mx-auto">
          <div className="mb-14">
            <h2 className="text-2xl font-bold tracking-tight text-frost">Zero-Trust Operational Architecture</h2>
            <p className="text-ash text-sm mt-1">
              Engineered to dissolve legal, technical, and operational friction between enterprise security leaders and external researchers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Pillar 1 */}
            <div id="roe" className="bg-slate-surface border border-graphite rounded-lg p-6 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded bg-signal/10 border border-signal/30 flex items-center justify-center mb-5 text-signal">
                  <FileCheck2 className="w-5 h-5" />
                </div>
                <h3 className="text-base font-semibold text-frost mb-2">Cryptographic RoE Generation</h3>
                <p className="text-ash text-xs leading-relaxed font-normal">
                  Interactive scoping parameters capture CIDRs, URLs, scheduled testing windows, and rate limits. Once finalized, client-side SHA-256 canonical hashing locks terms before digital signature acceptance.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-graphite text-xs text-signal font-mono">
                Immutable JSON Canonicalization
              </div>
            </div>

            {/* Pillar 2 */}
            <div id="kill-switch" className="bg-slate-surface border border-graphite rounded-lg p-6 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded bg-kill/10 border border-kill/30 flex items-center justify-center mb-5 text-kill">
                  <Skull className="w-5 h-5" />
                </div>
                <h3 className="text-base font-semibold text-frost mb-2">Live Emergency Kill Switch</h3>
                <p className="text-ash text-xs leading-relaxed font-normal">
                  High-priority dashboard trigger allowing enterprise sponsors to halt testing instantly if production impact is suspected. Triggers instantaneous Supabase Realtime broadcast and SMS webhooks.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-graphite text-xs text-kill font-mono">
                Sub-100ms Termination Broadcast
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="bg-slate-surface border border-graphite rounded-lg p-6 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded bg-caution/10 border border-caution/30 flex items-center justify-center mb-5 text-caution">
                  <Bug className="w-5 h-5" />
                </div>
                <h3 className="text-base font-semibold text-frost mb-2">Vulnerability State Machine</h3>
                <p className="text-ash text-xs leading-relaxed font-normal">
                  Replaces static PDF deliverables with an integrated remediation dashboard. Integrated CVSS v3.1 / v4.0 scoring, CWE taxonomy, and one-click export to SARIF JSON and Jira Cloud.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-graphite text-xs text-caution font-mono">
                REPORTED → RETEST VERIFIED → CLOSED
              </div>
            </div>

            {/* Pillar 4 */}
            <div className="bg-slate-surface border border-graphite rounded-lg p-6 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded bg-signal/10 border border-signal/30 flex items-center justify-center mb-5 text-signal">
                  <HardDrive className="w-5 h-5" />
                </div>
                <h3 className="text-base font-semibold text-frost mb-2">Zero-Trust Envelope Encryption</h3>
                <p className="text-ash text-xs leading-relaxed font-normal">
                  Technical artifacts and exploit PoCs undergo client-side encryption via Data Encryption Keys (DEKs) wrapped by AWS KMS Key Encryption Keys (KEKs). Short-lived pre-signed uploads with 5-minute strict TTL.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-graphite text-xs text-signal font-mono">
                KMS Alias: alias/cyberconsult-key
              </div>
            </div>

            {/* Pillar 5 */}
            <div className="bg-slate-surface border border-graphite rounded-lg p-6 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded bg-purple-500/10 border border-purple-500/30 flex items-center justify-center mb-5 text-purple-400">
                  <Layers className="w-5 h-5" />
                </div>
                <h3 className="text-base font-semibold text-frost mb-2">Ephemeral Artifact Shredding</h3>
                <p className="text-ash text-xs leading-relaxed font-normal">
                  Configurable 30, 60, or 90-day post-engagement purge policies permanently shred technical documentation and network topologies to minimize long-term liability for both enterprise and consultant.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-graphite text-xs text-purple-400 font-mono">
                Dynamic Watermarking Preview
              </div>
            </div>

            {/* Pillar 6 */}
            <div id="escrow" className="bg-slate-surface border border-graphite rounded-lg p-6 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded bg-verified/10 border border-verified/30 flex items-center justify-center mb-5 text-verified">
                  <Coins className="w-5 h-5" />
                </div>
                <h3 className="text-base font-semibold text-frost mb-2">Milestone Escrow Pipeline</h3>
                <p className="text-ash text-xs leading-relaxed font-normal">
                  Enterprise funding is captured upfront via Stripe Connect and held in escrow. Payouts release progressively as milestones (e.g. Scoping Accepted, Initial Report, Retest) receive authenticated sign-off.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-graphite text-xs text-verified font-mono">
                Stripe Express & Custom Payouts
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-graphite bg-slate-surface/30 py-8 px-6 text-xs text-ash">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-signal" />
            <span className="font-semibold text-frost">CyberConsult</span>
            <span>&copy; {new Date().getFullYear()}. Enterprise Security Marketplace & Scoping Platform.</span>
          </div>
          <div className="flex items-center gap-6 font-mono text-[11px]">
            <Link href="/client/engagements" className="hover:text-frost transition-colors">Client Portal</Link>
            <Link href="/consultant" className="hover:text-frost transition-colors">Consultant Portal</Link>
            <Link href="/admin" className="hover:text-frost transition-colors">Audit Ledger</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

