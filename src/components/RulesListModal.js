import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

export default function RulesListModal({ rules, visible, onClose }) {
  if (!visible) return null;
  return (
    <View style={styles.overlay}>
      <View style={styles.modal}>
        <Text style={styles.title}>Règles du Poker</Text>
        <ScrollView style={{maxHeight:320}}>
          {Array.isArray(rules) && rules.length > 0 ? (
            rules.map((rule, idx) => (
              <Text key={idx} style={styles.ruleItem}>{rule}</Text>
            ))
          ) : (
            <Text style={styles.ruleItem}>Aucune règle trouvée.</Text>
          )}
        </ScrollView>
        <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
          <Text style={styles.closeText}>Fermer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  closeBtn: {
    marginTop: 24,
    backgroundColor: '#116C2D',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    minWidth: 120,
  },
  closeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  modal: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    minWidth: 280,
    maxWidth: 340,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#116C2D',
    marginBottom: 16,
    textAlign: 'center',
  },
  ruleItem: {
    fontSize: 16,
    color: '#116C2D',
    marginBottom: 8,
    textAlign: 'left',
  },
});
