export type NoteType = "text" | "audio";

export interface Note {
  id: string;
  content: string;
  type: NoteType;
  createdOn: string;
  edited: string | null;
  tags: string[];
  pinned: boolean;
}