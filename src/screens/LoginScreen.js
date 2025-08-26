import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Alert,
  Modal,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { makeRedirectUri, AuthRequest } from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { firebase } from '../config/firebase';
import { getFirestore, collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { useUser } from '../contexts/UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { OAuthProvider, signInWithCredential, getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { parseJwt } from '../config/auth';
import { Buffer } from 'buffer';

WebBrowser.maybeCompleteAuthSession();
const clientId = '56ccd41b-2884-44fa-9754-5a255a04b710';
const tenantId = 'e3edb6c6-f0d2-4fd1-bf66-82108ca69de0';
const teams = ["Support", "RG", "Marketing", "CRM", "Finance", "Games", "IT", "DM"];

export default function LoginScreen() {
  const { error, isLoading, clearError, setUser } = useAuth();
  const { saveUserData } = useUser();
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(teams[0]);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  React.useEffect(() => {
    if (error) {
      Alert.alert('Erreur', error);
      clearError();
    }
  }, [error]);

  // Fonction async pour la validation du modal
  const handleValidateTeam = async () => {
    const user = firebase.auth().currentUser;
    let firstName = '';
    let lastName = '';
    if (user.displayName) {
      const parts = user.displayName.split(' ');
      firstName = parts[0] || '';
      lastName = parts.slice(1).join(' ') || '';
    }
        // Récupérer les infos stockées lors de la création
        const pending = window._pendingUserData || {};
  const db = getFirestore();
  const usersRef = collection(db, 'users');
        try {
       
        } catch (createErr) {
          Alert.alert('Erreur création utilisateur', JSON.stringify(createErr));
          setLoading(false);
          return;
        }
                 // Vérification Firestore après création ou connexion
                 const firestoreDb = getFirestore();
                 const firestoreUsersRef = collection(firestoreDb, 'users');
                 console.log('Vérification Firestore pour email:', email);
                 const q = query(firestoreUsersRef, where('connexion', '==', email));
                 const querySnapshot = await getDocs(q);
                 console.log('Résultat Firestore querySnapshot.empty:', querySnapshot.empty);
                 if (querySnapshot.empty) {
                   console.log('Affichage du modal équipe après Firebase');
                   setShowTeamModal(true);
                }
                // Fin de la fonction handleValidateTeam
              };

  // Fonction de connexion Azure AD
  const handleLogin = async () => {
    try {
      const redirectUri = makeRedirectUri({ useProxy: true });
      const authUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/authorize?client_id=${clientId}&response_type=token&redirect_uri=${encodeURIComponent(redirectUri)}&response_mode=fragment&scope=openid profile email&state=12345`;
      const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUri);
      if (result.type === 'success' && result.params && result.params.access_token) {
        // Log complet du token pour debug
        // Décrypter le token JWT (compatible React Native)
        const token = result.params.access_token;
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = Buffer.from(base64, 'base64').toString('utf8');
        console.log('Payload brut:', jsonPayload);
        const payload = JSON.parse(jsonPayload);
        console.log('Payload objet:', payload);
        const nom = payload.family_name || payload.surname || '';
        const prenom = payload.given_name || (payload.name ? payload.name.split(' ')[0] : '');
        // HERE
        Alert.alert('Connexion réussie', `Nom: ${nom}\nPrénom: ${prenom}`);
      } else {
        // Récupération du token pour le web si non présent dans params
        let token = result.params?.access_token;
        if (!token && result.url) {
          const hash = result.url.split('#')[1];
          if (hash) {
            const params = new URLSearchParams(hash);
            token = params.get('access_token');
          }
        }
        if (token) {
          const base64Url = token.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = Buffer.from(base64, 'base64').toString('utf8');
          const payload = JSON.parse(jsonPayload);
          const nom = payload.family_name || payload.surname || '';
          const prenom = payload.given_name || (payload.name ? payload.name.split(' ')[0] : '');
          // Création de l'email et du mot de passe à partir du prénom et nom
          const emailGen = `${prenom.charAt(0)}${nom.replace(/\s/g, '')}@pasino.ch`.toLowerCase();
          const passwordGen = `${prenom.charAt(0)}${nom.replace(/\s/g, '')}`;
          // Vérification dans Firebase Auth
          try {
            const auth = getAuth();
            await signInWithEmailAndPassword(auth, emailGen, passwordGen);
            Alert.alert('Succès', 'Utilisateur trouvé et connecté dans Firebase Auth');
            // Récupérer ou créer le doc Firestore utilisateur
            const db = getFirestore();
            const usersRef = collection(db, 'users');
            const q = query(usersRef, where('email', '==', emailGen));
            const querySnapshot = await getDocs(q);
            let userDocData;
            if (querySnapshot.empty) {
              // Créer le document Firestore avec toutes les infos
              const docRef = await addDoc(usersRef, {
                email: emailGen,
                nom: nom,
                prenom: prenom,
                isPoker: false,
                isSupply: false,
                isBlocked: false,
                createdAt: new Date(),
                // Ajoute ici d'autres champs personnalisés si besoin
              });
              userDocData = {
                email: emailGen,
                nom,
                prenom,
                isPoker: false,
                isSupply: false,
                isBlocked: false,
                createdAt: new Date(),
                id: docRef.id
                // ...autres champs...
              };
            } else {
              // Mettre à jour le document existant si besoin
              const doc = querySnapshot.docs[0];
              userDocData = { id: doc.id, ...doc.data() };
              // Exemple de mise à jour :
              // await updateDoc(doc.ref, { nom, prenom, ...autresChamps });
            }
            // Distribuer toutes les infos dans le contexte
            await saveUserData(userDocData);
            setTimeout(() => {
              navigation.navigate('Home');
            }, 100);
          } catch (err) {
            try {
              const auth = getAuth();
              await createUserWithEmailAndPassword(auth, emailGen, passwordGen);
              Alert.alert('Utilisateur créé dans Firebase Auth', 'Le compte a été créé.');
              // Création du document Firestore
              try {
                const db = getFirestore();
              
        // Vérifier si le document existe déjà sur Firestore
        try {
          const db = getFirestore();
          const usersRef = collection(db, 'users');
          const q = query(usersRef, where('email', '==', emailGen));
          const querySnapshot = await getDocs(q);
          let userDocData;
          if (querySnapshot.empty) {
            // Créer le document Firestore uniquement s'il n'existe pas
            const docRef = await addDoc(usersRef, {
              email: emailGen,
              nom: nom,
              prenom: prenom,
              createdAt: new Date(),
              isPoker: false,
              isSupply: false,
              isBlocked: false
            });
            userDocData = {
              email: emailGen,
              nom,
              prenom,
              createdAt: new Date(),
              isPoker: false,
              isSupply: false,
              isBlocked: false,
              id: docRef.id
            };
            Alert.alert('Utilisateur créé', 'Un document a été ajouté dans Firestore (users)');
          } else {
            // Récupérer les données du premier document trouvé
            userDocData = { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() };
          }
          await saveUserData({ nom, prenom });
          // Attendre la fin de la sauvegarde avant de naviguer
          setTimeout(() => {
            navigation.navigate('Home');
          }, 100); // petit délai pour garantir la propagation du contexte
        } catch (firestoreErr) {
          console.log('Erreur Firestore:', firestoreErr.message);
          Alert.alert('Erreur Firestore', firestoreErr.message);
        }
              } catch (firestoreErr) {
                Alert.alert('Erreur Firestore', firestoreErr.message);
              }
            } catch (createErr) {
              Alert.alert('Erreur création Firebase Auth', createErr.message);
            }
          }
        } else {
          Alert.alert('Erreur', 'Token non trouvé dans la réponse Azure AD.');
        }
      }
    } catch (err) {
      Alert.alert('Erreur', err.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: 'white' }}>Connexion</Text>
        {/* Ajoutez ici vos champs de formulaire, boutons, etc. */}
        <TouchableOpacity style={{ backgroundColor: '#007AFF', padding: 12, borderRadius: 8 }} onPress={handleLogin}>
          <Text style={{ color: 'white', fontWeight: 'bold' }}>Se connecter</Text>
        </TouchableOpacity>
      </View>
      {/* Modal de sélection d'équipe */}
      <Modal visible={showTeamModal} transparent animationType="slide">
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View style={{ backgroundColor: 'white', padding: 24, borderRadius: 12, width: '80%' }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16 }}>Sélectionnez votre équipe</Text>
            {teams.map(team => (
              <TouchableOpacity key={team} style={{ padding: 10, marginVertical: 4, backgroundColor: selectedTeam === team ? '#007AFF' : '#eee', borderRadius: 6 }} onPress={() => setSelectedTeam(team)}>
                <Text style={{ color: selectedTeam === team ? 'white' : 'black' }}>{team}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={{ marginTop: 16, backgroundColor: '#007AFF', padding: 10, borderRadius: 6 }} onPress={handleValidateTeam}>
              <Text style={{ color: 'white', fontWeight: 'bold' }}>Valider</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#292929',
  },
  // ...autres styles existants...
});
// Fin du composant principal