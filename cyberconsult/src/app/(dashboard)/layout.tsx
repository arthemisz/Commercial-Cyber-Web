'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shield, ShieldAlert, Users, Award, Lock, ExternalLink, LogOut, Terminal, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const navGroups = [
    {
      group: 'Enterprise Client',
      items: [
        { name: 'Active Engagements', href: '/client/engagements', icon: Shield },
      ]
    },
    {
      group: 'Security Consultant',
      items: [
        { name: 'Consultant Console', href: '/consultant', icon: Terminal },
        { name: 'Profile & Credentials', href: '/consultant/onboard', icon: Award },
      ]
    },
    {
      group: 'Governance & Auditing',
      items: [
        { name: 'Admin Telemetry', href: '/admin', icon: Lock },
      ]
    }
  ];

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <div className="min-h-screen flex bg-void text-frost">
      {/* Sidebar */}
      <aside className="w-64 flex flex-col bg-slate-surface border-r border-graphite shrink-0">
        <div className="h-16 flex items-center justify-between px-5 border-b border-graphite">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-7 h-7 rounded bg-signal/15 border border-signal/40 flex items-center justify-center">
              <Shield className="w-4 h-4 text-signal group-hover:scale-105 transition-transform" />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-sm tracking-wide text-frost">CyberConsult</span>
              <span className="text-[10px] font-mono text-signal leading-none">ZERO-TRUST ROE</span>
            </div>
          </Link>
        </div>

        <nav className="flex-1 px-3 py-5 space-y-6 overflow-y-auto">
          {navGroups.map((group) => (
            <div key={group.group}>
              <div className="px-3 mb-2 text-[11px] font-medium text-ash uppercase tracking-wider">
                {group.group}
              </div>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname?.startsWith(item.href));
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        "flex items-center justify-between px-3 py-2 text-xs font-medium rounded transition-colors",
                        isActive
                          ? "bg-signal/10 text-signal border-l-2 border-signal font-semibold"
                          : "text-ash hover:bg-graphite/30 hover:text-frost border-l-2 border-transparent"
                      )}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={cn("w-4 h-4 shrink-0", isActive ? "text-signal" : "text-ash")} />
                        <span>{item.name}</span>
                      </div>
                      {isActive && <span className="w-1.5 h-1.5 rounded-full bg-signal" />}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* System Enclave Security Status Badge */}
        <div className="p-3 mx-3 mb-3 rounded bg-void/80 border border-graphite text-[11px] font-mono">
          <div className="flex items-center gap-2 text-verified">
            <span className="w-1.5 h-1.5 rounded-full bg-verified animate-ping" />
            <span>KMS Key Envelope Armed</span>
          </div>
          <p className="text-ash text-[10px] mt-1">TTL Shredding: 60-day auto-purge</p>
        </div>

        <div className="p-3 border-t border-graphite">
          <div className="flex items-center justify-between px-2 py-1 mb-2">
            <div className="min-w-0">
              <p className="text-xs font-medium text-frost truncate">secops@acme.corp</p>
              <p className="text-[10px] font-mono text-ash truncate">Client Admin</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="flex w-full items-center gap-2 px-2 py-1.5 text-xs text-ash hover:text-frost hover:bg-graphite/40 rounded transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            End Session
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 px-8 border-b border-graphite flex items-center justify-between bg-slate-surface/40 backdrop-blur-sm shrink-0">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono rounded bg-void border border-graphite text-ash">
              <span className="w-2 h-2 rounded-full bg-signal" />
              Realtime WAL Sync Active
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <Link
              href="/"
              className="text-ash hover:text-frost flex items-center gap-1 transition-colors"
            >
              Public Portal
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
