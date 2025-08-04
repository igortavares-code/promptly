import React, { useState } from "react";
import { View, TouchableOpacity, StyleSheet, SafeAreaView  } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Notes from "./Notes";
import ChatScreen from "./ChatScreen";
export default function PrincipalView() {
  const [feature, setFeature] = useState(0);

  return (
    <SafeAreaView style={styles.menuContainer}>
      {feature === 0 && <Notes />}
      {feature === 1 && <ChatScreen />}
      <View style={styles.bottomMenu}>
           <TouchableOpacity
           style={styles.menuItem}
        onPress={() => setFeature(0)}
        // disabled={loading}
        // style={styles.optionsOutlineButton}
      >
        <MaterialCommunityIcons name="thought-bubble" color="#000" size={32} />
        {/* <Icon
          name="options-outline"
          size={24}
          color="#000"
          style={styles.optionsOutlineIcon}
        /> */}
      </TouchableOpacity>
      <TouchableOpacity
      style={styles.menuItem}
      onPress={() => setFeature(1)}
      >
        <MaterialCommunityIcons name="creation" color="#000" size={32} />
      </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  menuContainer: {
    flex: 1,
  },
  bottomMenu: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#ccc',
  },
  menuItem: {
    alignItems: 'center',
  },
})
