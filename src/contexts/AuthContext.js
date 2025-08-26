import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithPopup, 
  signOut as firebaseSignOut, 
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
import { auth } from '../config/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const signInWithMicrosoft = async () => {
    try {
      setError(null);
      setIsLoading(true);
      if (typeof window !== 'undefined') {
        // Web : popup Microsoft
        const { signInWithPopup } = await import('firebase/auth');
        const { microsoftProvider, auth } = await import('../config/firebase');
        const result = await signInWithPopup(auth, microsoftProvider);
        return result.user;
      } else {
        throw new Error('La connexion Microsoft n\'est pas disponible sur mobile. Utilisez la connexion email ou Google.');
      }
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Écouter les changements d'état d'authentification Firebase
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Vérifier que l'email contient @pasino.ch
        if (firebaseUser.email && firebaseUser.email.includes('@pasino.ch')) {
          const userData = {
            id: firebaseUser.uid,
            name: firebaseUser.displayName || 'Utilisateur',
            email: firebaseUser.email,
            picture: firebaseUser.photoURL || 'https://via.placeholder.com/150',
          };
          setUser(userData);
          await AsyncStorage.setItem('user', JSON.stringify(userData));
        } else {
          // Email non autorisé, déconnecter
          setError('Vous devez utiliser une adresse email @pasino.ch');
          await signOut();
        }
      } else {
        setUser(null);
        await AsyncStorage.removeItem('user');
      }
      setIsLoading(false);
    });

    // Vérifier si l'utilisateur était déjà connecté
    checkStoredAuth();

    return () => unsubscribe();
  }, []);

  const checkStoredAuth = async () => {
      
    try {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser && !auth.currentUser) {
        // Si on a un utilisateur stocké mais pas connecté à Firebase,
        // on attend que Firebase détermine l'état
        return;
      }
    } catch (error) {
      console.error('Erreur lors de la vérification de l\'authentification:', error);
    }
  };

  const signInWithEmail = async (email, password) => {
    try {
      setError(null);
      setIsLoading(true);
      
      // Vérifier que l'email contient @pasino.ch
      if (!email.includes('@pasino.ch')) {
        throw new Error('Vous devez utiliser une adresse email @pasino.ch');
      }

      const result = await signInWithEmailAndPassword(auth, email, password);
      return result.user;
    } catch (error) {
      console.error('Erreur lors de la connexion email:', error);
      
      // Gestion spécifique des erreurs Firebase
      let errorMessage = error.message;
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'Aucun compte trouvé avec cette adresse email. Essayez de créer un compte ou utilisez la connexion Google.';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Mot de passe incorrect. Si vous utilisez un compte Azure AD, essayez la connexion Google.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Adresse email invalide.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Trop de tentatives de connexion. Réessayez plus tard.';
      }
      
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const signUpWithEmail = async (email, password, displayName) => {
    try {
      setError(null);
      setIsLoading(true);
      
      // Vérifier que l'email contient @pasino.ch
      if (!email.includes('@pasino.ch')) {
        throw new Error('Vous devez utiliser une adresse email @pasino.ch');
      }

      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Mettre à jour le profil avec le nom d'affichage
      if (displayName) {
        await updateProfile(result.user, { displayName });
      }
      
      return result.user;
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction de connexion de test pour le développement
  const signInDemo = async () => {
    try {
      setError(null);
      setIsLoading(true);
      
      const demoUser = {
        id: 'demo-user-' + Date.now(),
        name: 'Utilisateur Test',
        email: 'test@pasino.ch',
        picture: 'https://via.placeholder.com/150',
      };
      
      setUser(demoUser);
      await AsyncStorage.setItem('user', JSON.stringify(demoUser));
    } catch (error) {
      console.error('Erreur lors de la connexion demo:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction de réinitialisation de mot de passe
  const resetPassword = async (email) => {
    try {
      setError(null);
      setIsLoading(true);
      
      // Vérifier que l'email contient @pasino.ch
      if (!email.includes('@pasino.ch')) {
        throw new Error('Vous devez utiliser une adresse email @pasino.ch');
      }

      await sendPasswordResetEmail(auth, email);
      return true;
    } catch (error) {
      console.error('Erreur lors de la réinitialisation:', error);
      let errorMessage = error.message;
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'Aucun compte trouvé avec cette adresse email. Essayez de créer un compte d\'abord.';
      }
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      await firebaseSignOut(auth);
      setUser(null);
      await AsyncStorage.removeItem('user');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      setError(error.message);
    }
  };

  const value = {
    user,
    isLoading,
    error,
    signInWithMicrosoft,
    signInWithEmail,
    signUpWithEmail,
    resetPassword,
    signInDemo,
    signOut,
    clearError: () => setError(null),
    setUser, // Ajout pour permettre la mise à jour du contexte depuis LoginScreen
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
