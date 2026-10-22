import { test, describe } from "node:test";
import assert from "node:assert/strict";
import {
  checkQuota,
  reserveCredits,
  refundCredits,
  getQuotaBalance,
} from "../src/lib/quota";

describe("Part I: Security, Quotas, and Cost Governance", () => {
  const TEST_ORG = `test_quota_org_${Date.now()}`;

  test("Initializes with standard dev credit allowance", async () => {
    const balance = await getQuotaBalance(TEST_ORG);
    assert.strictEqual(balance, 50000);
  });

  test("Atomically reserves credits and decrements balance", async () => {
    const hasEnough = await checkQuota(TEST_ORG, 1000);
    assert.strictEqual(hasEnough, true);

    const reserved = await reserveCredits(TEST_ORG, 1000);
    assert.strictEqual(reserved, true);

    const balanceAfter = await getQuotaBalance(TEST_ORG);
    assert.strictEqual(balanceAfter, 49000);
  });

  test("Refunds unused credits back into organization bucket", async () => {
    await refundCredits(TEST_ORG, 500);
    const balance = await getQuotaBalance(TEST_ORG);
    assert.strictEqual(balance, 49500);
  });

  test("Rejects reservation when quota is exceeded", async () => {
    const EXCESSIVE_AMOUNT = 100000;
    const canReserve = await reserveCredits(TEST_ORG, EXCESSIVE_AMOUNT);
    assert.strictEqual(canReserve, false);
  });
});
