# Hotel Booking System Setup Guide

This guide will help you set up and run the hotel booking system.

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database set up and running
- Environment variables configured

## Setup Steps

### 1. Install Dependencies

Dependencies have already been installed, but if you need to reinstall:

```bash
npm install
```

### 2. Database Setup

Make sure your `.env` or `.env.local` file has the correct PostgreSQL connection string:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/mybook"
```

### 3. Generate Prisma Client

The Prisma client needs to be generated based on the schema:

```bash
npx prisma generate
```

### 4. Run Database Migrations

Create the database tables by running migrations:

```bash
npx prisma migrate dev --name init
```

This will:
- Create all necessary tables (User, Session, Account, Verification, Hotel, Room, Booking)
- Generate the Prisma client

### 5. Seed Sample Data (Optional)

Populate the database with sample hotels and rooms:

```bash
npx tsx scripts/seed.ts
```

This creates:
- 3 sample hotels (New York, Miami, Denver)
- 9 sample rooms across the hotels
- Ready-to-book room inventory

### 6. Run the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## How to Use

### Authentication

1. First, you need to create an account or log in
2. Navigate to `/login` to sign up or use an existing account
3. All booking features require authentication

### Booking a Hotel

1. Once logged in, you'll be redirected to the home page
2. Click "Browse Hotels" to see available hotels
3. Click on a hotel to view available rooms
4. Click "Book Now" on any room
5. Select check-in and check-out dates using the calendar picker
6. Review the booking summary
7. Click "Confirm Booking" to complete the reservation
8. You'll receive a confirmation page with booking details

### Managing Bookings

- Click "My Bookings" to view all your reservations
- See booking details including dates, room info, and total price
- Click "View Details" for full booking information

## Project Structure

```
src/
├── app/
│   ├── page.tsx                    # Home page (requires login)
│   ├── hotels/
│   │   ├── page.tsx               # Hotels listing
│   │   └── [id]/
│   │       ├── page.tsx           # Hotel details & rooms
│   │       └── rooms/
│   │           └── [roomId]/
│   │               └── booking/
│   │                   └── page.tsx    # Booking form with calendar
│   ├── bookings/
│   │   ├── page.tsx               # My bookings
│   │   └── [id]/
│   │       └── page.tsx           # Booking confirmation details
│   └── api/
│       ├── hotels/                # Hotel API endpoints
│       └── bookings/              # Booking API endpoints
├── lib/
│   ├── auth.ts                    # Authentication setup
│   └── prisma.ts                  # Prisma client instance
└── components/
    └── ui/
        ├── calendar.tsx           # Calendar date picker
        └── popover.tsx            # Popover component

prisma/
└── schema.prisma                  # Database schema
```

## Database Schema

### Hotel Model
- id, name, description, city, country, address, imageUrl
- Relations: rooms

### Room Model
- id, hotelId, roomNumber, type, price, capacity, description, imageUrl
- Relations: hotel, bookings

### Booking Model
- id, userId, roomId, checkIn, checkOut, totalPrice, status
- Relations: user, room

## Key Features

✅ **Login Required** - All booking features require authentication
✅ **Calendar Date Picker** - Choose check-in and check-out dates visually
✅ **Real-time Availability** - System prevents double-booking
✅ **Automatic Price Calculation** - Total price calculated based on nights
✅ **Booking Confirmation** - Detailed confirmation for each booking
✅ **My Bookings** - View all your reservations in one place

## API Endpoints

### Hotels
- `GET /api/hotels` - Get all hotels
- `GET /api/hotels/:id` - Get specific hotel
- `GET /api/hotels/:id/rooms` - Get hotel's rooms
- `GET /api/hotels/:id/rooms/:roomId` - Get specific room

### Bookings (Requires Authentication)
- `POST /api/bookings` - Create new booking
- `GET /api/bookings` - Get user's bookings
- `GET /api/bookings/:id` - Get booking details

## Environment Variables

Make sure your `.env.local` has:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/mybook"

# Auth (if using OAuth providers)
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

## Troubleshooting

### Database Connection Issues
- Verify PostgreSQL is running
- Check DATABASE_URL in .env.local
- Run `npx prisma db push` to sync schema

### Prisma Migration Issues
- Delete old migration files if needed
- Run `npx prisma migrate reset` to start fresh (⚠️ deletes data)
- Regenerate client: `npx prisma generate`

### Calendar Not Working
- Ensure `react-day-picker` and `date-fns` are installed
- Clear node_modules and run `npm install`

## Next Steps

- Customize hotel/room images with your actual URLs
- Add payment processing (Stripe, etc.)
- Implement booking cancellation
- Add review/rating system
- Send confirmation emails

Enjoy your hotel booking system! 🎉
