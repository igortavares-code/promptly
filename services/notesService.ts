import { Note } from "../types/notes";
import { loadJSON, saveJSON } from "./storage";

const STORAGE_KEY = "notes";

export async function loadNotes(): Promise<Note[]> {
  return loadJSON<Note[]>(STORAGE_KEY, []);
}

export async function saveNotes(notes: Note[]): Promise<void> {
  return saveJSON(STORAGE_KEY, notes);
}

export function sortNotes(notes: Note[]): Note[] {
  return [...notes].sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    return new Date(b.createdOn).getTime() - new Date(a.createdOn).getTime();
  });
}