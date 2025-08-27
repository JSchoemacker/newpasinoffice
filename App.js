import { NavigationContainer } from '@react-navigation/native';
import AppWithProvider from './src/navigation/AppNavigator';
import { UserProvider } from './src/contexts/UserContext';
import { DarkModeProvider } from './src/contexts/DarkModeContext';

export default function App() {
  useEffect(() => {
  async function checkUpdate() {
    const update = await Updates.checkForUpdateAsync();
    if (update.isAvailable) {
      await Updates.fetchUpdateAsync();
      await Updates.reloadAsync();
    }
  }
  checkUpdate();
  }, []);
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