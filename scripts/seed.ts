import "dotenv/config"
import prisma from "@/src/lib/prisma"

async function seed() {
  console.log("Seeding database with sample hotels and rooms...")

  // Create sample hotels
  const hotel1 = await prisma.hotel.create({
    data: {
      name: "Luxury Haven Hotel",
      description:
        "Experience luxury and comfort at our five-star hotel with world-class amenities and exceptional service.",
      city: "New York",
      country: "USA",
      address: "123 Manhattan Avenue, New York, NY 10001",
      imageUrl:
        "https://images.unsplash.com/photo-1596178065887-cf38d1da1b65?w=800&q=80",
      rooms: {
        create: [
          {
            roomNumber: "101",
            type: "Single",
            price: 149,
            capacity: 1,
            description: "Cozy single room with modern amenities",
            imageUrl:
              "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80",
          },
          {
            roomNumber: "102",
            type: "Double",
            price: 199,
            capacity: 2,
            description: "Spacious double room with king-size bed and city view",
            imageUrl:
              "https://images.unsplash.com/photo-1611432097413-eca07d3003e9?w=800&q=80",
          },
          {
            roomNumber: "103",
            type: "Suite",
            price: 299,
            capacity: 4,
            description:
              "Elegant suite with living area, bedroom, and panoramic city views",
            imageUrl:
              "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
          },
        ],
      },
    },
  })

  const hotel2 = await prisma.hotel.create({
    data: {
      name: "Beachside Paradise Resort",
      description:
        "Relax on pristine beaches and enjoy tropical vibes at our all-inclusive resort.",
      city: "Miami",
      country: "USA",
      address: "456 Ocean Boulevard, Miami, FL 33139",
      imageUrl:
        "https://images.unsplash.com/photo-1604147706283-d7119b5b822c?w=800&q=80",
      rooms: {
        create: [
          {
            roomNumber: "201",
            type: "Double",
            price: 179,
            capacity: 2,
            description: "Beach-view room with direct access to the sand",
            imageUrl:
              "https://images.unsplash.com/photo-1615529328331-f8917597711f?w=800&q=80",
          },
          {
            roomNumber: "202",
            type: "Suite",
            price: 279,
            capacity: 2,
            description: "Luxury suite with private balcony and jacuzzi",
            imageUrl:
              "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=800&q=80",
          },
          {
            roomNumber: "203",
            type: "Family",
            price: 349,
            capacity: 4,
            description: "Spacious family suite perfect for larger groups",
            imageUrl:
              "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800&q=80",
          },
        ],
      },
    },
  })

  const hotel3 = await prisma.hotel.create({
    data: {
      name: "Mountain Retreat Inn",
      description:
        "Experience peace and tranquility in the heart of the mountains with stunning scenic views.",
      city: "Denver",
      country: "USA",
      address: "789 Peak Road, Denver, CO 80205",
      imageUrl:
        "https://images.unsplash.com/photo-1520763185298-1b434c919abe?w=800&q=80",
      rooms: {
        create: [
          {
            roomNumber: "301",
            type: "Single",
            price: 99,
            capacity: 1,
            description: "Intimate room with mountain views and fireplace",
            imageUrl:
              "https://images.unsplash.com/photo-1589939705066-5470979efdd4?w=800&q=80",
          },
          {
            roomNumber: "302",
            type: "Double",
            price: 149,
            capacity: 2,
            description: "Comfortable double with private deck",
            imageUrl:
              "https://images.unsplash.com/photo-1501876725169-7c18a67135b6?w=800&q=80",
          },
          {
            roomNumber: "303",
            type: "Suite",
            price: 249,
            capacity: 2,
            description:
              "Premium suite with hot tub and 360-degree mountain panorama",
            imageUrl:
              "https://images.unsplash.com/photo-1523238102328-fb8812a12bda?w=800&q=80",
          },
        ],
      },
    },
  })

  console.log("✅ Successfully created sample hotels and rooms!")
  console.log(`
  Created hotels:
  - Luxury Haven Hotel (New York) with 3 rooms
  - Beachside Paradise Resort (Miami) with 3 rooms
  - Mountain Retreat Inn (Denver) with 3 rooms
  `)
}

seed()
  .then(() => {
    console.log("Seed completed successfully!")
    process.exit(0)
  })
  .catch((err) => {
    console.error("Error seeding database:", err)
    process.exit(1)
  })
