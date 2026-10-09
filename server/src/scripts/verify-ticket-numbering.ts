import "dotenv/config";
import assert from "node:assert/strict";

import { prisma } from "../lib/prisma.js";
import { createTicketWithNextNumber } from "../modules/tickets/repositories/ticket.repository.js";
import type { Prisma } from "../generated/prisma/client.js";

/**
 * Verification for P0: per-organization ticket numbering under concurrency.
 *
 * Run with: npx tsx src/scripts/verify-ticket-numbering.ts
 * Requires DATABASE_URL and the composite (organizationId, ticketNumber)
 * unique index from migration 20261009143000.
 *
 * Creates isolated fixtures tagged with a run id and removes them in a finally
 * block, so it is safe to run against the local development database.
 */

const RUN_ID = Date.now().toString(36);

type Fixtures = {
  org: { id: string };
  user: { id: string };
  category: { id: string };
  priority: { id: string };
  requester: { id: string };
};

async function createFixtures(suffix: string): Promise<Fixtures> {
  const org = await prisma.organization.create({
    data: {
      name: `P0 Verify ${suffix}`,
      slug: `p0-verify-${suffix}`,
    },
  });

  const user = await prisma.user.create({
    data: {
      firstName: "P0",
      lastName: "Verify",
      email: `p0-verify-${suffix}@example.com`,
      passwordHash: "not-a-real-hash",
      role: "ORG_ADMIN",
      organizationId: org.id,
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
      firstName: "P0",
      lastName: "Requester",
      email: `p0-req-${suffix}@example.com`,
      organizationId: org.id,
    },
  });

  return { org, user, category, priority, requester };
}

function ticketInput(
  f: Fixtures,
  title: string
): (ticketNumber: number) => Prisma.TicketCreateInput {
  return (ticketNumber) => ({
    ticketNumber,
    title,
    status: "NEW",
    source: "INTERNAL",
    responseDueAt: new Date(),
    resolutionDueAt: new Date(),
    organization: { connect: { id: f.org.id } },
    createdBy: { connect: { id: f.user.id } },
    priority: { connect: { id: f.priority.id } },
    category: { connect: { id: f.category.id } },
    requester: { connect: { id: f.requester.id } },
  });
}

async function cleanup(orgIds: string[]) {
  if (orgIds.length === 0) return;

  const where = { organizationId: { in: orgIds } };

  // Tickets first: Ticket -> Organization FK is RESTRICT.
  await prisma.ticket.deleteMany({ where });
  await prisma.requester.deleteMany({ where });
  await prisma.priority.deleteMany({ where });
  await prisma.category.deleteMany({ where });
  await prisma.user.deleteMany({ where });
  await prisma.organization.deleteMany({ where: { id: { in: orgIds } } });
}

async function main() {
  const createdOrgIds: string[] = [];

  try {
    // --- Test 1: composite uniqueness is enforced by the database ---
    const f1 = await createFixtures(`${RUN_ID}-constraint`);
    createdOrgIds.push(f1.org.id);

    await createTicketWithNextNumber(f1.org.id, ticketInput(f1, "first"));

    let backstopTriggered = false;
    try {
      // Bypass the allocator and force a duplicate number for the same org.
      await prisma.ticket.create({
        data: ticketInput(f1, "duplicate")(1),
      });
    } catch (error: unknown) {
      backstopTriggered =
        typeof error === "object" &&
        error !== null &&
        (error as { code?: string }).code === "P2002";
    }
    assert.equal(
      backstopTriggered,
      true,
      "Expected a P2002 unique violation when inserting a duplicate (organizationId, ticketNumber)"
    );

    // --- Test 2: numbering is independent per organization (both start at 1) ---
    const fA = await createFixtures(`${RUN_ID}-a`);
    const fB = await createFixtures(`${RUN_ID}-b`);
    createdOrgIds.push(fA.org.id, fB.org.id);

    const firstA = await createTicketWithNextNumber(fA.org.id, ticketInput(fA, "A #1"));
    const firstB = await createTicketWithNextNumber(fB.org.id, ticketInput(fB, "B #1"));

    assert.equal(firstA.ticketNumber, 1, "Org A first ticket should be #1");
    assert.equal(firstB.ticketNumber, 1, "Org B first ticket should be #1");

    // --- Test 3: concurrent allocations within one organization are unique ---
    const fC = await createFixtures(`${RUN_ID}-c`);
    createdOrgIds.push(fC.org.id);

    const N = 8;
    const created = await Promise.all(
      Array.from({ length: N }, (_, i) =>
        createTicketWithNextNumber(fC.org.id, ticketInput(fC, `C-${i}`))
      )
    );

    const numbers = created.map((t) => t.ticketNumber).sort((a, b) => a - b);
    const expected = Array.from({ length: N }, (_, i) => i + 1);
    assert.deepEqual(
      numbers,
      expected,
      `Concurrent allocations must be exactly ${expected.join(",")}, got ${numbers.join(",")}`
    );

    // --- Test 4: concurrent allocations across organizations don't interfere ---
    const fD = await createFixtures(`${RUN_ID}-d`);
    const fE = await createFixtures(`${RUN_ID}-e`);
    createdOrgIds.push(fD.org.id, fE.org.id);

    const M = 4;
    const mixed = await Promise.all([
      ...Array.from({ length: M }, (_, i) =>
        createTicketWithNextNumber(fD.org.id, ticketInput(fD, `D-${i}`))
      ),
      ...Array.from({ length: M }, (_, i) =>
        createTicketWithNextNumber(fE.org.id, ticketInput(fE, `E-${i}`))
      ),
    ]);

    const dNumbers = mixed
      .slice(0, M)
      .map((t) => t.ticketNumber)
      .sort((a, b) => a - b);
    const eNumbers = mixed
      .slice(M)
      .map((t) => t.ticketNumber)
      .sort((a, b) => a - b);

    assert.deepEqual(dNumbers, [1, 2, 3, 4], `Org D expected 1..4, got ${dNumbers.join(",")}`);
    assert.deepEqual(eNumbers, [1, 2, 3, 4], `Org E expected 1..4, got ${eNumbers.join(",")}`);

    console.log("PASS: all ticket-numbering checks passed");
    console.log(`  - composite (organizationId, ticketNumber) unique index enforced`);
    console.log(`  - per-org independence: A#${firstA.ticketNumber}, B#${firstB.ticketNumber}`);
    console.log(`  - ${N} concurrent same-org allocations -> ${numbers.join(",")}`);
    console.log(`  - cross-org concurrent: D -> ${dNumbers.join(",")}, E -> ${eNumbers.join(",")}`);
  } finally {
    await cleanup(createdOrgIds);
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error("FAIL:", error);
  process.exit(1);
});
