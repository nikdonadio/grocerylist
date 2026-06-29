import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

interface Props {
  onEnter: (token: string) => void;
}

export default function TokenScreen({ onEnter }: Props) {
  const [token, setToken] = useState("");

  function handleEnter() {
    const trimmed = token.trim();
    if (trimmed.length > 0) onEnter(trimmed);
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Text style={styles.title}>🛒 Lista de Compras</Text>
      <Text style={styles.subtitle}>Ingresá el código de tu lista</Text>

      <TextInput
        style={styles.input}
        placeholder="Ej: familia-garcia"
        placeholderTextColor="#aaa"
        value={token}
        onChangeText={setToken}
        onSubmitEditing={handleEnter}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="go"
      />

      <TouchableOpacity
        style={[styles.button, token.trim().length === 0 && styles.buttonDisabled]}
        onPress={handleEnter}
        disabled={token.trim().length === 0}
      >
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#222",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 32,
  },
  input: {
    width: "100%",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: "#222",
    marginBottom: 16,
  },
  button: {
    width: "100%",
    backgroundColor: "#2e7d32",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "#aaa",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
