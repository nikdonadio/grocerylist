import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { fetchList, addItem, toggleItem, deleteItem, Item } from "../api";

interface Props {
  accessToken: string;
  onLogout: () => void;
}

type ListRow =
  | { type: "item"; data: Item }
  | { type: "separator"; key: string };

export default function ListScreen({ accessToken, onLogout }: Props) {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [newItemName, setNewItemName] = useState("");
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadList() {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchList(accessToken);
      setItems(data);
    } catch {
      setError("No se pudo cargar la lista.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadList();
  }, []);

  async function handleAdd() {
    const name = newItemName.trim();
    if (!name) return;
    try {
      setAdding(true);
      const item = await addItem(accessToken, name);
      setItems((prev) => [item, ...prev]);
      setNewItemName("");
    } catch {
      Alert.alert("Error", "No se pudo agregar el ítem.");
    } finally {
      setAdding(false);
    }
  }

  async function handleToggle(item: Item) {
    try {
      await toggleItem(accessToken, item.itemId, !item.checked);
      setItems((prev) =>
        prev.map((i) => (i.itemId === item.itemId ? { ...i, checked: !i.checked } : i))
      );
    } catch {
      Alert.alert("Error", "No se pudo actualizar el ítem.");
    }
  }

  async function handleDelete(itemId: string) {
    try {
      await deleteItem(accessToken, itemId);
      setItems((prev) => prev.filter((i) => i.itemId !== itemId));
    } catch {
      Alert.alert("Error", "No se pudo eliminar el ítem.");
    }
  }

  // Construir la lista con separador si hay items en el carrito
  function buildRows(): ListRow[] {
    const pending = items.filter((i) => !i.checked);
    const inCart = items.filter((i) => i.checked);
    const rows: ListRow[] = pending.map((i) => ({ type: "item", data: i }));
    if (inCart.length > 0) {
      rows.push({ type: "separator", key: "separator" });
      inCart.forEach((i) => rows.push({ type: "item", data: i }));
    }
    return rows;
  }

  function renderRow({ item: row }: { item: ListRow }) {
    if (row.type === "separator") {
      return (
        <View style={styles.separator}>
          <Text style={styles.separatorText}>🛒 En el carrito</Text>
        </View>
      );
    }

    const item = row.data;
    return (
      <View style={styles.itemRow}>
        <TouchableOpacity style={styles.itemLeft} onPress={() => handleToggle(item)}>
          <View style={[styles.checkbox, item.checked && styles.checkboxChecked]}>
            {item.checked && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <Text style={[styles.itemName, item.checked && styles.itemNameChecked]}>
            {item.name}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDelete(item.itemId)} style={styles.deleteBtn}>
          <Text style={styles.deleteText}>✕</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const rows = buildRows();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🛒 Lista</Text>
        <TouchableOpacity onPress={onLogout}>
          <Text style={styles.logoutText}>Cambiar lista</Text>
        </TouchableOpacity>
      </View>

      {/* Add item */}
      <View style={styles.addRow}>
        <TextInput
          style={styles.addInput}
          placeholder="Agregar ítem..."
          placeholderTextColor="#aaa"
          value={newItemName}
          onChangeText={setNewItemName}
          onSubmitEditing={handleAdd}
          returnKeyType="done"
        />
        <TouchableOpacity
          style={[styles.addButton, (!newItemName.trim() || adding) && styles.addButtonDisabled]}
          onPress={handleAdd}
          disabled={!newItemName.trim() || adding}
        >
          <Text style={styles.addButtonText}>{adding ? "..." : "+"}</Text>
        </TouchableOpacity>
      </View>

      {/* List */}
      {loading ? (
        <ActivityIndicator style={styles.loader} size="large" color="#2e7d32" />
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadList}>
            <Text style={styles.retryText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={rows}
          keyExtractor={(row) => row.type === "item" ? row.data.itemId : row.key}
          renderItem={renderRow}
          onRefresh={loadList}
          refreshing={loading}
          ListEmptyComponent={
            <Text style={styles.emptyText}>La lista está vacía. ¡Agregá algo!</Text>
          }
          contentContainerStyle={rows.length === 0 ? styles.emptyContainer : undefined}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#2e7d32",
    paddingTop: 56,
    paddingBottom: 16,
    paddingHorizontal: 20,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
  },
  logoutText: {
    color: "#c8e6c9",
    fontSize: 14,
  },
  addRow: {
    flexDirection: "row",
    padding: 16,
    gap: 8,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  addInput: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    color: "#222",
  },
  addButton: {
    backgroundColor: "#2e7d32",
    borderRadius: 10,
    width: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  addButtonDisabled: {
    backgroundColor: "#aaa",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 24,
    lineHeight: 28,
  },
  loader: {
    marginTop: 40,
  },
  errorContainer: {
    alignItems: "center",
    marginTop: 40,
    padding: 20,
  },
  errorText: {
    color: "#c62828",
    fontSize: 16,
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: "#2e7d32",
    borderRadius: 10,
    paddingHorizontal: 24,
    paddingVertical: 10,
  },
  retryText: {
    color: "#fff",
    fontWeight: "bold",
  },
  separator: {
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 4,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  separatorText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#888",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: 10,
    borderRadius: 12,
    padding: 14,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  itemLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#2e7d32",
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    backgroundColor: "#2e7d32",
  },
  checkmark: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  itemName: {
    fontSize: 16,
    color: "#222",
    flexShrink: 1,
  },
  itemNameChecked: {
    textDecorationLine: "line-through",
    color: "#aaa",
  },
  deleteBtn: {
    padding: 6,
    marginLeft: 8,
  },
  deleteText: {
    color: "#e53935",
    fontSize: 16,
    fontWeight: "bold",
  },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  emptyText: {
    textAlign: "center",
    color: "#aaa",
    fontSize: 16,
    marginTop: 40,
  },
});
