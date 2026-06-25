/**
 * 04-deleteItem.ts
 * Tests the DELETE /list/{accessToken}/items/{itemId} endpoint.
 *
 * Scenarios:
 *  1. Delete an existing item → 200
 *  2. Verify item is gone from GET
 *  3. Delete same item again → still 200 (DynamoDB delete is idempotent)
 *  4. Other items in the list are unaffected
 */

import { api, TEST_TOKEN, section, assert, assertEqual, summary } from "./helpers";

async function run() {
  console.log("=".repeat(40));
  console.log("TEST FILE: 04-deleteItem.ts");
  console.log("Token:", TEST_TOKEN);
  console.log("=".repeat(40));

  // Setup: create two items
  const r1 = await api("POST", `/list/${TEST_TOKEN}/items`, { name: "Butter" });
  const r2 = await api("POST", `/list/${TEST_TOKEN}/items`, { name: "Cheese" });
  const item1 = r1.data as { itemId: string };
  const item2 = r2.data as { itemId: string };
  console.log("Setup — created items:", item1.itemId, item2.itemId);

  // ── 1. Delete first item ───────────────────────────────────────────────────
  section("DELETE — remove existing item");
  {
    const { status, data } = await api("DELETE", `/list/${TEST_TOKEN}/items/${item1.itemId}`);
    const body = data as { deleted?: string };

    assertEqual("Status is 200", status, 200);
    assertEqual("deleted ID matches", body.deleted, item1.itemId);
  }

  // ── 2. Verify item is gone ─────────────────────────────────────────────────
  section("GET — deleted item no longer in list");
  {
    const { data } = await api("GET", `/list/${TEST_TOKEN}`);
    const body = data as { items: Array<{ itemId: string }> };
    const found = body.items?.find(i => i.itemId === item1.itemId);

    assert("Deleted item absent", !found, body.items);
    assert("Other item still present", !!body.items?.find(i => i.itemId === item2.itemId), body.items);
  }

  // ── 3. Delete same item again (idempotent) ─────────────────────────────────
  section("DELETE — idempotent (delete non-existent item)");
  {
    const { status } = await api("DELETE", `/list/${TEST_TOKEN}/items/${item1.itemId}`);
    assertEqual("Status is still 200 (idempotent)", status, 200);
  }

  // ── 4. Delete second item, list now empty ────────────────────────────────
  section("DELETE — remove last item, list becomes empty");
  {
    await api("DELETE", `/list/${TEST_TOKEN}/items/${item2.itemId}`);
    const { data } = await api("GET", `/list/${TEST_TOKEN}`);
    const body = data as { items: unknown[] };

    assertEqual("List is now empty", body.items?.length, 0);
  }

  return summary();
}

run().then(({ failed }) => {
  process.exit(failed > 0 ? 1 : 0);
}).catch((err) => {
  console.error("\x1b[31mUnhandled error:\x1b[0m", err);
  process.exit(1);
});
