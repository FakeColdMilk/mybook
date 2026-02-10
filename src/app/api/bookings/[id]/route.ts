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

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        room: {
          include: {
            hotel: true,
          },
        },
      },
    })

    if (!booking) {
      return Response.json(
        { message: "Booking not found" },
        { status: 404 }
      )
    }

    // Check if user owns this booking
    if (booking.userId !== session.user.id) {
      return Response.json(
        { message: "Unauthorized" },
        { status: 403 }
      )
    }

    return Response.json(booking)
  } catch (error) {
    console.error("Error fetching booking:", error)
    return Response.json(
      { message: "Failed to fetch booking" },
      { status: 500 }
    )
  }
}

