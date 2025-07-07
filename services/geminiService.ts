import { GoogleGenerativeAI } from "@google/generative-ai";
import { API_KEY } from "@env";
import { ChatMessage } from "../types/chat";
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

let geminiChatSession: any = null;

export const sendPromptToGemini = async (
  prompt: string,
  personalizedPrompt?: string
): Promise<ChatMessage> => {
  if (!geminiChatSession) {
    geminiChatSession = model.startChat({ history: [] });
  }

  const messageToSend =
    prompt + personalizedPrompt;
  const result = await geminiChatSession.sendMessage(messageToSend);
  const text = result.response.text();

  return { role: "model", text };
};
