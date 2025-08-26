import React, { useState } from 'react';
import AnimatedGoldName from '../components/AnimatedGoldName';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Modal } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useDarkMode } from '../contexts/DarkModeContext';
import { useUser } from '../contexts/UserContext';
import { getFirestore, doc, updateDoc, getDoc } from 'firebase/firestore';
import { MaterialIcons } from '@expo/vector-icons';

export default function PokerDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { darkMode } = useDarkMode();
  const { userData } = useUser();
  const theme = darkMode
    ? { bg: '#116C2D', text: '#fff', title: '#fff' }
    : { bg: '#1CA049', text: '#fff', title: '#fff' };
  const { name, tournamentName, toUntil, createdAt, createdBy, id, lastWinner } = route.params || {};
  const [players, setPlayers] = useState([]);
  const [newPlayer, setNewPlayer] = useState('');
  const [points, setPoints] = useState({});
  const [canJoin, setCanJoin] = useState(false);
  const [joinError, setJoinError] = useState(null);
  const [joinSuccess, setJoinSuccess] = useState(false);
  const [playersData, setPlayersData] = useState(route.params?.players || {});
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [editedScores, setEditedScores] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [playerToDelete, setPlayerToDelete] = useState(null);
  // Trie les joueurs par score décroissant uniquement après sauvegarde ou actualisation
  const [sortTrigger, setSortTrigger] = useState(Date.now());
  const [lastSavedScores, setLastSavedScores] = useState(playersData);

  // Met à jour le trigger et les scores sauvegardés après sauvegarde ou actualisation
  const handleSaveScores = async () => {
    const isDifferent = JSON.stringify(editedScores) !== JSON.stringify(playersData);
    if (!isDifferent) return;
    try {
      const db = getFirestore();
      const pokerDocRef = doc(db, 'poker', route.params.id);
      await updateDoc(pokerDocRef, { players: editedScores });
      await fetchPlayersFromFirestore();
      setLastSavedScores(editedScores);
      setSortTrigger(Date.now());
      console.log('Scores sauvegardés dans Firestore !');
    } catch (err) {
      setJoinError('Erreur Firestore : ' + err.message);
      console.log('Erreur Firestore:', err);
    }
  };

  // Fonction pour actualiser les données des joueurs depuis Firestore
  const fetchPlayersFromFirestore = async () => {
    try {
      const db = getFirestore();
      const pokerDocRef = doc(db, 'poker', route.params.id);
      const docSnap = await getDoc(pokerDocRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setPlayersData(data.players || {});
        setLastSavedScores(data.players || {});
        setSortTrigger(Date.now());
        console.log('Données joueurs actualisées depuis Firestore:', data.players);
      }
    } catch (err) {
      console.log('Erreur lors de l’actualisation des joueurs:', err);
    }
  };

  // Ajout d'un joueur
  const handleAddPlayer = async () => {
    const playerName = newPlayer.trim();
    if (!playerName) return;
    if (playersData && typeof playersData === 'object' && Object.keys(playersData).includes(playerName)) {
      setShowDuplicateModal(true);
      return;
    }
    // Ajout local
    const newPlayers = { ...playersData, [playerName]: 0 };
    setPlayersData(newPlayers);
    setNewPlayer('');
    try {
      const db = getFirestore();
      const pokerDocRef = doc(db, 'poker', route.params.id);
      await updateDoc(pokerDocRef, { players: newPlayers });
      await fetchPlayersFromFirestore();
    } catch (err) {
      setJoinError('Erreur Firestore : ' + err.message);
      console.log('Erreur Firestore:', err);
    }
  };

  React.useEffect(() => {
    // Met à jour editedScores à chaque actualisation des données Firestore
    setEditedScores(playersData);
  }, [playersData]);

  // Ajout de points
  const handleAddPoints = (player, value) => {
    setEditedScores(prev => ({ ...prev, [player]: (prev[player] || 0) + value }));
  };

  React.useEffect(() => {
    if (route.params) {
      console.log('Document Firestore reçu sur PokerDetailScreen :', route.params);
    }
    if (userData?.prenom && userData?.nom) {
      const displayName = `${userData.prenom} ${userData.nom.charAt(0)}.`;
      if (route.params?.players && typeof route.params.players === 'object') {
        const playerKeys = Object.keys(route.params.players);
        const hasPlayerKey = playerKeys.includes(displayName);
        setCanJoin(!hasPlayerKey);
        console.log(`displayName est une clé dans players :`, hasPlayerKey);
      } else {
        setCanJoin(true);
      }
    }
  }, [userData, route.params]);

  const handleJoin = async () => {
    if (playersData && typeof playersData === 'object') {
      const displayName = `${userData.prenom} ${userData.nom.charAt(0)}.`;
      const newPlayers = { ...playersData, [displayName]: 0 };
      setCanJoin(false);
      setJoinError(null);
      setJoinSuccess(false);
      try {
        const db = getFirestore();
        const pokerDocRef = doc(db, 'poker', route.params.id);
        await updateDoc(pokerDocRef, { players: newPlayers });
        setJoinSuccess(true);
        setPlayersData(newPlayers);
        console.log('Joueur ajouté dans Firestore !');
        await fetchPlayersFromFirestore();
      } catch (err) {
        setJoinError('Erreur Firestore : ' + err.message);
        console.log('Erreur Firestore:', err);
      }
    } else {
      setJoinError('Aucun objet players trouvé dans les props !');
      console.log('Aucun objet players trouvé dans les props !');
    }
  };

  React.useEffect(() => {
    if (userData?.prenom && userData?.nom) {
      const displayName = `${userData.prenom} ${userData.nom.charAt(0)}.`;
      if (playersData && typeof playersData === 'object') {
        const playerKeys = Object.keys(playersData);
        const hasPlayerKey = playerKeys.includes(displayName);
        setCanJoin(!hasPlayerKey);
        console.log(`displayName est une clé dans players :`, hasPlayerKey);
      } else {
        setCanJoin(true);
      }
    }
  }, [userData, playersData]);

  // Actualise les données à l'arrivée sur PokerDetailScreen
  React.useEffect(() => {
    fetchPlayersFromFirestore();
  }, [route.params?.id]);

  // Ajout d'un joueur (champ et bouton toujours affichés si isPoker)
  const renderAddPlayerInput = () => (
    userData?.isPoker === true && (
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
        <TextInput
          style={styles.input}
          placeholder="Nom du joueur"
          value={newPlayer}
          onChangeText={setNewPlayer}
        />
        <TouchableOpacity style={{padding:10, borderRadius:8, backgroundColor:'#fff'}} onPress={handleAddPlayer}>
          <Text style={{ color: '#000', fontWeight: 'bold' }}>Ajouter</Text>
        </TouchableOpacity>
      </View>
    )
  );

  // Trie les joueurs uniquement selon les scores sauvegardés
  const sortedPlayers = React.useMemo(() => {
    return Object.keys(lastSavedScores).sort((a, b) => (lastSavedScores[b] || 0) - (lastSavedScores[a] || 0));
  }, [sortTrigger, lastSavedScores]);

  // Actualise PokerScreen à la sortie
  React.useEffect(() => {
    return () => {
      // On force PokerScreen à se rafraîchir en passant un paramètre
      if (navigation.canGoBack()) {
        navigation.navigate('Poker', { refresh: Date.now() });
      }
    };
  }, []);

  const openDeleteModal = (player) => {
    setPlayerToDelete(player);
    setShowDeleteModal(true);
  };

  const handleDeletePlayer = async () => {
    if (!playerToDelete) return;
    const updatedScores = { ...editedScores };
    delete updatedScores[playerToDelete];
    setEditedScores(updatedScores);
    setShowDeleteModal(false);
    setPlayerToDelete(null);
    try {
      const db = getFirestore();
      const pokerDocRef = doc(db, 'poker', route.params.id);
      await updateDoc(pokerDocRef, { players: updatedScores });
      await fetchPlayersFromFirestore();
      console.log('Joueur supprimé et Firestore actualisé !');
    } catch (err) {
      setJoinError('Erreur Firestore : ' + err.message);
      console.log('Erreur Firestore:', err);
    }
  };

  console.log(players)
  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.bg }]}> 
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 18 }}>← Retour</Text>
      </TouchableOpacity>
      <Text style={styles.title}>{tournamentName || name}</Text>
      <Text style={styles.subtitle}>{toUntil}</Text>
  

      <View style={styles.section}>
        <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center', width:'100%', marginBottom:5}}>
          <Text style={styles.sectionTitle}>Joueurs</Text>
          <View style={{flexDirection:'row'}}>
            <TouchableOpacity onPress={fetchPlayersFromFirestore} style={{padding:8, borderRadius:8, backgroundColor:'#fff', marginRight:8}}>
              <Text style={{color:'#116C2D', fontWeight:'bold'}}>Actualiser</Text>
            </TouchableOpacity>
            {userData?.isPoker === true && (
              <TouchableOpacity onPress={handleSaveScores} style={{padding:8, borderRadius:8, backgroundColor:'#fff'}}>
                <Text style={{color:'#116C2D', fontWeight:'bold'}}>Sauvegarder</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
        <ScrollView style={{maxHeight:320, width:'100%'}} contentContainerStyle={{paddingBottom:24}}>
          {sortedPlayers.length === 0 ? (
            <Text style={styles.subtitle}>Aucun joueur ajouté.</Text>
          ) : (
            sortedPlayers.map(player => (
              <View key={player} style={[styles.playerRow, {justifyContent:'space-between'}]}>
                <View style={{flex:1, flexDirection:'row', alignItems:'center'}}>
                  {userData?.isPoker === true && (
                    <TouchableOpacity onPress={() => openDeleteModal(player)} style={{marginLeft:8}}>
                      <View style={{width:24, height:24, borderRadius:12, backgroundColor:'red', alignItems:'center', justifyContent:'center', marginRight: 5}}>
                        <MaterialIcons name="close" size={18} color="#fff" />
                      </View>
                    </TouchableOpacity>
                  )}
                  {lastWinner && player === lastWinner ? (
                    <AnimatedGoldName name={player} />
                  ) : (
                    <Text style={[styles.playerName, {flexShrink:1, minWidth:80}]} numberOfLines={1} ellipsizeMode="tail">{player}</Text>
                  )}
                </View>
                <View style={{flexDirection:'row', alignItems:'center', minWidth:120, justifyContent:'center'}}>
                  {userData?.isPoker === true && (
                    <TouchableOpacity style={styles.pointBtn} onPress={() => handleAddPoints(player, -1)}>
                      <Text style={{ color: '#fff' }}>-</Text>
                    </TouchableOpacity>
                  )}
                  <Text style={{fontSize:16, fontWeight:'bold', color:'#116C2D', marginHorizontal:8, minWidth:32, textAlign:'center'}}>{editedScores[player]}</Text>
                  {userData?.isPoker === true && (
                    <TouchableOpacity style={styles.pointBtn} onPress={() => handleAddPoints(player, 1)}>
                      <Text style={{ color: '#fff' }}>+</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))
          )}
        </ScrollView>
      </View>
 

        <View style={{position:'absolute', bottom:0, left:0, right:0, alignItems:'center', paddingBottom:24, backgroundColor:'transparent'}}>
          {userData?.isPoker === true && (
           <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
          <TextInput
            style={styles.input}
            placeholder="Nom du joueur"
            value={newPlayer}
            onChangeText={setNewPlayer}
          />
          <TouchableOpacity style={{padding:10, borderRadius:8, backgroundColor:'#fff'}} onPress={handleAddPlayer}>
            <Text style={{ color: '#000', fontWeight: 'bold' }}>Ajouter</Text>
          </TouchableOpacity>
        </View>
          )}
               {canJoin && (
          <View>
          <TouchableOpacity style={{backgroundColor:'#fff', padding:16, borderRadius:16, minWidth:200, alignItems:'center', shadowColor:'#000', shadowOpacity:0.1, shadowRadius:8, elevation:2}} onPress={handleJoin}>
            <Text style={{color:'#116C2D', fontWeight:'bold', fontSize:18}}>Rejoindre</Text>
          </TouchableOpacity>
          </View>
          )}
        </View>
      
      {joinSuccess && (
        <Text style={{color:'#1CA049', fontWeight:'bold', fontSize:16, marginTop:16}}>Inscription réussie !</Text>
      )}
      {joinError && (
        <Text style={{color:'red', fontWeight:'bold', fontSize:16, marginTop:16}}>{joinError}</Text>
      )}
      {showDuplicateModal && (
        <Modal
          transparent
          animationType="fade"
          visible={showDuplicateModal}
          onRequestClose={() => setShowDuplicateModal(false)}
        >
          <View style={{flex:1, justifyContent:'center', alignItems:'center', backgroundColor:'rgba(0,0,0,0.3)'}}>
            <View style={{backgroundColor:'#fff', padding:24, borderRadius:16, alignItems:'center'}}>
              <Text style={{color:'#116C2D', fontWeight:'bold', fontSize:18, marginBottom:12}}>Ce joueur existe déjà !</Text>
              <TouchableOpacity onPress={() => setShowDuplicateModal(false)} style={{backgroundColor:'#116C2D', padding:10, borderRadius:8}}>
                <Text style={{color:'#fff', fontWeight:'bold'}}>Fermer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
      {showDeleteModal && (
        <Modal
          transparent
          animationType="fade"
          visible={showDeleteModal}
          onRequestClose={() => setShowDeleteModal(false)}
        >
          <View style={{flex:1, justifyContent:'center', alignItems:'center', backgroundColor:'rgba(0,0,0,0.3)'}}>
            <View style={{backgroundColor:'#fff', padding:24, borderRadius:16, alignItems:'center'}}>
              <Text style={{color:'#116C2D', fontWeight:'bold', fontSize:18, marginBottom:12}}>Confirmer la suppression du joueur</Text>
              <View style={{flexDirection:'row', marginTop:16}}>
                <TouchableOpacity onPress={() => setShowDeleteModal(false)} style={{backgroundColor:'#bbb', padding:10, borderRadius:8, marginRight:12}}>
                  <Text style={{color:'#fff', fontWeight:'bold'}}>Annuler</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleDeletePlayer} style={{backgroundColor:'red', padding:10, borderRadius:8}}>
                  <Text style={{color:'#fff', fontWeight:'bold'}}>Confirmer</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    alignItems: 'center',
    minHeight: '100%',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#fff',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 4,
    textAlign: 'center',
  },
  section: {
    marginTop: 24,
    width: '100%',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    width: 180,
    marginRight: 8,
  },
  addBtn: {
    backgroundColor: '#116C2D',
    padding: 10,
    borderRadius: 8,
  },
  backBtn: {
    alignSelf: 'flex-start',
    marginBottom: 16,
    backgroundColor: '#116C2D',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 8,
    width: '100%',
    justifyContent: 'space-between',
  },
  playerName: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#116C2D',
  },
  playerPoints: {
    fontSize: 16,
    color: '#1CA049',
    marginHorizontal: 8,
  },
  pointBtn: {
    backgroundColor: '#1CA049',
    padding: 6,
    borderRadius: 6,
    marginHorizontal: 2,
  },
});
