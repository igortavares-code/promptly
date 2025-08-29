import React, { memo, useMemo } from "react";
import { SectionList, StyleSheet } from "react-native";
import Text from "../Text/Text";
import { Note } from "../../types/notes";
import { NoteItem } from "../NoteItem/NoteItem";

type Props = {
  notes: Note[];
  playingId: string | null;
  playingStatus: boolean;
  onPlayAudio: (n: Note) => void;
  onTogglePin: (n: Note) => void;
  onEdit: (n: Note) => void;
  contentContainerStyle: any;
};

export const NoteList: React.FC<Props> = memo(
  ({
    notes,
    playingId,
    playingStatus,
    onPlayAudio,
    onTogglePin,
    onEdit,
    contentContainerStyle,
  }) => {
    const sections = useMemo(() => {
      const pinned = notes.filter((n) => n.pinned);
      const others = notes.filter((n) => !n.pinned);
      return [
        { title: "Pinned notes", data: pinned },
        { title: "", data: others },
      ];
    }, [notes]);

    return (
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <NoteItem
            note={item}
            playingId={playingId}
            playingStatus={playingStatus}
            onPlayAudio={onPlayAudio}
            onPin={onTogglePin}
            onEdit={(id, text) => onEdit({ ...item, content: text })}
          />
        )}
        renderSectionHeader={({ section: { title, data } }) => {
          if (!title) return null;
          if (data.length === 0) return null;

          return <Text style={styles.sectionHeader}>{title}</Text>;
        }}
        ListEmptyComponent={<Text>No notes yet</Text>}
        initialNumToRender={10}
        windowSize={8}
        stickySectionHeadersEnabled
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerStyle={contentContainerStyle}
        removeClippedSubviews={false}
      />
    );
  }
);

const styles = StyleSheet.create({
  sectionHeader: { fontWeight: "bold", marginVertical: 12, marginTop: 0 },
});
