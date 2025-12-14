/*
  Warnings:

  - You are about to drop the column `yearLevel` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Confession` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "yearLevel",
ALTER COLUMN "firstName" SET DEFAULT 'No_name',
ALTER COLUMN "lastName" SET DEFAULT 'No_lastname',
ALTER COLUMN "section" SET DEFAULT 'B';

-- DropTable
DROP TABLE "Confession";

-- DropEnum
DROP TYPE "YearLevel";
