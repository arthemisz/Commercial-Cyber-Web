'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { HireModal } from '@/components/public/hire-modal';

export function PublicHeader() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'How It Works', href: '/#how-it-works', active: false },
    { label: 'Our Experts', href: '/#experts', active: false },
    { label: 'Contact', href: 'mailto:dispatch@cyberthink.io', active: false },
  ];

  return (
    <header className="sticky top-0 z-50 h-14 bg-obsidian border-b border-steel flex items-center justify-between px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <Link href="/" className="flex items-center gap-3 group">
          <Image
            src="/Logo.svg"
            alt="Cyberthink Solutions"
            width={44}
            height={44}
            className="w-10 h-10 sm:w-11 sm:h-11 object-contain shrink-0"
          />
          <span className="font-mono font-bold tracking-[0.2em] text-frost text-sm group-hover:text-amber transition-colors">
            CYBERTHINK
          </span>
          <span className="text-ash text-[10px]">—</span>
          <span className="text-ash text-[10px] tracking-[0.15em] uppercase hidden sm:inline">
            SOLUTIONS
          </span>
        </Link>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-8">
        {navLinks.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={cn(
              "font-mono text-[11px] uppercase tracking-wider transition-colors relative py-1",
              item.active
                ? "text-amber font-semibold"
                : "text-ash hover:text-amber"
            )}
          >
            {item.label}
            {item.active && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-amber" />
            )}
          </Link>
        ))}
      </nav>

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        <ThemeToggle size="sm" />

        <HireModal>
          <span className="bg-amber text-obsidian font-mono text-[11px] font-semibold px-4 py-1.5 hover:bg-frost transition-colors uppercase tracking-wider cursor-pointer">
            HIRE AN EXPERT →
          </span>
        </HireModal>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-1.5 border border-steel text-ash hover:text-amber transition-colors"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="absolute top-14 left-0 right-0 bg-bunker border-b border-steel p-6 flex flex-col gap-4 md:hidden shadow-2xl z-50 animate-fadeIn">
          <nav className="flex flex-col gap-3">
            {navLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "font-mono text-xs uppercase tracking-wider py-2 px-3 border border-steel transition-colors",
                  item.active
                    ? "border-amber text-amber bg-amber/5 font-semibold"
                    : "text-ash hover:text-frost hover:bg-gunmetal"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          
          <div className="pt-3 border-t border-steel flex items-center justify-between">
            <span className="font-mono text-xs uppercase tracking-wider text-ash">Theme</span>
            <ThemeToggle variant="segmented" />
          </div>

          <div className="pt-2 border-t border-steel flex flex-col gap-2">
            <HireModal>
              <span className="text-center bg-amber text-obsidian font-semibold py-2 text-xs font-mono uppercase tracking-wider hover:bg-frost transition-colors cursor-pointer block w-full">
                HIRE AN EXPERT →
              </span>
            </HireModal>
          </div>
        </div>
      )}
    </header>
  );
}
