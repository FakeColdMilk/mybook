"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { format } from "date-fns"
import { CheckCircle } from "lucide-react"
import Header from "@/components/header"

export default function BookingDetailsPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const bookingId = params.id as string
  const isSuccess = searchParams.get("success") === "true"
  
  const [booking, setBooking] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await fetch(`/api/bookings/${bookingId}`)
        if (!response.ok) throw new Error("Booking not found")
        const data = await response.json()
        setBooking(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load booking")
      } finally {
        setLoading(false)
      }
    }

    fetchBooking()
  }, [bookingId])

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <p className="text-lg text-slate-600">Loading booking details...</p>
      </div>
    )
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 p-8">
        <div className="max-w-2xl mx-auto">
          <p className="text-red-600 mb-4">{error || "Booking not found"}</p>
          <Link href="/bookings">
            <Button>Back to My Bookings</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100">
      <Header />
      <div className="max-w-2xl mx-auto px-4 py-8">
        {isSuccess && (
          <Card className="p-6 bg-green-50 border-green-200 mb-6">
            <div className="flex gap-4">
              <CheckCircle className="h-6 w-6 text-green-600 shrink-0" />
              <div>
                <h2 className="font-semibold text-green-900">Booking Confirmed!</h2>
                <p className="text-green-700 text-sm mt-1">
                  Your reservation has been successfully created.
                </p>
              </div>
            </div>
          </Card>
        )}

        <Card className="p-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-8">Booking Confirmation</h1>

          <div className="space-y-8">
            {/* Hotel Info */}
            <div className="border-b pb-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                Hotel Information
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-slate-600">Hotel Name</p>
                  <p className="text-lg font-semibold text-slate-900">
                    {booking.room.hotel.name}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Location</p>
                  <p className="text-lg font-semibold text-slate-900">
                    {booking.room.hotel.city}, {booking.room.hotel.country}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-slate-600">Address</p>
                  <p className="text-slate-900">{booking.room.hotel.address}</p>
                </div>
              </div>
            </div>

            {/* Room Info */}
            <div className="border-b pb-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                Room Details
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-slate-600">Room Type</p>
                  <p className="text-lg font-semibold text-slate-900">
                    {booking.room.type}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Room Number</p>
                  <p className="text-lg font-semibold text-slate-900">
                    #{booking.room.roomNumber}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Capacity</p>
                  <p className="text-slate-900">
                    {booking.room.capacity} {booking.room.capacity === 1 ? "guest" : "guests"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Price per Night</p>
                  <p className="text-slate-900">
                    ${booking.room.price.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            {/* Booking Details */}
            <div className="border-b pb-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                Booking Details
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-slate-600">Check-in Date</p>
                  <p className="text-lg font-semibold text-slate-900">
                    {format(new Date(booking.checkIn), "EEEE, MMMM dd, yyyy")}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Check-out Date</p>
                  <p className="text-lg font-semibold text-slate-900">
                    {format(new Date(booking.checkOut), "EEEE, MMMM dd, yyyy")}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Booking ID</p>
                  <p className="font-mono text-slate-900">{booking.id}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Status</p>
                  <p className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-800 font-semibold">
                    {booking.status}
                  </p>
                </div>
              </div>
            </div>

            {/* Price Summary */}
            <div className="bg-slate-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                Price Summary
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-600">
                    {Math.ceil(
                      (new Date(booking.checkOut).getTime() -
                        new Date(booking.checkIn).getTime()) /
                        (1000 * 60 * 60 * 24)
                    )}{" "}
                    nights
                  </span>
                  <span className="font-semibold text-slate-900">
                    ${(booking.totalPrice).toFixed(2)}
                  </span>
                </div>
                <div className="border-t pt-3 flex justify-between text-lg">
                  <span className="font-semibold text-slate-900">Total</span>
                  <span className="font-bold text-primary">
                    ${booking.totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex gap-4">
            <Link href="/bookings">
              <Button>Back to My Bookings</Button>
            </Link>
            <Link href="/hotels">
              <Button variant="outline">Browse More Hotels</Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  )
}

