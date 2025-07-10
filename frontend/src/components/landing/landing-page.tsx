"use client"

import { useState, useEffect, useRef } from "react"
import { Music, Sparkles, Brain, Headphones, Play, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AuthModal } from "./auth-modal"

interface LandingPageProps {
  onAuthenticatedAction: () => void
}

export function LandingPage({ onAuthenticatedAction }: LandingPageProps) {
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState<"login" | "signup">("login")
  const [isVisible, setIsVisible] = useState(false)
  const demoSectionRef = useRef<HTMLDivElement>(null)

  const scrollToDemoSection = () => {
    demoSectionRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Analysis",
      description:
        "Advanced machine learning algorithms analyze your music to identify genres and moods with incredible accuracy.",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: Sparkles,
      title: "Smart Recommendations",
      description: "Get personalized playlist suggestions based on your listening habits and mood preferences.",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: Headphones,
      title: "Seamless Experience",
      description: "Upload, analyze, and organize your music library with our intuitive and beautiful interface.",
      gradient: "from-green-500 to-emerald-500",
    },
  ]

  const handleAuth = (mode: "login" | "signup") => {
    setAuthMode(mode)
    setShowAuthModal(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="p-6">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Music className="w-6 h-6" />
              </div>
              <span className="font-bold text-2xl">VibeSync</span>
            </div>
            <div className="flex gap-4">
              <Button
                variant="ghost"
                onClick={() => handleAuth("login")}
                className="text-white/80 hover:text-white hover:bg-white/10"
              >
                Sign In
              </Button>
              <Button
                onClick={() => handleAuth("signup")}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                Get Started
              </Button>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="px-6 py-20">
          <div className="max-w-7xl mx-auto text-center">
            <div
              className={`transition-all duration-1000 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
            >
              <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                Feel the Beat,
                <br />
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Know the Vibe
                </span>
              </h1>
              <p className="text-xl text-white/70 mb-8 max-w-3xl mx-auto leading-relaxed">
                Discover the power of AI-driven music analysis. Upload your tracks, get instant genre and mood
                classification, and create the perfect playlists for every moment.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button
                  size="lg"
                  onClick={() => handleAuth("signup")}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-lg px-8 py-4 h-auto group"
                >
                  Start Analyzing Music
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10 text-lg px-8 py-4 h-auto group bg-transparent"
                  onClick={scrollToDemoSection}
                >
                  <Play className="mr-2 w-5 h-5" />
                  Watch Demo
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="px-6 py-20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Powered by Advanced AI</h2>
              <p className="text-xl text-white/70 max-w-2xl mx-auto">
                Our cutting-edge machine learning models understand music like never before
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div
                  key={feature.title}
                  className={`group bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-500 hover:scale-105 ${
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                  }`}
                  style={{ transitionDelay: `${index * 200}ms` }}
                >
                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
                  >
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                  <p className="text-white/70 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Demo Section */}
        <section ref={demoSectionRef} className="px-6 py-20">
          <div className="max-w-5xl mx-auto">
            <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">See VibeSync in Action</h2>
                <p className="text-white/70">Experience the magic of AI music analysis</p>
              </div>

              <div className="aspect-video bg-gradient-to-br from-purple-900/50 to-pink-900/50 rounded-2xl flex items-center justify-center border border-white/10">
                <div className="text-center">
                  <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mb-4 mx-auto hover:bg-white/20 transition-colors cursor-pointer">
                    <Play className="w-10 h-10 ml-1" />
                  </div>
                  <p className="text-white/70">Click to watch demo</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-6 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Music Experience?</h2>
            <p className="text-xl text-white/70 mb-8">
              Join thousands of music lovers who are already using VibeSync to discover and organize their perfect
              soundtracks.
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="px-6 py-8 border-t border-white/10">
          <div className="max-w-7xl mx-auto text-center text-white/50">
            <p>&copy; 2024 VibeSync. All rights reserved.</p>
          </div>
        </footer>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onCloseAction={() => setShowAuthModal(false)}
        mode={authMode}
        onAuthenticatedAction={onAuthenticatedAction}
      />
    </div>
  )
}
