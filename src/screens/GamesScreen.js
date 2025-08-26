import React from 'react';
import { useDarkMode } from '../contexts/DarkModeContext';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
  StatusBar,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function GamesScreen() {
  const navigation = useNavigation();
  const { darkMode } = useDarkMode();
  const themeColors = darkMode
    ? { background: '#181818', surface: '#232323', text: '#fff', card: '#232323', icon: '#fff', secondary: '#bbb' }
    : { background: '#f5f5f5', surface: '#fff', text: '#333', card: '#fff', icon: '#333', secondary: '#666' };
  

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }] }>
      <View style={{ flex: 1 }}>
        
        <ScrollView style={[styles.content, { backgroundColor: themeColors.background }] }>
        
         
          <View style={styles.emptySpace} />
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Poker')}
          >
            <Text style={styles.buttonText}>Poker</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('GGR')}
          >
            <Text style={styles.buttonText}>GGR</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingBottom: Platform.OS === 'android' ? 8 : 0,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  filterButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4285f4',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  gameCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  gameHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  gameIcon: {
    width: 48,
    height: 48,
    backgroundColor: '#f0f0f0',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  gameInfo: {
    flex: 1,
  },
  gameName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  gameCategory: {
    fontSize: 14,
    color: '#666',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
  gameDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tableInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tableCount: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  manageButton: {
    backgroundColor: '#4285f4',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  manageButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  emptySpace: {
    height: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 32,
    color: '#2F2F7A',
  },
  button: {
    backgroundColor: '#e60936',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginVertical: 12,
    alignItems: 'center',
    minWidth: 120,
    maxWidth: 180,
    alignSelf: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
