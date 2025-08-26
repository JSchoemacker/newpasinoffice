import React, { createContext, useContext, useState } from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);

  const saveUserData = async (data) => {
    try {
      if (Platform.OS === 'web') {
        window.localStorage.setItem('firestoreUserData', JSON.stringify(data));
      } else {
        await AsyncStorage.setItem('firestoreUserData', JSON.stringify(data));
      }
      setUserData(data);
    } catch (err) {
      // Optionnel : gérer l'erreur silencieusement
    }
  };

  // Correction : définition de clearUserData
  const clearUserData = async () => {
    setUserData(null);
    if (Platform.OS === 'web') {
      window.localStorage.removeItem('firestoreUserData');
    } else {
      await AsyncStorage.removeItem('firestoreUserData');
    }
  };

  React.useEffect(() => {
    (async () => {
      try {
        let stored;
        if (Platform.OS === 'web') {
          stored = window.localStorage.getItem('firestoreUserData');
        } else {
          stored = await AsyncStorage.getItem('firestoreUserData');
        }
        if (stored) setUserData(JSON.parse(stored));
      } catch (err) {
        // Optionnel : gérer l'erreur silencieusement
      }
    })();
  }, []);


  return (
    <UserContext.Provider value={{ userData, saveUserData, clearUserData }}>
      {children}
    </UserContext.Provider>
  );
};
