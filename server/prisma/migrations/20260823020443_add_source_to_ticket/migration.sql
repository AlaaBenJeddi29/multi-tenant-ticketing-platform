-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "relatedEntityId" TEXT,
ADD COLUMN     "relatedEntityType" TEXT;

-- AlterTable
ALTER TABLE "Ticket" ADD COLUMN     "source" TEXT NOT NULL DEFAULT 'INTERNAL';
