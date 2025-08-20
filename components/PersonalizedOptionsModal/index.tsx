import React from "react";
import { Modal, View, Text, StyleSheet, ScrollView, TouchableWithoutFeedback } from "react-native";
import { PersonalizedOptionsModalProps, Option } from "../../types/personalizedOptionsModal";
import { OptionItem } from "./OptionItem";

const PersonalizedOptionsModal: React.FC<PersonalizedOptionsModalProps> = ({
  visible,
  onClose,
  options,
  selected,
  onOptionsChange
}) => {

  const toggleSelection = (format: string) => {
    onOptionsChange((prev) =>
      prev.includes(format)
        ? prev.filter((item) => item !== format)
        : [...prev, format]
    );
  };

  return (
    <Modal visible={visible} animationType="none" presentationStyle="formSheet">
       <TouchableWithoutFeedback onPress={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.content}>
          <ScrollView style={styles.scroll}>
          {options.map((option: Option, index: number) => (
            <OptionItem
              key={index}
              category={option.category}
              formats={option.formats}
              selectedFormats={selected}
              onToggleFormat={toggleSelection}
            />
          ))}

          <Text style={{ marginTop: 10 }}>
            Selected: {selected.join(", ")}
          </Text>
        </ScrollView >
        </View>
      </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
  },
  content: {
    backgroundColor: "#fff",
    margin: 20,
    borderRadius: 8,
    padding: 20,
    height: 400,
    width: 400,
    position: "absolute",
    bottom: 60,
    right: "27%",
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  scroll: {
    paddingRight: 10
  }
});

export default PersonalizedOptionsModal;