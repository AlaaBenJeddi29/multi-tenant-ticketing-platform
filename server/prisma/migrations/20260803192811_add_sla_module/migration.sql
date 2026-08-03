/*
  Warnings:

  - Added the required column `resolutionDueAt` to the `Ticket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `responseDueAt` to the `Ticket` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Ticket" ADD COLUMN     "firstRespondedAt" TIMESTAMP(3),
ADD COLUMN     "resolutionBreached" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "resolutionDueAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "resolvedAt" TIMESTAMP(3),
ADD COLUMN     "responseBreached" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "responseDueAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "Sla" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "responseTimeMinutes" INTEGER NOT NULL,
    "resolutionTimeMinutes" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "organizationId" TEXT NOT NULL,
    "priorityId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Sla_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Sla_priorityId_key" ON "Sla"("priorityId");

-- CreateIndex
CREATE INDEX "Sla_organizationId_idx" ON "Sla"("organizationId");

-- AddForeignKey
ALTER TABLE "Sla" ADD CONSTRAINT "Sla_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sla" ADD CONSTRAINT "Sla_priorityId_fkey" FOREIGN KEY ("priorityId") REFERENCES "Priority"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
