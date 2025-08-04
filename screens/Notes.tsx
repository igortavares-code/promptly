import "react-native-get-random-values";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { v4 as uuidv4 } from "uuid";
import {
  useAudioRecorder,
  RecordingPresets,
  setAudioModeAsync,
  requestRecordingPermissionsAsync,
  useAudioPlayer,
  useAudioRecorderState,
} from "expo-audio";

type Note = {
  id: string;
  conteudo: string | null;
  tipo: "texto" | "audio";
  criado: string;
  editado: string | null;
};

export default function Notes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [input, setInput] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");

  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(audioRecorder);

  const [tocandoId, setTocandoId] = useState<string | null>(null);
  const player = useAudioPlayer(
    tocandoId ? notes.find((n) => n.id === tocandoId)?.conteudo ?? null : null
  );

  useEffect(() => {
    if (tocandoId) {
      player.play();
    } else {
      player.pause();
    }
  }, [tocandoId]);

  useEffect(() => {
    (async () => {
      const { granted } = await requestRecordingPermissionsAsync();
      if (!granted) {
        Alert.alert(
          "Permissão Negada",
          "Permissão para acessar o microfone foi negada."
        );
      }
      await setAudioModeAsync({
        playsInSilentMode: true,
        allowsRecording: true,
      });
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const dados = await AsyncStorage.getItem("notes");
      if (dados) setNotes(JSON.parse(dados));
    })();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  const toggleAudio = (nota: Note) => {
    if (nota.tipo !== "audio" || !nota.conteudo) return;

    if (tocandoId === nota.id) {
      setTocandoId(null);
    } else {
      setTocandoId(null);
      setTimeout(() => {
        setTocandoId(nota.id);
      }, 100);
    }
  };

  useEffect(() => {
    if (!tocandoId) player.pause();
  }, [tocandoId]);

  const salvarBlobComoBase64 = async (blobUri: string): Promise<string> => {
    const response = await fetch(blobUri);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const adicionarNota = () => {
    if (!input.trim()) return;
    const newNote: Note = {
      id: uuidv4(),
      conteudo: input.trim(),
      tipo: "texto",
      criado: new Date().toLocaleString(),
      editado: null,
    };
    setNotes((old) => [...old, newNote]);
    setInput("");
  };

  const iniciarEdicao = (nota: Note) => {
    if (nota.tipo === "texto") {
      setEditingId(nota.id);
      setEditingText(nota.conteudo || "");
    } else {
      Alert.alert("Aviso", "Só é possível editar notas de texto.");
    }
  };

  const salvarEdicao = () => {
    if (!editingId) return;
    const atualizadas = notes.map((n) =>
      n.id === editingId
        ? { ...n, conteudo: editingText, editado: new Date().toLocaleString() }
        : n
    );
    setNotes(atualizadas);
    setEditingId(null);
    setEditingText("");
  };

  const cancelarEdicao = () => {
    setEditingId(null);
    setEditingText("");
  };

  const gravar = async () => {
    try {
      await audioRecorder.prepareToRecordAsync();
      audioRecorder.record();
    } catch (error) {
      Alert.alert("Erro", "Não foi possível iniciar a gravação.");
      console.error(error);
    }
  };

  const pararGravacao = async () => {
    try {
      await audioRecorder.stop();

      if (!audioRecorder.uri) {
        Alert.alert("Erro", "Não foi possível salvar o áudio.");
        return;
      }

      let uriContent: string;

      if (Platform.OS === "web") {
        uriContent = await salvarBlobComoBase64(audioRecorder.uri);
      } else {
        uriContent = audioRecorder.uri; // salva URI direto
      }

      const newAudioNote: Note = {
        id: uuidv4(),
        conteudo: uriContent,
        tipo: "audio",
        criado: new Date().toLocaleString(),
        editado: null,
      };

      setNotes((old) => [...old, newAudioNote]);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível parar a gravação.");
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Notas estilo WhatsApp</Text>

      <ScrollView style={styles.lista}>
        {notes.map((item) => (
          <TouchableOpacity
            key={item.id}
            onPress={() => (editingId === item.id ? null : iniciarEdicao(item))}
            style={styles.nota}
          >
            <Text style={styles.timestamp}>
              {item.criado} - {item.tipo === "audio" ? "Áudio" : "Texto"}
            </Text>
            <Text>{item.conteudo}</Text>

            {item.tipo === "texto" && editingId === item.id ? (
              <>
                <TextInput
                  style={styles.inputEdit}
                  value={editingText}
                  onChangeText={setEditingText}
                  multiline
                />
                <View style={styles.editButtons}>
                  <Button title="Salvar" onPress={salvarEdicao} />
                  <Button title="Cancelar" onPress={cancelarEdicao} />
                </View>
              </>
            ) : item.tipo === "texto" ? (
              <Text style={styles.texto}>{item.conteudo}</Text>
            ) : (
              <TouchableOpacity
                onPress={() => toggleAudio(item)}
                style={{ marginTop: 10 }}
              >
                <Text style={{ color: "blue" }}>
                  {tocandoId === item.id ? "Pausar Áudio" : "Tocar Áudio"}
                </Text>
                {tocandoId === item.id && <Text>🔊 Tocando...</Text>}
              </TouchableOpacity>
            )}

            {item.editado && (
              <Text style={styles.editado}>Editado em {item.editado}</Text>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TextInput
        style={styles.input}
        placeholder="Digite uma nota..."
        value={input}
        onChangeText={setInput}
      />

      <View style={styles.botoes}>
        <Button title="Criar Nota de Texto" onPress={adicionarNota} />
        <Button
          title={recorderState.isRecording ? "Parar Gravação" : "Gravar Áudio"}
          onPress={recorderState.isRecording ? pararGravacao : gravar}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f5f5f5" },
  titulo: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  lista: { flex: 1, marginBottom: 10 },
  nota: {
    backgroundColor: "#e0f7fa",
    padding: 10,
    marginBottom: 8,
    borderRadius: 8,
  },
  texto: { fontSize: 16 },
  timestamp: { fontSize: 12, color: "#555" },
  editado: { fontSize: 12, color: "#999", fontStyle: "italic" },
  input: {
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 5,
    padding: 10,
    marginBottom: 8,
    backgroundColor: "#fff",
    minHeight: 40,
  },
  inputEdit: {
    borderWidth: 1,
    borderColor: "#666",
    borderRadius: 5,
    padding: 8,
    backgroundColor: "#fff",
    minHeight: 40,
  },
  botoes: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  editButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },
});
