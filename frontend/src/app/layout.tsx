import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/lib/firebase/auth-context"
import { Toaster } from "react-hot-toast"
import { AuthTokenRefresher } from "@/components/auth/auth-token-refresher"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "VibeSync - AI Music Classification",
  description: "AI-powered music genre and mood classification with personalized playlists",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <AuthProvider>
          <AuthTokenRefresher />
          {children}
        </AuthProvider>
        <Toaster position="top-center" />
      </body>
    </html>
  )
}
