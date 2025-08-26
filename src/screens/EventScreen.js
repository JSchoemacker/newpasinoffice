import React from 'react';
import { useDarkMode } from '../contexts/DarkModeContext';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Platform, StatusBar } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function EventScreen() {
  const { darkMode } = useDarkMode();
  const themeColors = darkMode
    ? { background: '#181818', surface: '#232323', text: '#fff', card: '#232323', icon: '#fff', secondary: '#bbb' }
    : { background: '#f5f5f5', surface: '#fff', text: '#333', card: '#fff', icon: '#333', secondary: '#666' };
  const events = [
   
  ];

  function getEventColor(type) {
    switch (type) {
      case 'meeting':
        return darkMode ? '#1976d2' : '#4285f4';
      case 'game':
        return darkMode ? '#c62828' : '#e53935';
      case 'vip':
        return darkMode ? '#fbc02d' : '#ffd600';
      default:
        return '#666';
    }
  }

  function getEventIcon(type) {
    switch (type) {
      case 'meeting':
        return 'groups';
      case 'game':
        return 'casino';
      case 'vip':
        return 'star';
      default:
        return 'event';
    }
  }
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }] }>
      <View style={{ flex: 1 }}>
        <View style={[styles.header, { backgroundColor: themeColors.surface, shadowColor: darkMode ? '#000' : '#000' }] }>
          <Text style={[styles.headerTitle, { color: themeColors.text }]}>Événements</Text>
          <TouchableOpacity style={styles.addButton}>
            <MaterialIcons name="add" size={24} color={darkMode ? '#90caf9' : '#4285f4'} />
          </TouchableOpacity>
        </View>
        <ScrollView style={[styles.content, { backgroundColor: themeColors.background }] }>
                            <Text style={{color: darkMode ? '#90caf9' : '#4285f4'}}>En cours de développement</Text>

          {events.map((event) => (
            <TouchableOpacity key={event.id} style={[styles.eventCard, { backgroundColor: themeColors.card, shadowColor: darkMode ? '#000' : '#000' }] }>
              <View style={styles.eventHeader}>
                <View style={[styles.eventIcon, { backgroundColor: getEventColor(event.type) }] }>
                  <MaterialIcons
                    name={getEventIcon(event.type)}
                    size={24}
                    color="#fff"
                  />
                </View>
                <View style={styles.eventInfo}>
                  <Text style={[styles.eventTitle, { color: themeColors.text }]}>{event.title}</Text>
                  <Text style={[styles.eventLocation, { color: themeColors.secondary }]}>{event.location}</Text>
                </View>
              </View>
              <View style={styles.eventDetails}>
                <View style={styles.eventDateTime}>
                  <MaterialIcons name="schedule" size={16} color={themeColors.secondary} />
                  <Text style={[styles.eventTime, { color: themeColors.secondary }]}>{event.time}</Text>
                </View>
                <View style={styles.eventDateTime}>
                  <MaterialIcons name="calendar-today" size={16} color={themeColors.secondary} />
                  <Text style={[styles.eventDate, { color: themeColors.secondary }]}>{event.date}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
          <View style={styles.emptySpace} />
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
  addButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  eventCard: {
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
  eventHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  eventIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  eventInfo: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  eventLocation: {
    fontSize: 14,
    color: '#666',
  },
  eventDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  eventDateTime: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventTime: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  eventDate: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  emptySpace: {
    height: 20,
  },
});
