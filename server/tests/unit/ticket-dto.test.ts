import { describe, expect, it } from "vitest";

import { createTicketSchema } from "../../src/modules/tickets/dto/create-ticket.dto.js";
import { listTicketsQuerySchema } from "../../src/modules/tickets/dto/list-tickets.dto.js";

const VALID_CUID = "ckl9k2n8v0000qzrmn831i7rn";
const INVALID_CUID = "abc123";

describe("createTicketSchema", () => {
  it("rejects a title shorter than 3 characters", () => {
    const result = createTicketSchema.safeParse({
      title: "ab",
      priorityId: VALID_CUID,
      categoryId: VALID_CUID,
      requesterId: VALID_CUID,
    });

    expect(result.success).toBe(false);
  });

  it("rejects identifiers that are not CUIDs", () => {
    const result = createTicketSchema.safeParse({
      title: "Printer is offline",
      priorityId: INVALID_CUID,
      categoryId: VALID_CUID,
      requesterId: VALID_CUID,
    });

    expect(result.success).toBe(false);
  });

  it("accepts a valid payload", () => {
    const result = createTicketSchema.safeParse({
      title: "Printer is offline",
      priorityId: VALID_CUID,
      categoryId: VALID_CUID,
      requesterId: VALID_CUID,
    });

    expect(result.success).toBe(true);
  });
});

describe("listTicketsQuerySchema", () => {
  it("applies defaults when no query parameters are provided", () => {
    const parsed = listTicketsQuerySchema.parse({});

    expect(parsed.page).toBe(1);
    expect(parsed.pageSize).toBe(8);
    expect(parsed.sortOrder).toBe("desc");
    expect(parsed.sortBy).toBe("createdAt");
  });

  it("coerces numeric strings into numbers", () => {
    const parsed = listTicketsQuerySchema.parse({ page: "2", pageSize: "10" });

    expect(parsed.page).toBe(2);
    expect(parsed.pageSize).toBe(10);
  });

  it("rejects a page size above the maximum of 100", () => {
    expect(listTicketsQuerySchema.safeParse({ pageSize: "101" }).success).toBe(
      false
    );
  });

  it("rejects a page number below the minimum of 1", () => {
    expect(listTicketsQuerySchema.safeParse({ page: "0" }).success).toBe(false);
  });
});
