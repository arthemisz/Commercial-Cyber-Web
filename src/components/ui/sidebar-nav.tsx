import * as React from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { ChevronDown, UserSquare } from "lucide-react"
import { ThemeToggle } from "@/components/ui/theme-toggle"

export interface NavItem {
  title: string
  href: string
  isActive?: boolean
}

export interface NavGroup {
  label: string
  items: NavItem[]
}

export interface SidebarNavProps extends React.HTMLAttributes<HTMLDivElement> {
  groups: NavGroup[]
  user?: {
    name: string
    role: string
  }
}

export function SidebarNav({ className, groups, user, ...props }: SidebarNavProps) {
  return (
    <div
      className={cn(
        "flex h-full w-64 flex-col bg-bunker border-r border-steel",
        className
      )}
      {...props}
    >
      {/* Brand Section */}
      <div className="flex items-center justify-between h-16 px-6 border-b border-steel">
        <div className="flex items-center gap-3">
          <Image
            src="/Logo.svg"
            alt="Cyberthink Solutions"
            width={40}
            height={40}
            className="w-10 h-10 object-contain shrink-0"
          />
          <div className="flex flex-col items-start justify-center">
            <span className="font-mono font-bold tracking-[0.2em] text-frost">
              CYBERTHINK
            </span>
            <span className="text-[10px] text-ash font-mono mt-0.5">
              SOLUTIONS
            </span>
          </div>
        </div>
        <ThemeToggle size="sm" />
      </div>

      {/* Navigation Items */}
      <div className="flex-1 overflow-y-auto py-4">
        {groups.map((group, i) => (
          <div key={i} className="mb-6">
            <h4 className="text-[9px] font-mono uppercase tracking-[0.3em] text-ash/60 px-4 mb-2 mt-6 first:mt-2">
              {group.label}
            </h4>
            <nav className="flex flex-col space-y-0.5">
              {group.items.map((item, j) => (
                <a
                  key={j}
                  href={item.href}
                  className={cn(
                    "flex items-center px-4 py-2 font-mono text-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber",
                    item.isActive
                      ? "border-l-2 border-amber text-amber bg-amber/5"
                      : "border-l-2 border-transparent text-ash hover:text-chalk hover:bg-gunmetal"
                  )}
                >
                  {item.title}
                </a>
              ))}
            </nav>
          </div>
        ))}
      </div>

      {/* User Section */}
      <div className="border-t border-steel p-4 flex items-center justify-between hover:bg-gunmetal transition-colors cursor-pointer group">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-steel border border-graphite flex items-center justify-center text-ash group-hover:border-amber group-hover:text-amber transition-colors">
            <UserSquare className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-mono text-xs text-frost">
              {user?.name || "SYS_ADMIN"}
            </span>
            <span className="font-mono text-[10px] text-ash">
              {user?.role || "LEVEL 5"}
            </span>
          </div>
        </div>
        <ChevronDown className="w-4 h-4 text-ash group-hover:text-frost transition-colors" />
      </div>
    </div>
  )
}
