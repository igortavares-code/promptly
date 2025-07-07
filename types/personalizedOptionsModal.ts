export type Option = {
  categoria: string;
  formatos: string[];
};

export interface PersonalizedOptionsModalProps {
  visible: boolean;
  onClose: () => void;
  options: Option[];
  selected: string[];
  onOptionsChange: (value: string[] | ((prev: string[]) => string[])) => void;
}
