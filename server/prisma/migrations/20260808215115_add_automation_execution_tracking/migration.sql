-- CreateTable
CREATE TABLE "AutomationExecution" (
    "id" TEXT NOT NULL,
    "ticketId" TEXT NOT NULL,
    "automationRuleId" TEXT NOT NULL,
    "trigger" "AutomationTrigger" NOT NULL,
    "executedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AutomationExecution_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AutomationExecution_ticketId_idx" ON "AutomationExecution"("ticketId");

-- CreateIndex
CREATE INDEX "AutomationExecution_automationRuleId_idx" ON "AutomationExecution"("automationRuleId");

-- CreateIndex
CREATE UNIQUE INDEX "AutomationExecution_ticketId_automationRuleId_trigger_key" ON "AutomationExecution"("ticketId", "automationRuleId", "trigger");

-- AddForeignKey
ALTER TABLE "AutomationExecution" ADD CONSTRAINT "AutomationExecution_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "Ticket"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AutomationExecution" ADD CONSTRAINT "AutomationExecution_automationRuleId_fkey" FOREIGN KEY ("automationRuleId") REFERENCES "AutomationRule"("id") ON DELETE CASCADE ON UPDATE CASCADE;
