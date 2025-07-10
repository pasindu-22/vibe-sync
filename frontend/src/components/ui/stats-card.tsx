"use client"

import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatsCardProps {
  icon: LucideIcon
  title: string
  value: string
  subtitle: string
  gradient: string
}

export function StatsCard({ icon: Icon, title, value, subtitle, gradient }: StatsCardProps) {
  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300">
      <div className="flex items-center gap-4">
        <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center bg-gradient-to-r", gradient)}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div>
          <p className="text-2xl font-bold text-white">{value}</p>
          <p className="text-sm text-white/60">{title}</p>
          <p className="text-xs text-white/40">{subtitle}</p>
        </div>
      </div>
    </div>
  )
}
