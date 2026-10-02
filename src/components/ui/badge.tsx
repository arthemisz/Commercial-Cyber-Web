import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 px-2 py-0.5 text-[11px] font-mono font-medium uppercase tracking-wider border",
  {
    variants: {
      variant: {
        info: "border-cobalt/40 bg-cobalt/10 text-cobalt",
        success: "border-verified/40 bg-verified/10 text-verified",
        warning: "border-amber/40 bg-amber/10 text-amber",
        danger: "border-kill/40 bg-kill/10 text-kill",
        neutral: "border-steel bg-gunmetal text-ash",
        active: "border-cyan/40 bg-cyan/10 text-cyan",
      },
    },
    defaultVariants: {
      variant: "neutral",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
