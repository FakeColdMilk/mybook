"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function Navigation() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await fetch("/api/auth.ts/get-session", {
          credentials: "include",
        })
        if (response.ok) {
          const data = await response.json()
          setUser(data.user)
        }
      } catch (error) {
        console.error("Failed to fetch session:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSession()
  }, [])

  const handleLogout = async () => {
    try {
      await fetch("/api/auth.ts/sign-out", {
        method: "POST",
        credentials: "include",
      })
      router.push("/login")
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  if (loading) return null

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-primary">
          🏨 Hotel Booking
        </Link>

        <div className="flex gap-4 items-center">
          {user ? (
            <>
              <Link href="/hotels">
                <Button variant="ghost">Hotels</Button>
              </Link>
              <Link href="/bookings">
                <Button variant="ghost">My Bookings</Button>
              </Link>
              <span className="text-sm text-slate-600">
                Welcome, {user.name}
              </span>
              <Button
                onClick={handleLogout}
                variant="outline"
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link href="/signup">
                <Button>Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
