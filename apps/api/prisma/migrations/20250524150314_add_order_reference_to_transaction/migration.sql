/*
  Warnings:

  - You are about to drop the column `addressLine1` on the `ShippingAddress` table. All the data in the column will be lost.
  - Added the required column `addressLine` to the `ShippingAddress` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orderReference` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ShippingAddress" DROP COLUMN "addressLine1",
ADD COLUMN     "addressLine" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "orderReference" TEXT NOT NULL,
ALTER COLUMN "totalPrice" DROP NOT NULL;
