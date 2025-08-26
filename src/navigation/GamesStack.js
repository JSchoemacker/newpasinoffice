import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import GamesScreen from '../screens/GamesScreen';
import PokerScreen from '../screens/PokerScreen';
import GGRScreen from '../screens/GGRScreen';
import { useDarkMode } from '../contexts/DarkModeContext';
import { useNavigation } from '@react-navigation/native';
import { View, Text, TouchableOpacity } from 'react-native';

const Stack = createStackNavigator();

function CustomHeader() {
  const navigation = useNavigation();
  const { darkMode } = useDarkMode();
  const theme = darkMode
    ? { bg: '#181818', text: '#fff', border: '#333' }
    : { bg: '#fff', text: '#333', border: '#e0e0e0' };
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: theme.bg, borderBottomWidth: 1, borderBottomColor: theme.border, paddingHorizontal: 12, paddingVertical: 10 }}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 8 }}>
        <Text style={{ fontSize: 22, color: theme.text }}>{'←'}</Text>
      </TouchableOpacity>
      <Text style={{ fontSize: 20, fontWeight: 'bold', color: theme.text }}>Games</Text>
    </View>
  );
}

export default function GamesStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="GamesHome" component={GamesScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Poker" component={PokerScreen} options={{ header: () => <CustomHeader /> }} />
      <Stack.Screen name="GGR" component={GGRScreen} options={{ header: () => <CustomHeader /> }} />
    </Stack.Navigator>
  );
}
