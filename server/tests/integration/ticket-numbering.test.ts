import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import app from "../../src/app.js";
import { prisma } from "../../src/lib/prisma.js";
import { signAccessToken } from "../../src/lib/jwt.js";
import {
  cleanupOrganizations,
  createActiveSla,
  createOrgFixtures,
  uniqueSuffix,
  type OrgFixtures,
} from "./helpers/fixtures.js";

/**
 * Exercises the real per-organization ticket numbering: concurrent creations for
 * the same tenant must be serialized by the advisory lock so every ticket gets a
 * unique, consecutive number, and numbering must restart at 1 for each tenant.
 */
interface TicketBody {
  id: string;
  ticketNumber: number;
}

let fx: OrgFixtures;
let agent2: OrgFixtures;
let agent3: OrgFixtures;
let orgIds: string[];
let fxToken: string;
let agent2Token: string;
let agent3Token: string;

beforeAll(async () => {
  const run = uniqueSuffix();
  fx = await createOrgFixtures(`${run}-main`);
  agent2 = await createOrgFixtures(`${run}-iso-c`);
  agent3 = await createOrgFixtures(`${run}-iso-d`);
  orgIds = [fx.orgId, agent2.orgId, agent3.orgId];

  await Promise.all([
    createActiveSla(fx.orgId, fx.priorityId),
    createActiveSla(agent2.orgId, agent2.priorityId),
    createActiveSla(agent3.orgId, agent3.priorityId),
  ]);

  fxToken = signAccessToken({
    userId: fx.adminId,
    organizationId: fx.orgId,
    role: "ORG_ADMIN",
  });
  agent2Token = signAccessToken({
    userId: agent2.adminId,
    organizationId: agent2.orgId,
    role: "ORG_ADMIN",
  });
  agent3Token = signAccessToken({
    userId: agent3.adminId,
    organizationId: agent3.orgId,
    role: "ORG_ADMIN",
  });
});

afterAll(async () => {
  await cleanupOrganizations(orgIds);
  await prisma.$disconnect();
});

function postTicket(token: string, fxOrg: OrgFixtures, title: string) {
  return request(app)
    .post("/api/tickets")
    .set("Cookie", `accessToken=${token}`)
    .send({
      title,
      priorityId: fxOrg.priorityId,
      categoryId: fxOrg.categoryId,
      requesterId: fxOrg.requesterId,
    });
}

describe("ticket numbering under concurrency (integration)", () => {
  it("assigns unique, consecutive numbers to 8 concurrent creations in one organization", async () => {
    const CONCURRENCY = 8;

    const responses = await Promise.all(
      Array.from({ length: CONCURRENCY }, (_, i) =>
        postTicket(fxToken, fx, `Concurrent ${i}`)
      )
    );

    responses.forEach((res, i) => {
      expect(res.status, `request ${i}: ${JSON.stringify(res.body)}`).toBe(201);
    });

    const numbers = responses
      .map((res) => (res.body as TicketBody).ticketNumber)
      .sort((a, b) => a - b);

    expect(numbers).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);

    const stored = await prisma.ticket.count({
      where: { organizationId: fx.orgId },
    });
    expect(stored).toBe(CONCURRENCY);
  });

  it("numbers tickets independently per organization", async () => {
    const [resC, resD] = await Promise.all([
      postTicket(agent2Token, agent2, "Org C first"),
      postTicket(agent3Token, agent3, "Org D first"),
    ]);

    expect(resC.status).toBe(201);
    expect(resD.status).toBe(201);
    expect((resC.body as TicketBody).ticketNumber).toBe(1);
    expect((resD.body as TicketBody).ticketNumber).toBe(1);
  });
});
