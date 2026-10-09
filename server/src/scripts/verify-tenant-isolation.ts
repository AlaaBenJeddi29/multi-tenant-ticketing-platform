import "dotenv/config";
import assert from "node:assert/strict";

import { prisma } from "../lib/prisma.js";
import { AppError } from "../lib/AppError.js";

import {
  createNewTicket,
  editTicket,
  assignTicket,
} from "../modules/tickets/services/ticket.service.js";

import {
  editComment,
  removeComment,
} from "../modules/comments/services/comment.service.js";

import { createNewNotification } from "../modules/notifications/services/notification.service.js";

import notificationRouter from "../modules/notifications/routes/notification.routes.js";

/**
 * Verification for the F1/F2/F3 multi-tenant isolation fixes.
 *
 * Run with: npx tsx src/scripts/verify-tenant-isolation.ts
 *
 * Covers:
 *  - F1: cross-tenant comment edit/delete must fail (404), same-tenant must work.
 *  - F2: cross-tenant / invalid ticket relations (priority, category, requester,
 *        asset, assignee) must be rejected (400); same-tenant must work.
 *  - F3: the public POST /api/notifications route must not be registered, while
 *        internal notification creation still works.
 *
 * Creates isolated fixtures tagged with a run id and removes only those records
 * in a finally block, so it is safe against the local development database.
 */

const RUN_ID = Date.now().toString(36);

type OrgFixtures = {
  org: { id: string };
  admin: { id: string };
  agent: { id: string };
  inactiveAgent: { id: string };
  category: { id: string };
  category2: { id: string };
  priority: { id: string };
  requester: { id: string };
  asset: { id: string };
};

async function createOrgFixtures(suffix: string): Promise<OrgFixtures> {
  const org = await prisma.organization.create({
    data: { name: `Iso ${suffix}`, slug: `iso-${suffix}` },
  });

  const admin = await prisma.user.create({
    data: {
      firstName: "Iso",
      lastName: "Admin",
      email: `iso-admin-${suffix}@example.com`,
      passwordHash: "not-a-real-hash",
      role: "ORG_ADMIN",
      organizationId: org.id,
    },
  });

  const agent = await prisma.user.create({
    data: {
      firstName: "Iso",
      lastName: "Agent",
      email: `iso-agent-${suffix}@example.com`,
      passwordHash: "not-a-real-hash",
      role: "AGENT",
      organizationId: org.id,
    },
  });

  const inactiveAgent = await prisma.user.create({
    data: {
      firstName: "Iso",
      lastName: "Inactive",
      email: `iso-inactive-${suffix}@example.com`,
      passwordHash: "not-a-real-hash",
      role: "AGENT",
      organizationId: org.id,
      isActive: false,
    },
  });

  const category = await prisma.category.create({
    data: { name: "General", organizationId: org.id },
  });

  const category2 = await prisma.category.create({
    data: { name: "Second", organizationId: org.id },
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
      firstName: "Iso",
      lastName: "Requester",
      email: `iso-req-${suffix}@example.com`,
      organizationId: org.id,
    },
  });

  const asset = await prisma.asset.create({
    data: {
      name: "Laptop",
      assetTag: `TAG-${suffix}`,
      organizationId: org.id,
    },
  });

  return { org, admin, agent, inactiveAgent, category, category2, priority, requester, asset };
}

async function expectAppError(
  fn: () => Promise<unknown>,
  statusCode: number,
  forbiddenSubstring: string,
  label: string
) {
  let thrown: unknown = null;
  try {
    await fn();
  } catch (error) {
    thrown = error;
  }

  assert.ok(
    thrown instanceof AppError,
    `[${label}] expected an AppError, got: ${String(thrown)}`
  );

  const appError = thrown as AppError;
  assert.equal(
    appError.statusCode,
    statusCode,
    `[${label}] expected HTTP ${statusCode}, got ${appError.statusCode} ("${appError.message}")`
  );
  assert.ok(
    !appError.message.includes(forbiddenSubstring),
    `[${label}] error message must not disclose the other tenant's id`
  );
}

function routerSupportsMethod(router: unknown, method: string, path: string): boolean {
  const stack = (router as { stack?: Array<{ route?: { path?: string; methods?: Record<string, boolean> } }> }).stack ?? [];
  return stack.some(
    (layer) =>
      layer.route?.path === path && Boolean(layer.route?.methods?.[method])
  );
}

