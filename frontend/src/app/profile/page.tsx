"use client"

import { useAuth } from "@/lib/firebase/auth-context"
import { UserProfileForm } from "@/components/profile/user-profile-form"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function ProfilePage() {
  const { user, loading, logout } = useAuth()
  const router = useRouter()
  
  useEffect(() => {
    if (!loading && !user) {
      // Redirect to home if not authenticated
      router.push("/")
    }
  }, [user, loading, router])
  
  const handleLogout = async () => {
    try {
      await logout()
      // Use window.location for a full page refresh to ensure auth state is recognized
      window.location.href = "/"
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }
  
  // Show loading state
  if (loading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-12">
          <h1 className="text-3xl font-bold">My Profile</h1>
          <Button 
            variant="outline" 
            onClick={handleLogout}
            className="border-white/20 text-white hover:bg-white/10"
          >
            Sign Out
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <div className="bg-slate-900/95 backdrop-blur-xl border border-white/20 rounded-lg p-6 text-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 mx-auto mb-4 flex items-center justify-center">
                <span className="text-3xl font-bold">
                  {user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase()}
                </span>
              </div>
              <h2 className="text-xl font-bold">
                {user.displayName || 'User'}
              </h2>
              <p className="text-white/60">{user.email}</p>
            </div>
          </div>
          
          <div className="md:col-span-2">
            <UserProfileForm />
          </div>
        </div>
      </div>
    </div>
  )
}
