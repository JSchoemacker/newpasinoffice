import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, ScrollView } from 'react-native';
import { useDarkMode } from '../contexts/DarkModeContext';
import { MaterialIcons } from '@expo/vector-icons';
import RulesListModal from '../components/RulesListModal';
import { useUser } from '../contexts/UserContext';
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';

export default function PokerScreen() {
  const [rulesModalVisible, setRulesModalVisible] = useState(false);
  const [rulesList, setRulesList] = useState([]);
  // Fetch des règles poker
  useEffect(() => {
    if (rulesModalVisible) {
      const fetchRules = async () => {
        try {
          const db = getFirestore();
          const docSnap = await getDocs(collection(db, 'pokerRules'));
          let rules = [];
          docSnap.docs.forEach(doc => {
            if (doc.id === 'rules') {
              const data = doc.data();
              if (Array.isArray(data.rules)) rules = data.rules;
            }
          });
          setRulesList(rules);
        } catch (err) {
          setRulesList(['Erreur lors du chargement des règles.']);
        }
      };
      fetchRules();
    }
  }, [rulesModalVisible]);
  const { darkMode } = useDarkMode();
  const { userData } = useUser();
  const theme = darkMode
    ? { bg: '#116C2D', text: '#fff', title: '#fff' } // vert foncé style tapis poker
    : { bg: '#1CA049', text: '#fff', title: '#fff' }; // vert clair style tapis poker

  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [createdId, setCreatedId] = useState(null);
  const [tournamentName, setTournamentName] = useState('');
  const [tournamentDate, setTournamentDate] = useState('');
  const [lastWinner, setLastWinner] = useState('');
  const [pokerDocs, setPokerDocs] = useState([]);
  const navigation = useNavigation();
  useEffect(() => {
    const fetchPokerDocs = async () => {
      try {
        const db = getFirestore();
        const pokerRef = collection(db, 'poker');
        const snapshot = await getDocs(pokerRef);
        let docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        // Tri du plus récent au plus ancien
        docs = docs.sort((a, b) => {
          const dateA = a.createdAt?.seconds ? a.createdAt.seconds : new Date(a.createdAt).getTime()/1000;
          const dateB = b.createdAt?.seconds ? b.createdAt.seconds : new Date(b.createdAt).getTime()/1000;
          return dateB - dateA;
        });
        setPokerDocs(docs);
      } catch (err) {
        // Erreur fetch
      }
    };
    fetchPokerDocs();
  }, [modalVisible, createdId]);

  const handleCreatePokerDoc = async () => {
    if (!tournamentName.trim()) {
      setCreatedId('Veuillez entrer un nom de tournoi.');
      return;
    }
    if (!tournamentDate.trim()) {
      setCreatedId('Veuillez entrer une date.');
      return;
    }
    setLoading(true);
    try {
      const db = getFirestore();
      // Nom du document = nom du tournoi uniquement
      const docName = tournamentName.trim();
      // Création du map players avec le nom formaté
      let playersMap = {};
      if (userData?.prenom && userData?.nom) {
        const displayName = `${userData.prenom} ${userData.nom.charAt(0)}.`;
        playersMap[displayName] = 0;
      }
      const docRef = await addDoc(collection(db, 'poker'), {
        name: docName,
        tournamentName: tournamentName.trim(),
        toUntil: tournamentDate.trim(),
        lastWinner: lastWinner.trim(),
        createdAt: new Date(),
        createdBy: userData?.email || 'inconnu',
        players: playersMap,
      });
      setCreatedId(docRef.id);
    } catch (err) {
      setCreatedId('Erreur: ' + err.message);
    }
    setLoading(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}> 
      {/* Icône info en haut à gauche */}
      <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 }}>
        <TouchableOpacity
          onPress={() => setRulesModalVisible(true)}
          style={{
            borderWidth: 2,
            borderColor: '#bbb',
            borderRadius: 40,
            padding: 5,
            backgroundColor: '#fff',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <MaterialIcons name="info-outline" size={32} color="black" />
        </TouchableOpacity>
        {userData?.isPoker === true && (
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={{
              borderWidth: 3,
              borderColor: '#bbb',
              borderRadius: 40,
              padding: 5,
              backgroundColor: '#fff',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <MaterialIcons name="add" size={40} color={theme.title} style={{ fontWeight: 'bold', color: 'red' }} />
          </TouchableOpacity>
        )}
      </View>
      <ScrollView style={{ width: '100%' }} contentContainerStyle={{ alignItems: 'center', justifyContent: 'center', paddingBottom: 32 }}>
        <Text style={[styles.title, { color: theme.title, textAlign: 'center' }]}>Gunther Poker Tour</Text>
        {/* Liste des tournois poker */}
        <View style={{ width: '100%', marginTop: 24, alignItems: 'center' }}>
          {pokerDocs.length === 0 ? (
            <Text style={{ color: theme.text, fontSize: 16, textAlign: 'center' }}>Aucun tournoi trouvé.</Text>
          ) : (
            pokerDocs.map(doc => (
              <TouchableOpacity
                key={doc.id}
                style={{
                  backgroundColor: '#fff',
                  borderRadius: 12,
                  marginBottom: 16,
                  padding: 16,
                  shadowColor: '#000',
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 2,
                  width: '95%',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onPress={() => navigation.navigate('PokerDetail', { ...doc })}
              >
                <Text style={{ color: theme.title, fontSize: 20, fontWeight: 'bold', color: 'black', textAlign: 'center' }}>{doc.name}</Text>
                <Text style={{ color: theme.text, fontSize: 14, marginTop: 4, color: 'black', textAlign: 'center' }}>{doc.toUntil ? doc.toUntil : ''}</Text>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>

      {/* Modal création tournoi */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)' }}>
          <View style={{ backgroundColor: theme.bg, padding: 24, borderRadius: 16, alignItems: 'center', width: '80%' }}>
            <Text style={{ color: theme.title, fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>Créer un tournoi Poker</Text>
            <TextInput
              style={{
                width: '100%',
                backgroundColor: '#fff',
                color: '#333',
                borderRadius: 8,
                padding: 10,
                marginBottom: 16,
                fontSize: 16,
              }}
              placeholder="Nom du tournoi"
              placeholderTextColor="#888"
              value={tournamentName}
              onChangeText={setTournamentName}
              autoFocus
            />
            <TextInput
              style={{
                width: '100%',
                backgroundColor: '#fff',
                color: '#333',
                borderRadius: 8,
                padding: 10,
                marginBottom: 16,
                fontSize: 16,
              }}
              placeholder="Date (du xx/xx au XX/XX)"
              placeholderTextColor="#888"
              value={tournamentDate}
              onChangeText={setTournamentDate}
            />
            <TextInput
              style={{
                width: '100%',
                backgroundColor: '#fff',
                color: '#333',
                borderRadius: 8,
                padding: 10,
                marginBottom: 16,
                fontSize: 16,
              }}
              placeholder="Vainqueur précédent"
              placeholderTextColor="#888"
              value={lastWinner}
              onChangeText={setLastWinner}
            />
            <TouchableOpacity
              style={{ backgroundColor: theme.title, padding: 12, borderRadius: 8, marginBottom: 16 }}
              onPress={handleCreatePokerDoc}
              disabled={loading}
            >
              <Text style={{ color: 'black', fontWeight: 'bold' }}>{loading ? 'Création...' : 'Créer'}</Text>
            </TouchableOpacity>
            {createdId && (
              <Text style={{ color: theme.text, marginTop: 8 }}>
                {createdId.startsWith('Erreur') ? createdId : `Document créé : ${createdId}`}
              </Text>
            )}
            <TouchableOpacity style={{ marginTop: 24 }} onPress={() => { setModalVisible(false); setCreatedId(null); setTournamentName(''); setTournamentDate(''); setLastWinner(''); }}>
              <Text style={{ color: theme.title, fontWeight: 'bold' }}>Fermer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal règles poker */}
      <Modal visible={rulesModalVisible} transparent animationType="fade">
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)' }}>
          <View style={{ backgroundColor: '#fff', padding: 24, borderRadius: 16, alignItems: 'center', minWidth: 280, maxWidth: 340 }}>
            <RulesListModal rules={rulesList} visible={true} onClose={() => setRulesModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
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

