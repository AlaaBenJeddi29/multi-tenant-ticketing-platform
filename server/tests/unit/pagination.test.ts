import { describe, expect, it } from "vitest";

import { buildMeta, getSkipTake } from "../../src/lib/pagination.js";

describe("getSkipTake", () => {
  it("returns zero skip on the first page", () => {
    expect(getSkipTake(1, 8)).toEqual({ skip: 0, take: 8 });
  });

  it("skips previous pages on a later page", () => {
    expect(getSkipTake(3, 10)).toEqual({ skip: 20, take: 10 });
  });

  it("handles the maximum page size boundary", () => {
    expect(getSkipTake(1, 100)).toEqual({ skip: 0, take: 100 });
  });
});

describe("buildMeta", () => {
  it("reports zero total pages when there are no records", () => {
    expect(buildMeta(0, 1, 8)).toEqual({
      page: 1,
      pageSize: 8,
      total: 0,
      totalPages: 0,
    });
  });

  it("rounds total pages up to include a partial page", () => {
    expect(buildMeta(9, 1, 8)).toEqual({
      page: 1,
      pageSize: 8,
      total: 9,
      totalPages: 2,
    });
  });

  it("returns exact page count when the total divides evenly", () => {
    expect(buildMeta(100, 3, 10)).toEqual({
      page: 3,
      pageSize: 10,
      total: 100,
      totalPages: 10,
    });
  });
});
