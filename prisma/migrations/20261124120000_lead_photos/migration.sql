ALTER TABLE "lead" ADD COLUMN "submissionIpHash" TEXT;
CREATE INDEX "lead_submissionIpHash_createdAt_idx" ON "lead"("submissionIpHash", "createdAt");

CREATE TABLE "lead_photo" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "storagePath" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "lead_photo_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "lead_photo_storagePath_key" ON "lead_photo"("storagePath");
CREATE INDEX "lead_photo_leadId_idx" ON "lead_photo"("leadId");
ALTER TABLE "lead_photo" ADD CONSTRAINT "lead_photo_leadId_fkey"
  FOREIGN KEY ("leadId") REFERENCES "lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "lead_photo" ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON "lead_photo" FROM anon, authenticated;
