const BASE_URL = "https://grocerylist-production-ddd6.up.railway.app";

export interface Item {
  itemId: string;
  name: string;
  checked: boolean;
  createdAt: string;
}

export async function fetchList(accessToken: string): Promise<Item[]> {
  const res = await fetch(`${BASE_URL}/list/${accessToken}`);
  if (!res.ok) throw new Error("Failed to fetch list");
  const data = await res.json();
  return data.items as Item[];
}

export async function addItem(accessToken: string, name: string): Promise<Item> {
  const res = await fetch(`${BASE_URL}/list/${accessToken}/items`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  if (!res.ok) throw new Error("Failed to add item");
  return res.json();
}

export async function toggleItem(
  accessToken: string,
  itemId: string,
  checked: boolean
): Promise<void> {
  // Retry once on network failure — safe because checked is idempotent
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const res = await fetch(`${BASE_URL}/list/${accessToken}/items/${itemId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ checked }),
      });
      if (!res.ok) throw new Error("Failed to update item");
      return;
    } catch (err) {
      if (attempt === 2) throw err;
      // Wait 800ms before retry
      await new Promise((resolve) => setTimeout(resolve, 800));
    }
  }
}

export async function deleteItem(
  accessToken: string,
  itemId: string
): Promise<void> {
  const res = await fetch(`${BASE_URL}/list/${accessToken}/items/${itemId}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete item");
}
