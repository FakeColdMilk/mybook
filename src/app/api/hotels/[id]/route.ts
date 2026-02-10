import { auth } from "@/src/lib/auth"
import prisma from "@/src/lib/prisma"
import { headers } from "next/headers"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session) {
      return Response.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }

    const hotel = await prisma.hotel.findUnique({
      where: { id },
      include: {
        rooms: true,
      },
    })

    if (!hotel) {
      return Response.json({ message: "Hotel not found" }, { status: 404 })
    }

    return Response.json(hotel)
  } catch (error) {
    console.error("Error fetching hotel:", error)
    return Response.json(
      { message: "Failed to fetch hotel" },
      { status: 500 }
    )
  }
}

