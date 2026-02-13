-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Role" ADD VALUE 'ADMIN';
ALTER TYPE "Role" ADD VALUE 'SUPER_ADMIN';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "banReason" TEXT,
ADD COLUMN     "banned" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE "AdminLog" (
    "id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "details" JSONB,
    "userId" TEXT NOT NULL,
    "targetId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AdminLog_userId_createdAt_idx" ON "AdminLog"("userId", "createdAt");

-- AddForeignKey
ALTER TABLE "AdminLog" ADD CONSTRAINT "AdminLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
