"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Image from "next/image"

interface SocialLoginButtonProps {
  provider: string
  onClickAction: () => void
  icon: string
  label: string
  className?: string
  disabled?: boolean
}

export function SocialLoginButton({ 
  provider, 
  onClickAction, 
  icon, 
  label, 
  className,
  disabled = false 
}: SocialLoginButtonProps) {
  return (
    <Button
      onClick={onClickAction}
      variant="outline"
      disabled={disabled}
      className={cn(
        "w-full flex items-center justify-center gap-3 py-3 h-auto border-white/20 text-white hover:bg-white/10",
        className,
      )}
    >
      <Image src={icon || "/placeholder.svg"} alt={provider} width={20} height={20} className="w-5 h-5" />
      <span>{label}</span>
    </Button>
  )
}
