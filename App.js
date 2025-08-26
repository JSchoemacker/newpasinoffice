import { NavigationContainer } from '@react-navigation/native';
import AppWithProvider from './src/navigation/AppNavigator';
import { UserProvider } from './src/contexts/UserContext';
import { DarkModeProvider } from './src/contexts/DarkModeContext';

export default function App() {
  return (
    <UserProvider>
      <DarkModeProvider>
        <NavigationContainer>
          <AppWithProvider />
        </NavigationContainer>
      </DarkModeProvider>
    </UserProvider>
  );
}