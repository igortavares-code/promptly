import { create } from "zustand";
import { AIStore } from "../types/store"

export const useAIStore = create<AIStore>((set) => ({
  currentAIInput: "",
  setAIInput: (text) => set({ currentAIInput: text }),
  clearAIInput: () => set({ currentAIInput: "" }),
}));
