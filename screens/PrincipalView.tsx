import React, { useState } from "react";
import { View, TouchableOpacity, StyleSheet, SafeAreaView } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Notes from "./NotesScreen";
import ChatScreen from "./ChatScreen";
import Text from "../components/Text/Text";

export default function PrincipalView() {
  const [feature, setFeature] = useState(0);

  return (
    <SafeAreaView style={styles.menuContainer}>
      <View
        style={{
          backgroundColor: "white",
          padding: 16,
          alignItems: "center",
          justifyContent: "center",
          elevation: 3,
        }}
      >
        <Text style={{ fontSize: 20, fontWeight: "bold", color: "#333" }}>
          Promptly
        </Text>
      </View>
      {feature === 0 && <Notes />}
      {feature === 1 && <ChatScreen />}
      <View style={styles.bottomMenu}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => setFeature(0)}
          // disabled={loading}
          // style={styles.optionsOutlineButton}
        >
          <MaterialCommunityIcons
            name="thought-bubble"
            color="#000"
            size={32}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => setFeature(1)}>
          <MaterialCommunityIcons name="creation" color="#000" size={32} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  menuContainer: {
    flex: 1,
    backgroundColor: "#eee",
  },
  bottomMenu: {
    height: 60,
    backgroundColor: "#eee",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "#ccc",
  },
  menuItem: {
    alignItems: "center",
    marginTop: 16
  },
});
