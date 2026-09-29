'use client';

import React from 'react';
import { cn } from '@/lib/utils';

const steps = ['REPORTED', 'ACKNOWLEDGED', 'FIX COMMITTED', 'RETEST VERIFIED', 'CLOSED'];

interface Props {
  currentStatus: string;
}

export function StatusStepper({ currentStatus }: Props) {
  const currentIndex = steps.findIndex(s => s.toLowerCase() === currentStatus.toLowerCase());

  return (
    <div className="w-full flex items-center justify-between font-mono text-xs">
      {steps.map((step, index) => {
        const isCompleted = index < currentIndex;
        const isCurrent = index === currentIndex;
        
        return (
          <React.Fragment key={step}>
            <div className="flex flex-col items-center gap-2 relative z-10">
              <div 
                className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center border-2 transition-colors",
                  isCompleted ? "bg-verified border-verified text-void" : 
                  isCurrent ? "bg-slate-surface border-signal text-signal" : 
                  "bg-slate-surface border-graphite text-ash"
                )}
              >
                {isCompleted ? (
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              <div className={cn(
                "text-[10px] text-center max-w-[80px]",
                isCurrent ? "text-signal font-bold" : 
                isCompleted ? "text-verified" : "text-ash"
              )}>
                {step}
              </div>
            </div>
            {index < steps.length - 1 && (
              <div 
                className={cn(
                  "flex-1 h-0.5 mt-[-20px] z-0",
                  index < currentIndex ? "bg-verified" : "bg-graphite"
                )}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
