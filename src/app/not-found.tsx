import Link from 'next/link';
import { ShieldX, Home, ArrowLeft } from 'lucide-react';
import { PublicHeader } from '@/components/public/public-header';
import { PublicFooter } from '@/components/public/public-footer';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-obsidian text-chalk selection:bg-amber selection:text-obsidian flex flex-col font-sans">
      <PublicHeader />

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-bunker border border-steel p-8 shadow-2xl relative font-mono text-center">
          <span className="text-[10px] text-ash/40 uppercase tracking-[0.3em] block mb-4">
            ERR_404 // RESOURCE_NOT_FOUND
          </span>

          <div className="w-12 h-12 bg-amber/10 border border-amber/30 mx-auto flex items-center justify-center text-amber mb-4">
            <ShieldX className="w-6 h-6" />
          </div>

          <h1 className="text-xl font-bold text-frost tracking-tight uppercase mb-2">
            Target Out of Scope
          </h1>
          <p className="text-xs text-ash leading-relaxed mb-6">
            The requested URI does not map to any authorized route, engagement perimeter, or platform directive.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 text-xs">
            <Link
              href="/"
              className="flex-1 bg-amber text-obsidian px-4 py-2.5 font-semibold uppercase tracking-wider hover:bg-frost transition-colors flex items-center justify-center gap-2"
            >
              <Home className="w-3.5 h-3.5" />
              Return Home
            </Link>
            <Link
              href="/compliance"
              className="border border-steel text-chalk px-4 py-2.5 hover:border-frost hover:text-frost transition-colors uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Compliance
            </Link>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
