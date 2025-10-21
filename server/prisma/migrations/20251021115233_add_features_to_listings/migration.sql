-- AlterTable
ALTER TABLE "Listing" ADD COLUMN     "features" TEXT[] DEFAULT ARRAY[]::TEXT[];
