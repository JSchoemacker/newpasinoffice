// ...imports...
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../contexts/UserContext';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createEmail, setCreateEmail] = useState('');
  const [createNom, setCreateNom] = useState('');
  const [createPrenom, setCreatePrenom] = useState('');
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');

  const navigation = useNavigation();
  const { saveUserData } = useUser();

  const isPasinoEmail = (mail) => mail.trim().toLowerCase().endsWith('@pasino.ch');

  // Connexion utilisateur
  const handleLogin = async () => {
    if (!isPasinoEmail(email)) {
      Alert.alert('Erreur', "Seules les adresses '@pasino.ch' sont autorisées.");
      return;
    }
    if (!password) {
      Alert.alert('Erreur', 'Veuillez entrer un mot de passe.');
      return;
    }
    setLoading(true);
    try {
      const auth = getAuth();
      await signInWithEmailAndPassword(auth, email.trim().toLowerCase(), password);

      // Récupère les infos Firestore
      const db = getFirestore();
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', email.trim().toLowerCase()));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        await saveUserData({ id: doc.id, ...doc.data() });
      }

      setLoading(false);
      navigation.replace('Main');
    } catch (err) {
      setLoading(false);
      Alert.alert('Erreur de connexion', err.message);
    }
  };

  // Création de compte
  const handleCreateAccount = async () => {
    if (!isPasinoEmail(createEmail)) {
      Alert.alert('Erreur', "Seules les adresses '@pasino.ch' sont autorisées.");
      return;
    }
    if (!createNom || !createPrenom) {
      Alert.alert('Erreur', 'Veuillez renseigner votre nom et prénom.');
      return;
    }
    setLoading(true);
    try {
      const auth = getAuth();
      const db = getFirestore();
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', createEmail.trim().toLowerCase()));
      const querySnapshot = await getDocs(q);

      const generatedPassword = Math.random().toString(36).slice(-8);

      await createUserWithEmailAndPassword(auth, createEmail.trim().toLowerCase(), generatedPassword);

      let userDocData;
      if (querySnapshot.empty) {
        const docRef = await addDoc(usersRef, {
          email: createEmail.trim().toLowerCase(),
          nom: createNom.trim(),
          prenom: createPrenom.trim(),
          isPoker: false,
          isSupply: false,
          isBlocked: false,
          createdAt: new Date(),
        });
        userDocData = {
          email: createEmail.trim().toLowerCase(),
          nom: createNom.trim(),
          prenom: createPrenom.trim(),
          isPoker: false,
          isSupply: false,
          isBlocked: false,
          createdAt: new Date(),
          id: docRef.id
        };
      } else {
        const doc = querySnapshot.docs[0];
        userDocData = { id: doc.id, ...doc.data() };
      }

      await sendPasswordResetEmail(auth, createEmail.trim().toLowerCase());
      await saveUserData(userDocData);

      setLoading(false);
      setShowCreateModal(false);
      Alert.alert(
        'Compte créé',
        "Votre compte a été créé. Un email pour définir votre mot de passe vient d'être envoyé à l'adresse renseignée."
      );
    } catch (err) {
      setLoading(false);
      Alert.alert('Erreur création de compte', err.message);
    }
  };

  // Mot de passe oublié
  const handleResetPassword = async () => {
    if (!isPasinoEmail(resetEmail)) {
      Alert.alert('Erreur', "Seules les adresses '@pasino.ch' sont autorisées.");
      return;
    }
    setLoading(true);
    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, resetEmail.trim().toLowerCase());
      setLoading(false);
      setShowResetModal(false);
      Alert.alert(
        'Email envoyé',
        "Un email pour réinitialiser votre mot de passe a été envoyé à l'adresse renseignée."
      );
    } catch (err) {
      setLoading(false);
      Alert.alert('Erreur', err.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.centered}>
        <Text style={styles.title}>PASINOffice</Text>
        <TextInput
          style={[styles.input, { color: '#222' }]}
          placeholder="Adresse email @pasino.ch"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={[styles.input, { color: '#222' }]}
          placeholder="Mot de passe"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? 'Connexion...' : 'Se connecter'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.link} onPress={() => setShowCreateModal(true)}>
          <Text style={styles.linkText}>Créer un compte</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.link} onPress={() => setShowResetModal(true)}>
          <Text style={styles.linkText}>Mot de passe oublié</Text>
        </TouchableOpacity>
      </View>
      {/* Modal création de compte */}
      <Modal visible={showCreateModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Créer un compte</Text>
            <TextInput
              style={styles.input}
              placeholder="Adresse email @pasino.ch"
              autoCapitalize="none"
              keyboardType="email-address"
              value={createEmail}
              onChangeText={setCreateEmail}
            />
            <TextInput
              style={styles.input}
              placeholder="Nom"
              autoCapitalize="words"
              value={createNom}
              onChangeText={setCreateNom}
            />
            <TextInput
              style={styles.input}
              placeholder="Prénom"
              autoCapitalize="words"
              value={createPrenom}
              onChangeText={setCreatePrenom}
            />
            <TouchableOpacity style={styles.button} onPress={handleCreateAccount} disabled={loading}>
              <Text style={styles.buttonText}>{loading ? 'Création...' : 'Valider'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.link} onPress={() => setShowCreateModal(false)}>
              <Text style={styles.linkText}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* Modal reset mot de passe */}
      <Modal visible={showResetModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Mot de passe oublié</Text>
            <TextInput
              style={styles.input}
              placeholder="Adresse email @pasino.ch"
              autoCapitalize="none"
              keyboardType="email-address"
              value={resetEmail}
              onChangeText={setResetEmail}
            />
            <TouchableOpacity style={styles.button} onPress={handleResetPassword} disabled={loading}>
              <Text style={styles.buttonText}>{loading ? 'Envoi...' : 'Réinitialiser'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.link} onPress={() => setShowResetModal(false)}>
              <Text style={styles.linkText}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#292929' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: 'white' },
  input: {
    width: 260,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
    width: 260,
    alignItems: 'center',
  },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16, textAlign: 'center', },
  link: { marginTop: 16 },
  linkText: { color: '#007AFF', fontWeight: 'bold', fontSize: 16 },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 12,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 }
});