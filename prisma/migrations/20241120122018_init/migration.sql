/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `LostItem` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "LostItem" DROP COLUMN "imageUrl",
ADD COLUMN     "img" TEXT;
