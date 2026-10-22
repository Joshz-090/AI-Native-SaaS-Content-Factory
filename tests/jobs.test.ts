import { test, describe } from "node:test";
import assert from "node:assert/strict";
import {
  createAndProcessJob,
  getJobById,
  getAllRecentJobs,
} from "../src/lib/jobs";
import { dispatchContentJob } from "../src/lib/queue";

describe("Part F: Background Jobs and Worker Reliability", () => {
  test("createAndProcessJob requires organizationId", async () => {
    await assert.rejects(
      async () => {
        await createAndProcessJob({
          organizationId: "",
          topic: "Enterprise AI Security",
        });
      },
      {
        message: /Multi-tenant violation/,
      }
    );
  });

  test("dispatches and tracks job progression", async () => {
    const job = await dispatchContentJob({
      organizationId: "org_acme_media",
      topic: "Zero-Trust Architecture",
      tone: "Executive Briefing",
    });

    assert.ok(job.id.startsWith("job_"));
    assert.strictEqual(job.organizationId, "org_acme_media");
    assert.strictEqual(job.topic, "Zero-Trust Architecture");
    assert.ok(["PENDING", "PROCESSING", "COMPLETED"].includes(job.status));
  });

  test("Strict cross-tenant job isolation (Anti-leakage invariant)", async () => {
    const jobA = await createAndProcessJob({
      organizationId: "tenant_alpha",
      topic: "Confidential Alpha Product Launch",
    });

    // Tenant Alpha can access their own job
    const fetchSelf = getJobById(jobA.id, "tenant_alpha");
    assert.ok(fetchSelf !== null);
    assert.strictEqual(fetchSelf.id, jobA.id);

    // Tenant Beta MUST NOT be able to access Tenant Alpha's job
    const crossTenantFetch = getJobById(jobA.id, "tenant_beta");
    assert.strictEqual(crossTenantFetch, null);

    // getAllRecentJobs for Tenant Beta must not leak Tenant Alpha's jobs
    const betaJobs = getAllRecentJobs("tenant_beta");
    assert.strictEqual(betaJobs.some((j) => j.id === jobA.id), false);
  });
});
