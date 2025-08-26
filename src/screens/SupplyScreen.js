import React, { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { useUser } from '../contexts/UserContext';
import { useDarkMode } from '../contexts/DarkModeContext';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { getFirestore, doc, getDoc, updateDoc, FieldPath } from 'firebase/firestore';
import { setDoc } from 'firebase/firestore';
import { deleteField } from 'firebase/firestore';

export default function SupplyScreen() {
  // Générer le fichier TXT et supprimer la liste
  const handleExportAndClear = async () => {
    try {
      // Génère le texte de la liste
      let txt = 'Liste des fournitures\n\n';
      Object.entries(supplyList).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach(val => {
            txt += `- ${key}: ${val}\n`;
          });
        } else {
          txt += `- ${key}: ${value}\n`;
        }
      });

      const fileName = `fournitures_${Date.now()}.txt`;

      if (Platform.OS === 'web') {
        // Web : utilise Blob et déclenche le téléchargement
        const blob = new Blob([txt], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      } else {
        // Mobile : utilise expo-file-system et expo-sharing
        const fileUri = FileSystem.documentDirectory + fileName;
        await FileSystem.writeAsStringAsync(fileUri, txt);
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(fileUri);
        }
      }

      // Supprime tous les éléments de la liste sur Firestore
      const db = getFirestore();
      const listDocRef = doc(db, 'supply', 'list');
      const updates = {};
      Object.keys(supplyList).forEach(key => {
        updates[key] = deleteField();
      });
      await updateDoc(listDocRef, updates);
      await refreshList();
      alert('Fichier exporté et liste supprimée !');
    } catch (err) {
      alert('Erreur export ou suppression: ' + err);
    }
  };
  // ...existing code...
  // Fonction pour rafraîchir la liste
  const refreshList = async () => {
    setLoading(true);
    try {
      const db = getFirestore();
      const listDocRef = doc(db, 'supply', 'list');
      const docSnap = await getDoc(listDocRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setSupplyList(data || {});
      } else {
        setSupplyList({});
      }
    } catch (err) {
      setSupplyList([]);
    }
    setLoading(false);
  };

  // Modifier la valeur d'une entrée
  // On stocke l'ancienne valeur avant modification
  const [oldModalValue, setOldModalValue] = useState('');

  const handleUpdate = async () => {
    console.log('handleUpdate appelé', modalKey, modalValue);
    try {
      const db = getFirestore();
      const listDocRef = doc(db, 'supply', 'list');
      // Met à jour uniquement la valeur sélectionnée dans le tableau
      const docSnap = await getDoc(listDocRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        let arr = [];
        if (Array.isArray(data[modalKey])) {
          arr = [...data[modalKey]];
        } else if (typeof data[modalKey] === 'string') {
          arr = [data[modalKey]];
        }
        // Trouve l'index de l'ancienne valeur (avant modification)
        const idx = arr.indexOf(oldModalValue);
        if (idx !== -1) {
          arr[idx] = modalValue;
        }
        await updateDoc(listDocRef, { [modalKey]: arr });
      }
      setModalVisible(false);
      await refreshList();
      console.log('Mise à jour réussie');
    } catch (err) {
      console.log('Erreur update:', err);
    }
  };

  // Supprimer une entrée
  const handleDelete = async () => {
    console.log('handleDelete appelé', modalKey, modalValue);
    // Bloque les caractères interdits pour Firestore
    const forbidden = /[~*\/\[\]\n]/;
    if (
      !modalKey ||
      modalKey.startsWith('.') ||
      modalKey.endsWith('.') ||
      modalKey.includes('..') ||
      forbidden.test(modalKey)
    ) {
      console.log('Clé Firestore invalide pour suppression:', modalKey);
      return;
    }
    try {
      const db = getFirestore();
      const listDocRef = doc(db, 'supply', 'list');
      const docSnap = await getDoc(listDocRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        let arr = [];
        if (Array.isArray(data[modalKey])) {
          arr = data[modalKey].filter(val => val !== modalValue);
          // Si le tableau est vide après suppression, on supprime la clé
          if (arr.length === 0) {
            await updateDoc(listDocRef, { [modalKey]: deleteField() });
          } else {
            await updateDoc(listDocRef, { [modalKey]: arr });
          }
        } else if (typeof data[modalKey] === 'string') {
          // Si c'est une string, on supprime la clé si elle correspond
          await updateDoc(listDocRef, { [modalKey]: deleteField() });
        }
      }
      setModalVisible(false);
      await refreshList();
      console.log('Suppression réussie');
    } catch (err) {
      console.log('Erreur delete:', err);
    }
  };
  const { darkMode } = useDarkMode();
  const theme = darkMode
    ? { bg: '#181818', text: '#fff', card: '#232323', icon: '#fff', border: '#333' }
    : { bg: '#fff', text: '#333', card: '#fff', icon: '#116C2D', border: '#e0e0e0' };
  const [supplyList, setSupplyList] = useState({});
  const [loading, setLoading] = useState(true);
  const { userData } = useUser();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalKey, setModalKey] = useState(null);
  const [modalValue, setModalValue] = useState('');
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [addValue, setAddValue] = useState('');

  useEffect(() => {
    const fetchSupplyList = async () => {
      try {
        const db = getFirestore();
        const listDocRef = doc(db, 'supply', 'list');
        const docSnap = await getDoc(listDocRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setSupplyList(data || {});
        } else {
          setSupplyList({});
        }
      } catch (err) {
        setSupplyList([]);
      }
      setLoading(false);
    };
    fetchSupplyList();
  }, []);

  // Préparation du displayName custom
  let customDisplayName = null;
  if (userData && userData.prenom && userData.nom) {
    customDisplayName = `${userData.prenom} ${userData.nom.charAt(0)}`;
  }

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.bg }]}> 
      <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between', width:'100%', marginBottom:24, marginTop: 5, paddingLeft: 12, paddingRight: 12}}>
        <Text style={[styles.title, { color: theme.text }]}>Fournitures</Text>
        <View style={{flexDirection:'row', alignItems:'center'}}>
          {userData?.isSupply === true && (
            <TouchableOpacity style={{backgroundColor: 'white', borderRadius:24, padding:8, marginRight:8}} onPress={handleExportAndClear}>
              <MaterialIcons name="picture-as-pdf" size={28} color={theme.bg} />
            </TouchableOpacity>
          )}
          <TouchableOpacity style={{backgroundColor: theme.icon, borderRadius:24, padding:8}} onPress={() => setAddModalVisible(true)}>
            <MaterialIcons name="add" size={28} color={theme.bg} />
          </TouchableOpacity>
        </View>
      </View>
      {loading ? (
        <Text style={[styles.loading, { color: theme.text }]}>Chargement...</Text>
      ) : Object.keys(supplyList).length === 0 ? (
        <Text style={[styles.empty, { color: theme.text }]}>Aucune fourniture demandée.</Text>
      ) : (
        Object.entries(supplyList).map(([key, value], idx) => {
          const isUser = customDisplayName && key === customDisplayName;
          const canEdit = isUser || userData?.isSupply === true;
          if (Array.isArray(value)) {
            return value.map((val, i) => (
              <View key={key + '-' + i} style={[styles.itemRow, { borderBottomColor: theme.border, flexDirection: 'row', alignItems: 'center' }]}> 
                {canEdit && (
                  <TouchableOpacity onPress={() => { setModalKey(key); setModalValue(val); setOldModalValue(val); setModalVisible(true); }} style={{marginRight:8}}>
                    <MaterialIcons name="edit" size={24} color={theme.icon} />
                  </TouchableOpacity>
                )}
                <Text style={[styles.itemText, { color: theme.text }]}>{key}: {val}</Text>
              </View>
            ));
          } else {
            return (
              <View key={key} style={[styles.itemRow, { borderBottomColor: theme.border, flexDirection: 'row', alignItems: 'center' }]}> 
                {canEdit && (
                  <TouchableOpacity onPress={() => { setModalKey(key); setModalValue(value); setOldModalValue(value); setModalVisible(true); }} style={{marginRight:8}}>
                    <MaterialIcons name="edit" size={24} color={theme.icon} />
                  </TouchableOpacity>
                )}
                <Text style={[styles.itemText, { color: theme.text }]}>{key}: {value}</Text>
              </View>
            );
          }
        })
      )}
      {addModalVisible && (
        <View style={{position:'absolute', top:0, left:0, right:0, bottom:0, backgroundColor:theme.bg+'CC', justifyContent:'center', alignItems:'center', zIndex:10}}>
          <View style={{backgroundColor:theme.card, padding:24, borderRadius:16, width:'80%', shadowColor:'#000', shadowOpacity:0.2, shadowRadius:8}}>
            <Text style={{color:theme.text, fontSize:18, fontWeight:'bold', marginBottom:12}}>Ajouter une fourniture</Text>
            <View style={{flexDirection:'row', alignItems:'center', marginBottom:16}}>
              <Text style={{color:theme.text, marginRight:8}}>Demande :</Text>
              <SafeAreaView>
                <TextInput
                  value={addValue}
                  onChangeText={setAddValue}
                  style={{backgroundColor:theme.bg, color:theme.text, borderRadius:8, padding:8, borderWidth:1, borderColor:theme.border, minWidth:120}}
                />
              </SafeAreaView>
            </View>
            <View style={{flexDirection:'row', justifyContent:'center', gap: 12}}>
              <TouchableOpacity onPress={()=>{setAddModalVisible(false); setAddValue('');}} style={{padding:8, backgroundColor:theme.border, borderRadius:8, marginRight:8}}>
                <Text style={{color:theme.text}}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={async ()=>{
                if (!addValue.trim() || !customDisplayName) return;
                // Vérifie la validité de la clé
                const forbidden = /[~*\/\[\]\n]/;
                if (
                  customDisplayName.startsWith('.') ||
                  customDisplayName.endsWith('.') ||
                  customDisplayName.includes('..') ||
                  forbidden.test(customDisplayName)
                ) {
                  console.log('Clé Firestore invalide pour ajout:', customDisplayName);
                  return;
                }
                try {
                  const db = getFirestore();
                  const listDocRef = doc(db, 'supply', 'list');
                  // Récupère la liste actuelle
                  const docSnap = await getDoc(listDocRef);
                  let current = [];
                  if (docSnap.exists()) {
                    const data = docSnap.data();
                    if (Array.isArray(data[customDisplayName])) {
                      current = [...data[customDisplayName]];
                    } else if (typeof data[customDisplayName] === 'string') {
                      // Si la string existe déjà et est différente, on crée un tableau distinct
                      if (data[customDisplayName] !== addValue.trim()) {
                        current = [data[customDisplayName], addValue.trim()];
                      } else {
                        current = [data[customDisplayName]];
                      }
                    }
                  } else {
                    current = [addValue.trim()];
                  }
                  // Si la valeur existe déjà dans le tableau, ne pas l'ajouter
                  if (!current.includes(addValue.trim())) {
                    current.push(addValue.trim());
                  }
                  await updateDoc(listDocRef, { [customDisplayName]: current });
                  setAddModalVisible(false);
                  setAddValue('');
                  await refreshList();
                  console.log('Ajout réussi');
                } catch (err) {
                  console.log('Erreur ajout:', err);
                }
              }} style={{padding:8, backgroundColor:theme.icon, borderRadius:8}}>
                <Text style={{color:theme.bg}}>Valider</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
      {modalVisible && (
        <View style={{position:'absolute', top:0, left:0, right:0, bottom:0, backgroundColor:theme.bg+'CC', justifyContent:'center', alignItems:'center', zIndex:10}}>
          <View style={{backgroundColor:theme.card, padding:24, borderRadius:16, width:'80%', shadowColor:'#000', shadowOpacity:0.2, shadowRadius:8}}>
            <Text style={{color:theme.text, fontSize:18, fontWeight:'bold', marginBottom:12}}>Modifier ou supprimer</Text>
            <Text style={{color:theme.text, marginBottom:8}}>{modalKey}</Text>
            <View style={{flexDirection:'row', alignItems:'center', marginBottom:16}}>
              <Text style={{color:theme.text, marginRight:8}}>Valeur :</Text>
              <SafeAreaView>
                <TextInput
                  value={modalValue}
                  onChangeText={setModalValue}
                  style={{backgroundColor:theme.bg, color:theme.text, borderRadius:8, padding:8, borderWidth:1, borderColor:theme.border, minWidth:120}}
                />
              </SafeAreaView>
            </View>
            <View style={{flexDirection:'row', justifyContent:'space-between'}}>
              <TouchableOpacity onPress={()=>setModalVisible(false)} style={{padding:8, backgroundColor:theme.border, borderRadius:8}}>
                <Text style={{color:theme.text}}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDelete} style={{padding:8, backgroundColor:'#c00', borderRadius:8}}>
                <Text style={{color:'#fff'}}>Supprimer</Text>
              </TouchableOpacity>  
              <TouchableOpacity onPress={handleUpdate} style={{padding:8, backgroundColor:theme.icon, borderRadius:8}}>
                <Text style={{color:theme.bg}}>Enregistrer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 0,
    paddingTop: 0,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  loading: {
    fontSize: 16,
    marginTop: 16,
  },
  empty: {
    fontSize: 16,
    marginTop: 16,
  },
  itemRow: {
    width: '100%',
    padding: 12,
    borderBottomWidth: 1,
    alignItems: 'flex-start',
  },
  itemText: {
    fontSize: 18,
  },
});
