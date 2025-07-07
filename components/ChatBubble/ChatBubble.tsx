import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { ChatMessage } from '../utils/types';

export const ChatBubble = ({ message }: { message: ChatMessage }) => (
  <View style={[styles.bubble, message.role === 'user' ? styles.user : styles.model]}>
    <Text style={styles.text}>{message.text}</Text>
  </View>
);

const styles = StyleSheet.create({
  bubble: {
    maxWidth: '80%',
    padding: 10,
    borderRadius: 15,
    marginBottom: 10,
  },
  user: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6',
    borderBottomRightRadius: 2,
  },
  model: {
    alignSelf: 'flex-start',
    backgroundColor: '#E5E5EA',
    borderBottomLeftRadius: 2,
  },
  text: {
    fontSize: 16,
    color: '#000',
  },
});