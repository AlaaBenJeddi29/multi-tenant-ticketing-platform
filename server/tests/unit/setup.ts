/**
 * Unit tests must never touch PostgreSQL, HTTP, or cron. These variables exist
 * only so that modules reading process.env at import time (for example
 * lib/jwt.ts captures JWT_SECRET when it loads) have a value to read before the
 * unit under test is imported. All values are throwaway test values and none of
 * them are real credentials.
 */
process.env.NODE_ENV = "test";
process.env.PORT = "5000";
process.env.CLIENT_URL = "http://localhost:5173";
process.env.JWT_SECRET = "unit-test-only-jwt-secret";
process.env.DATABASE_URL = "postgresql://unit:unit@localhost:5432/unit-test-unused";