async function cleanup(orgIds: string[], userIds: string[]) {
  if (orgIds.length === 0) return;
  const orgWhere = { organizationId: { in: orgIds } };

  await prisma.ticketComment.deleteMany({
    where: { ticket: { organizationId: { in: orgIds } } },
  });
  await prisma.notification.deleteMany({
    where: { userId: { in: userIds } },
  });
  await prisma.ticket.deleteMany({ where: orgWhere });
  await prisma.sla.deleteMany({ where: orgWhere });
  await prisma.requester.deleteMany({ where: orgWhere });
  await prisma.asset.deleteMany({ where: orgWhere });
  await prisma.priority.deleteMany({ where: orgWhere });
  await prisma.category.deleteMany({ where: orgWhere });
  await prisma.user.deleteMany({ where: orgWhere });
  await prisma.organization.deleteMany({ where: { id: { in: orgIds } } });
}

async function main() {
  const createdOrgIds: string[] = [];
  const createdUserIds: string[] = [];

  try {
    const A = await createOrgFixtures(`${RUN_ID}-a`);
    const B = await createOrgFixtures(`${RUN_ID}-b`);
    createdOrgIds.push(A.org.id, B.org.id);
    createdUserIds.push(
      A.admin.id,
      A.agent.id,
      A.inactiveAgent.id,
      B.admin.id,
      B.agent.id,
      B.inactiveAgent.id
    );

    // An active SLA for A's priority so same-tenant ticket creation is allowed.
    await prisma.sla.create({
      data: {
        name: "Standard",
        responseTimeMinutes: 60,
        resolutionTimeMinutes: 480,
        organizationId: A.org.id,
        priorityId: A.priority.id,
      },
    });

    // ---------------------------------------------------------------------
    // F2: cross-tenant relations on ticket creation
    // ---------------------------------------------------------------------
    const validCreate = {
      title: "Valid ticket",
      priorityId: A.priority.id,
      categoryId: A.category.id,
      requesterId: A.requester.id,
    };

    await expectAppError(
      () => createNewTicket({ ...validCreate, priorityId: B.priority.id }, A.org.id, A.admin.id),
      400,
      B.priority.id,
      "create: foreign priority"
    );
    await expectAppError(
      () => createNewTicket({ ...validCreate, categoryId: B.category.id }, A.org.id, A.admin.id),
      400,
      B.category.id,
      "create: foreign category"
    );
    await expectAppError(
      () => createNewTicket({ ...validCreate, requesterId: B.requester.id }, A.org.id, A.admin.id),
      400,
      B.requester.id,
      "create: foreign requester"
    );
    await expectAppError(
      () => createNewTicket({ ...validCreate, assetId: B.asset.id }, A.org.id, A.admin.id),
      400,
      B.asset.id,
      "create: foreign asset"
    );
    await expectAppError(
      () => createNewTicket({ ...validCreate, assignedToId: B.agent.id }, A.org.id, A.admin.id),
      400,
      B.agent.id,
      "create: foreign assignee"
    );

    // Regression: same-tenant creation with all relations still works.
    const created = await createNewTicket(
      { ...validCreate, assetId: A.asset.id, assignedToId: A.agent.id },
      A.org.id,
      A.admin.id
    );
    assert.ok(created.id, "[create: same-tenant] expected a created ticket");
    console.log("OK  create: cross-tenant relations rejected, same-tenant creation works");

    // ---------------------------------------------------------------------
    // F2: cross-tenant relations on ticket edit
    // ---------------------------------------------------------------------
    const editTarget = await prisma.ticket.create({
      data: {
        ticketNumber: 900001,
        title: "Edit target",
        status: "NEW",
        source: "INTERNAL",
        responseDueAt: new Date(Date.now() + 60 * 60 * 1000),
        resolutionDueAt: new Date(Date.now() + 8 * 60 * 60 * 1000),
        organizationId: A.org.id,
        createdById: A.admin.id,
        priorityId: A.priority.id,
        categoryId: A.category.id,
        requesterId: A.requester.id,
      },
    });

    await expectAppError(
      () => editTicket(editTarget.id, A.org.id, { priorityId: B.priority.id }),
      400,
      B.priority.id,
      "edit: foreign priority"
    );
    await expectAppError(
      () => editTicket(editTarget.id, A.org.id, { categoryId: B.category.id }),
      400,
      B.category.id,
      "edit: foreign category"
    );
    await expectAppError(
      () => editTicket(editTarget.id, A.org.id, { requesterId: B.requester.id }),
      400,
      B.requester.id,
      "edit: foreign requester"
    );
    await expectAppError(
      () => editTicket(editTarget.id, A.org.id, { assetId: B.asset.id }),
      400,
      B.asset.id,
      "edit: foreign asset"
    );
    await expectAppError(
      () => editTicket(editTarget.id, A.org.id, { assignedToId: B.agent.id }),
      400,
      B.agent.id,
      "edit: foreign assignee"
    );

    // Regression: same-tenant edit works.
    await editTicket(editTarget.id, A.org.id, { categoryId: A.category2.id });
    const editedRow = await prisma.ticket.findUnique({ where: { id: editTarget.id } });
    assert.equal(
      editedRow?.categoryId,
      A.category2.id,
      "[edit: same-tenant] category should be updated"
    );
    console.log("OK  edit: cross-tenant relations rejected, same-tenant edit works");

    // ---------------------------------------------------------------------
    // F2: invalid / cross-tenant assignees
    // ---------------------------------------------------------------------
    await expectAppError(
      () => assignTicket(editTarget.id, A.org.id, { assignedToId: B.agent.id }),
      400,
      B.agent.id,
      "assign: foreign user"
    );
    await expectAppError(
      () => assignTicket(editTarget.id, A.org.id, { assignedToId: "ck_nonexistent_assignee_000" }),
      400,
      "ck_nonexistent_assignee_000",
      "assign: nonexistent user"
    );
    await expectAppError(
      () => assignTicket(editTarget.id, A.org.id, { assignedToId: A.inactiveAgent.id }),
      400,
      A.inactiveAgent.id,
      "assign: inactive same-tenant user"
    );

    // Regression: assigning to an active same-tenant agent works (and notifies).
    await assignTicket(editTarget.id, A.org.id, { assignedToId: A.agent.id });
    const assignedRow = await prisma.ticket.findUnique({ where: { id: editTarget.id } });
    assert.equal(
      assignedRow?.assignedToId,
      A.agent.id,
      "[assign: same-tenant] assignee should be set"
    );
    console.log("OK  assign: invalid/foreign assignees rejected, same-tenant assignment works");

    // ---------------------------------------------------------------------
    // F1: cross-tenant comment edit / delete
    // ---------------------------------------------------------------------
    const adminComment = await prisma.ticketComment.create({
      data: { content: "org A admin comment", ticketId: editTarget.id, authorId: A.admin.id },
    });

    await expectAppError(
      () => removeComment(adminComment.id, B.org.id, B.admin.id, "ORG_ADMIN"),
      404,
      B.org.id,
      "comment delete: other tenant"
    );
    const stillPresent = await prisma.ticketComment.findUnique({ where: { id: adminComment.id } });
    assert.ok(stillPresent, "[comment delete: other tenant] comment must NOT be deleted");

    await expectAppError(
      () => editComment(adminComment.id, B.org.id, B.admin.id, "ORG_ADMIN", { content: "hijacked" }),
      404,
      B.org.id,
      "comment edit: other tenant"
    );
    const notModified = await prisma.ticketComment.findUnique({ where: { id: adminComment.id } });
    assert.equal(
      notModified?.content,
      "org A admin comment",
      "[comment edit: other tenant] content must NOT be modified"
    );
    console.log("OK  comment: cross-tenant edit/delete rejected, target untouched");

    // Regression: same-tenant edit by author and same-tenant delete by admin work.
    const agentComment = await prisma.ticketComment.create({
      data: { content: "agent comment", ticketId: editTarget.id, authorId: A.agent.id },
    });

    await editComment(agentComment.id, A.org.id, A.agent.id, "AGENT", { content: "agent comment edited" });
    const editedComment = await prisma.ticketComment.findUnique({ where: { id: agentComment.id } });
    assert.equal(
      editedComment?.content,
      "agent comment edited",
      "[comment edit: same-tenant author] content should be updated"
    );

    await removeComment(agentComment.id, A.org.id, A.admin.id, "ORG_ADMIN");
    const deletedComment = await prisma.ticketComment.findUnique({ where: { id: agentComment.id } });
    assert.equal(
      deletedComment,
      null,
      "[comment delete: same-tenant admin] comment should be deleted"
    );
    console.log("OK  comment: same-tenant edit (author) and delete (admin) work");

    // ---------------------------------------------------------------------
    // F3: public notification creation removed, internal creation intact
    // ---------------------------------------------------------------------
    assert.equal(
      routerSupportsMethod(notificationRouter, "post", "/"),
      false,
      "[F3] POST /api/notifications must not be registered"
    );
    assert.equal(
      routerSupportsMethod(notificationRouter, "get", "/"),
      true,
      "[F3] GET /api/notifications must remain registered"
    );

    const before = await prisma.notification.count({ where: { userId: A.agent.id } });
    await createNewNotification({
      userId: A.agent.id,
      title: "Internal",
      message: "created internally by the ticket service",
    });
    const after = await prisma.notification.count({ where: { userId: A.agent.id } });
    assert.equal(
      after,
      before + 1,
      "[F3] internal notification creation must still persist"
    );
    console.log("OK  notifications: POST route removed, internal creation works");

    console.log("PASS: multi-tenant isolation checks passed");
  } finally {
    await cleanup(createdOrgIds, createdUserIds);
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error("FAIL:", error);
  process.exit(1);
});
