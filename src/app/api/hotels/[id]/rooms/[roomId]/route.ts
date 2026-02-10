import { auth } from "@/src/lib/auth"
import prisma from "@/src/lib/prisma"
import { headers } from "next/headers"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string; roomId: string }> }
) {
  try {
    const { id, roomId } = await params
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session) {
      return Response.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }

    const room = await prisma.room.findUnique({
      where: { id: roomId },
      include: {
        hotel: true,
      },
    })

    if (!room) {
      return Response.json({ message: "Room not found" }, { status: 404 })
    }

    return Response.json(room)
  } catch (error) {
    console.error("Error fetching room:", error)
    return Response.json(
      { message: "Failed to fetch room" },
      { status: 500 }
    )
  }
}

