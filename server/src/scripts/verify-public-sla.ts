import "dotenv/config";
import assert from "node:assert/strict";

import { prisma } from "../lib/prisma.js";
import { submitRequest } from "../modules/public/controllers/public.controller.js";

/**
 * Verification for P1: public submissions must get real SLA deadlines derived
 * from the organization's active SLA (matching the default priority), and a
 * documented fallback when no SLA matches. In both cases the deadlines must be
 * in the future so the SLA worker does not immediately mark the ticket breached.
 *
 * Run with: npx tsx src/scripts/verify-public-sla.ts
 *
 * Creates isolated fixtures tagged with a run id and removes them in a finally
 * block, so it is safe to run against the local development database.
 *
 * Why the worker is not invoked: processSlaAutomation() scans ALL organizations
 * and would mutate unrelated rows in the dev database. Instead we evaluate the
 * exact predicate the worker uses (automation-runtime.service.ts, response and
 * resolution breach queries) against our ticket only.
 */

const RUN_ID = Date.now().toString(36);

const DEFAULT_RESPONSE_MINUTES = 24 * 60;
const DEFAULT_RESOLUTION_MINUTES = 72 * 60;

type Fixtures = {
  org: { id: string; slug: string };
  user: { id: string };
};

function makeReq(slug: string, body: unknown) {
  return { body, params: { organizationSlug: slug } } as any;
}

function makeRes() {
  const res: any = { statusCode: 0, body: undefined };
  res.status = (code: number) => {
    res.statusCode = code;
    return res;
  };
  res.json = (payload: unknown) => {
    res.body = payload;
    return res;
  };
  return res;
}

async function createBaseFixtures(suffix: string): Promise<Fixtures> {
  const org = await prisma.organization.create({
    data: { name: `P1 Verify ${suffix}`, slug: `p1-verify-${suffix}` },
  });

  const user = await prisma.user.create({
    data: {
      firstName: "P1",
      lastName: "Verify",
      email: `p1-verify-${suffix}@example.com`,
      passwordHash: "not-a-real-hash",
      role: "ORG_ADMIN",
      organizationId: org.id,
    },
  });

  // Only active priority -> this is the "default priority" the controller picks.
  await prisma.priority.create({
    data: {
      name: "Normal",
      level: "MEDIUM",
      color: "#888888",
      organizationId: org.id,
    },
  });

  await prisma.category.create({
    data: { name: "General", organizationId: org.id },
  });

  return { org: { id: org.id, slug: org.slug }, user: { id: user.id } };
}

function bodyFor(tag: string) {
  return {
    firstName: "Public",
    lastName: "Requester",
    email: `p1-public-${tag}@example.com`,
    subject: `Subject for ${tag} public submission`,
    description: `This is a description for ${tag}, long enough to pass validation.`,
  };
}

async function submit(slug: string, tag: string) {
  const req = makeReq(slug, bodyFor(tag));
  const res = makeRes();
  let nextError: unknown = null;

  await submitRequest(req, res, (err: unknown) => {
    nextError = err;
  });

  return { res, nextError };
}

async function cleanup(orgIds: string[]) {
  if (orgIds.length === 0) return;
  const where = { organizationId: { in: orgIds } };

  await prisma.ticket.deleteMany({ where });
  await prisma.sla.deleteMany({ where });
  await prisma.requester.deleteMany({ where });
  await prisma.priority.deleteMany({ where });
  await prisma.category.deleteMany({ where });
  await prisma.user.deleteMany({ where });
  await prisma.organization.deleteMany({ where: { id: { in: orgIds } } });
}

