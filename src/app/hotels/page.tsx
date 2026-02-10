"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Header from "@/components/header"

export default function HotelsPage() {
  const router = useRouter()
  const [hotels, setHotels] = useState<any[]>([])
  const [filteredHotels, setFilteredHotels] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchCity, setSearchCity] = useState("")

  useEffect(() => {
    const checkAuthAndFetch = async () => {
      try {
        const response = await fetch("/api/hotels")
        if (response.status === 401) {
          router.push("/login")
          return
        }
        if (!response.ok) throw new Error("Failed to fetch hotels")
        const data = await response.json()
        setHotels(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error("Failed to fetch hotels:", err)
        setError("Failed to load hotels")
      } finally {
        setLoading(false)
      }
    }

    checkAuthAndFetch()
  }, [router])

  useEffect(() => {
    const filtered = hotels.filter((hotel) =>
      hotel.city.toLowerCase().includes(searchCity.toLowerCase())
    )
    setFilteredHotels(filtered)
  }, [hotels, searchCity])

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <p className="text-2xl text-white font-bold">Loading hotels...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header />

      <div className="max-w-7xl mx-auto px-6 py-12">
        {error && (
          <Card className="p-6 bg-red-900 text-red-100 mb-8 border-2 border-red-600">
            <p className="text-lg font-bold">{error}</p>
          </Card>
        )}

        <div className="mb-12">
          <h1 className="text-5xl font-black text-white mb-8 tracking-tight">Find Your Hotel</h1>
          <div className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Search by city..."
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
              className="w-full px-6 py-4 text-lg font-semibold rounded-xl bg-white text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-4 focus:ring-amber-500 border-4 border-amber-400 shadow-xl"
            />
            {searchCity && (
              <button
                onClick={() => setSearchCity("")}
                className="text-white font-bold hover:text-amber-400 transition"
              >
                Clear search
              </button>
            )}
          </div>
        </div>

        {filteredHotels.length === 0 ? (
          <Card className="p-12 text-center bg-slate-800 border-4 border-amber-500">
            <p className="text-2xl text-white font-bold mb-4">
              {searchCity ? "No hotels found in that city." : "No hotels available yet."}
            </p>
            {searchCity && (
              <Button
                onClick={() => setSearchCity("")}
                className="bg-amber-500 text-white font-bold hover:bg-amber-600 px-8 py-3 text-base"
              >
                Clear Search
              </Button>
            )}
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-8">
            {filteredHotels.map((hotel) => (
              <Link key={hotel.id} href={`/hotels/${hotel.id}`}>
                <Card className="h-auto hover:shadow-2xl transition-all cursor-pointer overflow-hidden bg-linear-to-r from-slate-700 to-slate-600 border-4 border-amber-400 hover:border-amber-300">
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/3 bg-linear-to-br from-indigo-600 to-blue-700 h-64 md:h-80 flex items-center justify-center font-bold text-white text-4xl">
                      {hotel.name.charAt(0)}
                    </div>
                    <div className="md:w-2/3 p-10 flex flex-col justify-center">
                      <h3 className="text-4xl font-black text-white mb-4">{hotel.name}</h3>
                      <p className="text-2xl text-amber-300 font-bold mb-6">{hotel.city}, {hotel.country}</p>
                      {hotel.description && (
                        <p className="text-lg text-slate-200 mb-8 leading-relaxed">{hotel.description}</p>
                      )}
                      <Button className="bg-amber-500 text-white font-black hover:bg-amber-600 px-8 py-4 text-lg w-fit">View Rooms →</Button>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
