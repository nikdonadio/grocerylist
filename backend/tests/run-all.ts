/**
 * run-all.ts
 * Sequential integration test runner.
 *
 * Usage:
 *   npx ts-node tests/run-all.ts
 *
 * Prerequisites:
 *   - DynamoDB Local running on :8000
 *   - serverless offline running on :3000
 *
 * Note: On Windows, Node.js/libuv may emit a UV_HANDLE_CLOSING assertion error
 * when a child process exits while DynamoDB HTTP connections are still open.
 * This is a known Windows bug — it does NOT indicate test failure. The runner
 * detects actual pass/fail by reading "ALL TESTS PASSED" in stdout, NOT the
 * child process exit code.
 */

import { spawnSync } from "child_process";
import path from "path";

const GREEN  = "\x1b[32m";
const RED    = "\x1b[31m";
const YELLOW = "\x1b[33m";
const BOLD   = "\x1b[1m";
const RESET  = "\x1b[0m";

const TEST_FILES = [
  "01-getList.ts",
  "02-addItem.ts",
  "03-updateItem.ts",
  "04-deleteItem.ts",
];

const results: Array<{ file: string; passed: boolean; output: string }> = [];

console.log(`\n${BOLD}╔════════════════════════════════════════════╗${RESET}`);
console.log(`${BOLD}║      GROCERY LIST — INTEGRATION TESTS      ║${RESET}`);
console.log(`${BOLD}╚════════════════════════════════════════════╝${RESET}\n`);

for (const file of TEST_FILES) {
  const filePath = path.join(__dirname, file);

  console.log(`\n${"─".repeat(44)}`);
  console.log(`${BOLD}Running: ${file}${RESET}`);
  console.log("─".repeat(44));

  const result = spawnSync(
    "npx ts-node --project tsconfig.json \"" + filePath + "\"",
    [],
    {
      cwd: path.join(__dirname, ".."),
      encoding: "utf-8",
      shell: true,
      stdio: ["pipe", "pipe", "pipe"],
      timeout: 30_000,
    }
  );

  const stdout = result.stdout ?? "";
  const stderr = result.stderr ?? "";

  if (stdout) process.stdout.write(stdout);

  // Only surface stderr if it contains something beyond the known
  // Windows libuv assertion crash (noise, not a real error).
  const meaningfulStderr = stderr
    .split("\n")
    .filter(line => !line.includes("UV_HANDLE_CLOSING") && line.trim() !== "")
    .join("\n");

  if (meaningfulStderr) {
    process.stderr.write(`${YELLOW}[stderr]${RESET}\n${meaningfulStderr}\n`);
  }

  // Determine pass/fail by reading the output, NOT the exit code.
  // The exit code is unreliable on Windows due to the libuv crash.
  const passed = stdout.includes("ALL TESTS PASSED");

  results.push({ file, passed, output: stdout + stderr });
}

// ── Final summary ─────────────────────────────────────────────────────────────
console.log(`\n${"═".repeat(44)}`);
console.log(`${BOLD}FINAL SUMMARY${RESET}`);
console.log("═".repeat(44));

let allPassed = true;
for (const r of results) {
  const icon  = r.passed ? `${GREEN}✓${RESET}` : `${RED}✗${RESET}`;
  const label = r.passed ? `${GREEN}PASS${RESET}` : `${RED}FAIL${RESET}`;
  console.log(`  ${icon}  ${r.file.padEnd(28)} ${label}`);
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
