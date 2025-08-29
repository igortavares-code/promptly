import React, { useEffect, useMemo, useState, useRef } from "react";
import {
  View,
  TouchableOpacity,
  TextInput,
  Button,
  Modal,
  StyleSheet,
} from "react-native";
import Text from "../Text/Text";
import { Note } from "../../types/notes";
import { formatDateTime } from "../../utils/date";
import { useAIStore } from "../../store/useAIStore";
import { useNavigation } from "@react-navigation/native";
import type { RootTabParamList } from "../../types/navigation";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable";

type NoteItemProps = {
  note: Note;
  onEdit: (id: string, newText: string) => void;
  onPlayAudio: (note: Note) => void;
  onPin: (note: Note) => void;
  playingId: string | null;
  playingStatus: boolean;
};

export function NoteItem({
  note,
  onEdit,
  onPlayAudio,
  onPin,
  playingId,
  playingStatus,
}: NoteItemProps) {
  const setAIInput = useAIStore((s) => s.setAIInput);
  const navigation = useNavigation<BottomTabNavigationProp<RootTabParamList>>();

  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(note?.content || "");
  const [modalVisible, setModalVisible] = useState(false);

  const swipeableRef = useRef<any>(null);

  useEffect(() => {
    if (!isEditing) setEditText(note?.content || "");
  }, [note?.content, isEditing]);

  const isPlaying = useMemo(() => playingId === note.id, [playingId, note.id]);

  const renderRightActions = () => (
    <View style={styles.leftAction}>
      <Text style={styles.leftActionText}>Use as AI prompt</Text>
    </View>
  );

  return (
    <ReanimatedSwipeable
      renderRightActions={renderRightActions}
      onSwipeableOpen={(direction) => {
        if (direction === "left") {
          setAIInput(note.content);
          navigation.navigate("AIChat");
        } else if (direction === "right") {
          // Maybe pin/unpin?
        }
        swipeableRef.current?.close();
      }}
    >
      <TouchableOpacity
        onPress={() => {
          if (note.type === "text") setIsEditing(true);
        }}
        onLongPress={() => setModalVisible(true)}
        style={[styles.note, note.pinned && styles.pinned]}
        activeOpacity={0.9}
      >
        <View style={styles.header}>
          <Text style={styles.timestamp}>{formatDateTime(note.createdOn)}</Text>
          {note.pinned ? <Text style={styles.pinBadge}>📌 Pinned</Text> : null}
        </View>

        {note.type === "text" && isEditing ? (
          <>
            <TextInput
              style={styles.inputEdit}
              value={editText}
              onChangeText={setEditText}
              multiline
              placeholder="Update your note…"
            />
            <View style={styles.editButtons}>
              <Button
                title="Save"
                onPress={() => {
                  onEdit(note.id, editText);
                  setIsEditing(false);
                }}
              />
              <Button title="Cancel" onPress={() => setIsEditing(false)} />
            </View>
          </>
        ) : note.type === "text" ? (
          <Text style={styles.content}>{note.content}</Text>
        ) : (
          <TouchableOpacity
            onPress={() => onPlayAudio(note)}
            style={styles.audioBtn}
          >
            <Text style={styles.audioText}>
              {isPlaying && !playingStatus ? "Pause Audio" : "Play Audio"}
            </Text>
            {isPlaying && !playingStatus && (
              <Text style={styles.playing}>🔊 Playing...</Text>
            )}
          </TouchableOpacity>
        )}

        {note.edited ? (
          <Text style={styles.edited}>Edited on {note.edited}</Text>
        ) : null}

        {!!note.tags?.length && (
          <View style={styles.tagsRow}>
            {note.tags.map((tag) => (
              <View style={styles.tagChip} key={tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        )}

        <Modal
          visible={modalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalBackdrop}>
            <View style={styles.modalContent}>
              <View style={styles.modalTitleRow}>
                <Text style={styles.modalTitle}>Note actions</Text>
              </View>

              <View style={styles.modalBtns}>
                <Button
                  title={note.pinned ? "Unpin" : "Pin"}
                  onPress={() => {
                    onPin(note);
                    setModalVisible(false);
                  }}
                />
                <Button title="Close" onPress={() => setModalVisible(false)} />
              </View>
            </View>
          </View>
        </Modal>
      </TouchableOpacity>
    </ReanimatedSwipeable>
  );
}

const styles = StyleSheet.create({
  note: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    marginBottom: 16,
  },
  pinned: {
    borderWidth: 1,
    borderColor: "#ffd166",
    backgroundColor: "#fff8e6",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    alignItems: "center",
  },
  timestamp: { fontSize: 12, color: "#555" },
  pinBadge: { fontSize: 12, color: "#b7791f" },
  content: { fontSize: 16, color: "#222" },
  edited: { fontSize: 12, color: "#999", fontStyle: "italic", marginTop: 6 },
  inputEdit: {
    borderWidth: 1,
    borderColor: "#d0d0d0",
    borderRadius: 10,
    padding: 10,
    backgroundColor: "#fff",
    minHeight: 60,
  },
  editButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    gap: 8,
  },
  audioBtn: { marginTop: 10 },
  audioText: { color: "#2563eb", fontSize: 15 },
  playing: { marginTop: 4, color: "#444" },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 10,
  },
  tagChip: {
    backgroundColor: "#eef6ff",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  tagText: { fontSize: 12, color: "#2563eb" },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  modalContent: {
    width: "100%",
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
  },
  modalTitleRow: { marginBottom: 8 },
  modalTitle: { fontSize: 18, fontWeight: "bold" },
  modalBtns: { flexDirection: "row", justifyContent: "flex-end", gap: 12 },
  leftAction: {
    backgroundColor: "#ffd166",
    justifyContent: "center",
    flex: 1,
    borderRadius: 12,
    paddingLeft: 20,
    marginBottom: 16,
  },
  leftActionText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 16,
  },
});
