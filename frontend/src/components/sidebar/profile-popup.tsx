"use client"

import { LogOut, Settings, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/firebase/auth-context"
import { useRouter } from "next/navigation"
// Line removed as it is unused
import { ProfileSettingsModal } from "@/components/profile/profile-settings-modal"

interface ProfilePopupProps {
  isExpanded: boolean
  onCloseAction: () => void
  onOpenSettings?: () => void
}

export function ProfilePopup({ isExpanded, onCloseAction, onOpenSettings }: ProfilePopupProps) {
  const { user, logout } = useAuth()
  const router = useRouter()
  
  const handleLogout = async () => {
    try {
      await logout()
      // Close the popup first
      onCloseAction()
      // Force page reload to ensure all components recognize the auth state change
      window.location.href = "/"
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }
  
  const handleSettingsClick = () => {
    // Use the parent's handler to open settings modal
    if (onOpenSettings) {
      onOpenSettings()
    } else {
      // Fallback to old behavior - redirect to profile page
      router.push("/profile")
      onCloseAction()
    }
  }
  
  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40" onClick={onCloseAction} />

      {/* Popup */}
      <div
        className={cn(
          "absolute bottom-full mb-2 bg-slate-800/95 backdrop-blur-xl border border-white/20 rounded-lg shadow-xl z-[1000] min-w-64",
          isExpanded ? "left-0" : "left-16",
        )}
      >
        {/* User Info */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div>
              <p className="font-medium text-white">{user?.displayName || 'User'}</p>
              <p className="text-sm text-white/60">{user?.email || 'No email'}</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="p-4 border-b border-white/10">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-lg font-bold text-white">-</p>
              <p className="text-xs text-white/60">Songs Analyzed</p>
            </div>
            <div>
              <p className="text-lg font-bold text-white">-</p>
              <p className="text-xs text-white/60">Playlists</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-2">
          <button 
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors text-white/70 hover:text-white"
            onClick={handleSettingsClick}
          >
            <Settings className="w-4 h-4" />
            <span>Profile Settings</span>
          </button>
          <button 
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-500/20 transition-colors text-red-400 hover:text-red-300"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      
      
    </>
  )
}
