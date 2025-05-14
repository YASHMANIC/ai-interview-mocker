/*
  Warnings:

  - The `response` column on the `Interview` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Interview" DROP COLUMN "response",
ADD COLUMN     "response" JSONB[];
