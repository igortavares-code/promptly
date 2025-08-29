export type AIStore = {
  currentAIInput: string;
  setAIInput: (text: string) => void;
  clearAIInput: () => void;
};