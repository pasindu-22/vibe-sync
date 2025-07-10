"use client"

import type { LucideIcon } from "lucide-react"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface SidebarItemProps {
  icon: LucideIcon
  label: string
  isActive?: boolean
  onClick?: () => void
  className?: string
  showLabel?: boolean
  isAI?: boolean
  hasChevron?: boolean
  isExpanded?: boolean
}

export function SidebarItem({
  icon: Icon,
  label,
  isActive,
  onClick,
  className,
  showLabel = true,
  isAI = false,
  hasChevron = false,
  isExpanded = false,
}: SidebarItemProps) {
  const content = (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative",
        "hover:bg-white/10 hover:scale-[1.02]",
        isActive && "bg-white/20 text-white",
        !isActive && "text-white/70 hover:text-white",
        isAI &&
          "bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 hover:from-purple-600/30 hover:to-pink-600/30",
        !showLabel && "justify-center",
        className,
      )}
    >
      <Icon className="w-5 h-5 flex-shrink-0" />
      {showLabel && (
        <>
          <span className="font-medium truncate">{label}</span>
          {hasChevron && (
            <ChevronRight className={cn("w-4 h-4 ml-auto transition-transform", isExpanded && "rotate-90")} />
          )}
        </>
      )}
    </button>
  )

  if (!showLabel) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{content}</TooltipTrigger>
          <TooltipContent side="right" className="bg-black/90 text-white border-white/20">
            <p>{label}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return content
}
