import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import { Platform, StatusBar } from 'react-native';

import HomeScreen from '../screens/HomeScreen';
import EventScreen from '../screens/EventScreen';
import GamesStack from './GamesStack';
import PokerStack from './PokerStack';
import SupplyScreen from '../screens/SupplyScreen';
import OptionsScreen from '../screens/OptionsScreen';
import { useDarkMode } from '../contexts/DarkModeContext';
import { useUser } from '../contexts/UserContext';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  const { darkMode } = useDarkMode();
  const { userData } = useUser();
  React.useEffect(() => {
    console.log('Prénom dans le contexte lors de l’arrivée sur HomeScreen:', userData?.prenom);
  }, [userData]);
  const themeColors = darkMode
    ? { background: '#181818', surface: '#232323', text: '#fff', card: '#232323', icon: '#90caf9', secondary: '#bbb', border: '#333' }
    : { background: '#fff', surface: '#fff', text: '#333', card: '#fff', icon: '#4285f4', secondary: '#666', border: '#e0e0e0' };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Events') {
            iconName = 'event';
          } else if (route.name === 'Games') {
            iconName = 'games';
          } else if (route.name === 'Supply') {
            iconName = 'inventory';
          } else if (route.name === 'Options') {
            iconName = 'settings';
          }
          // Couleur d'icône selon focus et thème
          const iconColor = focused ? themeColors.icon : themeColors.secondary;
          return <MaterialIcons name={iconName} size={size} color={iconColor} />;
        },
        tabBarActiveTintColor: themeColors.icon,
        tabBarInactiveTintColor: themeColors.secondary,
        tabBarStyle: {
          backgroundColor: themeColors.background,
          // paddingBottom relevé sur Android pour éviter que la nav bar soit trop basse
          paddingBottom: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) : 5,
          paddingTop: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Accueil',
        }}
      />
      <Tab.Screen
        name="Events"
        component={EventScreen}
        options={{
          tabBarLabel: 'Events',
        }}
      />
      <Tab.Screen
        name="Games"
        component={GamesStack}
        options={{
          tabBarLabel: 'Games',
        }}
      />
  {/* Tab Poker supprimé, navigation Poker via Stack principal */}
      <Tab.Screen
        name="Supply"
        component={SupplyScreen}
        options={{
          tabBarLabel: 'Supply',
        }}
      />
      <Tab.Screen
        name="Options"
        component={OptionsScreen}
        options={{
          tabBarLabel: 'Options',
        }}
      />
    </Tab.Navigator>
  );
}
