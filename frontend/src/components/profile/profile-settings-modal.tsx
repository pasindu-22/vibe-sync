"use client"

import { useEffect, useState } from "react"
import { UserProfileForm } from "@/components/profile/user-profile-form"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface ProfileSettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ProfileSettingsModal({ isOpen, onClose }: ProfileSettingsModalProps) {
  // Simplify the implementation - no need for local state or useEffect that might cause issues
  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
    >
      <DialogContent 
        className="bg-slate-900/95 backdrop-blur-xl border border-white/20 text-white max-w-md mx-auto z-[1000]"
        aria-describedby="profile-settings-description"
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white">Profile Settings</DialogTitle>
        </DialogHeader>
        
        {/* Add description for accessibility */}
        <p id="profile-settings-description" className="sr-only">
          Form to update your profile settings
        </p>
        
        <UserProfileForm onComplete={onClose} />
      </DialogContent>
    </Dialog>
  )
}
