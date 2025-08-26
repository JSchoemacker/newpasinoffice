import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { Platform, StatusBar } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { useDarkMode } from '../contexts/DarkModeContext';

export default function OptionsScreen() {
  const { user, signOut } = useAuth();
  const [notifications, setNotifications] = React.useState(true);
  const { darkMode, setDarkMode } = useDarkMode();
  const [autoSync, setAutoSync] = React.useState(true);

  // Définition des couleurs selon le mode
  const themeColors = darkMode
    ? {
        background: '#181818',
        surface: '#232323',
        textPrimary: '#fff',
        textSecondary: '#bbb',
        border: '#333',
      }
    : {
        background: '#f5f5f5',
        surface: '#fff',
        textPrimary: '#333',
        textSecondary: '#666',
        border: '#e0e0e0',
      };

  const optionSections = [
    {
      title: 'Compte',
      items: [
        {
          icon: 'person',
          title: 'Profil utilisateur',
          subtitle: user?.email || 'Non connecté',
          action: 'profile',
        }
      ],
    },
    {
      title: 'Préférences',
      items: [
        {
          icon: 'notifications',
          title: 'Notifications',
          subtitle: 'Recevoir les alertes',
          action: 'switch',
          value: notifications,
          onToggle: setNotifications,
        },
        {
          icon: 'dark-mode',
          title: 'Mode sombre',
          subtitle: 'Thème sombre de l\'application',
          action: 'switch',
          value: darkMode,
          onToggle: setDarkMode,
        }
      ],
    },
    {
      title: 'Application',
      items: [
       
        {
          icon: 'info',
          title: 'À propos',
          subtitle: 'Version 1.0.0',
          action: 'about',
        },
      ],
    },
    {
      title: 'Support',
      items: [
        {
          icon: 'help',
          title: 'Aide',
          subtitle: 'FAQ et support',
          action: 'help',
        }
      ],
    },
  ];

  const handleOptionPress = (action) => {
    switch (action) {
      case 'profile':
        // Navigation vers le profil
        break;
      case 'security':
        // Navigation vers la sécurité
        break;
      case 'language':
        // Navigation vers les paramètres de langue
        break;
      case 'storage':
        // Navigation vers la gestion du stockage
        break;
      case 'about':
        // Navigation vers à propos
        break;
      case 'help':
        // Navigation vers l'aide
        break;
      case 'feedback':
        // Navigation vers les commentaires
        break;
      case 'bug-report':
        // Navigation vers le rapport de bug
        break;
      default:
        break;
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}> 
      <View style={[styles.header, { backgroundColor: themeColors.surface }]}> 
        <Text style={[styles.headerTitle, { color: themeColors.textPrimary }]}>Options</Text>
      </View>

      <ScrollView style={[styles.content, { backgroundColor: themeColors.background }]}> 
        {optionSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: themeColors.textPrimary }]}>{section.title}</Text>
            <View style={[{ backgroundColor: themeColors.surface, borderRadius: 12, padding: 0 }]}> 
              {section.items.map((item, itemIndex) => (
                <TouchableOpacity
                  key={itemIndex}
                  style={[styles.optionItem, { borderColor: themeColors.border, backgroundColor: themeColors.surface }]}
                  onPress={() => handleOptionPress(item.action)}
                  disabled={item.action === 'switch'}
                >
                  <View style={styles.optionLeft}>
                    <View style={[styles.iconContainer, { backgroundColor: darkMode ? '#232323' : '#f0f0f0' }] }>
                      <MaterialIcons name={item.icon} size={24} color={darkMode ? '#90caf9' : '#4285f4'} />
                    </View>
                    <View style={styles.optionText}>
                      <Text style={[styles.optionTitle, { color: themeColors.textPrimary }]}>{item.title}</Text>
                      <Text style={[styles.optionSubtitle, { color: themeColors.textSecondary }]}>{item.subtitle}</Text>
                    </View>
                  </View>
                  <View style={styles.optionRight}>
                    {item.action === 'switch' ? (
                      <Switch
                        value={item.value}
                        onValueChange={item.onToggle}
                        trackColor={{ false: '#767577', true: '#4285f4' }}
                        thumbColor={item.value ? '#fff' : '#f4f3f4'}
                      />
                    ) : (
                      <MaterialIcons name="chevron-right" size={24} color={themeColors.textSecondary} />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        <View style={[styles.section, { backgroundColor: themeColors.surface }]}> 
          <TouchableOpacity
            style={[styles.logoutButton, {
              backgroundColor: darkMode ? '#232323' : '#fff',
              borderColor: darkMode ? '#e57373' : '#ea4335',
              borderWidth: 1,
            }]} 
            onPress={signOut}
          >
            <MaterialIcons name="logout" size={24} color={darkMode ? '#e57373' : '#ea4335'} />
            <Text style={[styles.logoutText, { color: darkMode ? '#e57373' : '#ea4335' }]}>Se déconnecter</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.emptySpace} />
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
    paddingHorizontal: 20,
    paddingVertical: 16,
    // paddingBottom supprimé pour éviter le problème de SafeAreaView trop haut
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    marginLeft: 4,
  },
  optionItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  optionSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  optionRight: {
    marginLeft: 16,
  },
  logoutButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    borderWidth: 1,
    borderColor: '#ea4335',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ea4335',
    marginLeft: 8,
  },
  emptySpace: {
    height: 20,
  },
});
