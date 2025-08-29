import React from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Text from '../Text/Text';

type Props = {
  value: string;
  onChange: (txt: string) => void;
  currentTags: string[];
  onSubmitText: () => void;
  onStartRecord: () => void;
  onStopRecord: () => void;
  isRecording: boolean
};

export const InputBar: React.FC<Props> = ({
  value,
  onChange,
  currentTags,
  onSubmitText,
  onStartRecord,
  onStopRecord,
  isRecording
}) => {
  const isTyping = value.trim().length > 0;

  return (
    <View style={styles.wrapper}>
      {!!currentTags.length && (
        <View style={styles.tagsRow}>
          {currentTags.map((t) => (
            <View key={t} style={styles.tag}>
              <Text style={styles.tagText}>{t}</Text>
            </View>
          ))}
        </View>
      )}
      <View style={styles.row}>
        <TextInput
          style={styles.input}
          placeholder="Type a note..."
          value={value}
          onChangeText={onChange}
          multiline
        />
        <View style={styles.action}>
          {!isTyping ? (
            isRecording ? (
              <TouchableOpacity
                onPress={onStopRecord}
                accessibilityLabel="Stop recording"
              >
                <FontAwesome name="microphone-slash" size={22} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={onStartRecord}
                accessibilityLabel="Start recording"
              >
                <FontAwesome name="microphone" size={22} />
              </TouchableOpacity>
            )
          ) : (
            <TouchableOpacity
              onPress={onSubmitText}
              accessibilityLabel="Send text note"
            >
              <FontAwesome name="send" size={22} />
            </TouchableOpacity>
          )}
        </View>
      </View>
      {Platform.OS === "ios" && <View style={{ height: 8 }} />}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { gap: 0, paddingTop: 6 },
  row: {
    flexDirection: "row",
    gap: 10,
    alignItems: "flex-end"
  },
  input: {
    flex: 1,
    minHeight: 10,
    maxHeight: 120,
    borderWidth: 1,
    borderColor: "#d0d0d0",
    borderRadius: 10,
    padding: 10,
    backgroundColor: "#fff",
    fontSize: 16
  },
  action: {
    width: 44,
    height: 44,
    borderRadius: 20,
    backgroundColor: "#d5c4b1ff",
    alignItems: "center",
    justifyContent: "center",
  },
  tagsRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 4 },
  tag: {
    backgroundColor: "#eef6ff",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  tagText: { fontSize: 12, color: "#2563eb" },
});