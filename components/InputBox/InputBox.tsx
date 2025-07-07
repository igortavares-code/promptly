import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

type InputBoxProps = {
  prompt: string;
  setPrompt: (text: string) => void;
  onSend: () => void;
  loading: boolean;
  onOpenOptions: () => void;
};

export default function InputBox({
  prompt,
  setPrompt,
  onSend,
  loading,
  onOpenOptions,
}: InputBoxProps) {
  const [inputHeight, setInputHeight] = useState(40);

  return (
    <View style={styles.textBoxArea}>
      <TextInput
        value={prompt}
        onChangeText={setPrompt}
        placeholder="Digite sua pergunta aqui..."
        multiline
        onContentSizeChange={(e) =>
          setInputHeight(Math.min(120, e.nativeEvent.contentSize.height))
        }
        style={[styles.textInput, { height: inputHeight }]}
        editable={!loading}
      />

      <View style={styles.buttons}>
        <TouchableOpacity
          onPress={onOpenOptions}
          disabled={loading}
          style={styles.optionsOutlineButton}
        >
          <Icon
            name="options-outline"
            size={24}
            color="#000"
            style={styles.optionsOutlineIcon}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onSend}
          disabled={loading}
          style={styles.circleOutlineButton}
        >
          {loading ? (
            <Icon name="reload-circle" size={24} color="#000" />
          ) : (
            <Icon name="arrow-up-circle-outline" size={24} color="#000" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  textBoxArea: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    width: "100%",
    maxWidth: 616,
    padding: 16,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "rgb(191 177 158)",
    backgroundColor: "rgb(252 250 247)",
    flexDirection: "row",
    alignItems: "center",
  },
  textInput: {
    flex: 1,
    padding: Platform.OS === "ios" ? 10 : 8,
    borderRadius: 20,
    borderColor: "rgb(191 177 158)",
    fontSize: 16,
    maxHeight: 120,
    borderWidth: 0,
  },
  buttons: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 12,
  },
  optionsOutlineButton: {
    padding: 5,
    marginRight: 10,
  },
  optionsOutlineIcon: {},
  circleOutlineButton: {
    paddingLeft: 10,
  },
});
