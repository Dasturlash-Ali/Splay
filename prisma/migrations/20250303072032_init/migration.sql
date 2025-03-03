/*
  Warnings:

  - You are about to drop the column `hash_password` on the `admin` table. All the data in the column will be lost.
  - Added the required column `hashed_password` to the `admin` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "admin" DROP COLUMN "hash_password",
ADD COLUMN     "hashed_password" TEXT NOT NULL;
