import { auth } from "@/src/lib/auth"
import prisma from "@/src/lib/prisma"
import { headers } from "next/headers"

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session) {
      return Response.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }

    const hotels = await prisma.hotel.findMany({
      include: {
        rooms: true,
      },
    })

    return Response.json(hotels)
  } catch (error) {
    console.error("Error fetching hotels:", error)
    return Response.json(
      { message: "Failed to fetch hotels" },
      { status: 500 }
    )
  }
}
