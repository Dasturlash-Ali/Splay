/*
  Warnings:

  - You are about to drop the column `hashed_password` on the `admin` table. All the data in the column will be lost.
  - Added the required column `hash_password` to the `admin` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "admin" DROP COLUMN "hashed_password",
ADD COLUMN     "hash_password" TEXT NOT NULL;
