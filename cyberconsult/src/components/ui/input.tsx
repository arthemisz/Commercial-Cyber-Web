import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
  mono?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, icon, mono, ...props }, ref) => {
    const inputId = React.useId()
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-ash">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-ash pointer-events-none">
              {icon}
            </div>
          )}
          <input
            id={inputId}
            type={type}
            className={cn(
              "flex h-10 w-full rounded-md border border-graphite bg-slate-surface px-3 py-2 text-sm text-frost ring-offset-void file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-ash/50 focus-visible:outline-none focus-visible:border-signal focus-visible:ring-1 focus-visible:ring-signal/30 disabled:cursor-not-allowed disabled:opacity-50 transition-colors",
              icon && "pl-10",
              mono && "font-mono text-sm",
              error && "border-kill focus-visible:border-kill focus-visible:ring-kill/30",
              className
            )}
            ref={ref}
            {...props}
          />
        </div>
        {error && <span className="text-xs text-kill font-medium">{error}</span>}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
