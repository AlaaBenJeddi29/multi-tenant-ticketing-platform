import { prisma } from "../../../src/lib/prisma.js";

/**
 * Fixture helpers for integration tests.
 *
 * Every fixture is tagged with a unique suffix so that repeated runs never
 * collide on the unique constraints (organization slug, user email, requester
 * email, asset tag). Tests only ever clean up the organizations they created,
 * via cleanupOrganizations, which deletes dependents in foreign-key-safe order.
 */

export function uniqueSuffix(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export interface OrgFixtures {
  orgId: string;
  adminId: string;
  agentId: string;
  inactiveAgentId: string;
  categoryId: string;
  priorityId: string;
  requesterId: string;
  assetId: string;
}

export async function createOrgFixtures(suffix: string): Promise<OrgFixtures> {
  const org = await prisma.organization.create({
    data: { name: `IT ${suffix}`, slug: `it-${suffix}` },
  });

  const admin = await prisma.user.create({
    data: {
      firstName: "IT",
      lastName: "Admin",
      email: `it-admin-${suffix}@example.com`,
      passwordHash: "not-a-real-hash",
      role: "ORG_ADMIN",
      organizationId: org.id,
    },
  });

  const agent = await prisma.user.create({
    data: {
      firstName: "IT",
      lastName: "Agent",
      email: `it-agent-${suffix}@example.com`,
      passwordHash: "not-a-real-hash",
      role: "AGENT",
      organizationId: org.id,
    },
  });

  const inactiveAgent = await prisma.user.create({
    data: {
      firstName: "IT",
      lastName: "Inactive",
      email: `it-inactive-${suffix}@example.com`,
      passwordHash: "not-a-real-hash",
      role: "AGENT",
      organizationId: org.id,
      isActive: false,
    },
  });

  const category = await prisma.category.create({
    data: { name: "General", organizationId: org.id },
  });

  const priority = await prisma.priority.create({
    data: {
      name: "Normal",
      level: "MEDIUM",
      color: "#888888",
      organizationId: org.id,
    },
  });

  const requester = await prisma.requester.create({
    data: {
      firstName: "IT",
      lastName: "Requester",
      email: `it-req-${suffix}@example.com`,
      organizationId: org.id,
    },
  });

  const asset = await prisma.asset.create({
    data: { name: "Laptop", assetTag: `IT-TAG-${suffix}`, organizationId: org.id },
  });

  return {
    orgId: org.id,
    adminId: admin.id,
    agentId: agent.id,
    inactiveAgentId: inactiveAgent.id,
    categoryId: category.id,
    priorityId: priority.id,
    requesterId: requester.id,
    assetId: asset.id,
  };
}

/**
 * An active SLA is required for ticket creation (the service rejects a priority
 * without one). Sla.priorityId is unique, so at most one per priority.
 */
export async function createActiveSla(orgId: string, priorityId: string) {
  return prisma.sla.create({
    data: {
      name: "Standard",
      responseTimeMinutes: 60,
      resolutionTimeMinutes: 480,
      organizationId: orgId,
      priorityId,
    },
  });
}

/**
 * Deletes only the records belonging to the given organizations, in an order
 * that respects the schema's foreign keys (no cascade exists from Ticket to
 * User/Priority/Category/Requester/Asset, so tickets must go first).
 */
export async function cleanupOrganizations(orgIds: string[]): Promise<void> {
  if (orgIds.length === 0) {
    return;
  }

  const orgScope = { organizationId: { in: orgIds } };

  await prisma.notification.deleteMany({
    where: { user: { organizationId: { in: orgIds } } },
  });
  await prisma.ticketComment.deleteMany({
    where: { ticket: { organizationId: { in: orgIds } } },
  });
  await prisma.automationExecution.deleteMany({
    where: { ticket: { organizationId: { in: orgIds } } },
  });
  await prisma.ticket.deleteMany({ where: orgScope });
  await prisma.sla.deleteMany({ where: orgScope });
  await prisma.requester.deleteMany({ where: orgScope });
  await prisma.asset.deleteMany({ where: orgScope });
  await prisma.priority.deleteMany({ where: orgScope });
  await prisma.category.deleteMany({ where: orgScope });
  await prisma.refreshToken.deleteMany({
    where: { user: { organizationId: { in: orgIds } } },
  });
  await prisma.user.deleteMany({ where: orgScope });
  await prisma.organization.deleteMany({ where: { id: { in: orgIds } } });
}
