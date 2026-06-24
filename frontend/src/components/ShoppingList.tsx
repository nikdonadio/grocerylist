import { useState } from "react";
import { Item, addItem, deleteItem, toggleItem } from "../api";
import AddItemForm from "./AddItemForm";
import ShoppingItem from "./ShoppingItem";

interface Props {
  accessToken: string;
  items: Item[];
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
  onItemsChange: (items: Item[]) => void;
}

export default function ShoppingList({
  accessToken,
  items,
  loading,
  error,
  onRefresh,
  onItemsChange,
}: Props) {
  const [adding, setAdding] = useState(false);

  async function handleAdd(name: string) {
    setAdding(true);
    try {
      const newItem = await addItem(accessToken, name);
      onItemsChange([...items, newItem]);
    } finally {
      setAdding(false);
    }
  }

  async function handleToggle(itemId: string, checked: boolean) {
    // Optimistic update — update UI immediately, then sync to server
    onItemsChange(
      items.map((i) => (i.itemId === itemId ? { ...i, checked } : i))
    );
    await toggleItem(accessToken, itemId, checked);
  }

  async function handleDelete(itemId: string) {
    onItemsChange(items.filter((i) => i.itemId !== itemId));
    await deleteItem(accessToken, itemId);
  }

  const unchecked = items.filter((i) => !i.checked);
  const checked = items.filter((i) => i.checked);

  return (
    <div className="container">
      <header className="header">
        <h1>🛒 Shopping List</h1>
        <button className="btn-refresh" onClick={onRefresh} disabled={loading}>
          {loading ? "..." : "↻ Refresh"}
        </button>
      </header>

      <AddItemForm onAdd={handleAdd} disabled={adding} />

      {error && <p className="error">{error}</p>}

      {loading && items.length === 0 ? (
        <p className="loading">Loading...</p>
      ) : (
        <>
          <ul className="item-list">
            {unchecked.map((item) => (
              <ShoppingItem
                key={item.itemId}
                item={item}
                onToggle={handleToggle}
                onDelete={handleDelete}
              />
            ))}
          </ul>

          {checked.length > 0 && (
            <>
              <p className="section-label">In the cart</p>
              <ul className="item-list checked-list">
                {checked.map((item) => (
                  <ShoppingItem
                    key={item.itemId}
                    item={item}
                    onToggle={handleToggle}
                    onDelete={handleDelete}
                  />
                ))}
              </ul>
            </>
          )}

          {items.length === 0 && (
            <p className="empty-state">List is empty. Add your first item!</p>
          )}
        </>
      )}
    </div>
  );
}
