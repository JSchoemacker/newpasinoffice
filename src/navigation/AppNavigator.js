import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { useUser } from '../contexts/UserContext';
import LoginScreen from '../screens/LoginScreen';
import LoadingScreen from '../screens/LoadingScreen';
import TabNavigator from './TabNavigator';

const Stack = createStackNavigator();

function AppNavigator() {
  const { user, isLoading } = useAuth();
  const { userData } = useUser();

  console.log('user', user, 'isLoading', isLoading);

  React.useEffect(() => {
    console.log('userData dans AppNavigator:', userData);
  }, [userData]);

  React.useEffect(() => {
    console.log('Prénom dans le contexte lors de l’arrivée sur Accueil:', userData?.prenom);
  }, [userData]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (

      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <>
            <Stack.Screen name="Main" component={TabNavigator} />
            <Stack.Screen name="Poker" component={require('../screens/PokerScreen').default} />
            <Stack.Screen name="PokerDetail" component={require('../screens/PokerDetailScreen').default} />
            <Stack.Screen name="GGR" component={require('../screens/GGRScreen').default} />
          </>
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
 
  );
}

export default function AppWithProvider() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}