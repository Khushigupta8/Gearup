ALTER TYPE "OrderStatus" ADD VALUE 'payment_review';
ALTER TABLE "bike"
  ADD COLUMN "hpiClearAt" TIMESTAMP(3),
  ADD COLUMN "hpiReference" TEXT,
  ADD COLUMN "inspectionCompletedAt" TIMESTAMP(3),
  ADD COLUMN "inspectionReference" TEXT;
