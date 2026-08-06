/*
  Warnings:

  - The values [ADD_INTERNAL_COMMENT] on the enum `AutomationAction` will be removed. If these variants are still used in the database, this will fail.
  - The values [CATEGORY_IS,ASSIGNED_AGENT_IS,REQUESTER_IS] on the enum `AutomationCondition` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "AutomationAction_new" AS ENUM ('ASSIGN_AGENT', 'CHANGE_STATUS', 'CHANGE_PRIORITY', 'ADD_COMMENT', 'CLOSE_TICKET', 'REOPEN_TICKET', 'SEND_NOTIFICATION', 'SEND_EMAIL', 'WEBHOOK');
ALTER TABLE "AutomationRule" ALTER COLUMN "action" TYPE "AutomationAction_new" USING ("action"::text::"AutomationAction_new");
ALTER TYPE "AutomationAction" RENAME TO "AutomationAction_old";
ALTER TYPE "AutomationAction_new" RENAME TO "AutomationAction";
DROP TYPE "public"."AutomationAction_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "AutomationCondition_new" AS ENUM ('ALWAYS', 'STATUS_IS', 'PRIORITY_IS', 'UNASSIGNED', 'RESPONSE_BREACHED', 'RESOLUTION_BREACHED');
ALTER TABLE "AutomationRule" ALTER COLUMN "condition" TYPE "AutomationCondition_new" USING ("condition"::text::"AutomationCondition_new");
ALTER TYPE "AutomationCondition" RENAME TO "AutomationCondition_old";
ALTER TYPE "AutomationCondition_new" RENAME TO "AutomationCondition";
DROP TYPE "public"."AutomationCondition_old";
COMMIT;

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Notification_userId_idx" ON "Notification"("userId");

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
