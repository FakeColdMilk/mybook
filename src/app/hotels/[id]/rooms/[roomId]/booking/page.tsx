"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format, addDays } from "date-fns"
import Link from "next/link"

export default function BookingPage() {
  const params = useParams()
  const router = useRouter()
  const hotelId = params.id as string
  const roomId = params.roomId as string
  
  const [room, setRoom] = useState<any>(null)
  const [hotel, setHotel] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  
  const [checkInDate, setCheckInDate] = useState<Date | undefined>(new Date())
  const [checkOutDate, setCheckOutDate] = useState<Date | undefined>(addDays(new Date(), 1))
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRoomAndHotel = async () => {
      try {
        const [hotelRes, roomRes] = await Promise.all([
          fetch(`/api/hotels/${hotelId}`),
          fetch(`/api/hotels/${hotelId}/rooms/${roomId}`),
        ])
        setHotel(await hotelRes.json())
        setRoom(await roomRes.json())
      } catch (error) {
        console.error("Failed to fetch details:", error)
        setError("Failed to load room details")
      } finally {
        setLoading(false)
      }
    }

    fetchRoomAndHotel()
  }, [hotelId, roomId])

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!checkInDate || !checkOutDate) {
      setError("Please select both check-in and check-out dates")
      return
    }

    if (checkOutDate <= checkInDate) {
      setError("Check-out date must be after check-in date")
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomId,
          checkInDate: checkInDate.toISOString(),
          checkOutDate: checkOutDate.toISOString(),
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || "Booking failed")
      }

      const booking = await response.json()
      router.push(`/bookings/${booking.id}?success=true`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Booking failed")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <p className="text-lg text-slate-600">Loading booking form...</p>
      </div>
    )
  }

  if (!room || !hotel) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 p-8">
        <div className="max-w-2xl mx-auto">
          <p className="text-slate-600 mb-4">Room not found</p>
          <Link href="/hotels">
            <Button>Back to Hotels</Button>
          </Link>
        </div>
      </div>
    )
  }

  const nights = checkInDate && checkOutDate ? Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)) : 0
  const totalPrice = nights * room.price

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-2xl mx-auto">
        <Link href={`/hotels/${hotelId}`}>
          <Button variant="outline" className="mb-6">
            ← Back to Hotel
          </Button>
        </Link>

        <h1 className="text-3xl font-bold text-slate-900 mb-8">Book Your Room</h1>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Booking Form */}
          <div className="md:col-span-2">
            <Card className="p-6">
              <form onSubmit={handleBooking} className="space-y-6">
                {error && (
                  <div className="p-4 bg-red-50 text-red-700 rounded-md">
                    {error}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-2">
                    Check-in Date
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        {checkInDate ? format(checkInDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={checkInDate}
                        onSelect={setCheckInDate}
                        disabled={(date) =>
                          date < new Date(new Date().setHours(0, 0, 0, 0))
                        }
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-2">
                    Check-out Date
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        {checkOutDate ? format(checkOutDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={checkOutDate}
                        onSelect={setCheckOutDate}
                        disabled={(date) =>
                          checkInDate
                            ? date <= checkInDate
                            : date < new Date(new Date().setHours(0, 0, 0, 0))
                        }
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={submitting}
                >
                  {submitting ? "Processing..." : "Confirm Booking"}
                </Button>
              </form>
            </Card>
          </div>

          {/* Booking Summary */}
          <div>
            <Card className="p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                Booking Summary
              </h2>

              <div className="space-y-4 border-b pb-4 mb-4">
                <div>
                  <p className="text-sm text-slate-600">Hotel</p>
                  <p className="font-semibold text-slate-900">{hotel.name}</p>
                </div>

                <div>
                  <p className="text-sm text-slate-600">Room Type</p>
                  <p className="font-semibold text-slate-900">{room.type}</p>
                </div>

                <div>
                  <p className="text-sm text-slate-600">Room #{room.roomNumber}</p>
                  <p className="text-sm text-slate-700">
                    Capacity: {room.capacity} {room.capacity === 1 ? "guest" : "guests"}
                  </p>
                </div>
              </div>

              <div className="space-y-3 border-b pb-4 mb-4">
                <div className="flex justify-between">
                  <span className="text-slate-600">Check-in</span>
                  <span className="font-semibold">
                    {checkInDate ? format(checkInDate, "MMM dd, yyyy") : "-"}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-600">Check-out</span>
                  <span className="font-semibold">
                    {checkOutDate ? format(checkOutDate, "MMM dd, yyyy") : "-"}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-600">Number of Nights</span>
                  <span className="font-semibold">{nights}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-600">Price per Night</span>
                  <span className="font-semibold">${room.price}</span>
                </div>

                <div className="flex justify-between text-lg pt-2 border-t">
                  <span className="font-semibold text-slate-900">Total</span>
                  <span className="font-bold text-primary">
                    ${totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

