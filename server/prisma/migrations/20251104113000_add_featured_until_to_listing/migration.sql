-- AlterTable: add featuredUntil column and index to Listing
ALTER TABLE "Listing" ADD COLUMN "featuredUntil" TIMESTAMP;

-- Optional: backfill strategy can be implemented in application code; leaving existing rows as NULL

-- Create index to optimize featured queries
CREATE INDEX IF NOT EXISTS "Listing_featured_idx" ON "Listing" ("featured");
