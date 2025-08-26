// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// Your web app's Firebase configuration
// Pour obtenir cette configuration :
// 1. Allez sur https://console.firebase.google.com/
// 2. Créez un nouveau projet ou sélectionnez un projet existant
// 3. Ajoutez une app Web
// 4. Copiez la configuration ici
const firebaseConfig = {
  apiKey: "AIzaSyAUVX5mT-YmqYzLtg3BFR5JDzQ7__iKZiw",
  authDomain: "pasino-office-app1002.firebaseapp.com",
  projectId: "pasino-office-app1002",
  storageBucket: "pasino-office-app1002.firebasestorage.app",
  messagingSenderId: "603707711044",
  appId: "1:603707711044:web:37ed2ead4e0c6eeffa6611"
};

// Utiliser la config de dev pour l'instant, remplacez par firebaseConfig en production
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
import { OAuthProvider } from 'firebase/auth';
export const googleProvider = new GoogleAuthProvider();
export const microsoftProvider = new OAuthProvider('microsoft.com');

// Configuration du provider Microsoft
microsoftProvider.setCustomParameters({
  prompt: 'select_account',
});

// Configuration du provider Google
googleProvider.addScope('email');
googleProvider.addScope('profile');

// Paramètres personnalisés pour PASINO
googleProvider.setCustomParameters({
  'hd': 'pasino.ch', // Limiter aux domaines pasino.ch
  'prompt': 'select_account'
});

export default app;
