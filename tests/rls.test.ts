import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { withTenantContext, forTenant } from "../src/lib/prisma";

describe("Part C: Multi-tenant Data Isolation", () => {
  test("withTenantContext rejects empty or missing organizationId", async () => {
    await assert.rejects(
      async () => {
        await withTenantContext("", async () => {});
      },
      {
        message: /Multi-tenant violation/,
      }
    );

    await assert.rejects(
      async () => {
        // @ts-expect-error test invalid input
        await withTenantContext(null, async () => {});
      },
      {
        message: /Multi-tenant violation/,
      }
    );
  });

  test("forTenant helper validates organizationId and provides scoped execution", async () => {
    const tenant = forTenant("org_acme_corp");
    assert.strictEqual(tenant.organizationId, "org_acme_corp");
    assert.strictEqual(typeof tenant.withContext, "function");

    assert.throws(
      () => {
        forTenant("   ");
      },
      {
        message: /Multi-tenant violation/,
      }
    );
  });
});
