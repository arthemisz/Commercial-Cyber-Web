'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Activity, FileText, Settings, Key, LogOut, Menu, X, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const navGroups = [
    {
      group: 'Enterprise Client',
      items: [
        { label: 'ACTIVE ENGAGEMENTS', href: '/client/engagements', icon: Activity, active: pathname.startsWith('/client') }
      ]
    },
    {
      group: 'Security Consultant',
      items: [
        { label: 'CONSULTANT CONSOLE', href: '/consultant', icon: FileText, active: pathname.startsWith('/consultant') && !pathname.includes('/onboard') },
        { label: 'PROFILE & ONBOARDING', href: '/consultant/onboard', icon: Key, active: pathname.includes('/consultant/onboard') }
      ]
    },
    {
      group: 'Governance & Auditing',
      items: [
        { label: 'ADMIN TELEMETRY', href: '/admin', icon: Settings, active: pathname.startsWith('/admin') }
      ]
    }
  ];

  const renderNavContent = () => (
    <div className="flex flex-col h-full bg-bunker">
      <div className="p-6 border-b border-steel flex items-center justify-between">
        <div>
          <div className="font-mono font-bold tracking-[0.2em] text-frost text-sm">
            CYBERTHINK
          </div>
          <div className="text-[9px] text-ash tracking-[0.15em] font-mono mt-1">
            SOLUTIONS
          </div>
        </div>
        {mobileMenuOpen && (
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="md:hidden text-ash hover:text-amber p-1 border border-steel"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto py-6 flex flex-col gap-6">
        {navGroups.map((g, idx) => (
          <div key={idx} className="px-4">
            <div className="text-[9px] font-mono uppercase tracking-[0.3em] text-ash/50 mb-3 px-2">
              {g.group}
            </div>
            <div className="flex flex-col space-y-1">
              {g.items.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 font-mono text-[11px] transition-colors",
                      item.active
                        ? "border-l-2 border-amber text-amber bg-amber/5 font-semibold"
                        : "border-l-2 border-transparent text-ash hover:text-chalk hover:bg-gunmetal/50"
                    )}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-auto">
        {/* Bottom status panel */}
        <div className="bg-obsidian border border-steel mx-3 mb-3 p-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-verified animate-pulse"></div>
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
            <div className="text-xs font-mono text-chalk truncate max-w-[120px]">operator@cyberthink.io</div>
            <div className="text-[9px] font-mono text-ash mt-1 uppercase tracking-wider">COMMAND LEVEL 5</div>
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
  );

  return (
    <div className="flex h-screen bg-obsidian text-chalk overflow-hidden">
      {/* Desktop Permanent Sidebar */}
      <aside className="hidden md:flex w-64 border-r border-steel flex-col flex-shrink-0 z-20">
        {renderNavContent()}
      </aside>

      {/* Mobile Drawer Backdrop & Sidebar */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-obsidian/80 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-64 max-w-[80vw] h-full z-10 border-r border-steel shadow-2xl">
            {renderNavContent()}
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Header */}
        <header className="h-12 bg-obsidian border-b border-steel flex items-center justify-between px-4 sm:px-6 flex-shrink-0 z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 border border-steel bg-gunmetal text-ash hover:text-amber transition-colors"
              aria-label="Toggle navigation"
            >
              <Menu className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2 border border-steel bg-gunmetal px-2 py-1">
              <div className="w-1.5 h-1.5 bg-amber animate-pulse"></div>
              <span className="font-mono text-[10px] text-frost tracking-wider">WAL SYNC ACTIVE</span>
            </div>
          </div>
          <Link href="/" className="font-mono text-[10px] text-ash hover:text-amber transition-colors uppercase tracking-wider">
            PUBLIC PORTAL →
          </Link>
        </header>

        <main className="bg-obsidian flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
