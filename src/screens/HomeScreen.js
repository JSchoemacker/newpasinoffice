import React from 'react';
import { useDarkMode } from '../contexts/DarkModeContext';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Image
} from 'react-native';
import { Platform, StatusBar } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { useUser } from '../contexts/UserContext';
import { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs, query, orderBy, where } from 'firebase/firestore';

export default function HomeScreen() {
  const { darkMode } = useDarkMode();
  const { user, signOut } = useAuth();
  const themeColors = darkMode
    ? { background: '#181818', surface: '#232323', text: '#fff', card: '#232323', icon: '#fff', secondary: '#bbb' }
    : { background: '#f5f5f5', surface: '#fff', text: '#333', card: '#fff', icon: '#333', secondary: '#666' };

const { userData } = useUser();

  const [news, setNews] = useState([]);
  const [menuImageUrl, setMenuImageUrl] = useState(null);
  // Calcule le numéro de la semaine courante
  function getWeekNumber(date = new Date()) {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
    // ...
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  }
  useEffect(() => {
    const fetchMenuImage = async () => {
      try {
        const db = getFirestore();
        const weekNumber = getWeekNumber();
        const menuRef = collection(db, 'menu');
        const q = query(menuRef, where('week', '==', weekNumber));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0].data();
          setMenuImageUrl(doc.url || null);
        } else {
          setMenuImageUrl(null);
        }
      } catch (err) {
        setMenuImageUrl(null);
    // ...
      }
    };
    fetchMenuImage();

    // DEBUG : Affiche tous les documents de la collection menu
    const debugMenuDocs = async () => {
      try {
        const db = getFirestore();
        const menuRef = collection(db, 'menu');
        const snapshot = await getDocs(menuRef);
        const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    // ...
      } catch (err) {
    // ...
      }
    };
    debugMenuDocs();
  }, []);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const db = getFirestore();
        const newsRef = collection(db, 'news');
        const q = query(newsRef, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const newsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setNews(newsList);
      } catch (err) {
        console.error('Erreur chargement des news:', err);
      }
    };
    fetchNews();
  }, []);

  useEffect(() => {
  // ...
  }, [userData]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }] }>
      <View style={[styles.header, { backgroundColor: themeColors.surface, shadowColor: darkMode ? '#000' : '#000' }] }>
        <View>
          <Text style={[styles.welcomeText, { color: themeColors.secondary }]}>Bonjour</Text>
          <Text style={[styles.userName, { color: themeColors.text }]}>{userData?.prenom || ''}</Text>
        </View>
        <TouchableOpacity onPress={signOut} style={styles.logoutButton}>
          <MaterialIcons name="logout" size={24} color={themeColors.secondary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>


        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Notifications récentes</Text>
          {news.length === 0 ? (
            <View style={[styles.notificationCard, { backgroundColor: themeColors.card, shadowColor: darkMode ? '#000' : '#000' }] }>
              <Text style={[styles.notificationText, { color: themeColors.text }] }>
                Aucune news disponible.
              </Text>
            </View>
          ) : (
            news.map(item => (
              <View key={item.id} style={[styles.notificationCard, { backgroundColor: themeColors.card, shadowColor: darkMode ? '#000' : '#000', marginBottom: 5 }] }>
                 {item.createdAt && (
                  <Text style={{ fontSize: 10, color: themeColors.secondary, marginTop: 4 }}>
                    {new Date(item.createdAt.seconds ? item.createdAt.seconds * 1000 : item.createdAt).toLocaleString('fr-FR')}
                  </Text>
                )}
                <Text style={[styles.notificationText, { color: themeColors.text, marginTop: 5 }] }>
                  {item.info}
                </Text>
               
              </View>
            ))
          )}
        </View>

          <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Menus</Text>
          <View style={{ alignItems: 'center', width: '100%' }}>
            {menuImageUrl ? (
              <Image
                source={{ uri: menuImageUrl }}
                style={{ width: '95%', aspectRatio: 3/4, borderRadius: 16, marginBottom: 16 }}
                resizeMode="cover"
              />
            ) : (
              <Text style={{ color: themeColors.secondary, marginBottom: 16 }}>
                Aucun menu disponible pour cette semaine.
              </Text>
            )}
          </View>
        </View>

      </ScrollView>
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
  welcomeText: {
    fontSize: 16,
    color: '#666',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  logoutButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: '48%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
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
  actionText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  notificationCard: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  notificationText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 20,
  },
});
