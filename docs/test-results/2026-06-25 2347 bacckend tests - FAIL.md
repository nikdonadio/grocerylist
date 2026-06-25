PS C:\Projects\grocerylist\backend> npx ts-node tests/run-all.ts

╔════════════════════════════════════════════╗
║      GROCERY LIST — INTEGRATION TESTS      ║
╚════════════════════════════════════════════╝


────────────────────────────────────────────
Running: 01-getList.ts
────────────────────────────────────────────
========================================
TEST FILE: 01-getList.ts
Token: test-1782423948852
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
Token: test-1782423957729
========================================

▶ POST /list/{token}/items — valid item
  ✓ Status is 201
  ✓ itemId present
  ✓ name matches
  ✓ checked is false
  ✓ createdAt present
  ✓ accessToken matches
  → itemId: db146272-f530-441b-94ed-0e6fd18909f8

▶ POST second item → GET returns both in order
  ✓ Add second — status 201
  ✓ GET status 200
  ✗ List has 2 items
    Got: {
  "actual": 1,
  "expected": 2
}
  ✗ First item is Milk
    Got: {
  "actual": "Bread",
  "expected": "Milk"
}
  ✗ Second item is Bread
    Got: {
  "expected": "Bread"
}

▶ POST with missing name → 400
  ✓ Status is 400

▶ POST with empty name → 400
  ✓ Status is 400

────────────────────────────────────────
FAILURES: 3 failed, 10 passed

────────────────────────────────────────────
Running: 03-updateItem.ts
────────────────────────────────────────────
========================================
TEST FILE: 03-updateItem.ts
Token: test-1782423964371
========================================
Setup item created: 338dad42-ffbe-4dfd-87b6-7313d3db321a

▶ PUT — toggle checked to true
  ✗ Status is 200
    Got: {
  "actual": 502,
  "expected": 200
}
  ✗ checked is true
    Got: {
  "expected": true
}
  ✗ name unchanged
    Got: {
  "expected": "Eggs"
}

▶ PUT — toggle checked back to false
  ✗ Status is 200
    Got: {
  "actual": 502,
  "expected": 200
}
  ✗ checked is false
    Got: {
  "expected": false
}

▶ PUT — rename item
  ✗ Status is 200
    Got: {
  "actual": 502,
  "expected": 200
}
  ✗ name updated
    Got: {
  "expected": "Free-range Eggs"
}
  ✗ checked still false
    Got: {
  "expected": false
}

▶ PUT — update name and checked together
  ✗ Status is 200
    Got: {
  "actual": 502,
  "expected": 200
}
  ✗ name updated
    Got: {
  "expected": "Organic Eggs"
}
  ✗ checked is true
    Got: {
  "expected": true
}

▶ PUT — empty body → 400
  ✓ Status is 400

▶ GET — confirm final state persisted
  ✓ Item found in list
  ✗ Final name is Organic Eggs
    Got: {
  "actual": "Eggs",
  "expected": "Organic Eggs"
}
  ✗ Final checked is true
    Got: {
  "actual": false,
  "expected": true
}

────────────────────────────────────────
FAILURES: 13 failed, 2 passed

────────────────────────────────────────────
Running: 04-deleteItem.ts
────────────────────────────────────────────
========================================
TEST FILE: 04-deleteItem.ts
Token: test-1782423970625
========================================
Setup — created items: ac3736c7-5c57-440b-96b0-27effb2327e7 2badd6b6-d05b-4057-96ec-5b9e8e5f8610

▶ DELETE — remove existing item
  ✗ Status is 200
    Got: {
  "actual": 502,
  "expected": 200
}
  ✗ deleted ID matches
    Got: {
  "expected": "ac3736c7-5c57-440b-96b0-27effb2327e7"
}

▶ GET — deleted item no longer in list
  ✓ Deleted item absent
  ✓ Other item still present

▶ DELETE — idempotent (delete non-existent item)
  ✗ Status is still 200 (idempotent)
    Got: {
  "actual": 502,
  "expected": 200
}

▶ DELETE — remove last item, list becomes empty
  ✗ List is now empty
    Got: {
  "actual": 1,
  "expected": 0
}

────────────────────────────────────────
FAILURES: 4 failed, 2 passed

════════════════════════════════════════════
FINAL SUMMARY
════════════════════════════════════════════
  ✓  01-getList.ts                PASS
  ✗  02-addItem.ts                FAIL
  ✗  03-updateItem.ts             FAIL
  ✗  04-deleteItem.ts             FAIL

SOME SUITES FAILED ✗