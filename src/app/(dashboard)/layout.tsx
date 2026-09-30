'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Shield, Users, Activity, FileText, Settings, Key, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <div className="flex h-screen bg-obsidian text-chalk">
      {/* Sidebar */}
      <div className="w-64 bg-bunker border-r border-steel flex flex-col flex-shrink-0">
        <div className="p-6 border-b border-steel">
          <div className="font-mono font-bold tracking-[0.2em] text-frost text-sm">
            CYBERTHINK
          </div>
          <div className="text-[9px] text-ash tracking-[0.15em] font-mono mt-1">
            SOLUTIONS
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-6 flex flex-col gap-8">
          {/* Nav Group 1 */}
          <div className="px-4">
            <div className="text-[9px] font-mono uppercase tracking-[0.3em] text-ash/50 mb-3 px-2">
              Enterprise Client
            </div>
            <Link
              href="/client/engagements"
              className={cn(
                "flex items-center gap-3 px-3 py-2 font-mono text-[11px] transition-colors",
                pathname.startsWith('/client')
                  ? "border-l-2 border-amber text-amber bg-amber/5"
                  : "border-l-2 border-transparent text-ash hover:text-chalk hover:bg-gunmetal/50"
              )}
            >
              <Activity className="w-4 h-4" />
              ACTIVE ENGAGEMENTS
            </Link>
          </div>

          {/* Nav Group 2 */}
          <div className="px-4">
            <div className="text-[9px] font-mono uppercase tracking-[0.3em] text-ash/50 mb-3 px-2">
              Security Consultant
            </div>
            <Link
              href="/consultant"
              className={cn(
                "flex items-center gap-3 px-3 py-2 font-mono text-[11px] transition-colors",
                pathname.startsWith('/consultant') && !pathname.includes('/onboard')
                  ? "border-l-2 border-amber text-amber bg-amber/5"
                  : "border-l-2 border-transparent text-ash hover:text-chalk hover:bg-gunmetal/50"
              )}
            >
              <FileText className="w-4 h-4" />
              CONSULTANT CONSOLE
            </Link>
            <Link
              href="/consultant/onboard"
              className={cn(
                "flex items-center gap-3 px-3 py-2 font-mono text-[11px] transition-colors mt-1",
                pathname.includes('/consultant/onboard')
                  ? "border-l-2 border-amber text-amber bg-amber/5"
                  : "border-l-2 border-transparent text-ash hover:text-chalk hover:bg-gunmetal/50"
              )}
            >
              <Key className="w-4 h-4" />
              PROFILE & ONBOARDING
            </Link>
          </div>

          {/* Nav Group 3 */}
          <div className="px-4">
            <div className="text-[9px] font-mono uppercase tracking-[0.3em] text-ash/50 mb-3 px-2">
              Governance & Auditing
            </div>
            <Link
              href="/admin"
              className={cn(
                "flex items-center gap-3 px-3 py-2 font-mono text-[11px] transition-colors",
                pathname.startsWith('/admin')
                  ? "border-l-2 border-amber text-amber bg-amber/5"
                  : "border-l-2 border-transparent text-ash hover:text-chalk hover:bg-gunmetal/50"
              )}
            >
              <Settings className="w-4 h-4" />
              ADMIN TELEMETRY
            </Link>
          </div>
        </div>

        <div className="mt-auto">
          {/* Bottom status panel */}
          <div className="bg-obsidian border border-steel mx-3 mb-3 p-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-verified"></div>
              <div className="w-2 h-2 bg-verified/20"></div>
              <div className="w-2 h-2 bg-verified/20"></div>
            </div>
            <div className="text-verified text-[10px] font-mono">
              KMS ENVELOPE: ARMED
            </div>
            <div className="text-ash text-[10px] font-mono mt-1">
              TTL SHRED: 60-DAY
            </div>
          </div>

          <div className="p-4 border-t border-steel bg-bunker flex items-center justify-between">
            <div>
              <div className="text-xs font-mono text-chalk truncate max-w-[120px]">user@cyberthink.io</div>
              <div className="text-[9px] font-mono text-ash mt-1 uppercase tracking-wider">ADMINISTRATOR</div>
            </div>
            <button 
              onClick={handleSignOut}
              className="p-2 text-ash hover:text-kill transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-12 bg-obsidian border-b border-steel flex items-center justify-between px-6 flex-shrink-0">
          <div className="flex items-center gap-2 border border-steel bg-gunmetal px-2 py-1">
            <div className="w-1.5 h-1.5 bg-amber"></div>
            <span className="font-mono text-[10px] text-frost tracking-wider">WAL SYNC ACTIVE</span>
          </div>
          <Link href="/" className="font-mono text-[10px] text-ash hover:text-amber transition-colors uppercase tracking-wider">
            PUBLIC PORTAL →
          </Link>
        </header>

        <main className="bg-obsidian flex-1 overflow-y-auto p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
