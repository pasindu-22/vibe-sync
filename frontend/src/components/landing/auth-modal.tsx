"use client"

import type React from "react"

import { useState } from "react"
import { Music } from "lucide-react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SocialLoginButton } from "./social-login-button"

interface AuthModalProps {
  isOpen: boolean
  onCloseAction: () => void
  mode: "login" | "signup"
  onAuthenticatedAction: () => void
}

export function AuthModal({ isOpen, onCloseAction, mode, onAuthenticatedAction }: AuthModalProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [currentMode, setCurrentMode] = useState(mode)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate authentication
    setTimeout(() => {
      onAuthenticatedAction()
      onCloseAction()
    }, 1000)
  }

  const handleSocialLogin = (provider: string) => {
    console.log(`Logging in with ${provider}`)
    // Simulate social login
    setTimeout(() => {
      onAuthenticatedAction()
      onCloseAction()
    }, 1000)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onCloseAction}>
      <DialogContent className="max-w-md max-h-[80vh] h-auto bg-slate-900/95 backdrop-blur-xl border-white/20 text-white overflow-y-auto p-6 scrollbar-hidden">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Music className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold">{currentMode === "login" ? "Welcome Back" : "Join VibeSync"}</h2>
          </div>
        </div>

        <div className="space-y-6">
          {/* Social Login Buttons */}
          <div className="space-y-3">
            <SocialLoginButton
              provider="google"
              onClickAction={() => handleSocialLogin("google")}
              icon="/icons/google.svg"
              label="Continue with Google"
            />

            <SocialLoginButton
              provider="facebook"
              onClickAction={() => handleSocialLogin("facebook")}
              icon="/icons/facebook.svg"
              label="Continue with Facebook"
              className="bg-blue-600 hover:bg-blue-700"
            />

            <SocialLoginButton
              provider="spotify"
              onClickAction={() => handleSocialLogin("spotify")}
              icon="/icons/spotify.svg"
              label="Continue with Spotify"
              className="bg-green-600 hover:bg-green-700"
            />

            <SocialLoginButton
              provider="apple"
              onClickAction={() => handleSocialLogin("apple")}
              icon="/icons/apple.svg"
              label="Continue with Apple Music"
              className="bg-black hover:bg-gray-900"
            />
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-slate-900 text-white/60">or</span>
            </div>
          </div>

          {/* Email Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {currentMode === "signup" && (
              <div>
                <label className="text-sm font-medium text-white/80 mb-2 block">Full Name</label>
                <Input
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                  required
                />
              </div>
            )}
            <div>
              <label className="text-sm font-medium text-white/80 mb-2 block">Email</label>
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-white/80 mb-2 block">Password</label>
              <Input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              {currentMode === "login" ? "Sign In" : "Create Account"}
            </Button>
          </form>

          <div className="text-center">
            <p className="text-sm text-white/60">
              {currentMode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
              <button
                onClick={() => setCurrentMode(currentMode === "login" ? "signup" : "login")}
                className="text-purple-400 hover:text-purple-300 font-medium"
              >
                {currentMode === "login" ? "Sign up" : "Sign in"}
              </button>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
