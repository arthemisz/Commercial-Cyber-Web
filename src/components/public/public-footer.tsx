import Link from 'next/link';
import Image from 'next/image';
import { ThemeToggle } from '@/components/ui/theme-toggle';

export function PublicFooter() {
  return (
    <footer className="bg-obsidian border-t border-steel py-10 px-6 font-sans">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <Image
                src="/analyst-luxury.svg"
                alt="Cyberthink Solutions"
                width={40}
                height={40}
                className="w-10 h-10 object-contain shrink-0"
              />
              <span className="font-mono font-bold tracking-[0.2em] text-frost text-sm">
                CYBERTHINK SOLUTIONS
              </span>
            </div>
            <p className="text-xs text-ash font-mono max-w-sm leading-relaxed mt-2">
              Connecting enterprises with vetted cybersecurity specialists. Submit a hiring request and let our expert team find the perfect match from our network of 100+ professionals.
            </p>
          </div>
          <div className="mt-6 text-[10px] text-ash/60 font-mono">
            © {new Date().getFullYear()} Cyberthink Solutions. All rights reserved.
          </div>
        </div>

        <div className="flex flex-col gap-3 font-mono">
          <h4 className="text-[10px] text-ash uppercase tracking-wider mb-1 font-semibold">
            PLATFORM
          </h4>
          <Link href="/#how-it-works" className="text-[11px] text-ash hover:text-amber transition-colors">
            How It Works
          </Link>
          <Link href="/#experts" className="text-[11px] text-ash hover:text-amber transition-colors">
            Our Expert Network
          </Link>
          <Link href="/#hire" className="text-[11px] text-ash hover:text-amber transition-colors">
            Submit a Request
          </Link>
        </div>

        <div className="flex flex-col gap-3 font-mono">
          <h4 className="text-[10px] text-ash uppercase tracking-wider mb-1 font-semibold">
            EXPERTISE AREAS
          </h4>
          <span className="text-[11px] text-ash">
            Penetration Testing
          </span>
          <span className="text-[11px] text-ash">
            Cloud Security
          </span>
          <span className="text-[11px] text-ash">
            Compliance & Auditing
          </span>
          <span className="text-[11px] text-ash">
            Incident Response
          </span>
        </div>

        <div className="flex flex-col gap-3 font-mono">
          <h4 className="text-[10px] text-ash uppercase tracking-wider mb-1 font-semibold">
            CONTACT
          </h4>
          <a href="mailto:dispatch@cyberthink.io" className="text-[11px] text-ash hover:text-amber transition-colors">
            Email Us
          </a>
          <Link href="#" className="text-[11px] text-ash hover:text-amber transition-colors">
            LinkedIn
          </Link>
          <Link href="#" className="text-[11px] text-ash hover:text-amber transition-colors">
            Twitter / X
          </Link>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto border-t border-steel pt-4 mt-8 flex flex-wrap items-center justify-between gap-4 font-mono text-[10px] text-ash/50">
        <div className="flex items-center gap-4">
          <ThemeToggle variant="segmented" />
          <span className="hidden sm:inline-block">|</span>
          <span>TRUSTED BY 50+ ENTERPRISES</span>
        </div>
        <span>
          100+ EXPERTS · 25+ DOMAINS · 98% SATISFACTION
        </span>
      </div>
    </footer>
  );
}
