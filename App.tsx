import React from "react";
import { View, ActivityIndicator } from "react-native";
import { useFonts } from "expo-font";
import PrincipalView from "./screens/PrincipalView";

export default function App() {
  const [fontsLoaded] = useFonts({
    "WorkSans-Regular": require("./assets/fonts/WorkSans-Regular.ttf"),
    "WorkSans-Bold": require("./assets/fonts/WorkSans-Bold.ttf"),
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    //"Ready to shape your thoughts into words?"
    <PrincipalView />
  );
}