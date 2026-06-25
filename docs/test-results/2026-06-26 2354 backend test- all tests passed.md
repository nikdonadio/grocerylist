PS C:\Projects\grocerylist\backend> npx ts-node tests/run-all.ts

╔════════════════════════════════════════════╗
║      GROCERY LIST — INTEGRATION TESTS      ║
╚════════════════════════════════════════════╝


────────────────────────────────────────────
Running: 01-getList.ts
────────────────────────────────────────────
========================================
TEST FILE: 01-getList.ts
Token: test-1782424391047
========================================

▶ GET /list/{token} — fresh token
  ✓ Status is 200
  ✓ accessToken echoed back
  ✓ items is an array
  ✓ items is empty

▶ GET /list/{token} — different token is isolated
  ✓ Status is 200
  ✓ accessToken matches other token
  ✓ Other token list is also empty

────────────────────────────────────────
ALL TESTS PASSED (7/7)

────────────────────────────────────────────
Running: 02-addItem.ts
────────────────────────────────────────────
========================================
TEST FILE: 02-addItem.ts
Token: test-1782424397636
========================================

▶ POST /list/{token}/items — valid item
  ✓ Status is 201
  ✓ itemId present
  ✓ name matches
  ✓ checked is false
  ✓ createdAt present
  ✓ accessToken matches
  → itemId: 8b9cd0c9-63b8-479e-a3d3-acb53a0278f8

▶ POST second item → GET returns both in order
  ✓ Add second — status 201
  ✓ GET status 200
  ✓ List has 2 items
  ✓ First item is Milk
  ✓ Second item is Bread

▶ POST with missing name → 400
  ✓ Status is 400

▶ POST with empty name → 400
  ✓ Status is 400

────────────────────────────────────────
ALL TESTS PASSED (13/13)

────────────────────────────────────────────
Running: 03-updateItem.ts
────────────────────────────────────────────
========================================
TEST FILE: 03-updateItem.ts
Token: test-1782424404189
========================================
Setup item created: 5b0a3335-6693-447d-9c3e-692fd6379c64

▶ PUT — toggle checked to true
  ✓ Status is 200
  ✓ checked is true
  ✓ name unchanged

▶ PUT — toggle checked back to false
  ✓ Status is 200
  ✓ checked is false

▶ PUT — rename item
  ✓ Status is 200
  ✓ name updated
  ✓ checked still false

▶ PUT — update name and checked together
  ✓ Status is 200
  ✓ name updated
  ✓ checked is true

▶ PUT — empty body → 400
  ✓ Status is 400

▶ GET — confirm final state persisted
  ✓ Item found in list
  ✓ Final name is Organic Eggs
  ✓ Final checked is true

────────────────────────────────────────
ALL TESTS PASSED (15/15)

────────────────────────────────────────────
Running: 04-deleteItem.ts
────────────────────────────────────────────
========================================
TEST FILE: 04-deleteItem.ts
Token: test-1782424411409
========================================
Setup — created items: f306f5fa-4e21-4bc6-9674-bd5180edf9c9 3e2f85c7-affa-47a1-a4a5-2947578c8f38

▶ DELETE — remove existing item
  ✓ Status is 200
  ✓ deleted ID matches

▶ GET — deleted item no longer in list
  ✓ Deleted item absent
  ✓ Other item still present

▶ DELETE — idempotent (delete non-existent item)
  ✓ Status is still 200 (idempotent)

▶ DELETE — remove last item, list becomes empty
  ✓ List is now empty

────────────────────────────────────────
ALL TESTS PASSED (6/6)

════════════════════════════════════════════
FINAL SUMMARY
════════════════════════════════════════════
  ✓  01-getList.ts                PASS
  ✓  02-addItem.ts                PASS
  ✓  03-updateItem.ts             PASS
  ✓  04-deleteItem.ts             PASS

ALL SUITES PASSED ✓