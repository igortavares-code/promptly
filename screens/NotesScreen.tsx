import "react-native-get-random-values";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Alert,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import Text from "../components/Text/Text";
import { v4 as uuidv4 } from "uuid";
import {
  useAudioRecorder,
  useAudioRecorderState,
  useAudioPlayer,
  RecordingPresets,
  useAudioPlayerStatus,
} from "expo-audio";
import * as FileSystem from "expo-file-system";
import { Note } from "../types/notes";
import { NoteList } from "../components/NoteList/NoteList";
import { InputBar } from "../components/InputBar/InputBar";
import { loadNotes, saveNotes, sortNotes } from "../services/notesService";
import { initAudioExpo } from "../services/audioService";
import { extractTags } from "../utils/tags";
import { nowIso } from "../utils/date";

export default function NotesScreen() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [input, setInput] = useState("");
  const [currentTags, setCurrentTags] = useState<string[]>([]);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [micGranted, setMicGranted] = useState<boolean>(false);
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(recorder);
  const isStartingRef = React.useRef(false);
  const isStoppingRef = React.useRef(false);

  const isRecordingRef = React.useRef(false);
  React.useEffect(() => {
    isRecordingRef.current = recorderState.isRecording;
  }, [recorderState.isRecording]);

  const player = useAudioPlayer();
  const status = useAudioPlayerStatus(player);
  let playingStatus =
    status?.isLoaded && !status.playing && status.didJustFinish;

  const [inputHeight, setInputHeight] = useState(0);

  useEffect(() => {
    (async () => {
      const ok = await initAudioExpo();
      if (!ok) {
        Alert.alert(
          "Permissão Negada",
          "Permissão para acessar o microfone foi negada."
        );
      }
      setMicGranted(ok);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const saved = await loadNotes();
      setNotes(sortNotes(saved));
    })();
  }, []);

  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      void saveNotes(notes);
    }, 250);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [notes]);

  const handleTextChange = useCallback((v: string) => {
    setInput(v);
    setCurrentTags(extractTags(v));
  }, []);

  const addTextNote = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const newNote: Note = {
      id: uuidv4(),
      content: trimmed,
      type: "text",
      createdOn: nowIso(),
      edited: null,
      tags: currentTags,
      pinned: false,
    };
    setNotes((prev) => sortNotes([...prev, newNote]));
    setInput("");
    setCurrentTags([]);
  }, [input, currentTags]);

  const onStartRecord = React.useCallback(async () => {
    if (isStartingRef.current || isStoppingRef.current) return;
    isStartingRef.current = true;
    try {
      if (!micGranted) {
        const grantedNow = await initAudioExpo();
        setMicGranted(grantedNow);
        if (!grantedNow) {
          Alert.alert("Permission", "Ative o microfone para gravar.");
          return;
        }
      }

      if (isRecordingRef.current) {
        return;
      }

      await recorder.prepareToRecordAsync();
      await recorder.record();
    } catch (e) {
      console.error("onStartRecord error", e);
      Alert.alert("Erro", "Não foi possível iniciar a gravação.");
    } finally {
      isStartingRef.current = false;
    }
  }, [micGranted, recorder, initAudioExpo]);

  const onStopRecord = React.useCallback(async () => {
    if (isStoppingRef.current || isStartingRef.current) return;
    isStoppingRef.current = true;
    try {
      if (!isRecordingRef.current) {
        return;
      }
      await recorder.stop();

      let uri: string | undefined = recorder.uri ?? undefined;
      const started = Date.now();
      while (!uri && Date.now() - started < 1000) {
        await new Promise((r) => setTimeout(r, 50));
        uri = recorder.uri ?? undefined;
      }

      if (!uri) {
        Alert.alert("Error", "not possible to save audio.");
        return;
      }

      const newId = uuidv4();
      const destPath = `${FileSystem.documentDirectory}recording-${newId}.m4a`;
      await FileSystem.copyAsync({ from: uri, to: destPath });

      const newAudioNote: Note = {
        id: newId,
        content: destPath,
        type: "audio",
        createdOn: new Date().toISOString(),
        edited: null,
        tags: [],
        pinned: false,
      };

      setNotes((prev) => {
        const updated = sortNotes([...prev, newAudioNote]);
        return updated;
      });
    } catch (e) {
      console.error("❌ Erro em onStopRecord:", e);
      Alert.alert("Erro", "Não foi possível parar a gravação.");
    } finally {
      isStoppingRef.current = false;
    }
  }, [recorder]);

  const onPlayAudio = async (nota: Note) => {
    if (nota.type !== "audio" || !nota.content) return;

    if (playingId === nota.id) {
      await player.pause();
      setPlayingId(null);
    } else {
      try {
        await player.replace({ uri: nota.content });
        player.volume = 200;
        await player.play();

        setPlayingId(nota.id);
      } catch (err) {
        console.error("Playback error:", err);
      }
    }
  };

  const onTogglePin = useCallback((item: Note) => {
    setNotes((prev) =>
      sortNotes(
        prev.map((n) => (n.id === item.id ? { ...n, pinned: !n.pinned } : n))
      )
    );
  }, []);

  const onEdit = useCallback((note: Note) => {
    if (note.type !== "text") {
      Alert.alert("Warning", "It's only possible to edit text notes.");
      return;
    }

    setNotes((prev) =>
      sortNotes(
        prev.map((n) =>
          n.id === note.id
            ? { ...n, content: note.content, edited: nowIso() }
            : n
        )
      )
    );
  }, []);

  // async function clearAudioFiles() {
  //   try {
  //     const rootFiles = await FileSystem.readDirectoryAsync(
  //       FileSystem.documentDirectory!
  //     );
  //     if (rootFiles.includes("ExpoAudio")) {
  //       const audioFiles = await FileSystem.readDirectoryAsync(
  //         FileSystem.documentDirectory + "ExpoAudio"
  //       );
  //       for (const f of audioFiles) {
  //         if (f.endsWith(".m4a")) {
  //           await FileSystem.deleteAsync(
  //             FileSystem.documentDirectory + "ExpoAudio/" + f,
  //             { idempotent: true }
  //           );
  //         }
  //       }
  //     }
  //   } catch (e) {
  //     console.error("Erro limpando áudios", e);
  //   }
  // }

  // async function resetAll() {
  //   await AsyncStorage.removeItem("notes");
  //   await clearAudioFiles();
  // }

  // const handleResetAll = async () => {
  //   await resetAll();
  //   setNotes([]);
  // };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={styles.containerText}>
          <Text style={styles.title}>My notes</Text>
        </View>

        <View style={{ flex: 1 }}>
          <NoteList
            notes={notes}
            playingId={playingId}
            playingStatus={playingStatus}
            onPlayAudio={onPlayAudio}
            onTogglePin={onTogglePin}
            onEdit={onEdit}
            contentContainerStyle={{
              paddingBottom: inputHeight + 12,
            }}
          />
        </View>

        {/* MEÇA AQUI a altura do InputBar (não na lista) */}
        <View onLayout={(e) => setInputHeight(e.nativeEvent.layout.height)}>
          <InputBar
            value={input}
            onChange={handleTextChange}
            currentTags={currentTags}
            onSubmitText={addTextNote}
            onStartRecord={onStartRecord}
            onStopRecord={onStopRecord}
            isRecording={recorderState.isRecording}
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 2,
    backgroundColor: "#EDE1D1",
  },
  containerText: {
    paddingVertical: 8,
  },
  title: { fontSize: 52, fontWeight: "bold", marginBottom: 10 },
  inputWrapper: { paddingTop: 2 },
});
