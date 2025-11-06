# Car Market – Modern Car Listings Microservice

**Find your perfect car or sell with confidence. Premium listings get priority placement.**

---

## Overview
Car Market is a modern, full-stack, open-source web application for buying and selling cars. Users can browse, search, and list vehicles, upgrade to premium listings, and securely process payments. Built with a modular structure (Next.js + NestJS/Prisma backend), it delivers a performant and developer-friendly codebase.

---

## Features
- User authentication (register & login)
- Browse, filter, and search cars
- CRUD vehicle listings with image upload (S3 compatible, e.g. MinIO)
- Premium/featured upgrade and placements
- Stripe payments integration (upgrade listings)
- Dashboard for sellers
- Responsive design
- Modern UI (Radix UI, Tailwind CSS)
- Cloud-ready (Docker Compose recipe for dev)

---

## Tech Stack
- **Frontend:** Next.js 14, React 18, Radix UI, Tailwind CSS
- **Backend:** NestJS, Prisma ORM, PostgreSQL, Redis, Stripe, MinIO (S3)
- **Infra (local dev):** Docker Compose (Postgres, Redis, MinIO)

---

## Monorepo Structure
```
car_listing_microservice/
│
├── app/         # Next.js frontend
├── components/  # Shared React components
├── server/      # NestJS backend (src, prisma, Docker, README)
├── public/      # Static images & assets
├── styles/      # Tailwind/global CSS
├── hooks/, lib/ # Reusable hooks and logic
├── docker-compose.yml  # Dev infra stack
└── ...
```

---

## Quickstart (Development)

**1. Clone the repo**
```bash
git clone https://github.com/YOUR_GITHUB_ACCOUNT/car_listing_microservice.git
cd car_listing_microservice
```

**2. Start databases & storage (Docker Compose)**
```bash
docker compose up -d postgres redis minio
# MinIO admin: http://localhost:9001 (user: minioadmin pass: minioadmin)
```

**3. Prepare Environment Variables**
- Copy the following to `/server/.env` (never commit real secrets; see `/server/README.md` for details):

```
APP_PORT=4000
CORS_ORIGIN=http://localhost:3000

DATABASE_URL=postgresql://postgres:postgres@localhost:5432/carlist?schema=public
REDIS_URL=redis://localhost:6379

S3_ENDPOINT=http://localhost:9000
S3_REGION=us-east-1
S3_BUCKET=car-photos
S3_ACCESS_KEY=minioadmin
S3_SECRET_KEY=minioadmin
S3_USE_SSL=false

STRIPE_SECRET_KEY=sk_test_xxx...
STRIPE_WEBHOOK_SECRET=whsec_...

JWT_SECRET=some-strong-secret
JWT_EXPIRES_IN=7d
```

Add your real Stripe/test and JWT secrets as needed. Add `/server/.env.example` for public reference if you wish.

**4. Setup Backend & DB**
```bash
cd server
pnpm install    # or npm install
pnpm prisma generate
pnpm prisma migrate dev --name init
pnpm dev        # starts API at http://localhost:4000
```

**5. Setup Frontend**
```bash
cd ../          # project root
dpnm install    # or npm install
pnpm dev        # starts Next.js at http://localhost:3000
```

*The app will now be available at [http://localhost:3000](http://localhost:3000) (frontend), with the API at [http://localhost:4000](http://localhost:4000).* 

---

## Contributing
Pull requests welcome! For major changes, please open an issue first to discuss your ideas.

## License
MIT – see [LICENSE](LICENSE)

---

## Attribution
Icons, car images, and UI kit credits: Radix UI, Lucide Icons, Unsplash demo images.

---
