"use client"

import { LogOut, Settings, User } from "lucide-react"
import { cn } from "@/lib/utils"

interface ProfilePopupProps {
  isExpanded: boolean
  onCloseAction: () => void
}

export function ProfilePopup({ isExpanded, onCloseAction }: ProfilePopupProps) {
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
              <p className="font-medium text-white">John Doe</p>
              <p className="text-sm text-white/60">john.doe@example.com</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="p-4 border-b border-white/10">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-lg font-bold text-white">1,247</p>
              <p className="text-xs text-white/60">Songs Analyzed</p>
            </div>
            <div>
              <p className="text-lg font-bold text-white">156</p>
              <p className="text-xs text-white/60">Playlists</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-2">
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors text-white/70 hover:text-white">
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-500/20 transition-colors text-red-400 hover:text-red-300">
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  )
}
