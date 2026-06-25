/**
 * 02-addItem.ts
 * Tests the POST /list/{accessToken}/items endpoint.
 *
 * Scenarios:
 *  1. Add a valid item → 201 + correct shape
 *  2. Add a second item → list now has 2 items in order
 *  3. Missing name → 400
 *  4. Empty name → 400
 */

import { api, TEST_TOKEN, section, assert, assertEqual, assertExists, summary } from "./helpers";

export let createdItemId: string | undefined;
export let secondItemId: string | undefined;

async function run() {
  console.log("=".repeat(40));
  console.log("TEST FILE: 02-addItem.ts");
  console.log("Token:", TEST_TOKEN);
  console.log("=".repeat(40));

  // ── 1. Add first valid item ────────────────────────────────────────────────
  section("POST /list/{token}/items — valid item");
  {
    const { status, data } = await api("POST", `/list/${TEST_TOKEN}/items`, { name: "Milk" });
    const body = data as Record<string, unknown>;

    assertEqual("Status is 201", status, 201);
    assertExists("itemId present", body.itemId);
    assertEqual("name matches", body.name as string, "Milk");
    assertEqual("checked is false", body.checked as boolean, false);
    assertExists("createdAt present", body.createdAt);
    assertEqual("accessToken matches", body.accessToken as string, TEST_TOKEN);

    createdItemId = body.itemId as string;
    console.log("  → itemId:", createdItemId);
  }

  // ── 2. Add second item and verify list order ───────────────────────────────
  section("POST second item → GET returns both in order");
  {
    const addRes = await api("POST", `/list/${TEST_TOKEN}/items`, { name: "Bread" });
    const addBody = addRes.data as Record<string, unknown>;
    assertEqual("Add second — status 201", addRes.status, 201);
    secondItemId = addBody.itemId as string;

    // Small delay so createdAt timestamps differ
    await new Promise(r => setTimeout(r, 50));

    const { status, data } = await api("GET", `/list/${TEST_TOKEN}`);
    const body = data as { items: Array<{ name: string; itemId: string }> };

    assertEqual("GET status 200", status, 200);
    assertEqual("List has 2 items", body.items?.length, 2);
    assertEqual("First item is Milk", body.items?.[0]?.name, "Milk");
    assertEqual("Second item is Bread", body.items?.[1]?.name, "Bread");
  }

  // ── 3. Missing name field ──────────────────────────────────────────────────
  section("POST with missing name → 400");
  {
    const { status } = await api("POST", `/list/${TEST_TOKEN}/items`, {});
    assertEqual("Status is 400", status, 400);
  }

  // ── 4. Empty name (whitespace only) ───────────────────────────────────────
  section("POST with empty name → 400");
  {
    const { status } = await api("POST", `/list/${TEST_TOKEN}/items`, { name: "   " });
    assertEqual("Status is 400", status, 400);
  }

  return summary();
}

run().then(({ failed }) => {
  process.exit(failed > 0 ? 1 : 0);
}).catch((err) => {
  console.error("\x1b[31mUnhandled error:\x1b[0m", err);
  process.exit(1);
});
