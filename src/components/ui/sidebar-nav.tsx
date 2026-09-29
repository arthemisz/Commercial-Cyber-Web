"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  Shield, 
  LayoutDashboard, 
  FileText, 
  Settings, 
  Users, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  Briefcase
} from "lucide-react"

import { cn } from "@/lib/utils"

export type Role = "client" | "consultant" | "admin"

interface NavItem {
  title: string
  href: string
  icon: React.ElementType
  roles: Role[]
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: ["client", "consultant", "admin"],
  },
  {
    title: "Projects",
    href: "/projects",
    icon: Briefcase,
    roles: ["client", "consultant", "admin"],
  },
  {
    title: "Reports",
    href: "/reports",
    icon: FileText,
    roles: ["client", "consultant", "admin"],
  },
  {
    title: "Users",
    href: "/users",
    icon: Users,
    roles: ["admin"],
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
    roles: ["client", "consultant", "admin"],
  },
]

export interface SidebarNavProps extends React.HTMLAttributes<HTMLDivElement> {
  role?: Role
  userEmail?: string
}

export function SidebarNav({ className, role = "client", userEmail = "user@cyberconsult.io", ...props }: SidebarNavProps) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = React.useState(false)

  const filteredItems = navItems.filter((item) => item.roles.includes(role))

  return (
    <div
      className={cn(
        "flex h-screen flex-col bg-slate-surface border-r border-graphite transition-all duration-300",
        collapsed ? "w-16" : "w-60",
        className
      )}
      {...props}
    >
      {/* Brand */}
      <div className="flex h-14 items-center justify-between px-4 border-b border-graphite">
        {!collapsed && (
          <div className="flex items-center gap-2 overflow-hidden">
            <Shield className="h-5 w-5 text-signal shrink-0" />
            <span className="font-mono text-sm font-bold tracking-wider text-frost truncate">
              CYBER_CONSULT
            </span>
          </div>
        )}
        {collapsed && (
          <Shield className="h-5 w-5 text-signal mx-auto shrink-0" />
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "text-ash hover:text-frost focus:outline-none",
            collapsed && "hidden"
          )}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      </div>

      {collapsed && (
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="mx-auto mt-4 text-ash hover:text-frost focus:outline-none"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      )}

      {/* Nav Items */}
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-2">
          {filteredItems.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`)
            const Icon = item.icon

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center rounded-md px-2 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-signal/10 text-signal border-l-2 border-signal"
                    : "text-ash hover:bg-slate-surface hover:text-frost border-l-2 border-transparent",
                  collapsed && "justify-center px-0 border-l-0"
                )}
                title={collapsed ? item.title : undefined}
              >
                <Icon
                  className={cn(
                    "shrink-0",
                    collapsed ? "h-5 w-5" : "mr-3 h-4 w-4",
                    isActive ? "text-signal" : "text-ash group-hover:text-frost"
                  )}
                />
                {!collapsed && <span>{item.title}</span>}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* User Section */}
      <div className="border-t border-graphite p-4">
        <div className={cn("flex items-center", collapsed ? "justify-center" : "justify-between")}>
          {!collapsed && (
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-medium text-frost truncate">{userEmail}</span>
              <span className="text-xs text-ash capitalize truncate">{role} Role</span>
            </div>
          )}
          <button
            className={cn(
              "text-ash hover:text-kill transition-colors focus:outline-none",
              collapsed ? "mx-auto" : "ml-2 shrink-0"
            )}
            title="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
