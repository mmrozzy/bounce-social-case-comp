import { View, Image, StyleSheet, ScrollView, Text, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { setNavigationTarget } from '@/lib/navigationState';
import { PersonaBadge } from '@/components/PersonaBadge';
import { analyzeUserProfile } from '@/src/utils/profileAnalyzer';
import { getUserById, getGroups, getEvents, getTransactions, uploadImage, updateUserImages } from '@/lib/database';
import { useImageCache } from '@/lib/ImageCacheContext';

interface RecentAction {
  id: string;
  type: 'created_event' | 'created_split' | 'joined_event' | 'joined_split';
  activityName: string;
  groupName: string;
  groupId: string;
  activityId: string;
  timestamp: string;
}

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
      return { name: 'pie-chart-outline' as const, color: '#4FC3F7' };
    case 'joined_event':
      return { name: 'checkmark-circle' as const, color: '#C3F73A' };
    case 'joined_split':
      return { name: 'checkmark-circle' as const, color: '#4FC3F7' };
  }
};

export default function ProfileScreen() {
  const router = useRouter();
  const { getUserImages, updateUserImages: updateCacheUserImages } = useImageCache();
  const [bannerImage, setBannerImage] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [showPersonaDetails, setShowPersonaDetails] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userGroups, setUserGroups] = useState<any[]>([]);
  const [userEvents, setUserEvents] = useState<any[]>([]);
  const [userTransactions, setUserTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Convert events and splits to recent actions
  const recentActions: RecentAction[] = (() => {
    const actions: Array<RecentAction & { dateObj: Date }> = [];
    
    // Add events
    userEvents.forEach(event => {
      const group = userGroups.find(g => g.id === event.groupId);
      const isCreator = event.createdBy === 'current-user';
      const eventDate = new Date(event.date);
      const timeAgo = getTimeAgo(eventDate);
      
      actions.push({
        id: event.id,
        type: isCreator ? 'created_event' : 'joined_event',
        activityName: event.name,
        groupName: group?.name || 'Unknown Group',
        groupId: event.groupId,
        activityId: event.id,
        timestamp: timeAgo,
        dateObj: eventDate,
      });
    });
    
    // Add splits
    userTransactions
      .filter(tx => tx.type === 'split')
      .forEach(split => {
        const group = userGroups.find(g => g.id === split.groupId);
        const isCreator = split.from === 'current-user';
        const splitDate = new Date(split.createdAt);
        const timeAgo = getTimeAgo(splitDate);
        
        actions.push({
          id: split.id,
          type: isCreator ? 'created_split' : 'joined_split',
          activityName: split.note || 'Split Payment',
          groupName: group?.name || 'Unknown Group',
          groupId: split.groupId,
          activityId: split.id,
          timestamp: timeAgo,
          dateObj: splitDate,
        });
      });
    
    // Sort by date (most recent first) and take top 10
    return actions
      .sort((a, b) => b.dateObj.getTime() - a.dateObj.getTime())
      .slice(0, 10)
      .map(({ dateObj, ...action }) => action); // Remove dateObj from final result
  })();

  // Helper function to calculate time ago
  function getTimeAgo(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return '1d ago';
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    return `${Math.floor(diffDays / 30)}mo ago`;
  }

  // Fetch user data from Supabase
  const loadUserData = async () => {
    try {
      // TODO: Replace 'current-user' with actual authenticated user ID
      const user = await getUserById('current-user');
      setCurrentUser(user);
      
      const groups = await getGroups();
      const userGroupsFiltered = groups.filter(g => g.members.includes('current-user'));
      setUserGroups(userGroupsFiltered);
      
      const events = await getEvents();
      const userEventsFiltered = events.filter(e => e.participants.includes('current-user'));
      setUserEvents(userEventsFiltered);
      
      const transactions = await getTransactions();
      const userTransactionsFiltered = transactions.filter(
        t => t.from === 'current-user' || t.participants?.includes('current-user')
      );
      setUserTransactions(userTransactionsFiltered);
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  useEffect(() => {
    const initLoad = async () => {
      setLoading(true);
      await loadUserData();
      setLoading(false);
    };
    initLoad();
  }, []);

  // Reload data when profile tab comes into focus
  useFocusEffect(
    useCallback(() => {
      loadUserData();
    }, [])
  );

  // Handle pull to refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await loadUserData();
    setRefreshing(false);
  };

  // Calculate user persona profile
  const userProfile = currentUser ? analyzeUserProfile(
    currentUser.id,
    userTransactions,
    userEvents,
    userGroups
  ) : null;

  // Load cached images immediately, then check for updates
  useEffect(() => {
    // Load from cache instantly
    const cachedImages = getUserImages('current-user');
    if (cachedImages) {
      if (cachedImages.bannerImage) setBannerImage(cachedImages.bannerImage);
      if (cachedImages.profileImage) setProfileImage(cachedImages.profileImage);
    }
    
    // Then check database for any updates
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
      const user = await getUserById('current-user');
      // Only update if images changed
      if (user.bannerImage && user.bannerImage !== bannerImage) {
        setBannerImage(user.bannerImage);
        updateCacheUserImages('current-user', undefined, user.bannerImage);
      }
      if (user.profileImage && user.profileImage !== profileImage) {
        setProfileImage(user.profileImage);
        updateCacheUserImages('current-user', user.profileImage, undefined);
      }
    } catch (error) {
      console.error('Error loading images:', error);
    }
  };

  const pickBannerImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setBannerImage(uri);
      try {
        // Upload to Supabase Storage
        const publicUrl = await uploadImage(
          { uri, type: 'image/jpeg', name: `banner-${Date.now()}.jpg` },
          'banners'
        );
        
        // Update database with new URL
        await updateUserImages('current-user', undefined, publicUrl);
        updateCacheUserImages('current-user', undefined, publicUrl);
        setBannerImage(publicUrl);
      } catch (error) {
        console.error('Error uploading banner:', error);
        Alert.alert('Error', 'Failed to upload banner. Please try again.');
      }
    }
  };

  const pickProfileImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setProfileImage(uri);
      try {
        // Upload to Supabase Storage
        const publicUrl = await uploadImage(
          { uri, type: 'image/jpeg', name: `profile-${Date.now()}.jpg` },
          'profiles'
        );
        
        // Update database with new URL
        await updateUserImages('current-user', publicUrl, undefined);
        updateCacheUserImages('current-user', publicUrl, undefined);
        setProfileImage(publicUrl);
      } catch (error) {
        console.error('Error uploading profile image:', error);
        Alert.alert('Error', 'Failed to upload profile picture. Please try again.');
      }
    }
  };

  const handleActionPress = (action: RecentAction) => {
    // Set navigation target for groups tab to pick up
    setNavigationTarget(action.groupId, action.activityId);
    // Navigate to groups tab
    router.push('/tabs/groups');
  };

  // Show loading state
  if (loading || !currentUser || !userProfile) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor="#C3F73A"
          colors={['#C3F73A']}
        />
      }
    >
      {/* Banner */}
      <TouchableOpacity 
        style={styles.bannerContainer}
        onPress={pickBannerImage}
        activeOpacity={0.8}
      >
        {bannerImage ? (
          <Image source={{ uri: bannerImage }} style={styles.banner} />
        ) : (
          <View style={styles.banner} />
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
          
          {recentActions.length === 0 ? (
            <View style={styles.emptyActivityContainer}>
              <Ionicons name="calendar-outline" size={48} color="#333" />
              <Text style={styles.emptyActivityText}>No recent activity</Text>
              <Text style={styles.emptyActivitySubtext}>Join or create events to see them here</Text>
            </View>
          ) : (
            recentActions.map((action) => {
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
            })
          )}
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
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#C3F73A',
    fontSize: 16,
  },
  emptyActivityContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyActivityText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
  },
  emptyActivitySubtext: {
    color: '#444',
    fontSize: 14,
    marginTop: 4,
  },
});