/*
  Warnings:

  - Made the column `teacherId` on table `LostItem` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "LostItem" DROP CONSTRAINT "LostItem_teacherId_fkey";

-- AlterTable
ALTER TABLE "LostItem" ALTER COLUMN "teacherId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "LostItem" ADD CONSTRAINT "LostItem_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
