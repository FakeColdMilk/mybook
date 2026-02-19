"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { format } from "date-fns"
import Header from "@/components/header"
import { Booking,Room } from "@/src/generated/prisma/client"

interface BookingWithRoom extends Booking {
  room: Room & {
    hotel: {
      name: string;
      city: string;
      country: string;
    };
  };
}

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<BookingWithRoom[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
console.log("Bookings state:", bookings) // Debugging log
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch("/api/bookings")
        if (!response.ok) throw new Error("Failed to fetch bookings")
        const data = await response.json()
        setBookings(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load bookings")
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <p className="text-2xl text-white font-bold">Loading bookings...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header />
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h1 className="text-5xl font-black text-white">My Bookings</h1>
        </div>

        {error && (
          <Card className="p-6 bg-red-900 text-red-100 mb-8 border-2 border-red-600">
            <p className="text-lg font-bold">{error}</p>
          </Card>
        )}

        {bookings.length === 0 ? (
          <Card className="p-12 text-center bg-slate-800 border-4 border-amber-500">
            <p className="text-2xl text-white font-bold mb-6">You haven't made any bookings yet.</p>
            <Link href="/hotels">
              <Button className="bg-amber-500 text-white font-bold hover:bg-amber-600 px-8 py-3 text-base">Browse Hotels</Button>
            </Link>
          </Card>
        ) : (
          <div className="grid gap-8">
            {bookings.map((booking) => (
              <Card key={booking.id} className="p-8 bg-linear-to-r from-slate-700 to-slate-600 border-4 border-amber-400 hover:border-amber-300 transition-all hover:shadow-2xl">
                <div className="grid md:grid-cols-4 gap-8 mb-8">
                  <div>
                    <p className="text-xs text-amber-300 font-bold uppercase tracking-wider mb-2">Hotel</p>
                    <p className="font-black text-white text-xl">
                      {booking.room.hotel.name}
                    </p>
                    <p className="text-base text-blue-200 mt-2 font-semibold">
                      {booking.room.hotel.city}, {booking.room.hotel.country}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-amber-300 font-bold uppercase tracking-wider mb-2">Room</p>
                    <p className="font-black text-white text-xl">
                      {booking.room.type} (#{booking.room.roomNumber})
                    </p>
                    <p className="text-base text-green-400 mt-2 font-bold uppercase">{booking.status}</p>
                  </div>

                  <div>
                    <p className="text-xs text-amber-300 font-bold uppercase tracking-wider mb-2">Dates</p>
                    <p className="font-black text-white text-base">
                      {format(new Date(booking.checkIn), "MMM dd")} - {format(new Date(booking.checkOut), "MMM dd")}
                    </p>
                    <p className="text-blue-200 mt-2 font-semibold">
                      {Math.ceil((new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime()) / (1000 * 60 * 60 * 24))} nights
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-amber-300 font-bold uppercase tracking-wider mb-2">Total</p>
                    <p className="font-black text-amber-300 text-2xl">${booking.totalPrice}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Link href={`/bookings/${booking.id}`}>
                    <Button className="bg-white text-slate-900 font-black hover:bg-gray-100 px-8 py-3">View Details</Button>
                  </Link>
                  {booking.status === "confirmed" && (
                    <Button className="bg-red-600 text-white font-bold hover:bg-red-700 px-8 py-3">Cancel</Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}
