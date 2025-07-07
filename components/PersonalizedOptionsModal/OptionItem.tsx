import React, { useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { FormatItem } from "./FormatItem";

interface OptionItemProps {
  categoria: string;
  formatos: string[];
  selectedFormats: string[];
  onToggleFormat: (format: string) => void;
}

export const OptionItem: React.FC<OptionItemProps> = ({
  categoria,
  formatos,
  selectedFormats,
  onToggleFormat,
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <View>
      <TouchableOpacity
        style={styles.item}
        onPress={() => setExpanded((prev) => !prev)}
        accessibilityRole="button"
        accessibilityLabel={`Toggle ${categoria}`}
      >
        <Text style={styles.title}>{categoria}</Text>
        <AntDesign name={expanded ? "up" : "down"} size={16} color="black" />
      </TouchableOpacity>

      {expanded && (
        <View style={styles.sublist}>
          {formatos.map((format) => (
            <FormatItem
              key={format}
              format={format}
              selected={selectedFormats.includes(format)}
              onToggle={onToggleFormat}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  title: {
    fontSize: 16,
  },
  sublist: {
    paddingLeft: 16,
    backgroundColor: "#f9f9f9",
  },
});
