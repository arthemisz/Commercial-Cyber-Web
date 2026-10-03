'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, Home, ShieldAlert } from 'lucide-react';

export default function GlobalErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log exception to local telemetry
    console.error('Unhandled platform route error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-obsidian text-chalk selection:bg-amber selection:text-obsidian flex flex-col items-center justify-center p-6 font-sans">
      <div className="max-w-xl w-full bg-bunker border border-kill/40 p-8 shadow-2xl relative font-mono">
        <span className="absolute top-4 left-6 text-[10px] text-kill/70 uppercase tracking-[0.3em]">
          EXCEPTION_RECOVERY // CRITICAL_INTERRUPT
        </span>

        <div className="mt-6 flex items-center gap-3 border-b border-steel pb-4 mb-6">
          <div className="w-10 h-10 bg-kill/10 border border-kill/30 flex items-center justify-center text-kill">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-frost tracking-tight uppercase">
              Route Execution Interrupted
            </h1>
            <p className="text-[11px] text-ash">
              Cryptographic pipeline encountered an unexpected client state.
            </p>
          </div>
        </div>

        <div className="bg-obsidian border border-steel p-4 mb-6 text-xs text-ash space-y-2">
          <div className="flex items-center justify-between text-[10px] border-b border-steel/50 pb-2">
            <span className="text-ash/60 uppercase">SYSTEM_STATE:</span>
            <span className="text-kill font-bold">RECOVERY_MODE</span>
          </div>
          {error.digest && (
            <div className="text-[11px] text-chalk/80">
              <span className="text-amber">DIGEST:</span> {error.digest}
            </div>
          )}
          <div className="text-[11px] text-chalk/70 break-words font-mono">
            {error.message || 'An unexpected rendering or network exception occurred while loading the view.'}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs">
          <button
            onClick={() => reset()}
            className="flex-1 bg-amber text-obsidian px-5 py-2.5 font-semibold uppercase tracking-wider hover:bg-frost transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Retry Execution
          </button>
          <Link
            href="/"
            className="border border-steel text-chalk px-5 py-2.5 hover:border-frost hover:text-frost transition-colors uppercase tracking-wider flex items-center justify-center gap-2"
          >
            <Home className="w-3.5 h-3.5" />
            Home Console
          </Link>
        </div>
      </div>
    </div>
  );
}
