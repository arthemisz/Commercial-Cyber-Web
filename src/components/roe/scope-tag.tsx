interface ScopeTagProps {
  label: string;
  onRemove: () => void;
}

export function ScopeTag({ label, onRemove }: ScopeTagProps) {
  return (
    <span className="inline-flex items-center gap-2 bg-gunmetal text-chalk font-mono text-[11px] px-2 py-0.5 border border-steel uppercase">
      {label}
      <button
        type="button"
        onClick={onRemove}
        className="text-ash hover:text-kill transition-colors focus:outline-none flex items-center justify-center w-3 h-3"
        aria-label={`Remove ${label}`}
      >
        <span className="text-[14px] leading-none mb-0.5">×</span>
      </button>
    </span>
  );
}
