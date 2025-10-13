/*
  Warnings:

  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "premiumListingsRemaining" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "subscription" TEXT NOT NULL DEFAULT 'free',
ALTER COLUMN "name" SET NOT NULL;
