import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import Text from '../Text/Text';

interface FormatItemProps {
  format: string;
  selected: boolean;
  onToggle: (format: string) => void;
}

export const FormatItem: React.FC<FormatItemProps> = ({
  format,
  selected,
  onToggle,
}) => {
  return (
    <TouchableOpacity onPress={() => onToggle(format)}>
      <Text style={[styles.subitem, selected && styles.selected]}>
        {selected ? "✓ " : ""}
        {format}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  subitem: {
    paddingVertical: 8,
    fontSize: 14,
  },
  selected: {
    color: "#007aff",
    fontWeight: "bold",
  },
});