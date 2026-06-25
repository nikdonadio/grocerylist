/**
 * helpers.ts
 * Minimal test utilities — no external dependencies required.
 */

export const BASE_URL = "http://localhost:3000/dev";

// Unique token per test run so each run starts with a clean slate
export const TEST_TOKEN = `test-${Date.now()}`;

// ─── Colours ────────────────────────────────────────────────────────────────
const GREEN = "\x1b[32m";
const RED = "\x1b[31m";
const YELLOW = "\x1b[33m";
const RESET = "\x1b[0m";
const BOLD = "\x1b[1m";

export function green(s: string) { return `${GREEN}${s}${RESET}`; }
export function red(s: string)   { return `${RED}${s}${RESET}`; }
export function yellow(s: string){ return `${YELLOW}${s}${RESET}`; }
export function bold(s: string)  { return `${BOLD}${s}${RESET}`; }

// ─── Assertion ──────────────────────────────────────────────────────────────
let passed = 0;
let failed = 0;

export function assert(label: string, condition: boolean, extra?: unknown): void {
  if (condition) {
    console.log(green("  ✓") + " " + label);
    passed++;
  } else {
    console.log(red("  ✗") + " " + label);
    if (extra !== undefined) console.log(red("    Got:"), JSON.stringify(extra, null, 2));
    failed++;
  }
}

export function assertEqual<T>(label: string, actual: T, expected: T): void {
  assert(label, actual === expected, { actual, expected });
}

export function assertExists(label: string, value: unknown): void {
  assert(label, value !== undefined && value !== null, value);
}

export function section(name: string): void {
  console.log("\n" + bold(yellow(`▶ ${name}`)));
}

export function summary(): { passed: number; failed: number } {
  console.log("\n" + "─".repeat(40));
  if (failed === 0) {
    console.log(green(bold(`ALL TESTS PASSED (${passed}/${passed + failed})`)));
  } else {
    console.log(red(bold(`FAILURES: ${failed} failed, ${passed} passed`)));
  }
  return { passed, failed };
}

// ─── HTTP helpers ────────────────────────────────────────────────────────────
export async function api(
  method: string,
  path: string,
  body?: object
): Promise<{ status: number; data: unknown }> {
  const url = `${BASE_URL}${path}`;
  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let data: unknown;
  try { data = JSON.parse(text); } catch { data = text; }
  return { status: res.status, data };
}
