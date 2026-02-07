import { View, Image, StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { setNavigationTarget } from '@/lib/navigationState';

interface RecentAction {
  id: string;
  type: 'created_event' | 'created_split' | 'joined_event' | 'joined_split';
  activityName: string;
  groupName: string;
  groupId: string;
  activityId: string;
  timestamp: string;
}

// Sample group data for navigation
const SAMPLE_GROUPS = [
  { id: '1', name: 'Basketball Crew', members: 24, image: 'https://via.placeholder.com/60', createdBy: 'otherUser1' },
  { id: '2', name: 'Friday Night Football', members: 18, image: 'https://via.placeholder.com/60', createdBy: 'otherUser2' },
];

// Sample recent actions
const RECENT_ACTIONS: RecentAction[] = [
  {
    id: '1',
    type: 'created_event',
    activityName: 'Weekend Tournament',
    groupName: 'Basketball Crew',
    groupId: '1',
    activityId: '2',
    timestamp: '2h ago',
  },
  {
    id: '2',
    type: 'joined_event',
    activityName: 'Friday Basketball Game',
    groupName: 'Basketball Crew',
    groupId: '1',
    activityId: '1',
    timestamp: '5h ago',
  },
  {
    id: '3',
    type: 'joined_split',
    activityName: 'Court Rental Split',
    groupName: 'Friday Night Football',
    groupId: '2',
    activityId: '4',
    timestamp: '1d ago',
  },
  {
    id: '4',
    type: 'created_split',
    activityName: 'Equipment Split',
    groupName: 'Basketball Crew',
    groupId: '1',
    activityId: '5',
    timestamp: '2d ago',
  },
];

const getActionText = (action: RecentAction) => {
  switch (action.type) {
    case 'created_event':
      return `Created event "${action.activityName}"`;
    case 'created_split':
      return `Created split "${action.activityName}"`;
    case 'joined_event':
      return `Joined event "${action.activityName}"`;
    case 'joined_split':
      return `Joined split "${action.activityName}"`;
  }
};

const getActionIcon = (type: RecentAction['type']) => {
  switch (type) {
    case 'created_event':
      return { name: 'add-circle' as const, color: '#C3F73A' };
    case 'created_split':
      return { name: 'add-circle' as const, color: '#4FC3F7' };
    case 'joined_event':
      return { name: 'checkmark-circle' as const, color: '#C3F73A' };
    case 'joined_split':
      return { name: 'checkmark-circle' as const, color: '#4FC3F7' };
  }
};

export default function ProfileScreen() {
  const router = useRouter();

  const handleActionPress = (action: RecentAction) => {
    // Set navigation target for groups tab to pick up
    setNavigationTarget(action.groupId, action.activityId);
    // Navigate to groups tab
    router.push('/tabs/groups');
  };

  return (
    <ScrollView style={styles.container}>
      {/* Banner */}
      <View style={styles.banner} />
      
      {/* Profile Picture */}
      <View style={styles.profilePicContainer}>
        <View style={styles.profilePic}>
          {/* Replace with actual profile image */}
          <Image 
            source={{ uri: 'https://via.placeholder.com/150' }}
            style={styles.profileImage}
          />
        </View>
      </View>
      
      {/* Profile content */}
      <View style={styles.content}>
        {/* Greeting */}
        <Text style={styles.greeting}>Hello, bouncy boyy</Text>

        {/* Recent Actions Section */}
        <View style={styles.actionsSection}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          
          {RECENT_ACTIONS.map((action) => {
            const icon = getActionIcon(action.type);
            return (
              <TouchableOpacity
                key={action.id}
                style={styles.actionItem}
                onPress={() => handleActionPress(action)}
              >
                <View style={styles.actionIconContainer}>
                  <Ionicons name={icon.name} size={24} color={icon.color} />
                </View>
                
                <View style={styles.actionDetails}>
                  <Text style={styles.actionText}>{getActionText(action)}</Text>
                  <Text style={styles.actionGroup}>in {action.groupName}</Text>
                  <Text style={styles.actionTimestamp}>{action.timestamp}</Text>
                </View>
                
                <Ionicons name="chevron-forward" size={20} color="#666" />
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  banner: {
    width: '100%',
    height: 200,
    backgroundColor: '#333', // Placeholder - replace with banner image
  },
  profilePicContainer: {
    alignItems: 'center',
    marginTop: -75, // Negative margin to overlap banner
  },
  profilePic: {
    width: 150,
    height: 150,
    borderRadius: 75, // Make it circular
    borderWidth: 5,
    borderColor: '#000', // Black border to separate from banner
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  content: {
    padding: 20,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  actionsSection: {
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    padding: 15,
    borderRadius: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  actionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#222',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  actionDetails: {
    flex: 1,
  },
  actionText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  actionGroup: {
    color: '#999',
    fontSize: 13,
    marginBottom: 2,
  },
  actionTimestamp: {
    color: '#666',
    fontSize: 12,
  },
});