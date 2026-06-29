import { useState } from "react";
import { StatusBar } from "expo-status-bar";
import TokenScreen from "./src/screens/TokenScreen";
import ListScreen from "./src/screens/ListScreen";

export default function App() {
  const [accessToken, setAccessToken] = useState<string | null>(null);

  if (!accessToken) {
    return (
      <>
        <StatusBar style="dark" />
        <TokenScreen onEnter={setAccessToken} />
      </>
    );
  }

  return (
    <>
      <StatusBar style="light" />
      <ListScreen accessToken={accessToken} onLogout={() => setAccessToken(null)} />
    </>
  );
}
