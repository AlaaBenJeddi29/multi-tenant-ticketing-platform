-- CreateEnum
CREATE TYPE "AutomationTrigger" AS ENUM ('TICKET_CREATED', 'TICKET_UPDATED', 'COMMENT_CREATED', 'STATUS_CHANGED', 'SLA_BREACHED');

-- CreateEnum
CREATE TYPE "AutomationCondition" AS ENUM ('ALWAYS', 'PRIORITY_IS', 'STATUS_IS', 'CATEGORY_IS', 'ASSIGNED_AGENT_IS', 'REQUESTER_IS', 'RESPONSE_BREACHED', 'RESOLUTION_BREACHED');

-- CreateEnum
CREATE TYPE "AutomationAction" AS ENUM ('ASSIGN_AGENT', 'CHANGE_PRIORITY', 'CHANGE_STATUS', 'ADD_INTERNAL_COMMENT', 'SEND_NOTIFICATION');

-- CreateTable
CREATE TABLE "AutomationRule" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "trigger" "AutomationTrigger" NOT NULL,
    "condition" "AutomationCondition" NOT NULL,
    "conditionValue" TEXT,
    "action" "AutomationAction" NOT NULL,
    "actionValue" TEXT,
    "organizationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AutomationRule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AutomationRule_organizationId_idx" ON "AutomationRule"("organizationId");

-- CreateIndex
CREATE INDEX "AutomationRule_trigger_idx" ON "AutomationRule"("trigger");

-- AddForeignKey
ALTER TABLE "AutomationRule" ADD CONSTRAINT "AutomationRule_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
