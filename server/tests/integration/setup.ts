/**
 * Integration tests run against an isolated PostgreSQL database. This setup
 * refuses to run unless TEST_DATABASE_URL is explicitly provided and points at
 * a database whose name contains "test". It never falls back to the development
 * .env DATABASE_URL, so a missing or misconfigured value fails loudly instead of
 * touching the development database.
 *
 * It runs before any test module is imported, so modules that capture
 * process.env at import time (lib/jwt.ts captures JWT_SECRET, lib/prisma.ts
 * reads DATABASE_URL) observe these values.
 */

const testDatabaseUrl = process.env.TEST_DATABASE_URL;

if (!testDatabaseUrl) {
  throw new Error(
    "TEST_DATABASE_URL is not set. Integration tests require an explicit, " +
      "isolated test database (for example " +
      "postgresql://user:password@localhost:5433/ticketing_test). " +
      "Refusing to fall back to the development database."
  );
}

let databaseName: string;

try {
  databaseName = new URL(testDatabaseUrl).pathname.replace(/^\//, "");
} catch {
  throw new Error(
    "TEST_DATABASE_URL is not a valid connection URL. Refusing to run integration tests."
  );
}

if (!/test/i.test(databaseName)) {
  throw new Error(
    `Refusing to run integration tests against database "${databaseName}": ` +
      'the database name must contain "test" to be treated as isolated.'
  );
}

process.env.DATABASE_URL = testDatabaseUrl;
process.env.JWT_SECRET = "integration-test-only-jwt-secret";
process.env.NODE_ENV = "test";
process.env.CLIENT_URL = "http://localhost:5173";
process.env.PORT = "5000";
