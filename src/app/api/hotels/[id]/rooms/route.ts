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

    const rooms = await prisma.room.findMany({
      where: { hotelId: id },
      include: {
        hotel: true,
      },
    })

    return Response.json(rooms)
  } catch (error) {
    console.error("Error fetching rooms:", error)
    return Response.json(
      { message: "Failed to fetch rooms" },
      { status: 500 }
    )
  }
}

