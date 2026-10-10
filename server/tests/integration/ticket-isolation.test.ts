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
 * Verifies that tenant data cannot cross the organization boundary through the
 * real /api/tickets endpoints: reads, agent assignment scoping, and the
 * relation-ownership checks enforced on ticket creation.
 */
let A: OrgFixtures;
let B: OrgFixtures;

let aAdminToken: string;
let bAdminToken: string;
let aAgentToken: string;

interface TicketBody {
  id: string;
  ticketNumber: number;
}

beforeAll(async () => {
  const run = uniqueSuffix();
  A = await createOrgFixtures(`${run}-a`);
  B = await createOrgFixtures(`${run}-b`);

  // A's priority needs an active SLA so ticket creation succeeds.
  await createActiveSla(A.orgId, A.priorityId);

  aAdminToken = signAccessToken({
    userId: A.adminId,
    organizationId: A.orgId,
    role: "ORG_ADMIN",
  });
  bAdminToken = signAccessToken({
    userId: B.adminId,
    organizationId: B.orgId,
    role: "ORG_ADMIN",
  });
  aAgentToken = signAccessToken({
    userId: A.agentId,
    organizationId: A.orgId,
    role: "AGENT",
  });
});

afterAll(async () => {
  await cleanupOrganizations([A.orgId, B.orgId]);
  await prisma.$disconnect();
});

function createTicketInOrgA(
  title: string,
  overrides: Record<string, unknown> = {}
) {
  return request(app)
    .post("/api/tickets")
    .set("Cookie", `accessToken=${aAdminToken}`)
    .send({
      title,
      priorityId: A.priorityId,
      categoryId: A.categoryId,
      requesterId: A.requesterId,
      ...overrides,
    });
}

describe("multi-tenant ticket isolation (integration)", () => {
  it("lets Organization A read its own ticket", async () => {
    const created = await createTicketInOrgA("A private ticket");
    expect(created.status).toBe(201);
    const createdBody = created.body as TicketBody;

    const res = await request(app)
      .get(`/api/tickets/${createdBody.id}`)
      .set("Cookie", `accessToken=${aAdminToken}`);

    expect(res.status).toBe(200);
    expect((res.body as TicketBody).id).toBe(createdBody.id);
  });

  it("returns 404 when Organization B requests Organization A's ticket", async () => {
    const created = await createTicketInOrgA("Cross-tenant read target");
    const createdBody = created.body as TicketBody;

    const res = await request(app)
      .get(`/api/tickets/${createdBody.id}`)
      .set("Cookie", `accessToken=${bAdminToken}`);

    expect(res.status).toBe(404);
  });

  it("hides an unassigned ticket from an agent and reveals it once assigned", async () => {
    const created = await createTicketInOrgA("Agent scoping target");
    const createdBody = created.body as TicketBody;

    const beforeAssign = await request(app)
      .get(`/api/tickets/${createdBody.id}`)
      .set("Cookie", `accessToken=${aAgentToken}`);
    expect(beforeAssign.status).toBe(404);

    const assigned = await request(app)
      .patch(`/api/tickets/${createdBody.id}/assign`)
      .set("Cookie", `accessToken=${aAdminToken}`)
      .send({ assignedToId: A.agentId });
    expect(assigned.status).toBe(200);

    const afterAssign = await request(app)
      .get(`/api/tickets/${createdBody.id}`)
      .set("Cookie", `accessToken=${aAgentToken}`);
    expect(afterAssign.status).toBe(200);
    expect(
      (afterAssign.body as { assignedTo: { id: string } }).assignedTo.id
    ).toBe(A.agentId);
  });

  it("rejects a ticket created with another organization's requester", async () => {
    const res = await createTicketInOrgA("Foreign requester", {
      requesterId: B.requesterId,
    });

    expect(res.status).toBe(400);
    expect((res.body as { message: string }).message).toContain("requester");
  });

  it("rejects a ticket created with another organization's category", async () => {
    const res = await createTicketInOrgA("Foreign category", {
      categoryId: B.categoryId,
    });

    expect(res.status).toBe(400);
    expect((res.body as { message: string }).message).toContain("category");
  });

  it("rejects a ticket created with another organization's priority", async () => {
    const res = await createTicketInOrgA("Foreign priority", {
      priorityId: B.priorityId,
    });

    expect(res.status).toBe(400);
    expect((res.body as { message: string }).message).toContain("priority");
  });

  it("rejects a ticket created with another organization's asset", async () => {
    const res = await createTicketInOrgA("Foreign asset", {
      assetId: B.assetId,
    });

    expect(res.status).toBe(400);
    expect((res.body as { message: string }).message).toContain("asset");
  });

  it("rejects a ticket created with another organization's assignee", async () => {
    const res = await createTicketInOrgA("Foreign assignee", {
      assignedToId: B.agentId,
    });

    expect(res.status).toBe(400);
    expect((res.body as { message: string }).message).toContain("assignee");
  });
});
