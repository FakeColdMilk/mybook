"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { authClient } from "@/src/lib/auth-client"

export default function Header() {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      // Use better-auth logout which handles session and cookies
      await authClient.signOut()
      // Clear any remaining cookies
      document.cookie.split(";").forEach((c) => {
        const eqPos = c.indexOf("=")
        const name = eqPos > -1 ? c.substr(0, eqPos).trim() : c.trim()
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`
      })
      router.push("/login")
    } catch (error) {
      console.error("Logout error:", error)
      router.push("/login")
    }
  }

  return (
    <header className="bg-linear-to-r from-indigo-900 via-blue-900 to-blue-800 text-white py-6 px-8 flex justify-between items-center border-b-4 border-amber-500 shadow-lg">
      <Link href="/hotels" className="text-3xl font-bold tracking-tighter">HotelBook</Link>
      <div className="flex gap-6 items-center">
        <Link href="/bookings">
          <Button className="bg-amber-500 text-white font-bold hover:bg-amber-600 px-6 py-2 text-base">My Bookings</Button>
        </Link>
        <Button onClick={handleLogout} className="bg-red-600 text-white font-bold hover:bg-red-700 px-6 py-2 text-base">Logout</Button>
      </div>
    </header>
  )
}

