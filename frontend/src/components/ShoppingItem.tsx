import { Item } from "../api";

interface Props {
  item: Item;
  onToggle: (itemId: string, checked: boolean) => Promise<void>;
  onDelete: (itemId: string) => Promise<void>;
}

export default function ShoppingItem({ item, onToggle, onDelete }: Props) {
  return (
    <li className={`item ${item.checked ? "item--checked" : ""}`}>
      <label className="item-label">
        <input
          type="checkbox"
          checked={item.checked}
          onChange={(e) => onToggle(item.itemId, e.target.checked)}
          className="item-checkbox"
        />
        <span className="item-name">{item.name}</span>
      </label>
      <button
        className="btn-delete"
        onClick={() => onDelete(item.itemId)}
        aria-label={`Delete ${item.name}`}
      >
        ✕
      </button>
    </li>
  );
}
