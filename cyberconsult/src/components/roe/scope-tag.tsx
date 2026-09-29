import { X } from 'lucide-react';

interface ScopeTagProps {
  label: string;
  onRemove: () => void;
}

export function ScopeTag({ label, onRemove }: ScopeTagProps) {
  return (
    <span className="inline-flex items-center gap-1.5 bg-graphite text-frost font-mono text-sm px-2 py-0.5 rounded border border-slate-surface">
      {label}
      <button
        type="button"
        onClick={onRemove}
        className="text-ash hover:text-kill transition-colors focus:outline-none"
        aria-label={`Remove ${label}`}
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </span>
  );
}
