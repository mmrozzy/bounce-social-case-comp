import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Logo from '@/components/Logo';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { View, StyleSheet, Platform } from 'react-native';
import * as Notifications from 'expo-notifications'; 
import { useEffect } from 'react'; 

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function TabLayout() {
  useEffect(() => {
    registerForPushNotifications();
  }, []);

  async function registerForPushNotifications() {
    // Set up Android notification channel
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#C3F73A',
      });
    }

    // Check existing permission status
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    // Request permission if not already granted
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    // Log result
    if (finalStatus !== 'granted') {
      console.log('❌ Notification permission denied');
      return;
    }
    
    console.log('✅ Notification permission granted');
    
    // Get and log the push token (useful for debugging)
    try {
      const token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log('📱 Push Token:', token);
    } catch (error) {
      console.log('Error getting push token:', error);
    }
  }
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: '#666',
        tabBarStyle: {
          backgroundColor: '#000',
          borderTopColor: '#333',
        },
        headerShown: true,
        headerStyle: {
          backgroundColor: '#000',
          height: 120,
          borderBottomWidth: 2,
          borderBottomColor: '#C3F73A',
          shadowColor: '#C3F73A',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 1.0,
          shadowRadius: 20,
          elevation: 15,
        },
        headerTitle: () => (
          <View style={styles.headerBar}>
            <Logo />
          </View>
        ),
        headerTitleAlign: 'left',
        headerLeft: () => null,
      }}
    >
      <Tabs.Screen
        name="groups"
        options={{
          title: 'Groups',
          tabBarIcon: ({ color, size }) => (
           <FontAwesome name="group" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  headerBar: {
    width: '100%',
    paddingHorizontal: 0,
    paddingVertical: 20,
    paddingLeft: 0,
    justifyContent: 'flex-start',
  },
});