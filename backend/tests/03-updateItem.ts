/**
 * 03-updateItem.ts
 * Tests the PUT /list/{accessToken}/items/{itemId} endpoint.
 *
 * Scenarios:
 *  1. Toggle checked → true
 *  2. Toggle checked back → false
 *  3. Rename item
 *  4. Update both name and checked simultaneously
 *  5. Empty body → 400
 */

import { api, TEST_TOKEN, section, assert, assertEqual, summary } from "./helpers";

async function run() {
  console.log("=".repeat(40));
  console.log("TEST FILE: 03-updateItem.ts");
  console.log("Token:", TEST_TOKEN);
  console.log("=".repeat(40));

  // Setup: create a fresh item to work with
  const setup = await api("POST", `/list/${TEST_TOKEN}/items`, { name: "Eggs" });
  const item = setup.data as { itemId: string; name: string; checked: boolean };
  const itemId = item.itemId;
  console.log("Setup item created:", itemId);

  const itemPath = `/list/${TEST_TOKEN}/items/${itemId}`;

  // ── 1. Check the item ──────────────────────────────────────────────────────
  section("PUT — toggle checked to true");
  {
    const { status, data } = await api("PUT", itemPath, { checked: true });
    const body = data as Record<string, unknown>;

    assertEqual("Status is 200", status, 200);
    assertEqual("checked is true", body.checked as boolean, true);
    assertEqual("name unchanged", body.name as string, "Eggs");
  }

  // ── 2. Uncheck the item ────────────────────────────────────────────────────
  section("PUT — toggle checked back to false");
  {
    const { status, data } = await api("PUT", itemPath, { checked: false });
    const body = data as Record<string, unknown>;

    assertEqual("Status is 200", status, 200);
    assertEqual("checked is false", body.checked as boolean, false);
  }

  // ── 3. Rename the item ────────────────────────────────────────────────────
  section("PUT — rename item");
  {
    const { status, data } = await api("PUT", itemPath, { name: "Free-range Eggs" });
    const body = data as Record<string, unknown>;

    assertEqual("Status is 200", status, 200);
    assertEqual("name updated", body.name as string, "Free-range Eggs");
    assertEqual("checked still false", body.checked as boolean, false);
  }

  // ── 4. Update both fields ─────────────────────────────────────────────────
  section("PUT — update name and checked together");
  {
    const { status, data } = await api("PUT", itemPath, { name: "Organic Eggs", checked: true });
    const body = data as Record<string, unknown>;

    assertEqual("Status is 200", status, 200);
    assertEqual("name updated", body.name as string, "Organic Eggs");
    assertEqual("checked is true", body.checked as boolean, true);
  }

  // ── 5. Empty body ─────────────────────────────────────────────────────────
  section("PUT — empty body → 400");
  {
    const { status } = await api("PUT", itemPath, {});
    assertEqual("Status is 400", status, 400);
  }

  // ── 6. Verify via GET ─────────────────────────────────────────────────────
  section("GET — confirm final state persisted");
  {
    const { data } = await api("GET", `/list/${TEST_TOKEN}`);
    const body = data as { items: Array<{ itemId: string; name: string; checked: boolean }> };
    const found = body.items?.find(i => i.itemId === itemId);

    assert("Item found in list", !!found, body.items);
    assertEqual("Final name is Organic Eggs", found?.name, "Organic Eggs");
    assertEqual("Final checked is true", found?.checked, true);
  }

  return summary();
}

run().then(({ failed }) => {
  process.exit(failed > 0 ? 1 : 0);
}).catch((err) => {
  console.error("\x1b[31mUnhandled error:\x1b[0m", err);
  process.exit(1);
});
