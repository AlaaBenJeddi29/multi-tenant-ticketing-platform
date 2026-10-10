import { defineConfig } from "vitest/config";

/**
 * Integration tests exercise the real Express app against an isolated
 * PostgreSQL database. This configuration is intentionally separate from
 * vitest.config.ts so the unit suite keeps its in-memory, dependency-free
 * setup and never shares the integration environment.
 *
 * fileParallelism is disabled because every file mutates the shared test
 * database with its own fixtures; running files one at a time avoids fixture
 * creation and cleanup races.
 */
export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/integration/**/*.test.ts"],
    setupFiles: ["./tests/integration/setup.ts"],
    fileParallelism: false,
    hookTimeout: 30_000,
    testTimeout: 30_000,
  },
});
