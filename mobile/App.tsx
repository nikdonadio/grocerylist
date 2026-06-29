import { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import TokenScreen from "./src/screens/TokenScreen";
import ListScreen from "./src/screens/ListScreen";

const TOKEN_KEY = "grocerylist_token";

export default function App() {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // On app start: check if there's a saved token
  useEffect(() => {
    AsyncStorage.getItem(TOKEN_KEY)
      .then((saved) => {
        if (saved) setAccessToken(saved);
      })
      .finally(() => setLoading(false));
  }, []);

  async function handleEnter(token: string) {
    await AsyncStorage.setItem(TOKEN_KEY, token);
    setAccessToken(token);
  }

  async function handleLogout() {
    await AsyncStorage.removeItem(TOKEN_KEY);
    setAccessToken(null);
  }

  // While reading AsyncStorage, show a blank loading screen
  if (loading) {
    return (
      <View style={styles.splash}>
        <ActivityIndicator size="large" color="#2e7d32" />
      </View>
    );
  }

  if (!accessToken) {
    return (
      <>
        <StatusBar style="dark" />
        <TokenScreen onEnter={handleEnter} />
      </>
    );
  }

  return (
    <>
      <StatusBar style="light" />
      <ListScreen
        accessToken={accessToken}
        onLogout={handleLogout}
      />
    </>
  );
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f9f9f9",
  },
});
