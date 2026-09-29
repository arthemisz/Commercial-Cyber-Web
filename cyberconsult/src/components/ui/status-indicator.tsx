import * as React from "react"
import { cn } from "@/lib/utils"

export type StatusType = "active" | "halted" | "pending" | "idle"

export interface StatusIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
  status: StatusType
  label?: string
}

const statusColors: Record<StatusType, { dot: string; bg: string }> = {
  active: { dot: "bg-verified", bg: "bg-verified/20" },
  halted: { dot: "bg-kill", bg: "bg-kill/20" },
  pending: { dot: "bg-caution", bg: "bg-caution/20" },
  idle: { dot: "bg-ash", bg: "bg-ash/20" },
}

export function StatusIndicator({ status, label, className, ...props }: StatusIndicatorProps) {
  const colors = statusColors[status]

  return (
    <div className={cn("inline-flex items-center gap-2", className)} {...props}>
      <div className="relative flex h-2.5 w-2.5 items-center justify-center">
        {status !== "idle" && (
          <span
            className={cn(
              "absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 motion-reduce:animate-none",
              colors.dot
            )}
          />
        )}
        <span className={cn("relative inline-flex h-2.5 w-2.5 rounded-full", colors.dot)} />
      </div>
      {label && <span className="text-sm font-medium text-frost">{label}</span>}
    </div>
  )
}
