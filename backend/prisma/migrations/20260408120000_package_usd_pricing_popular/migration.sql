-- Align Package with schema.prisma: optional USD fields + isPopular flag
ALTER TABLE "Package" ADD COLUMN "usdPrice" DOUBLE PRECISION;
ALTER TABLE "Package" ADD COLUMN "usdOriginalPrice" DOUBLE PRECISION;
ALTER TABLE "Package" ADD COLUMN "isPopular" BOOLEAN NOT NULL DEFAULT false;
