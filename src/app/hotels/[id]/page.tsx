"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Header from "@/components/header"

export default function HotelDetailsPage() {
  const params = useParams()
  const hotelId = params.id as string
  const [hotel, setHotel] = useState<any>(null)
  const [rooms, setRooms] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHotelAndRooms = async () => {
      try {
        const [hotelRes, roomsRes] = await Promise.all([
          fetch(`/api/hotels/${hotelId}`),
          fetch(`/api/hotels/${hotelId}/rooms`),
        ])
        setHotel(await hotelRes.json())
        setRooms(await roomsRes.json())
      } catch (error) {
        console.error("Failed to fetch hotel details:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchHotelAndRooms()
  }, [hotelId])

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <p className="text-2xl text-white font-bold">Loading hotel details...</p>
      </div>
    )
  }

  if (!hotel) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-900 to-slate-800 p-8">
        <div className="max-w-6xl mx-auto">
          <p className="text-2xl text-white font-bold mb-4">Hotel not found</p>
          <Link href="/hotels">
            <Button className="bg-amber-500 text-white font-bold hover:bg-amber-600 px-6 py-3">Back to Hotels</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header />
      <div className="max-w-6xl mx-auto px-6 py-12">

        <div className="bg-linear-to-r from-indigo-900 to-blue-900 rounded-2xl shadow-2xl p-12 mb-12 border-4 border-amber-400">
          <h1 className="text-5xl font-black text-white mb-4">
            {hotel.name}
          </h1>
          <p className="text-3xl text-amber-300 font-bold mb-6">
            {hotel.address}
          </p>
          <p className="text-2xl text-blue-200 mb-6">
            {hotel.city}, {hotel.country}
          </p>
          {hotel.description && (
            <p className="text-white text-xl leading-relaxed">{hotel.description}</p>
          )}
        </div>

        <h2 className="text-4xl font-black text-white mb-8">Available Rooms</h2>

        {rooms.length === 0 ? (
          <Card className="p-8 text-center bg-slate-800 border-4 border-amber-500">
            <p className="text-2xl text-white font-bold">No rooms available</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {rooms.map((room) => (
              <Card
                key={room.id}
                className="overflow-hidden hover:shadow-2xl transition-all bg-linear-to-b from-slate-700 to-slate-600 border-4 border-amber-400 hover:border-amber-300"
              >
                <div className="bg-linear-to-br from-green-700 to-teal-700 h-32 flex items-center justify-center font-black text-white text-4xl">
                  {room.type.charAt(0)}
                </div>
                <div className="p-8">
                  <h3 className="text-3xl font-black text-white mb-4">
                    {room.type}
                  </h3>
                  <p className="text-sm text-amber-300 font-bold mb-3">
                    Room #{room.roomNumber}
                  </p>
                  <p className="text-base text-blue-200 mb-4 font-semibold">
                    Capacity: {room.capacity} {room.capacity === 1 ? "guest" : "guests"}
                  </p>
                  {room.description && (
                    <p className="text-white mb-6 text-base leading-relaxed">{room.description}</p>
                  )}
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-4xl font-black text-amber-300">
                      ${room.price}
                    </span>
                    <span className="text-base text-blue-200 font-bold">per night</span>
                  </div>
                  <Link href={`/hotels/${hotelId}/rooms/${room.id}/booking`}>
                    <Button className="w-full bg-amber-500 text-white font-black hover:bg-amber-600 py-4">Book Now</Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}


