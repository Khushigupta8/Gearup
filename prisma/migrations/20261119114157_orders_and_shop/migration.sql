-- AlterTable
ALTER TABLE "order" ADD COLUMN     "balanceMethod" TEXT,
ADD COLUMN     "deliveryAddress" TEXT,
ADD COLUMN     "deliveryPostcode" TEXT,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "paidAt" TIMESTAMP(3),
ADD COLUMN     "partExReg" TEXT;

-- AlterTable
ALTER TABLE "payment" ADD COLUMN     "receiptUrl" TEXT;

-- AlterTable
ALTER TABLE "product" ADD COLUMN     "flagText" TEXT,
ADD COLUMN     "meta" TEXT,
ADD COLUMN     "rating" DOUBLE PRECISION,
ADD COLUMN     "reviewCount" INTEGER;
