import React, { memo, useMemo } from "react";
import { SectionList } from "react-native";
import Text from '../Text/Text';
import { Note } from "../../types/notes";
import { NoteItem } from "../NoteItem/NoteItem";

type Props = {
  notes: Note[];
  playingId: string | null;
  playingStatus: boolean;
  onPlayAudio: (n: Note) => void;
  onTogglePin: (n: Note) => void;
  onEdit: (n: Note) => void;
};

export const NoteList: React.FC<Props> = memo(
  ({ notes, playingId, playingStatus, onPlayAudio, onTogglePin, onEdit }) => {
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
        renderSectionHeader={({ section: { title, data } }) =>
          data.length > 0 ? (
            <Text style={{ fontWeight: "bold", marginTop: 12 }}>{title}</Text>
          ) : null
        }
        ListEmptyComponent={<Text>No notes yet</Text>}
        initialNumToRender={10}
        windowSize={8}
        removeClippedSubviews
        stickySectionHeadersEnabled
      />
    );
  }
);