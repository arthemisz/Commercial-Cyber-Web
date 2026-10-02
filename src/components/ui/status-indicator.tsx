import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const statusVariants = cva("w-2 h-2", {
  variants: {
    status: {
      online: "bg-verified",
      offline: "bg-ash",
      warning: "bg-amber",
      error: "bg-kill",
      active: "bg-cyan",
    }
  },
  defaultVariants: {
    status: "online",
  },
})

export interface StatusIndicatorProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statusVariants> {
  label?: string
  blink?: boolean
}

const StatusIndicator = React.forwardRef<HTMLDivElement, StatusIndicatorProps>(
  ({ className, status, blink, label, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center gap-2 border border-steel px-2 py-1 bg-bunker",
          className
        )}
        {...props}
      >
        <div className="relative flex items-center justify-center">
          {blink && (
            <div 
              className={cn(
                "absolute w-2 h-2", 
                statusVariants({ status })
              )}
              style={{ animation: 'sharpBlink 1s step-end infinite' }}
            />
          )}
          <div className={cn(statusVariants({ status }))} />
        </div>
        
        {label && (
          <span className="font-mono uppercase text-[11px] text-frost tracking-wider">
            {label}
          </span>
        )}
        
        {blink && (
          <style>{`
            @keyframes sharpBlink {
              0%, 100% { opacity: 1; }
              50% { opacity: 0; }
            }
          `}</style>
        )}
      </div>
    )
  }
)
StatusIndicator.displayName = "StatusIndicator"

export { StatusIndicator, statusVariants }
