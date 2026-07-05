# Family Shopping List App - MVP v1

## Objective

Build an extremely simple shared shopping list application for family use.

The purpose of this version is validation of behavior in real usage:

* Does a shared list improve grocery shopping coordination?
* Is it usable in real-time while shopping?
* Is the “shared checklist” model intuitive enough?

This version prioritizes speed, simplicity, and minimal infrastructure complexity.

---

## Intended Use

* Everyone in the family can add items to a shared shopping list at any time.
* While shopping in the store, users can check/cross items as they are bought.
* The list acts as a shared live checklist of needed and purchased items.

---

## Sync Behavior

* The system maintains a **single shared list state**.
* **Eventual consistency is acceptable** (no real-time synchronization required).
* Users may refresh the browser at any time to retrieve the latest state.
* If another user modifies the list (add / update / delete / check items), changes are visible after refresh or next fetch.
* No WebSockets, SSE, or push mechanisms are required.
* No conflict resolution beyond **last write wins**.

---

## Access Model (CRITICAL DESIGN)

### Single List + Secret Access Token

The application exposes **one shared shopping list** protected by a secret access token.

* There are no user accounts.
* There is no authentication system.
* There are no roles or permissions.

Access is granted only if the correct token is provided.

---

### Access Pattern

Example:

```text id="access1"
/list/{accessToken}
```

or:

```text id="access2"
/list?token={accessToken}
```

Either approach is valid, but path-based routing is preferred for simplicity.

---

### Security Model

* The `accessToken` is a **high-entropy random string**.
* Possession of the token grants full access to the list.
* If the token is lost or leaked, the list is compromised (acceptable for MVP).
* No additional security layers are required in v1.

---

## Scope

### Included

* Create and access the single shared list.
* Add items to the list.
* Mark items as purchased (checked).
* Unmark items.
* Delete items.
* View list items on mobile and desktop browsers.

---

### Excluded

* User accounts or authentication.
* Multiple lists per family or user.
* Permissions or roles.
* List history or audit logs.
* Notifications or reminders.
* Product catalog or barcode scanning.
* Offline mode.
* Real-time updates (WebSockets / SSE).
* Analytics or tracking.

---

## Functional Requirements

### Shopping List

* The system contains exactly **one active shopping list**.
* The list has an optional name (default: "Shopping List").

### Item

Each item includes:

* `id` (UUID)
* `name` (string)
* `checked` (boolean)
* `createdAt` (timestamp)

---

## Core User Flows

### 1. Access List

* User opens URL containing the access token.
* Backend validates token.
* List is returned.

---

### 2. Add Item

* User submits item name.
* Item is appended to list.

---

### 3. Toggle Item

* User marks/unmarks item as purchased.
* State updates immediately in UI.

---

### 4. Delete Item

* User removes item from list.

---

### 5. Refresh / Sync

* Page refresh fetches latest state from backend.
* No live updates required.

---

## Non-Functional Requirements

### Simplicity

* Optimize for minimal code and minimal AWS complexity.
* Avoid premature scalability or abstraction layers.

### Performance

* List must load quickly on mobile networks.
* API responses should be lightweight.

### Security

* Access token must be unguessable (UUID or random string with sufficient entropy).
* No sensitive data is stored in the system.

### Reliability

* Concurrent edits allowed with **last write wins** behavior.
* No merge conflict handling required.

---

## Suggested Architecture (Non-binding)

### Frontend

* React
* TypeScript
* Vite
* Mobile-first responsive UI
* Optional PWA configuration

---

### Backend

* Node.js (TypeScript preferred)
* AWS Lambda
* API Gateway

---

### Database

* Amazon DynamoDB

Single table or minimal schema approach recommended.

---

### Infrastructure

* AWS Serverless stack
* Infrastructure as Code optional but recommended:

  * AWS SAM
  * Serverless Framework

---

## API Endpoints (Minimal)

### Get List

```http id="api1"
GET /list/{accessToken}
```

---

### Add Item

```http id="api2"
POST /list/{accessToken}/items
```

Request:

```json id="req1"
{
  "name": "Milk"
}
```

---

### Update Item

```http id="api3"
PUT /list/{accessToken}/items/{itemId}
```

Request:

```json id="req2"
{
  "name": "Milk",
  "checked": true
}
```

---

### Delete Item

```http id="api4"
DELETE /list/{accessToken}/items/{itemId}
```

---

## Data Model

### Shopping List

```json id="data1"
{
  "accessToken": "random-secret-string",
  "name": "Shopping List",
  "createdAt": "ISO_TIMESTAMP"
}
```

---

### Item

```json id="data2"
{
  "itemId": "uuid",
  "name": "Milk",
  "checked": false,
  "createdAt": "ISO_TIMESTAMP"
}
```

---

## Development Strategy

Implement vertical slices, not layers.

Recommended order:

1. Create backend infra (Lambda + API Gateway + DynamoDB)
2. Implement GET list endpoint
3. Implement add item
4. Implement toggle item
5. Implement delete item
6. Build frontend list UI
7. Connect frontend to backend
8. Add mobile responsiveness
9. Basic testing (manual only)

---

## Definition of Done

The MVP is complete when:

* A user can access the list via URL with token.
* Items can be added, checked, unchecked, and deleted.
* Multiple devices can use the same list.
* Refresh shows updated state.
* No authentication or accounts exist.

---

## Success Criteria (Product)

* Users actually use it during real grocery shopping.
* Multiple family members interact without confusion.
* The app replaces or improves paper or WhatsApp shopping lists.
