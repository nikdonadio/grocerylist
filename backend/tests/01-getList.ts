/**
 * 01-getList.ts
 * Tests the GET /list/{accessToken} endpoint.
 *
 * Scenarios:
 *  1. Fresh token → 200 with empty items array
 *  2. Missing token in URL → serverless returns 403 (no path match) — we document this
 */

import { api, TEST_TOKEN, section, assert, assertEqual, summary } from "./helpers";

async function run() {
  console.log("=".repeat(40));
  console.log("TEST FILE: 01-getList.ts");
  console.log("Token:", TEST_TOKEN);
  console.log("=".repeat(40));

  // ── 1. Fresh list returns 200 and empty items ──────────────────────────────
  section("GET /list/{token} — fresh token");
  {
    const { status, data } = await api("GET", `/list/${TEST_TOKEN}`);
    const body = data as { accessToken?: string; items?: unknown[] };

    assertEqual("Status is 200", status, 200);
    assertEqual("accessToken echoed back", body.accessToken, TEST_TOKEN);
    assert("items is an array", Array.isArray(body.items), body.items);
    assertEqual("items is empty", body.items?.length, 0);
  }

  // ── 2. Different token → different (also empty) list ──────────────────────
  section("GET /list/{token} — different token is isolated");
  {
    const otherToken = TEST_TOKEN + "-other";
    const { status, data } = await api("GET", `/list/${otherToken}`);
    const body = data as { accessToken?: string; items?: unknown[] };

    assertEqual("Status is 200", status, 200);
    assertEqual("accessToken matches other token", body.accessToken, otherToken);
    assertEqual("Other token list is also empty", body.items?.length, 0);
  }

  return summary();
}

run().then(({ failed }) => {
  process.exit(failed > 0 ? 1 : 0);
}).catch((err) => {
  console.error("\x1b[31mUnhandled error:\x1b[0m", err);
  process.exit(1);
});
