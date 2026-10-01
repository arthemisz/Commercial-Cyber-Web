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
    <div className="w-full flex items-center justify-between font-mono">
      {steps.map((step, index) => {
        const isCompleted = index < currentIndex;
        const isCurrent = index === currentIndex;
        
        return (
          <React.Fragment key={step}>
            <div className="flex flex-col items-center gap-3 relative z-10 w-20">
              <div 
                className={cn(
                  "w-2 h-2 transition-colors",
                  isCompleted ? "bg-verified" : 
                  isCurrent ? "bg-amber animate-pulse" : 
                  "bg-steel"
                )}
              />
              <div className={cn(
                "text-[9px] text-center uppercase tracking-wider",
                isCurrent ? "text-amber font-bold" : 
                isCompleted ? "text-verified" : "text-ash"
              )}>
                {step.replace(' ', '\n')}
              </div>
            </div>
            {index < steps.length - 1 && (
              <div 
                className={cn(
                  "flex-1 h-[1px] mt-[-30px] z-0",
                  index < currentIndex ? "bg-verified" : "bg-steel"
                )}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
