import { test, describe } from "node:test";
import assert from "node:assert/strict";

describe("Baseline Environment Sanity", () => {
  test("Node environment is active", () => {
    assert.ok(process.version.startsWith("v20"));
  });

  test("Module resolution works", () => {
    assert.strictEqual(typeof describe, "function");
  });
});
