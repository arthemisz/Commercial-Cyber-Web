import Image from "next/image";
import Link from "next/link";
import {
  FileCode2,
  PowerOff,
  Bug,
  Shield,
  Trash2,
  Lock,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-obsidian text-chalk selection:bg-amber selection:text-obsidian flex flex-col font-sans">
      {/* 1. NAVIGATION BAR */}
      <header className="sticky top-0 z-50 h-14 bg-obsidian border-b border-steel flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3 group">
            <Image
              src="/Logo.jpg"
              alt="Cyberthink Solutions"
              width={28}
              height={28}
              className="w-7 h-7 object-contain"
            />
            <span className="font-mono font-bold tracking-[0.2em] text-frost text-sm group-hover:text-amber transition-colors">
              CYBERTHINK
            </span>
            <span className="text-ash text-[10px]">—</span>
            <span className="text-ash text-[10px] tracking-[0.15em] uppercase">
              SOLUTIONS
            </span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          {["Architecture", "Operations", "Compliance", "Escrow"].map((item) => (
            <Link
              key={item}
              href={`#${item.toLowerCase()}`}
              className="font-mono text-[11px] uppercase tracking-wider text-ash hover:text-amber transition-colors"
            >
              {item}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/consultants"
            className="hidden sm:inline-block border border-steel text-ash hover:border-amber hover:text-amber text-[11px] font-mono px-3 py-1.5 transition-colors"
          >
            Apply as Consultant
          </Link>
          <Link
            href="/console"
            className="bg-amber text-obsidian font-mono text-[11px] font-semibold px-4 py-1.5 hover:bg-frost transition-colors"
          >
            Enter Console →
          </Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col">
        {/* 2. HERO SECTION */}
        <section className="relative w-full py-20 px-6 border-b border-steel overflow-hidden">
          {/* Subtle grid overlay could go here via a background pattern, but using base bg for now */}
          <span className="absolute top-4 left-6 text-[10px] font-mono text-ash/40 uppercase tracking-[0.3em]">
            SEC_01 // COMMAND
          </span>

          <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 mt-8">
            {/* LEFT COLUMN: 60% (7/12) */}
            <div className="lg:col-span-7 flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 border border-amber/30 bg-amber/5 text-amber font-mono text-[10px] px-2 py-1 mb-8 self-start">
                <span className="w-1.5 h-1.5 bg-amber"></span>
                <span>OPERATIONAL // ALL SYSTEMS NOMINAL</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-frost leading-[1.05]">
                Your penetration test <br className="hidden md:block" />
                shouldn't require a <br className="hidden md:block" />
                leap of faith.
              </h1>

              <p className="text-chalk text-sm md:text-base leading-relaxed max-w-xl mt-6">
                Cyberthink eliminates operational risk from security engagements. Cryptographic rules of engagement, real-time kill switches, and milestone escrow — engineered for enterprises that don't gamble with their attack surface.
              </p>

              <div className="flex flex-wrap items-center gap-4 mt-10">
                <Link
                  href="/start"
                  className="bg-amber text-obsidian font-mono text-xs font-semibold px-5 py-2.5 hover:bg-frost transition-colors inline-flex items-center gap-2"
                >
                  START ENGAGEMENT →
                </Link>
                <Link
                  href="#architecture"
                  className="border border-steel text-chalk font-mono text-xs px-5 py-2.5 hover:border-chalk hover:text-frost transition-colors"
                >
                  VIEW ARCHITECTURE
                </Link>
              </div>
            </div>

            {/* RIGHT COLUMN: 40% (5/12) */}
            <div className="lg:col-span-5 flex items-center justify-end">
              <div className="w-full border border-steel bg-bunker flex flex-col shadow-2xl">
                <div className="px-4 py-2.5 border-b border-steel bg-obsidian flex items-center justify-between">
                  <span className="font-mono text-[10px] text-ash uppercase tracking-wider">
                    THREAT TELEMETRY // LIVE
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-verified"></span>
                    <span className="text-[10px] font-mono text-verified uppercase">Sync</span>
                  </div>
                </div>

                <div className="flex flex-col">
                  <div className="flex items-center justify-between py-2 px-4 border-b border-steel/50">
                    <span className="text-[11px] font-mono text-chalk/80 w-[160px]">[2024-10-01T23:47:12Z]</span>
                    <span className="text-[11px] font-mono text-chalk/80 flex-1">SCAN</span>
                    <span className="text-[11px] font-mono text-chalk/80 flex-1">net/192.168.1.0/24</span>
                    <span className="text-[11px] font-mono text-cyan text-right w-[100px]">████████░░ 82%</span>
                  </div>
                  <div className="flex items-center justify-between py-2 px-4 border-b border-steel/50">
                    <span className="text-[11px] font-mono text-chalk/80 w-[160px]">[2024-10-01T23:47:08Z]</span>
                    <span className="text-[11px] font-mono text-chalk/80 flex-1">PROBE</span>
                    <span className="text-[11px] font-mono text-chalk/80 flex-1">tcp/443:tls1.3</span>
                    <span className="text-[11px] font-mono text-verified text-right w-[100px]">COMPLETE 4.2ms</span>
                  </div>
                  <div className="flex items-center justify-between py-2 px-4 border-b border-steel/50">
                    <span className="text-[11px] font-mono text-chalk/80 w-[160px]">[2024-10-01T23:46:55Z]</span>
                    <span className="text-[11px] font-mono text-chalk/80 flex-1">ENUM</span>
                    <span className="text-[11px] font-mono text-chalk/80 flex-1">dns/zone-transfer</span>
                    <span className="text-[11px] font-mono text-amber text-right w-[100px]">BLOCKED —</span>
                  </div>
                  <div className="flex items-center justify-between py-2 px-4 border-b border-steel/50">
                    <span className="text-[11px] font-mono text-chalk/80 w-[160px]">[2024-10-01T23:46:41Z]</span>
                    <span className="text-[11px] font-mono text-chalk/80 flex-1">AUTH</span>
                    <span className="text-[11px] font-mono text-chalk/80 flex-1">kerberos/spn-scan</span>
                    <span className="text-[11px] font-mono text-cyan text-right w-[100px]">████░░░░░░ 41%</span>
                  </div>
                  <div className="flex items-center justify-between py-2 px-4">
                    <span className="text-[11px] font-mono text-chalk/80 w-[160px]">[2024-10-01T23:46:30Z]</span>
                    <span className="text-[11px] font-mono text-chalk/80 flex-1">VULN</span>
                    <span className="text-[11px] font-mono text-chalk/80 flex-1">CVE-2024-3094</span>
                    <span className="text-[11px] font-mono text-kill text-right w-[100px]">CRITICAL ▲</span>
                  </div>
                </div>

                <div className="px-4 py-2 border-t border-steel text-[10px] font-mono text-ash bg-obsidian/50">
                  5 events · Last sync 2s ago · Latency 12ms
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. ARCHITECTURAL PILLARS SECTION */}
        <section id="architecture" className="relative w-full py-20 px-6 border-b border-steel">
          <span className="absolute top-4 left-6 text-[10px] font-mono text-ash/40 uppercase tracking-[0.3em]">
            SEC_02 // ARCHITECTURE
          </span>

          <div className="max-w-[1400px] mx-auto mt-8">
            <div className="mb-12">
              <h2 className="text-2xl font-bold tracking-tight text-frost">Zero-Trust Operational Architecture</h2>
              <p className="text-sm text-ash font-mono mt-2">TECHNICAL PILLARS // CORE INFRASTRUCTURE</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Row 1 */}
              <div className="md:col-span-2 border border-steel bg-bunker p-6 relative flex flex-col">
                <span className="absolute top-3 right-4 text-[10px] font-mono text-ash/30">01</span>
                <FileCode2 className="text-amber w-4 h-4" />
                <h3 className="text-sm font-semibold text-frost uppercase tracking-wide mt-3">Cryptographic RoE Generation</h3>
                <p className="text-xs text-chalk/70 leading-relaxed mt-2 flex-1">
                  Rules of Engagement are hashed securely with SHA-256 canonical hashing and dual digital signatures, ensuring absolute non-repudiation between consultant and client before operations commence.
                </p>
                <div className="mt-4 pt-3 border-t border-steel text-[10px] font-mono text-amber uppercase tracking-wider">
                  PROTOCOL: SHA-256 / ECDSA
                </div>
              </div>

              <div className="md:col-span-1 border border-steel bg-bunker p-6 relative flex flex-col">
                <span className="absolute top-3 right-4 text-[10px] font-mono text-ash/30">02</span>
                <PowerOff className="text-amber w-4 h-4" />
                <h3 className="text-sm font-semibold text-frost uppercase tracking-wide mt-3">Live Emergency Kill Switch</h3>
                <p className="text-xs text-chalk/70 leading-relaxed mt-2 flex-1">
                  Sub-100ms halt command propagation via PostgreSQL WAL broadcast, terminating all authorized proxy connections instantly.
                </p>
                <div className="mt-4 pt-3 border-t border-steel text-[10px] font-mono text-amber uppercase tracking-wider">
                  LATENCY: &lt; 100ms
                </div>
              </div>

              {/* Row 2 */}
              <div className="md:col-span-1 border border-steel bg-bunker p-6 relative flex flex-col">
                <span className="absolute top-3 right-4 text-[10px] font-mono text-ash/30">03</span>
                <Bug className="text-amber w-4 h-4" />
                <h3 className="text-sm font-semibold text-frost uppercase tracking-wide mt-3">Vulnerability State Machine</h3>
                <p className="text-xs text-chalk/70 leading-relaxed mt-2 flex-1">
                  Structured tracking via CVSS v3.1/v4.0 and CWE taxonomy, enabling automated SARIF exports and CI/CD ingestion.
                </p>
                <div className="mt-4 pt-3 border-t border-steel text-[10px] font-mono text-amber uppercase tracking-wider">
                  TAXONOMY: CVSS / CWE
                </div>
              </div>

              <div className="md:col-span-2 border border-steel bg-bunker p-6 relative flex flex-col">
                <span className="absolute top-3 right-4 text-[10px] font-mono text-ash/30">04</span>
                <Shield className="text-amber w-4 h-4" />
                <h3 className="text-sm font-semibold text-frost uppercase tracking-wide mt-3">Zero-Trust Envelope Encryption</h3>
                <p className="text-xs text-chalk/70 leading-relaxed mt-2 flex-1">
                  All evidence and reports are encrypted client-side using a DEK/KEK architecture backed by AWS KMS, requiring strict RBAC authorization and utilizing 5-minute TTLs for upload vectors.
                </p>
                <div className="mt-4 pt-3 border-t border-steel text-[10px] font-mono text-amber uppercase tracking-wider">
                  KMS: AWS / AES-256-GCM
                </div>
              </div>

              {/* Row 3 */}
              <div className="md:col-span-1 border border-steel bg-bunker p-6 relative flex flex-col">
                <span className="absolute top-3 right-4 text-[10px] font-mono text-ash/30">05</span>
                <Trash2 className="text-amber w-4 h-4" />
                <h3 className="text-sm font-semibold text-frost uppercase tracking-wide mt-3">Ephemeral Artifact Shredding</h3>
                <p className="text-xs text-chalk/70 leading-relaxed mt-2 flex-1">
                  Automated purge policies enforce cryptographic shredding of engagement artifacts at 30, 60, or 90-day intervals.
                </p>
                <div className="mt-4 pt-3 border-t border-steel text-[10px] font-mono text-amber uppercase tracking-wider">
                  RETENTION: ENFORCED
                </div>
              </div>

              <div className="md:col-span-1 border border-steel bg-bunker p-6 relative flex flex-col">
                <span className="absolute top-3 right-4 text-[10px] font-mono text-ash/30">06</span>
                <Lock className="text-amber w-4 h-4" />
                <h3 className="text-sm font-semibold text-frost uppercase tracking-wide mt-3">Milestone Escrow Pipeline</h3>
                <p className="text-xs text-chalk/70 leading-relaxed mt-2 flex-1">
                  Deterministic fund routing via Stripe Connect, ensuring progressive payouts automatically trigger upon cryptographic client sign-off.
                </p>
                <div className="mt-4 pt-3 border-t border-steel text-[10px] font-mono text-amber uppercase tracking-wider">
                  ROUTING: STRIPE CONNECT
                </div>
              </div>

              <div className="md:col-span-1 border border-steel bg-bunker p-6 relative flex flex-col">
                <span className="absolute top-3 right-4 text-[10px] font-mono text-ash/30">07</span>
                <Bug className="text-amber w-4 h-4" />
                <h3 className="text-sm font-semibold text-frost uppercase tracking-wide mt-3">Continuous Audit Ledger</h3>
                <p className="text-xs text-chalk/70 leading-relaxed mt-2 flex-1">
                  Every platform action is cryptographically logged to an immutable audit trail — timestamped, signed, and exportable for GRC compliance.
                </p>
                <div className="mt-4 pt-3 border-t border-steel text-[10px] font-mono text-amber uppercase tracking-wider">
                  FORMAT: RFC 3161
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* 4. MASCOT / BRAND SECTION */}
        <section className="relative w-full py-10 px-6 border-b border-steel bg-bunker">
          <span className="absolute top-4 left-6 text-[10px] font-mono text-ash/40 uppercase tracking-[0.3em]">
            SEC_03 // SYSTEM_MONITOR
          </span>

          <div className="max-w-[1400px] mx-auto flex items-center gap-8 mt-6">
            <div className="border border-steel p-1.5 flex-shrink-0 bg-obsidian">
              <Image 
                src="/analyst-luxury.jpg" 
                alt="Cyberthink Analyst" 
                width={120} 
                height={120} 
                className="w-28 h-28 object-contain"
              />
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-[10px] font-mono uppercase tracking-[0.2em] text-ash">
                CYBERTHINK ANALYST // SYSTEM MONITOR
              </h3>
              <p className="text-xs text-chalk/60 max-w-lg leading-relaxed">
                Autonomous threat assessment and engagement oversight. Monitoring 847 active security parameters across all client enclaves.
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="w-2 h-2 bg-verified"></span>
                <span className="text-verified font-mono text-[10px]">ONLINE</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 5. FOOTER */}
      <footer className="bg-obsidian border-t border-steel py-8 px-6">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex flex-col">
            <span className="font-mono font-bold tracking-[0.2em] text-frost text-sm">
              CYBERTHINK
            </span>
            <span className="mt-2 text-[10px] text-ash font-mono">
              © 2024 Cyberthink Solutions
            </span>
          </div>

          <div className="flex flex-col gap-3">
            <h4 className="text-[10px] font-mono text-ash uppercase tracking-wider mb-1">
              OPERATIONS
            </h4>
            <Link href="#" className="text-[11px] font-mono text-ash hover:text-amber transition-colors">Architecture</Link>
            <Link href="#" className="text-[11px] font-mono text-ash hover:text-amber transition-colors">Penetration Testing</Link>
            <Link href="#" className="text-[11px] font-mono text-ash hover:text-amber transition-colors">Red Teaming</Link>
          </div>

          <div className="flex flex-col gap-3">
            <h4 className="text-[10px] font-mono text-ash uppercase tracking-wider mb-1">
              COMPLIANCE
            </h4>
            <Link href="#" className="text-[11px] font-mono text-ash hover:text-amber transition-colors">SARIF Exports</Link>
            <Link href="#" className="text-[11px] font-mono text-ash hover:text-amber transition-colors">Escrow Terms</Link>
            <Link href="#" className="text-[11px] font-mono text-ash hover:text-amber transition-colors">Privacy Policy</Link>
          </div>

          <div className="flex flex-col gap-3">
            <h4 className="text-[10px] font-mono text-ash uppercase tracking-wider mb-1">
              CONNECT
            </h4>
            <Link href="#" className="text-[11px] font-mono text-ash hover:text-amber transition-colors">Console Login</Link>
            <Link href="#" className="text-[11px] font-mono text-ash hover:text-amber transition-colors">Consultant Portal</Link>
            <Link href="#" className="text-[11px] font-mono text-ash hover:text-amber transition-colors">Contact Dispatch</Link>
          </div>
        </div>

        <div className="max-w-[1400px] mx-auto border-t border-steel pt-4 mt-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-[10px] font-mono text-ash/50">
            <span>BUILD v2.4.11-stable</span>
            <span className="hidden sm:inline-block">|</span>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-verified"></span>
              <span>SYSTEMS ONLINE</span>
            </div>
          </div>
          <span className="text-[10px] font-mono text-ash/50">
            {new Date().toISOString().split('T')[0]}T{new Date().toISOString().split('T')[1].substring(0, 8)}Z
          </span>
        </div>
      </footer>
    </div>
  );
}
