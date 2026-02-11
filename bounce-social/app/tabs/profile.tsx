import { View, Image, StyleSheet, ScrollView, Text, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setNavigationTarget } from '@/lib/navigationState';
import { PersonaBadge } from '@/components/PersonaBadge';
import { analyzeUserProfile } from '@/src/utils/profileAnalyzer';
import { currentUser, userGroups, userEvents, userTransactions } from '@/data/mockUserData';

const PROFILE_BANNER_KEY = '@profile_banner';
const PROFILE_IMAGE_KEY = '@profile_image';

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
  const [bannerImage, setBannerImage] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [showPersonaDetails, setShowPersonaDetails] = useState(false);

  // Calculate user persona profile
  const userProfile = analyzeUserProfile(
    currentUser.id,
    userTransactions,
    userEvents,
    userGroups
  );

  // Load saved images on mount
  useEffect(() => {
    loadImages();
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'We need access to your photos to upload images.');
    }
  };

  const loadImages = async () => {
    try {
      const savedBanner = await AsyncStorage.getItem(PROFILE_BANNER_KEY);
      const savedProfile = await AsyncStorage.getItem(PROFILE_IMAGE_KEY);
      if (savedBanner) setBannerImage(savedBanner);
      if (savedProfile) setProfileImage(savedProfile);
    } catch (error) {
      console.error('Error loading images:', error);
    }
  };

  const pickBannerImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setBannerImage(uri);
      try {
        await AsyncStorage.setItem(PROFILE_BANNER_KEY, uri);
      } catch (error) {
        console.error('Error saving banner:', error);
      }
    }
  };

  const pickProfileImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setProfileImage(uri);
      try {
        await AsyncStorage.setItem(PROFILE_IMAGE_KEY, uri);
      } catch (error) {
        console.error('Error saving profile image:', error);
      }
    }
  };

  const handleActionPress = (action: RecentAction) => {
    // Set navigation target for groups tab to pick up
    setNavigationTarget(action.groupId, action.activityId);
    // Navigate to groups tab
    router.push('/tabs/groups');
  };

  return (
    <ScrollView style={styles.container}>
      {/* Banner */}
      <TouchableOpacity 
        style={styles.bannerContainer}
        onPress={pickBannerImage}
        activeOpacity={0.8}
      >
        {bannerImage ? (
          <Image source={{ uri: bannerImage }} style={styles.banner} />
        ) : (
          <View style={styles.banner}>
            <View style={styles.uploadOverlay}>
              <Ionicons name="camera" size={40} color="#666" />
              <Text style={styles.uploadText}>Tap to add banner</Text>
            </View>
          </View>
        )}
        {bannerImage && (
          <View style={styles.editIconOverlay}>
            <Ionicons name="camera" size={24} color="#fff" />
          </View>
        )}
      </TouchableOpacity>
      
      {/* Profile Picture */}
      <View style={styles.profilePicContainer}>
        {/* Triangle background */}
        <Image 
          source={require('@/assets/images/profile/triangle.png')}
          style={styles.profileTriangle}
        />
        
        <TouchableOpacity 
          style={styles.profilePic}
          onPress={pickProfileImage}
          activeOpacity={0.8}
        >
          <Image 
            source={{ uri: profileImage || 'https://via.placeholder.com/150' }}
            style={styles.profileImage}
          />
          <View style={styles.profileEditIcon}>
            <Ionicons name="camera" size={20} color="#fff" />
          </View>
        </TouchableOpacity>
      </View>
      
      {/* Profile content */}
      <View style={styles.content}>
        {/* Greeting */}
        <Text style={styles.greeting}>Hello, Guillaume!</Text>

        {/* Persona Badge */}
        <TouchableOpacity 
          style={styles.personaSection}
          onPress={() => setShowPersonaDetails(!showPersonaDetails)}
          activeOpacity={0.8}
        >
          <View style={styles.personaHeader}>
            <Text style={styles.personaBadgeEmoji}>{userProfile.emoji}</Text>
            <View style={styles.personaInfo}>
              <Text style={styles.personaType}>
                {userProfile.type.replace(/([A-Z])/g, ' $1').trim()}
              </Text>
              <Text style={styles.personaDescription}>
                {userProfile.description.split(' - ')[1]}
              </Text>
            </View>
            <Ionicons 
              name={showPersonaDetails ? "chevron-up" : "chevron-down"} 
              size={24} 
              color="#C3F73A" 
            />
          </View>

          {showPersonaDetails && (
            <View style={styles.personaDetails}>
              {/* Traits */}
              <View style={styles.detailSection}>
                <Text style={styles.detailSectionTitle}>✨ Your Traits</Text>
                {userProfile.traits.map((trait, index) => (
                  <Text key={index} style={styles.traitText}>• {trait}</Text>
                ))}
              </View>

              {/* Stats */}
              <View style={styles.detailSection}>
                <Text style={styles.detailSectionTitle}>📊 Your Stats</Text>
                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>Events Attended</Text>
                  <Text style={styles.statValue}>{userProfile.stats.eventsAttended}</Text>
                </View>
                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>Total Spent</Text>
                  <Text style={styles.statValue}>${userProfile.stats.totalSpent.toFixed(2)}</Text>
                </View>
                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>Avg per Event</Text>
                  <Text style={styles.statValue}>${userProfile.stats.avgEventCost.toFixed(2)}</Text>
                </View>
              </View>

              {/* Behavioral Insights */}
              <View style={styles.detailSection}>
                <Text style={styles.detailSectionTitle}>🔍 Behavioral Insights</Text>
                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>Avg Group Size</Text>
                  <Text style={styles.statValue}>{userProfile.stats.features.avgGroupSize.toFixed(1)} people</Text>
                </View>
                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>Activity Level</Text>
                  <Text style={styles.statValue}>{userProfile.stats.features.eventsPerMonth.toFixed(1)} events/mo</Text>
                </View>
                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>Generosity</Text>
                  <Text style={styles.statValue}>{(userProfile.stats.features.generosityScore * 100).toFixed(0)}%</Text>
                </View>
                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>Most Active</Text>
                  <Text style={styles.statValue}>{userProfile.stats.features.mostActiveHour}:00</Text>
                </View>
              </View>
            </View>
          )}
        </TouchableOpacity>

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
  bannerContainer: {
    position: 'relative',
  },
  banner: {
    width: '100%',
    height: 200,
    backgroundColor: '#333',
  },
  uploadOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#333',
  },
  uploadText: {
    color: '#666',
    fontSize: 14,
    marginTop: 8,
  },
  editIconOverlay: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 20,
    padding: 8,
  },
  profilePicContainer: {
    alignItems: 'center',
    marginTop: -75, // Negative margin to overlap banner
    position: 'relative',
  },
  profileTriangle: {
    position: 'absolute',
    width: 240,
    height: 200,
    top: -50,
    zIndex: 0,
    opacity: 0.9,
  },
  profilePic: {
    width: 150,
    height: 150,
    borderRadius: 75, // Make it circular
    borderWidth: 5,
    borderColor: '#000', // Black border to separate from banner
    backgroundColor: '#fff',
    overflow: 'hidden',
    position: 'relative',
    zIndex: 1,
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  profileEditIcon: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 15,
    padding: 6,
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
    marginBottom: 20,
  },
  personaSection: {
    backgroundColor: '#1a1a1a',
    borderRadius: 20,
    padding: 20,
    marginBottom: 25,
    borderWidth: 2,
    borderColor: '#C3F73A',
  },
  personaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  personaBadgeEmoji: {
    fontSize: 48,
    marginRight: 16,
  },
  personaInfo: {
    flex: 1,
  },
  personaType: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#C3F73A',
    marginBottom: 4,
    textTransform: 'capitalize',
  },
  personaDescription: {
    fontSize: 14,
    color: '#999',
    lineHeight: 20,
  },
  personaDetails: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  detailSection: {
    marginBottom: 20,
  },
  detailSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  traitText: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 8,
    lineHeight: 20,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  statLabel: {
    fontSize: 14,
    color: '#999',
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#C3F73A',
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