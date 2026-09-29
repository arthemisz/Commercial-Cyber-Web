import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-signal focus:ring-offset-2",
  {
    variants: {
      variant: {
        info: "border-transparent bg-signal/10 text-signal",
        success: "border-transparent bg-verified/10 text-verified",
        warning: "border-transparent bg-caution/10 text-caution",
        danger: "border-transparent bg-kill/10 text-kill",
        neutral: "border-transparent bg-ash/10 text-ash",
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
