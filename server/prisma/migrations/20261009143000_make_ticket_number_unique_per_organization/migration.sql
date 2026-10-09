-- DropIndex
DROP INDEX "Ticket_ticketNumber_key";

-- CreateIndex
CREATE UNIQUE INDEX "Ticket_organizationId_ticketNumber_key" ON "Ticket"("organizationId", "ticketNumber");