function assertFutureAndNotBreached(
  ticket: { status: string; firstRespondedAt: Date | null; responseBreached: boolean; resolutionBreached: boolean; responseDueAt: Date; resolutionDueAt: Date },
  ref: number,
  expectedResponseMinutes: number,
  expectedResolutionMinutes: number,
  label: string
) {
  const now = new Date();

  assert.ok(
    ticket.responseDueAt.getTime() > now.getTime(),
    `[${label}] responseDueAt must be in the future`
  );
  assert.ok(
    ticket.resolutionDueAt.getTime() > now.getTime(),
    `[${label}] resolutionDueAt must be in the future`
  );

  const respMin = (ticket.responseDueAt.getTime() - ref) / 60000;
  const resMin = (ticket.resolutionDueAt.getTime() - ref) / 60000;
  const tol = 2; // minutes
  assert.ok(
    Math.abs(respMin - expectedResponseMinutes) < tol,
    `[${label}] response deadline expected ~${expectedResponseMinutes}min, got ${respMin.toFixed(1)}min`
  );
  assert.ok(
    Math.abs(resMin - expectedResolutionMinutes) < tol,
    `[${label}] resolution deadline expected ~${expectedResolutionMinutes}min, got ${resMin.toFixed(1)}min`
  );

  // Mirror processSlaAutomation() breach queries for this single ticket.
  const wouldFlagResponse =
    ticket.status === "NEW" &&
    ticket.firstRespondedAt === null &&
    ticket.responseBreached === false &&
    ticket.responseDueAt < now;
  const wouldFlagResolution =
    ticket.status !== "RESOLVED" &&
    ticket.status !== "CLOSED" &&
    ticket.resolutionBreached === false &&
    ticket.resolutionDueAt < now;

  assert.equal(wouldFlagResponse, false, `[${label}] ticket must not be immediately response-breached`);
  assert.equal(wouldFlagResolution, false, `[${label}] ticket must not be immediately resolution-breached`);
}

async function main() {
  const createdOrgIds: string[] = [];

  try {
    // --- Case A: organization HAS an active SLA for its default priority ---
    const fA = await createBaseFixtures(`${RUN_ID}-a`);
    createdOrgIds.push(fA.org.id);

    const priorityA = await prisma.priority.findFirstOrThrow({
      where: { organizationId: fA.org.id },
    });

    await prisma.sla.create({
      data: {
        name: "Standard",
        responseTimeMinutes: 60,
        resolutionTimeMinutes: 480,
        organizationId: fA.org.id,
        priorityId: priorityA.id,
      },
    });

    const refA = Date.now();
    const a = await submit(fA.org.slug, `${RUN_ID}-a`);
    assert.equal(a.nextError, null, `[A] controller must not error: ${String(a.nextError)}`);
    assert.equal(a.res.statusCode, 200, "[A] expected HTTP 200");
    assert.equal(a.res.body.success, true, "[A] expected success:true");

    const ticketA = await prisma.ticket.findFirstOrThrow({
      where: { organizationId: fA.org.id, ticketNumber: a.res.body.ticketNumber },
    });
    assertFutureAndNotBreached(ticketA, refA, 60, 480, "A");
    console.log(
      `Case A (SLA present): ticket #${ticketA.ticketNumber} response in ${((ticketA.responseDueAt.getTime() - refA) / 60000).toFixed(1)}min, resolution in ${((ticketA.resolutionDueAt.getTime() - refA) / 60000).toFixed(1)}min`
    );

    // --- Case B: organization has NO SLA -> documented fallback ---
    const fB = await createBaseFixtures(`${RUN_ID}-b`);
    createdOrgIds.push(fB.org.id);

    const refB = Date.now();
    const b = await submit(fB.org.slug, `${RUN_ID}-b`);
    assert.equal(b.nextError, null, `[B] controller must not error: ${String(b.nextError)}`);
    assert.equal(b.res.statusCode, 200, "[B] expected HTTP 200");

    const ticketB = await prisma.ticket.findFirstOrThrow({
      where: { organizationId: fB.org.id, ticketNumber: b.res.body.ticketNumber },
    });
    assertFutureAndNotBreached(
      ticketB,
      refB,
      DEFAULT_RESPONSE_MINUTES,
      DEFAULT_RESOLUTION_MINUTES,
      "B"
    );
    console.log(
      `Case B (no SLA): ticket #${ticketB.ticketNumber} response in ${((ticketB.responseDueAt.getTime() - refB) / 60000).toFixed(1)}min, resolution in ${((ticketB.resolutionDueAt.getTime() - refB) / 60000).toFixed(1)}min`
    );

    console.log("PASS: public SLA deadlines are correct and not immediately breached");
  } finally {
    await cleanup(createdOrgIds);
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error("FAIL:", error);
  process.exit(1);
});
