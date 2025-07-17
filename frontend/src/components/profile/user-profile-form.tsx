"use client"

import { useState } from "react"
import { useAuth } from "@/lib/firebase/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "react-hot-toast"

interface UserProfileFormProps {
  onComplete?: () => void
}

export function UserProfileForm({ onComplete }: UserProfileFormProps) {
  const { user, updateUserProfile } = useAuth()
  const [displayName, setDisplayName] = useState(user?.displayName || "")
  const [isUpdating, setIsUpdating] = useState(false)

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdating(true)
    
    try {
      await updateUserProfile(displayName)
      toast.success("Profile updated successfully!")
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to update profile"
      toast.error(errorMessage)
      console.error(error)
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <form onSubmit={handleUpdateProfile} className="space-y-4 mt-4">
      <div>
        <label className="text-sm font-medium text-white/80 mb-2 block">
          Display Name
        </label>
        <Input
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
          disabled={isUpdating}
        />
      </div>
      
      <div>
        <label className="text-sm font-medium text-white/80 mb-2 block">
          Email
        </label>
        <Input
          type="email"
          value={user?.email || ""}
          className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
          disabled
        />
        <p className="mt-1 text-xs text-white/60">
          Email cannot be changed
        </p>
      </div>
      
      <div className="pt-2">
        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          disabled={isUpdating}
        >
          {isUpdating ? "Updating..." : "Update Profile"}
        </Button>
      </div>
    </form>
  )
}
