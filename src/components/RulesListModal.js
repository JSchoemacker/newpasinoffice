import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';

export default function RulesListModal({ rules, visible, onClose }) {
  if (!visible) return null;
  return (
    <View style={styles.overlay}>
      <ScrollView style={styles.content}>
        {rules.map((rule, idx) => (
          <Text key={idx} style={styles.rule}>{rule}</Text>
        ))}
      </ScrollView>
      <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
        <Text style={styles.closeText}>Fermer</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: { alignItems: 'center', justifyContent: 'center' },
  content: { maxHeight: 300, marginBottom: 16 },
  rule: { fontSize: 16, color: '#222', marginBottom: 8 },
  closeBtn: { padding: 8, backgroundColor: '#eee', borderRadius: 8 },
  closeText: { color: '#007AFF', fontWeight: 'bold' },
});