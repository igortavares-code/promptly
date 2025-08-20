import React from "react";
import { Modal, View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import Text from '../Text/Text';

type Props = {
  visible: boolean;
  text: string;
  onChange: (v: string) => void;
  onCancel: () => void;
  onSave: () => void;
};

export const EditModal: React.FC<Props> = ({ visible, text, onChange, onCancel, onSave }) => {
  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View style={styles.backdrop}>
        <View style={styles.modal}>
          <Text style={styles.title}>Edit note</Text>
          <TextInput
            style={styles.input}
            multiline
            value={text}
            onChangeText={onChange}
            placeholder="Update your note…"
          />
          <View style={styles.row}>
            <TouchableOpacity onPress={onCancel} style={[styles.btn, styles.cancel]}>
              <Text>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onSave} style={[styles.btn, styles.save]}>
              <Text style={{ color: "#fff" }}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.3)", justifyContent: "center", alignItems: "center" },
  modal: { width: "88%", backgroundColor: "#fff", borderRadius: 12, padding: 16 },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 8 },
  input: { minHeight: 80, borderWidth: 1, borderColor: "#ddd", borderRadius: 8, padding: 10, backgroundColor: "#fff" },
  row: { flexDirection: "row", justifyContent: "flex-end", gap: 10, marginTop: 12 },
  btn: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 8 },
  cancel: { backgroundColor: "#f2f2f2" },
  save: { backgroundColor: "#2563eb" },
});