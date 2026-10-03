import Link from 'next/link';

export function PublicFooter() {
  return (
    <footer className="bg-obsidian border-t border-steel py-10 px-6 font-sans">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-1.5 h-1.5 bg-amber"></span>
              <span className="font-mono font-bold tracking-[0.2em] text-frost text-sm">
                CYBERTHINK SOLUTIONS
              </span>
            </div>
            <p className="text-xs text-ash font-mono max-w-sm leading-relaxed mt-2">
              High-assurance offensive security operations. Dual-signed cryptographic RoE, real-time emergency kill switches, and milestone-backed escrow architectures.
            </p>
          </div>
          <div className="mt-6 text-[10px] text-ash/60 font-mono">
            © {new Date().getFullYear()} Cyberthink Solutions. All rights reserved.
          </div>
        </div>

        <div className="flex flex-col gap-3 font-mono">
          <h4 className="text-[10px] text-ash uppercase tracking-wider mb-1 font-semibold">
            OPERATIONS
          </h4>
          <Link href="/operations" className="text-[11px] text-ash hover:text-amber transition-colors">
            Operational Protocol
          </Link>
          <Link href="/operations#kill-switch" className="text-[11px] text-ash hover:text-amber transition-colors">
            Kill Switch Engine
          </Link>
          <Link href="/operations#scope-bounding" className="text-[11px] text-ash hover:text-amber transition-colors">
            Scope Bounding (RoE)
          </Link>
          <Link href="/client/engagements" className="text-[11px] text-ash hover:text-amber transition-colors">
            Authorized Scopes
          </Link>
        </div>

        <div className="flex flex-col gap-3 font-mono">
          <h4 className="text-[10px] text-ash uppercase tracking-wider mb-1 font-semibold">
            COMPLIANCE
          </h4>
          <Link href="/compliance" className="text-[11px] text-ash hover:text-amber transition-colors">
            GRC & Compliance Directives
          </Link>
          <Link href="/compliance#frameworks" className="text-[11px] text-ash hover:text-amber transition-colors">
            SOC 2 / ISO 27001 Mapping
          </Link>
          <Link href="/compliance#worm-audit" className="text-[11px] text-ash hover:text-amber transition-colors">
            RFC 3161 WORM Ledger
          </Link>
          <Link href="/compliance#sarif" className="text-[11px] text-ash hover:text-amber transition-colors">
            SARIF 2.1.0 Telemetry
          </Link>
        </div>

        <div className="flex flex-col gap-3 font-mono">
          <h4 className="text-[10px] text-ash uppercase tracking-wider mb-1 font-semibold">
            ESCROW & ACCESS
          </h4>
          <Link href="/escrow" className="text-[11px] text-ash hover:text-amber transition-colors">
            Milestone Escrow Architecture
          </Link>
          <Link href="/escrow#calculator" className="text-[11px] text-ash hover:text-amber transition-colors">
            Disbursal Calculator
          </Link>
          <Link href="/login" className="text-[11px] text-ash hover:text-amber transition-colors">
            Client Login
          </Link>
          <Link href="/consultant" className="text-[11px] text-ash hover:text-amber transition-colors">
            Consultant Portal
          </Link>
          <a href="mailto:dispatch@cyberthink.io" className="text-[11px] text-ash hover:text-amber transition-colors">
            Contact Dispatch
          </a>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto border-t border-steel pt-4 mt-8 flex flex-wrap items-center justify-between gap-4 font-mono text-[10px] text-ash/50">
        <div className="flex items-center gap-4">
          <span>BUILD v2.4.11-stable</span>
          <span className="hidden sm:inline-block">|</span>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-verified"></span>
            <span>SECURE ESCROW & TELEMETRY LIVE</span>
          </div>
        </div>
        <span>
          ENCRYPTION: AES-256-GCM · WAL SYNC: SUB-100MS · MULTI-SIG: STRIPE CONNECT
        </span>
      </div>
    </footer>
  );
}
