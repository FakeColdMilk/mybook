Project Setup Instructions

1) Requirements
- Node.js (recommended v18+)
- PostgreSQL (local or remote) with a database you can connect to
- Git (optional)

2) Install dependencies
- From project root:
  npm install

3) Environment variables
- Create a file named `.env` in the project root with at least the following values:

  DATABASE_URL="postgres://USER:PASSWORD@HOST:PORT/DATABASE"
  GITHUB_CLIENT_ID=your_github_client_id
  GITHUB_CLIENT_SECRET=your_github_client_secret

- Replace USER, PASSWORD, HOST, PORT, DATABASE and the GitHub values with your credentials.
- If you don't use GitHub social sign-in you can leave the GitHub values blank.

4) Prisma (database)
- Generate Prisma client:
  npx prisma generate

- Run migrations locally (applies migrations and creates schema):
  npx prisma migrate dev --name init

- (Optional) Open Prisma Studio to inspect data:
  npx prisma studio

5) Seed sample data (optional)
- The repo includes a seed script. Run it after migrations:
  npx tsx scripts/seed.ts

6) Run the app (development)
- Start the Next.js dev server:
  npm run dev

- Visit http://localhost:3000 in your browser.

7) Build & Production
- Build the app:
  npm run build
- Start the production server:
  npm start

8) Notes & troubleshooting
- Ensure `DATABASE_URL` points to a running Postgres instance.
- If migrations fail, verify your DB user has permissions to create schemas/tables.
- For GitHub OAuth, set the app's callback/redirect URL to http://localhost:3000 (or your deploy URL) when creating the OAuth app and use the provided client id/secret in `.env`.
- If you change Prisma schema, run `npx prisma generate` and create a new migration.

9) Useful commands
- Install deps: `npm install`
- Dev: `npm run dev`
- Build: `npm run build`
- Start prod: `npm start`
- Prisma generate: `npx prisma generate`
- Apply migrations: `npx prisma migrate dev --name <name>`
- Seed: `npx tsx scripts/seed.ts`

If anything is missing or you want the README in a different format (README.md), tell me and I will update it.