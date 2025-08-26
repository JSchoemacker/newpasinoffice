import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useDarkMode } from '../contexts/DarkModeContext';

export default function GGRScreen() {
  const { darkMode } = useDarkMode();
  const theme = darkMode
    ? { bg: '#181818', text: '#fff', title: '#e60936' }
    : { bg: '#fff', text: '#333', title: '#2F2F7A' };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}> 
      <Text style={[styles.title, { color: theme.title }]}>GGR</Text>
      <Text style={[styles.text, { color: theme.text }]}>En cours de développement</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  text: {
    fontSize: 18,
  },
});
