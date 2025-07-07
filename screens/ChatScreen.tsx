import React, { useState, useEffect, useRef } from "react";
import {
  View,
  ScrollView,
  Text,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import InputBox from "../components/InputBox/InputBox";
import PersonalizedOptionsModal from "../components/PersonalizedOptionsModal/index";
import { promptOptions } from "../components/promptOptions";
import { sendPromptToGemini } from "../services/geminiService";
import { ChatMessage } from "../types/chat";

export default function ChatScreen() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selected, setOptionsSelected] = useState<string[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const scrollViewRef = useRef<ScrollView>(null);

  // Scroll to bottom when messages update
  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [chatMessages]);

  const itens = ['carro', 'moto', 'bicicleta'];
  const generateContent = async () => {
    if (!prompt.trim()) {
      setError("Por favor, digite um prompt.");
      return;
    }

    setLoading(true);
    setError(null);

    const personalizedPrompt = selected.length === 0 ? '' : ` Por favor, crie o conteúdo seguindo esse ou esses formatos: ${selected.join(', ')}`;
    const userMessage: ChatMessage = { role: "user", text: prompt};
    setChatMessages((prev) => [...prev, userMessage]);
    const currentPrompt = prompt;
    setPrompt("");

    try {
      // Envia o prompt para o serviço Gemini
      const responseText = await sendPromptToGemini(
        currentPrompt,
        personalizedPrompt
      );
      const modelMessage: ChatMessage = {
        role: "model",
        text: responseText.text,
      };
      setChatMessages((prev) => [...prev, modelMessage]);
    } catch (e) {
      setError("Ocorreu um erro ao gerar o conteúdo. Tente novamente.");
      setChatMessages((prev) => prev.slice(0, -1)); // remove user message se erro
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "rgb(237 225 209)" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
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

      <ScrollView
        ref={scrollViewRef}
        style={{ flex: 1, paddingHorizontal: 16, paddingTop: 20 }}
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        {chatMessages.length === 0 ? (
          <Text style={{ textAlign: "center", marginTop: 50, color: "#666" }}>
            Comece uma conversa com o Gemini!
          </Text>
        ) : (
          chatMessages.map((message, i) => (
            <View
              key={i}
              style={{
                maxWidth: "80%",
                padding: 10,
                borderRadius: 15,
                marginBottom: 10,
                backgroundColor:
                  message.role === "user" ? "#DCF8C6" : "#E5E5EA",
                alignSelf: message.role === "user" ? "flex-end" : "flex-start",
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  color: "#000",
                }}
              >
                {message.text}
              </Text>
            </View>
          ))
        )}

        {loading && (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              alignSelf: "flex-start",
              backgroundColor: "#E5E5EA",
              padding: 10,
              borderRadius: 15,
              marginBottom: 10,
            }}
          >
            <ActivityIndicator size="small" color="#0000ff" />
            <Text style={{ marginLeft: 8, color: "#000" }}>
              Gerando resposta...
            </Text>
          </View>
        )}

        {error && (
          <Text style={{ color: "red", textAlign: "center", marginTop: 10 }}>
            {error}
          </Text>
        )}
      </ScrollView>

      <InputBox
        prompt={prompt}
        setPrompt={setPrompt}
        onSend={generateContent}
        onOpenOptions={() => setModalVisible(!modalVisible)}
        loading={loading}
      />

      <PersonalizedOptionsModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        options={promptOptions}
        selected={selected}
        onOptionsChange={setOptionsSelected}
      />
    </KeyboardAvoidingView>
  );
}
