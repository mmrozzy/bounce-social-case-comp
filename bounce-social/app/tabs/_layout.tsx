import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Logo from '@/components/Logo';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { View, StyleSheet, Platform } from 'react-native';
import * as Notifications from 'expo-notifications'; 
import { useEffect } from 'react'; 
import { ImageCacheProvider } from '@/lib/ImageCacheContext';

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
    setupNotifications();
  }, []);

  async function setupNotifications() {
    try {
      // Set up Android notification channel FIRST (required for Android 8+)
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'Payment Reminders',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#C3F73A',
        });
        console.log('Android notification channel created');
      }

      // Request permissions
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        console.log('Notification permission denied');
        return;
      }
      
      console.log('Notification permission granted');
      
      // ONLY get push token on iOS (Android throws error in Expo Go SDK 53+)
      if (Platform.OS === 'ios') {
        try {
          const token = (await Notifications.getExpoPushTokenAsync()).data;
          console.log('📱 iOS Push Token:', token);
        } catch (error) {
          console.log('Could not get push token:', error);
        }
      } else {
        console.log('Android: Skipping push token (not needed for local notifications)');
      }
      
    } catch (error) {
      console.error('Notification setup error:', error);
      // Don't crash the app if notifications fail
    }
  }
  
  return (
    <ImageCacheProvider>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#fff',
          tabBarInactiveTintColor: '#666',
          tabBarStyle: {
            backgroundColor: '#222222',
            borderTopColor: '#333',
          },
          headerShown: true,
          headerStyle: {
            backgroundColor: '#0a0a0a',
            height: 120,
            borderBottomWidth: 2,
            borderBottomColor: '#C3F73A',
            shadowColor: '#C3F73A',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 1.0,
            shadowRadius: 5,
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
    </ImageCacheProvider>
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