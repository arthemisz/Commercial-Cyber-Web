import { cn } from '@/lib/utils';

const STATUS_STEPS = [
  { id: 'DRAFT_SCOPE', label: 'Draft Scope' },
  { id: 'ROE_PENDING', label: 'RoE Pending' },
  { id: 'ROE_SIGNED', label: 'RoE Signed' },
  { id: 'FUNDS_ESCROWED', label: 'Funds Escrowed' },
  { id: 'TESTING_ACTIVE', label: 'Testing Active' },
  { id: 'REPORT_DELIVERED', label: 'Report Delivered' },
  { id: 'COMPLETED', label: 'Completed' },
];

interface StatusTimelineProps {
  currentStatus: string;
  timestamps: Record<string, string | null>;
}

export function StatusTimeline({ currentStatus, timestamps }: StatusTimelineProps) {
  const isAborted = currentStatus === 'ABORTED';
  const currentIndex = STATUS_STEPS.findIndex(s => s.id === currentStatus);
  const activeIndex = isAborted ? STATUS_STEPS.length : currentIndex;

  return (
    <div className="border border-steel bg-bunker p-5 font-mono">
      <div className="text-[10px] font-mono text-ash uppercase tracking-[0.2em] mb-6">
        EVENT LOG // TIMELINE
      </div>

      <div className="flex flex-col relative space-y-1">
        {STATUS_STEPS.map((step, index) => {
          const isCompleted = index < activeIndex && !isAborted;
          const isCompletedIfAborted = isAborted && timestamps[step.id];
          const actuallyCompleted = isCompleted || isCompletedIfAborted;
          const isCurrent = index === activeIndex;

          return (
            <div key={step.id} className="relative flex items-center group hover:bg-gunmetal/50 p-2 -mx-2 transition-colors min-h-[40px]">
              <div className="text-[10px] font-mono text-ash/60 w-40 shrink-0">
                {timestamps[step.id] ? new Date(timestamps[step.id]!).toLocaleString() : 'PENDING'}
              </div>
              
              <div className="relative flex items-center justify-center w-6 shrink-0 z-10 self-stretch">
                <div className={cn(
                  "w-2 h-2 z-10",
                  actuallyCompleted ? "bg-verified" :
                  isCurrent ? "bg-amber animate-pulse" :
                  "bg-steel"
                )} />
                {index !== STATUS_STEPS.length - 1 && (
                  <div className="absolute top-1/2 left-1/2 -ml-[0.5px] w-[1px] h-[calc(100%+4px)] bg-steel -z-10" />
                )}
              </div>
              
              <div className="ml-4 flex items-center gap-3 w-full">
                <div className={cn(
                  "border px-2 py-0.5 text-[10px] uppercase",
                  actuallyCompleted ? "border-verified/30 text-verified bg-verified/5" :
                  isCurrent ? "border-amber/30 text-amber bg-amber/5" :
                  "border-steel text-ash bg-obsidian"
                )}>
                  {step.id.replace('_', ' ')}
                </div>
                <div className="text-[11px] text-chalk truncate">
                  {step.label}
                </div>
              </div>
            </div>
          );
        })}

        {isAborted && (
          <div className="relative flex items-center group hover:bg-gunmetal/50 p-2 -mx-2 transition-colors min-h-[40px]">
             <div className="text-[10px] font-mono text-ash/60 w-40 shrink-0">
                {timestamps['ABORTED'] ? new Date(timestamps['ABORTED']!).toLocaleString() : 'N/A'}
             </div>
             <div className="relative flex items-center justify-center w-6 shrink-0 z-10 self-stretch">
                <div className="w-2 h-2 bg-kill z-10" />
                <div className="absolute bottom-1/2 left-1/2 -ml-[0.5px] w-[1px] h-[calc(100%+4px)] bg-kill -z-10" />
             </div>
             <div className="ml-4 flex items-center gap-3 w-full">
                <div className="border border-kill/30 text-kill bg-kill/5 px-2 py-0.5 text-[10px] uppercase">
                  ABORTED
                </div>
                <div className="text-[11px] text-chalk truncate">
                  Testing Aborted
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
