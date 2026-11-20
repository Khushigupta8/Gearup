-- AlterTable
ALTER TABLE "bike" ADD COLUMN     "videoUrl" TEXT;

-- CreateTable
CREATE TABLE "promo_asset" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "promo_asset_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "promo_asset_active_sortOrder_idx" ON "promo_asset"("active", "sortOrder");

-- Keep Supabase's public API locked out (same as 20261119094551_lock_down_public_api).
ALTER TABLE "promo_asset" ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON "promo_asset" FROM anon, authenticated;
