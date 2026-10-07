import { ThemeToggle } from '@/components/ui/theme-toggle';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-obsidian min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Subtle grid background */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(var(--color-steel)_1px,transparent_1px),linear-gradient(90deg,var(--color-steel)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
      
      {/* Section coordinate label */}
      <div className="absolute top-6 left-6 font-mono text-[10px] tracking-[0.2em] text-ash/50">
        AUTH // SECURE_GATEWAY
      </div>

      <div className="absolute top-6 right-6">
        <ThemeToggle size="sm" />
      </div>

      <div className="relative z-10 w-full max-w-md px-4">
        {children}
      </div>
    </div>
  );
}
