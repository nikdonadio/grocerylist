import { useEffect, useState } from "react";
import { fetchList, Item } from "./api";
import ShoppingList from "./components/ShoppingList";
import "./index.css";

// Reads the accessToken from the URL path: /list/{accessToken}
function getTokenFromPath(): string | null {
  const parts = window.location.pathname.split("/");
  const idx = parts.indexOf("list");
  return idx !== -1 ? parts[idx + 1] ?? null : null;
}

export default function App() {
  const accessToken = getTokenFromPath();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadList() {
    if (!accessToken) return;
    try {
      setLoading(true);
      const data = await fetchList(accessToken);
      setItems(data);
      setError(null);
    } catch {
      setError("Could not load the list. Check your connection.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadList();
  }, [accessToken]);

  if (!accessToken) {
    return (
      <div className="empty-state">
        <p>No list found. Use a link like <code>/list/your-secret-token</code></p>
      </div>
    );
  }

  return (
    <ShoppingList
      accessToken={accessToken}
      items={items}
      loading={loading}
      error={error}
      onRefresh={loadList}
      onItemsChange={setItems}
    />
  );
}
