import { auth } from "@/src/lib/auth"
import prisma from "@/src/lib/prisma"
import { headers } from "next/headers"

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session) {
      return Response.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { roomId, checkInDate, checkOutDate } = body

    if (!roomId || !checkInDate || !checkOutDate) {
      return Response.json(
        { message: "Missing required fields" },
        { status: 400 }
      )
    }

    const room = await prisma.room.findUnique({
      where: { id: roomId },
    })

    if (!room) {
      return Response.json(
        { message: "Room not found" },
        { status: 404 }
      )
    }

    const checkIn = new Date(checkInDate)
    const checkOut = new Date(checkOutDate)

    if (checkOut <= checkIn) {
      return Response.json(
        { message: "Check-out date must be after check-in date" },
        { status: 400 }
      )
    }

    // Calculate number of nights and total price
    const nights = Math.ceil(
      (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)
    )
    const totalPrice = nights * room.price

    // Check for overlapping bookings
    const existingBooking = await prisma.booking.findFirst({
      where: {
        roomId: roomId,
        status: "confirmed",
        OR: [
          {
            checkIn: { lt: checkOut },
            checkOut: { gt: checkIn },
          },
        ],
      },
    })

    if (existingBooking) {
      return Response.json(
        { message: "Room is not available for selected dates" },
        { status: 409 }
      )
    }

    const booking = await prisma.booking.create({
      data: {
        userId: session.user.id,
        roomId,
        checkIn,
        checkOut,
        totalPrice,
        status: "confirmed",
      },
      include: {
        room: {
          include: {
            hotel: true,
          },
        },
      },
    })

    return Response.json(booking)
  } catch (error) {
    console.error("Error creating booking:", error)
    return Response.json(
      { message: "Failed to create booking" },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session) {
      return Response.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }

    const bookings = await prisma.booking.findMany({
      where: { userId: session.user.id },
      include: {
        room: {
          include: {
            hotel: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return Response.json(bookings)
  } catch (error) {
    console.error("Error fetching bookings:", error)
    return Response.json(
      { message: "Failed to fetch bookings" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session) {
      return Response.json({ message: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { id } = body

    if (!id) {
      return Response.json({ message: "Missing booking id" }, { status: 400 })
    }

    const booking = await prisma.booking.findUnique({ where: { id } })

    if (!booking) {
      return Response.json({ message: "Booking not found" }, { status: 404 })
    }

    if (booking.userId !== session.user.id) {
      return Response.json({ message: "Unauthorized" }, { status: 403 })
    }

    await prisma.booking.delete({ where: { id } })

    return Response.json({ success: true })
  } catch (error) {
    console.error("Error deleting booking:", error)
    return Response.json({ message: "Failed to delete booking" }, { status: 500 })
  }
}
