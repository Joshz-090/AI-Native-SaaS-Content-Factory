import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { hasRequiredRole, getSessionContext } from "../src/lib/auth";

describe("Part B: Authentication and Authorization", () => {
  describe("RBAC Role Hierarchy Verification", () => {
    test("ADMIN has access to ADMIN, EDITOR, and VIEWER operations", () => {
      assert.strictEqual(hasRequiredRole("ADMIN", "ADMIN"), true);
      assert.strictEqual(hasRequiredRole("ADMIN", "EDITOR"), true);
      assert.strictEqual(hasRequiredRole("ADMIN", "VIEWER"), true);
    });

    test("EDITOR has access to EDITOR and VIEWER, but NOT ADMIN operations", () => {
      assert.strictEqual(hasRequiredRole("EDITOR", "ADMIN"), false);
      assert.strictEqual(hasRequiredRole("EDITOR", "EDITOR"), true);
      assert.strictEqual(hasRequiredRole("EDITOR", "VIEWER"), true);
    });

    test("VIEWER has access only to VIEWER operations", () => {
      assert.strictEqual(hasRequiredRole("VIEWER", "ADMIN"), false);
      assert.strictEqual(hasRequiredRole("VIEWER", "EDITOR"), false);
      assert.strictEqual(hasRequiredRole("VIEWER", "VIEWER"), true);
    });
  });

  describe("Session Context Resolver", () => {
    test("Falls back to deterministic local dev organization when Clerk keys are not set", async () => {
      const originalPublishable = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
      const originalSecret = process.env.CLERK_SECRET_KEY;
      
      delete process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
      delete process.env.CLERK_SECRET_KEY;

      const context = await getSessionContext();
      assert.ok(context !== null);
      assert.strictEqual(context.isDevFallback, true);
      assert.strictEqual(typeof context.organizationId, "string");
      assert.ok(context.organizationId.length > 0);

      // Restore
      if (originalPublishable) process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = originalPublishable;
      if (originalSecret) process.env.CLERK_SECRET_KEY = originalSecret;
    });
  });
});
