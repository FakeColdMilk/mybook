#  Quick Start & User Guide

## 🚀 One-Time Setup (Run These Commands Once)

```bash
# 1. Generate Prisma client from schema
npx prisma generate

# 2. Create database tables
npx prisma migrate dev --name init

# 3. Add sample hotels and rooms (optional)
npx tsx scripts/seed.ts

# 4. Start the development server
npm run dev
```

## 📖 How to Use the Booking System

### Step 1: Authentication
```
Visit: http://localhost:3000
→ You'll be redirected to /login if not authenticated
→ Sign up for a new account or login with existing credentials
```

### Step 2: Browse Hotels
```
http://localhost:3000
→ Click "Browse Hotels" button
→ See all available hotels with descriptions and images
→ Click on a hotel to view its rooms
```

### Step 3: Select Room & Dates
```
Click "Book Now" on any room
→ Use calendar picker to select check-in date
→ Use calendar picker to select check-out date
→ See real-time price calculation
→ Click "Confirm Booking"
```

### Step 4: Confirmation & Management
```
You'll see booking confirmation with:
- Hotel name and location
- Room details
- Check-in and check-out dates
- Total price

Access anytime via: http://localhost:3000/bookings
```

## 🔗 Key URLs

| Page | URL | Purpose |
|------|-----|---------|
| Home/Dashboard | `/` | Main page (requires login) |
| Hotels | `/hotels` | Browse all hotels |
| Hotel Details | `/hotels/[id]` | View rooms in hotel |
| Booking Form | `/hotels/[id]/rooms/[roomId]/booking` | Make a reservation |
| My Bookings | `/bookings` | View your reservations |
| Booking Details | `/bookings/[id]` | View confirmation |
| Login | `/login` | Sign in |
| Signup | `/signup` | Create account |

## 💡 Calendar Date Picker Features

✅ Cannot select past dates
✅ Check-out must be after check-in
✅ Visual date selection
✅ Auto-calculates number of nights
✅ Real-time price calculation

## 🔒 Authentication Required

The following are protected (require login):
- Browse hotels
- Select room and make booking
- View my bookings
- Confirm bookings

Anonymous users are redirected to `/login`

## 📊 Sample Data

When you run `npx tsx scripts/seed.ts`:

**3 Hotels Created:**
1. **Luxury Haven Hotel** (New York, NY)
   - 3 rooms ranging $149-$299/night
   
2. **Beachside Paradise Resort** (Miami, FL)
   - 3 rooms ranging $179-$349/night
   
3. **Mountain Retreat Inn** (Denver, CO)
   - 3 rooms ranging $99-$249/night

## 🐛 Troubleshooting

### Database Not Connecting
```bash
# Check your DATABASE_URL in .env.local
# Make sure PostgreSQL is running
# Try pushing schema again
npx prisma db push
```

### Prisma Errors
```bash
# Regenerate client
rm -rf node_modules/.prisma
npx prisma generate

# Or reset everything (WARNING: deletes all data)
npx prisma migrate reset
```

### Calendar Not Showing
```bash
# Reinstall dependencies
rm -rf node_modules
npm install
npm run dev
```

## 🎯 Features Checklist

✅ User authentication required
✅ Hotel listings with images
✅ Room details and descriptions  
✅ Calendar-based date selection
✅ Real-time price calculations
✅ Double-booking prevention
✅ Booking confirmation
✅ My bookings management
✅ Responsive design
✅ Professional UI with Tailwind

## 📱 Responsive Design

Works perfectly on:
- Desktop (1920px+)
- Tablet (768px-1919px)
- Mobile (320px-767px)

## 🔧 Tech Stack

- **Frontend:** Next.js 16, React 19, TypeScript
- **Styling:** Tailwind CSS, Radix UI
- **Auth:** Better Auth
- **Database:** PostgreSQL with Prisma ORM
- **Components:** shadcn/ui based components
- **Date Handling:** react-day-picker, date-fns

## 📝 Notes

- All prices are shown per night
- Bookings cannot be made for past dates
- A room cannot be double-booked on overlapping dates
- Users can only view their own bookings
- Created with full TypeScript support

---

**Need help?** See SETUP.md for detailed documentation or BOOKING_SYSTEM.md for feature overview.
