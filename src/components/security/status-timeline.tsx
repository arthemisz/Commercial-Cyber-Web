import { cn } from '@/lib/utils';
import { Check, Circle } from 'lucide-react';

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
  const activeIndex = isAborted ? STATUS_STEPS.length : currentIndex; // If aborted, we handle it separately

  return (
    <div className="relative pl-6 space-y-8 font-mono">
      {/* Vertical line connecting steps */}
      <div className="absolute top-2 bottom-2 left-[11px] w-0.5 bg-slate-surface z-0" />
      
      {STATUS_STEPS.map((step, index) => {
        const isCompleted = index < activeIndex && !isAborted;
        const isCompletedIfAborted = isAborted && timestamps[step.id];
        const actuallyCompleted = isCompleted || isCompletedIfAborted;
        const isCurrent = index === activeIndex;
        const isFuture = index > activeIndex;

        return (
          <div key={step.id} className="relative z-10 flex items-start group">
            <div className={cn(
              "flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center -ml-[30px] border-2 bg-void mt-0.5",
              actuallyCompleted ? "border-verified text-verified" :
              isCurrent ? "border-signal text-signal" :
              "border-slate-surface text-ash"
            )}>
              {actuallyCompleted ? (
                <Check className="w-3.5 h-3.5" />
              ) : isCurrent ? (
                <div className="w-2 h-2 rounded-full bg-signal animate-pulse" />
              ) : (
                <Circle className="w-2 h-2 fill-current opacity-30" />
              )}
            </div>
            
            <div className="ml-6 flex flex-col">
              <span className={cn(
                "text-sm uppercase tracking-wider font-semibold",
                actuallyCompleted ? "text-verified" :
                isCurrent ? "text-signal" :
                "text-ash"
              )}>
                {step.label}
              </span>
              {timestamps[step.id] && (
                <span className="text-xs text-ash mt-1">
                  {new Date(timestamps[step.id]!).toLocaleString()}
                </span>
              )}
            </div>
          </div>
        );
      })}

      {isAborted && (
        <div className="relative z-10 flex items-start group mt-8">
           {/* Branching red line */}
           <div className="absolute -top-8 left-[-19px] w-6 h-10 border-l-2 border-b-2 border-kill rounded-bl-lg z-0" />
           <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center -ml-[30px] border-2 bg-void mt-0.5 border-kill text-kill">
              <div className="w-2 h-2 rounded-full bg-kill" />
           </div>
           <div className="ml-6 flex flex-col">
              <span className="text-sm uppercase tracking-wider font-semibold text-kill">
                Aborted
              </span>
              {timestamps['ABORTED'] && (
                <span className="text-xs text-ash mt-1">
                  {new Date(timestamps['ABORTED']!).toLocaleString()}
                </span>
              )}
           </div>
        </div>
      )}
    </div>
  );
}
