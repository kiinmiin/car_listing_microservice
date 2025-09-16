## Car Listing Backend (NestJS + Prisma)

### Prerequisites
- Node.js 18+
- pnpm (recommended) or npm
- Docker + Docker Compose

### Services via Docker
Start databases and storage:

```bash
docker compose up -d postgres redis minio
```

- Postgres: localhost:5432 (user: postgres / pass: postgres / db: carlist)
- Redis: localhost:6379
- MinIO: S3 API on :9000, console on :9001 (user/pass: minioadmin)

Open MinIO console at http://localhost:9001 and create a bucket named `car-photos`.

### Environment variables
Create a `.env` in `server/` using these keys (do not commit real secrets):

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

STRIPE_SECRET_KEY=sk_live_or_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

JWT_SECRET=replace-with-strong-secret
JWT_EXPIRES_IN=7d
```

Add a sanitized `.env.example` to git (without real secrets) when ready.

### Install dependencies
```bash
cd server
pnpm install
```

### Prisma setup
```bash
pnpm prisma generate
pnpm prisma migrate dev --name init
pnpm prisma studio  # optional GUI
```

### Run the API
```bash
pnpm dev
# API: http://localhost:4000
# Health: http://localhost:4000/health -> {"status":"ok"}
```

### Stripe setup (test mode to start)
1. Create a Stripe account and a test project.
2. In Developers → API keys: copy the Secret key into `STRIPE_SECRET_KEY`.
3. Install the Stripe CLI and forward webhooks:
   ```bash
   # from the server/ directory (or root) run:
   stripe login
   stripe listen --forward-to localhost:4000/stripe/webhook
   ```
   Copy the `whsec_...` signing secret into `STRIPE_WEBHOOK_SECRET`.
4. You’ll later implement endpoints to create Checkout Sessions for premium listings.

### Recommended modules to add next
- Auth: JWT-based login/register with password hashing (argon2/bcrypt)
- Listings: CRUD for listings with image upload to S3 (MinIO)
- Payments: Stripe Checkout for premium/featured placement, webhooks handler
- Search: Postgres full-text indices, later upgrade to Elasticsearch if needed
- Caching/Rate limiting: Redis-backed cache and limiter

### Notes
- Keep microservices out of scope for now; grow from this modular monolith.
- Use migrations for any schema change and keep `DATABASE_URL` consistent across envs.
