/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Interview` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `Interview` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Interview` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Interview" DROP CONSTRAINT "Interview_user_id_fkey";

-- DropIndex
DROP INDEX "Interview_user_id_idx";

-- AlterTable
ALTER TABLE "Interview" DROP COLUMN "createdAt",
DROP COLUMN "user_id",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Interview" ADD CONSTRAINT "Interview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
