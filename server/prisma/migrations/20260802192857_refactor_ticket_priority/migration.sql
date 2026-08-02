/*
  Warnings:

  - You are about to drop the column `priority` on the `Ticket` table. All the data in the column will be lost.
  - Added the required column `priorityId` to the `Ticket` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Ticket" DROP COLUMN "priority",
ADD COLUMN     "priorityId" TEXT NOT NULL,
ALTER COLUMN "description" DROP NOT NULL;

-- DropEnum
DROP TYPE "TicketPriority";

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_priorityId_fkey" FOREIGN KEY ("priorityId") REFERENCES "Priority"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
