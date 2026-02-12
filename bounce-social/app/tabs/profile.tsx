import { View, Image, StyleSheet, ScrollView, Text, TouchableOpacity, Alert, RefreshControl, Modal, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { setNavigationTarget } from '@/lib/navigationState';
import { PersonaBadge } from '@/components/PersonaBadge';
import { analyzeUserProfile } from '@/src/utils/profileAnalyzer';
import { getUserById, getGroups, getEvents, getTransactions, uploadImage, updateUserImages, getActivityReactions, toggleActivityReaction } from '@/lib/database';
import { useImageCache } from '@/lib/ImageCacheContext';
import UserWrappedAppView from '@/components/UserPersonaCard';
import UserShareableWrapped from '@/components/UserShareablePersona';

interface RecentAction {
  id: string;
  type: 'created_event' | 'created_split' | 'joined_event' | 'joined_split';
  activityName: string;
  groupName: string;
  groupId: string;
  activityId: string;
  timestamp: string;
  reactions?: ActionReaction[];
}

interface ActionReaction {
  emoji: string;
  users: string[]; // User IDs who reacted
  count: number;
}

type ThemeType = {
  id: string;
  name: string;
  colors: string[];
  bg: string;
  cardBg: string;
  textPrimary: string;
  textSecondary: string;
  bgPattern: string;
};

const COMMON_EMOJIS = ['👍', '❤️', '😂', '🔥', '🎉', '👏', '💯', '✨'];

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
  const [showUserWrapped, setShowUserWrapped] = useState(false);
  const [showUserShareable, setShowUserShareable] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<ThemeType | null>(null);
  const [actionReactions, setActionReactions] = useState<Record<string, ActionReaction[]>>({});
  const [showEmojiPicker, setShowEmojiPicker] = useState<string | null>(null);
  const [customEmoji, setCustomEmoji] = useState('');
  const emojiInputRef = useRef<TextInput>(null);

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
        reactions: actionReactions[event.id] || [],
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
          reactions: actionReactions[split.id] || [],
        });
      });
    
    // Sort by date (most recent first) and take top 10
    return actions
      .sort((a, b) => b.dateObj.getTime() - a.dateObj.getTime())
      .slice(0, 10)
      .map(({ dateObj, ...action }) => action);
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

  // Load reactions from database
  const loadReactions = async () => {
    try {
      const reactions = await getActivityReactions('current-user');
      setActionReactions(reactions);
    } catch (error) {
      console.error('Error loading reactions:', error);
    }
  };

  // Handle emoji reaction
  const handleReaction = async (actionId: string, emoji: string, activityType: 'event' | 'split') => {
    if (!emoji.trim()) return;
    
    const currentUserId = 'current-user'; // TODO: Replace with actual user ID
    
    // Optimistically update UI
    setActionReactions(prev => {
      const existingReactions = prev[actionId] || [];
      const emojiReaction = existingReactions.find(r => r.emoji === emoji);
      
      if (emojiReaction) {
        // User already reacted with this emoji - remove reaction
        if (emojiReaction.users.includes(currentUserId)) {
          const updatedUsers = emojiReaction.users.filter(id => id !== currentUserId);
          
          if (updatedUsers.length === 0) {
            // Remove emoji completely if no users left
            return {
              ...prev,
              [actionId]: existingReactions.filter(r => r.emoji !== emoji),
            };
          }
          
          return {
            ...prev,
            [actionId]: existingReactions.map(r =>
              r.emoji === emoji
                ? { ...r, users: updatedUsers, count: updatedUsers.length }
                : r
            ),
          };
        } else {
          // Add user to existing emoji
          return {
            ...prev,
            [actionId]: existingReactions.map(r =>
              r.emoji === emoji
                ? { ...r, users: [...r.users, currentUserId], count: r.count + 1 }
                : r
            ),
          };
        }
      } else {
        // New emoji reaction
        return {
          ...prev,
          [actionId]: [
            ...existingReactions,
            { emoji, users: [currentUserId], count: 1 },
          ],
        };
      }
    });
    
    setShowEmojiPicker(null);
    setCustomEmoji('');
    
    // Persist to database
    try {
      await toggleActivityReaction(currentUserId, actionId, activityType, emoji);
    } catch (error) {
      console.error('Error toggling reaction:', error);
      // Reload reactions to sync with database state
      await loadReactions();
    }
  };

  // Check if current user reacted with this emoji
  const hasUserReacted = (actionId: string, emoji: string): boolean => {
    const reactions = actionReactions[actionId] || [];
    const emojiReaction = reactions.find(r => r.emoji === emoji);
    return emojiReaction?.users.includes('current-user') || false;
  };

  // Handle custom emoji input - reacts immediately as user types
  const handleCustomEmojiChange = (text: string, actionId: string, activityType: 'event' | 'split') => {
    setCustomEmoji(text);
    
    // If user typed an emoji (non-empty after trim), react immediately
    if (text.trim()) {
      handleReaction(actionId, text.trim(), activityType);
    }
  };

  // Fetch user data from Supabase
  const loadUserData = async () => {
    try {
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
      
      await loadReactions();
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

  useFocusEffect(
    useCallback(() => {
      loadUserData();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadUserData();
    setRefreshing(false);
  };

  const userProfile = currentUser ? analyzeUserProfile(
    currentUser.id,
    userTransactions,
    userEvents,
    userGroups
  ) : null;

  useEffect(() => {
    const cachedImages = getUserImages('current-user');
    if (cachedImages) {
      if (cachedImages.bannerImage) setBannerImage(cachedImages.bannerImage);
      if (cachedImages.profileImage) setProfileImage(cachedImages.profileImage);
    }
    
    loadImages();
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'We need access to your photos to upload images.');
    }
  };

  const loadImages = () => {
    getUserById('current-user')
      .then(user => {
        if (user.bannerImage && user.bannerImage !== bannerImage) {
          setBannerImage(user.bannerImage);
          updateCacheUserImages('current-user', undefined, user.bannerImage);
        }
        if (user.profileImage && user.profileImage !== profileImage) {
          setProfileImage(user.profileImage);
          updateCacheUserImages('current-user', user.profileImage, undefined);
        }
      })
      .catch(error => {
        console.error('Error loading images:', error);
      });
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
        const publicUrl = await uploadImage(
          { uri, type: 'image/jpeg', name: `banner-${Date.now()}.jpg` },
          'banners'
        );
        
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
        const publicUrl = await uploadImage(
          { uri, type: 'image/jpeg', name: `profile-${Date.now()}.jpg` },
          'profiles'
        );
        
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
    setNavigationTarget(action.groupId, action.activityId);
    router.push('/tabs/groups');
  };

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
        <Text style={styles.greeting}>Hello, Guillaume!</Text>

        {/* Persona Badge */}
        <TouchableOpacity 
          style={styles.personaSection}
          onPress={() => setShowUserWrapped(true)}
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
              name="chevron-forward" 
              size={24} 
              color="#C3F73A" 
            />
          </View>
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
                <View key={action.id} style={styles.actionItemContainer}>
                  <TouchableOpacity
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

                  {/* Reactions Section */}
                  <View style={styles.reactionsContainer}>
                    {/* Existing Reactions */}
                    {action.reactions && action.reactions.length > 0 && (
                      <View style={styles.reactionsList}>
                        {action.reactions.map((reaction) => (
                          <TouchableOpacity
                            key={reaction.emoji}
                            style={[
                              styles.reactionBubble,
                              hasUserReacted(action.id, reaction.emoji) && styles.reactionBubbleActive,
                            ]}
                            onPress={() => {
                              const activityType = action.type.includes('event') ? 'event' : 'split';
                              handleReaction(action.id, reaction.emoji, activityType);
                            }}
                          >
                            <Text style={styles.reactionEmoji}>{reaction.emoji}</Text>
                            <Text style={styles.reactionCount}>{reaction.count}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}

                    {/* Add Reaction Button */}
                    <TouchableOpacity
                      style={styles.addReactionButton}
                      onPress={() => {
                        const isOpen = showEmojiPicker === action.id;
                        setShowEmojiPicker(isOpen ? null : action.id);
                        if (!isOpen) {
                          // Focus emoji input after picker opens
                          setTimeout(() => emojiInputRef.current?.focus(), 100);
                        }
                      }}
                    >
                      <Ionicons name={showEmojiPicker === action.id ? "close" : "add-circle-outline"} size={20} color="#666" />
                    </TouchableOpacity>
                  </View>

                  {/* Emoji Picker */}
                  {showEmojiPicker === action.id && (
                    <View style={styles.emojiPicker}>
                      <Text style={styles.emojiPickerTitle}>Quick Reactions</Text>
                      <View style={styles.commonEmojis}>
                        {COMMON_EMOJIS.map((emoji) => (
                          <TouchableOpacity
                            key={emoji}
                            style={styles.emojiOption}
                            onPress={() => {
                              const activityType = action.type.includes('event') ? 'event' : 'split';
                              handleReaction(action.id, emoji, activityType);
                            }}
                          >
                            <Text style={styles.emojiOptionText}>{emoji}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                      
                      {/* Custom Emoji Input */}
                      <View style={styles.customEmojiContainer}>
                        <Text style={styles.customEmojiLabel}>Or choose from keyboard</Text>
                        <View style={styles.customEmojiInput}>
                          <TextInput
                            ref={emojiInputRef}
                            style={styles.emojiTextInput}
                            placeholder="Tap to open emoji keyboard 😊"
                            placeholderTextColor="#666"
                            value={customEmoji}
                            onChangeText={(text) => {
                              const activityType = action.type.includes('event') ? 'event' : 'split';
                              handleCustomEmojiChange(text, action.id, activityType);
                            }}
                            maxLength={2}
                          />
                        </View>
                      </View>
                    </View>
                  )}
                </View>
              );
            })
          )}
        </View>
      </View>

      {/* User Wrapped Modal */}
      {showUserWrapped && userProfile && (
        <Modal
          visible={true}
          animationType="slide"
          presentationStyle="fullScreen"
        >
          <UserWrappedAppView
            userProfile={userProfile}
            userName="Guillaume"
            onClose={() => setShowUserWrapped(false)}
            onShare={(theme) => {
              setShowUserWrapped(false);
              setSelectedTheme(theme);
              setShowUserShareable(true);
            }}
          />
        </Modal>
      )}

      {/* User Shareable Modal */}
      {showUserShareable && selectedTheme && userProfile && (
        <Modal
          visible={true}
          animationType="slide"
          presentationStyle="fullScreen"
        >
          <UserShareableWrapped
            userProfile={userProfile}
            userName="Guillaume"
            selectedTheme={selectedTheme}
            onBack={() => setShowUserShareable(false)}
          />
        </Modal>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#131313',
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
    marginTop: -75,
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
    borderRadius: 75,
    borderWidth: 5,
    borderColor: '#000',
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
  actionsSection: {
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  actionItemContainer: {
    marginBottom: 12,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    padding: 15,
    borderRadius: 15,
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
  reactionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: 8,
    gap: 8,
  },
  reactionsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    flex: 1,
  },
  reactionBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#222',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
    gap: 4,
    borderWidth: 1,
    borderColor: '#333',
  },
  reactionBubbleActive: {
    backgroundColor: '#2a2a2a',
    borderColor: '#C3F73A',
  },
  reactionEmoji: {
    fontSize: 16,
  },
  reactionCount: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  addReactionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#222',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  emojiPicker: {
    flexDirection: 'column',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 15,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#333',
  },
  emojiPickerTitle: {
    color: '#999',
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  commonEmojis: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  emojiOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#222',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emojiOptionText: {
    fontSize: 24,
  },
  customEmojiContainer: {
    borderTopWidth: 1,
    borderTopColor: '#333',
    paddingTop: 12,
  },
  customEmojiLabel: {
    color: '#999',
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  customEmojiInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#222',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#333',
  },
  emojiTextInput: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    paddingVertical: 4,
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