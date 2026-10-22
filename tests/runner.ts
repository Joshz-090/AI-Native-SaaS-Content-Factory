import { run } from "node:test";
import { spec } from "node:test/reporters";
import fs from "node:fs";
import path from "node:path";

function findTests(dir: string): string[] {
  const files: string[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...findTests(fullPath));
    } else if (entry.name.endsWith(".test.ts")) {
      files.push(fullPath);
    }
  }
  return files;
}

const testFiles = findTests(__dirname);

const testStream = run({ files: testFiles });
testStream.compose(new spec()).pipe(process.stdout);

testStream.on("test:fail", () => {
  process.exitCode = 1;
});
