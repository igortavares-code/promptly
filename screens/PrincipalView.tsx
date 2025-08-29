import React from "react";
import { View, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import NotesScreen from "./NotesScreen";
import ChatScreen from "./ChatScreen";
import Text from "../components/Text/Text";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

const Tab = createBottomTabNavigator();

export default function PrincipalView() {
  const [headerH, setHeaderH] = React.useState(0);
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={styles.menuContainer} edges={["top", "left", "right"]}>
      <View
        style={styles.viewText}
        onLayout={(e) => setHeaderH(e.nativeEvent.layout.height)}
      >
        <Text style={{ fontSize: 20, fontWeight: "bold", color: "#333" }}>
          Promptly
        </Text>
      </View>
      <View style={{ flex: 1 }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={
            Platform.OS === "ios" ? insets.top + headerH : 0
          }
        >
          <Tab.Navigator
            screenOptions={{
              headerShown: false,
              tabBarStyle: { backgroundColor: "#eee" },
              tabBarActiveTintColor: "#000",
              tabBarHideOnKeyboard: true,
            }}
          >
            <Tab.Screen
              name="Notes"
              component={NotesScreen}
              options={{
                tabBarIcon: () => (
                  <MaterialCommunityIcons
                    name="thought-bubble"
                    color={"#000"}
                    size={32}
                  />
                ),
              }}
              initialParams={{ headerOffset: headerH }}
            />
            <Tab.Screen
              name="AIChat"
              component={ChatScreen}
              options={{
                tabBarIcon: () => (
                  <MaterialCommunityIcons
                    name="creation"
                    color={"#000"}
                    size={32}
                  />
                ),
              }}
              initialParams={{ headerOffset: headerH }}
            />
          </Tab.Navigator>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  menuContainer: {
    flex: 1,
    backgroundColor: "#eee",
  },
  viewText: {
    backgroundColor: "white",
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
  },
});
