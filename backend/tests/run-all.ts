/**
 * run-all.ts
 * Sequential integration test runner.
 * Each file runs with its own isolated TEST_TOKEN so they don't interfere.
 *
 * Usage:
 *   npx ts-node tests/run-all.ts
 *
 * Prerequisites:
 *   - DynamoDB Local running on :8000
 *   - serverless offline running on :3000
 */

import { execSync } from "child_process";
import path from "path";

const GREEN = "\x1b[32m";
const RED   = "\x1b[31m";
const BOLD  = "\x1b[1m";
const RESET = "\x1b[0m";

const TEST_FILES = [
  "01-getList.ts",
  "02-addItem.ts",
  "03-updateItem.ts",
  "04-deleteItem.ts",
];

const results: Array<{ file: string; passed: boolean; output: string }> = [];

console.log(`\n${BOLD}╔════════════════════════════════════════╗${RESET}`);
console.log(`${BOLD}║     GROCERY LIST — INTEGRATION TESTS   ║${RESET}`);
console.log(`${BOLD}╚════════════════════════════════════════╝${RESET}\n`);

for (const file of TEST_FILES) {
  const filePath = path.join(__dirname, file);
  console.log(`\n${"─".repeat(44)}`);
  console.log(`${BOLD}Running: ${file}${RESET}`);
  console.log("─".repeat(44));

  try {
    const output = execSync(
      `npx ts-node --project tsconfig.json "${filePath}"`,
      {
        cwd: path.join(__dirname, ".."),
        encoding: "utf-8",
        // Don't throw on non-zero exit — we capture it below
        stdio: ["pipe", "pipe", "pipe"],
      }
    );
    console.log(output);
    results.push({ file, passed: true, output });
  } catch (err: unknown) {
    const e = err as { stdout?: string; stderr?: string };
    const out = (e.stdout ?? "") + (e.stderr ?? "");
    console.log(out);
    results.push({ file, passed: false, output: out });
  }
}

// ── Final summary ────────────────────────────────────────────────────────────
console.log(`\n${"═".repeat(44)}`);
console.log(`${BOLD}FINAL SUMMARY${RESET}`);
console.log("═".repeat(44));

let allPassed = true;
for (const r of results) {
  const icon  = r.passed ? `${GREEN}✓${RESET}` : `${RED}✗${RESET}`;
  const label = r.passed ? `${GREEN}PASS${RESET}` : `${RED}FAIL${RESET}`;
  console.log(`  ${icon}  ${r.file.padEnd(25)} ${label}`);
  if (!r.passed) allPassed = false;
}

console.log();
if (allPassed) {
  console.log(`${GREEN}${BOLD}ALL SUITES PASSED ✓${RESET}`);
  process.exit(0);
} else {
  console.log(`${RED}${BOLD}SOME SUITES FAILED ✗${RESET}`);
  process.exit(1);
}
