import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import PokerScreen from '../screens/PokerScreen';
import PokerDetailScreen from '../screens/PokerDetailScreen';

const Stack = createStackNavigator();

export default function PokerStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Poker" component={PokerScreen} />
      <Stack.Screen name="PokerDetail" component={PokerDetailScreen} />
    </Stack.Navigator>
  );
}
