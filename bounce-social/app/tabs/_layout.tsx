import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Logo from '@/components/Logo';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { View, StyleSheet } from 'react-native';

export default function TabLayout() {
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

