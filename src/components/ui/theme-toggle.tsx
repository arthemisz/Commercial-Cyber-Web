'use client';

import React from 'react';
import { Sun, Moon, Laptop } from 'lucide-react';
import { useTheme } from '@/context/theme-context';
import { cn } from '@/lib/utils';

export interface ThemeToggleProps {
  className?: string;
  variant?: 'icon' | 'segmented' | 'badge';
  size?: 'sm' | 'md';
}

export function ThemeToggle({
  className,
  variant = 'icon',
  size = 'md',
}: ThemeToggleProps) {
  const { theme, resolvedTheme, setTheme, toggleTheme, mounted } = useTheme();

  if (variant === 'segmented') {
    // Current active selection (defaults to 'dark' before hydration)
    const currentTheme = mounted ? theme : 'dark';

    return (
      <div
        className={cn(
          "inline-flex items-center p-0.5 border border-steel bg-obsidian font-mono text-[10px]",
          className
        )}
        role="group"
        aria-label="Theme mode selector"
      >
        <button
          type="button"
          onClick={() => setTheme('dark')}
          className={cn(
            "px-2 py-1 flex items-center gap-1.5 transition-colors uppercase tracking-wider cursor-pointer",
            currentTheme === 'dark'
              ? "bg-amber text-obsidian font-semibold"
              : "text-ash hover:text-frost hover:bg-gunmetal"
          )}
          title="Dark Theme"
        >
          <Moon className="w-3 h-3" />
          <span>DARK</span>
        </button>

        <button
          type="button"
          onClick={() => setTheme('light')}
          className={cn(
            "px-2 py-1 flex items-center gap-1.5 transition-colors uppercase tracking-wider cursor-pointer",
            currentTheme === 'light'
              ? "bg-amber text-obsidian font-semibold"
              : "text-ash hover:text-frost hover:bg-gunmetal"
          )}
          title="Light Theme"
        >
          <Sun className="w-3 h-3" />
          <span>LIGHT</span>
        </button>

        <button
          type="button"
          onClick={() => setTheme('system')}
          className={cn(
            "px-2 py-1 flex items-center gap-1.5 transition-colors uppercase tracking-wider cursor-pointer",
            currentTheme === 'system'
              ? "bg-amber text-obsidian font-semibold"
              : "text-ash hover:text-frost hover:bg-gunmetal"
          )}
          title="System Theme"
        >
          <Laptop className="w-3 h-3" />
          <span>SYS</span>
        </button>
      </div>
    );
  }

  if (variant === 'badge') {
    const isDark = mounted ? resolvedTheme === 'dark' : true;

    return (
      <button
        type="button"
        onClick={toggleTheme}
        className={cn(
          "inline-flex items-center gap-2 px-2.5 py-1 border border-steel bg-bunker text-ash hover:border-amber hover:text-amber font-mono text-[11px] uppercase tracking-wider transition-all duration-150 group cursor-pointer",
          className
        )}
        aria-label={`Toggle theme (currently ${isDark ? 'dark' : 'light'})`}
        title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      >
        <span className="relative flex h-2 w-2">
          <span
            className={cn(
              "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
              isDark ? "bg-amber" : "bg-cyan"
            )}
          />
          <span
            className={cn(
              "relative inline-flex rounded-full h-2 w-2",
              isDark ? "bg-amber" : "bg-cyan"
            )}
          />
        </span>
        {isDark ? (
          <>
            <Moon className="w-3.5 h-3.5 text-amber" />
            <span className="text-frost group-hover:text-amber">MODE: DARK</span>
          </>
        ) : (
          <>
            <Sun className="w-3.5 h-3.5 text-amber" />
            <span className="text-frost group-hover:text-amber">MODE: LIGHT</span>
          </>
        )}
      </button>
    );
  }

  // Default 'icon' button variant: Uses pure CSS class swapping for instant rendering without layout shift
  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={cn(
        "relative flex items-center justify-center border border-steel bg-bunker text-ash hover:border-amber hover:text-amber transition-all duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber group cursor-pointer",
        size === 'sm' ? "h-7 w-7" : "h-8 w-8",
        className
      )}
      aria-label="Toggle theme"
      title="Toggle theme (Light / Dark)"
    >
      <Sun className="theme-toggle-sun w-4 h-4 transition-transform duration-200 group-hover:rotate-45 text-ash group-hover:text-amber" />
      <Moon className="theme-toggle-moon w-4 h-4 transition-transform duration-200 group-hover:-rotate-12 text-ash group-hover:text-amber" />
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}
