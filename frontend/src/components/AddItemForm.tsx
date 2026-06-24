import { useState } from "react";

interface Props {
  onAdd: (name: string) => Promise<void>;
  disabled: boolean;
}

export default function AddItemForm({ onAdd, disabled }: Props) {
  const [value, setValue] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const name = value.trim();
    if (!name) return;
    await onAdd(name);
    setValue("");
  }

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <input
        className="add-input"
        type="text"
        placeholder="Add item..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={disabled}
        autoComplete="off"
      />
      <button className="btn-add" type="submit" disabled={disabled || !value.trim()}>
        Add
      </button>
    </form>
  );
}
