import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image } from 'react-native';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import GroupProfile from '@/components/GroupProfile';
import CreateGroup from '@/components/CreateGroup';
import { getNavigationTarget, clearNavigationTarget, subscribeToNavigation } from '@/lib/navigationState';

// Current user identifier (will be replaced with actual auth later)
const CURRENT_USER_ID = 'currentUser';

interface Group {
  id: string;
  name: string;
  members: number;
  image: string;
  banner?: string;
  createdBy: string;
}

const GROUP_COLORS = ['#C3F73A', '#FF6B6B', '#4FC3F7', '#FFD93D'];

// Initial sample groups
const INITIAL_GROUPS: Group[] = [
  { id: '1', name: 'Basketball Crew', members: 24, image: 'https://via.placeholder.com/60', createdBy: 'otherUser1' },
  { id: '2', name: 'Friday Night Football', members: 18, image: 'https://via.placeholder.com/60', createdBy: 'otherUser2' },
  { id: '3', name: 'Tennis Club', members: 12, image: 'https://via.placeholder.com/60', createdBy: 'otherUser3' },
  { id: '4', name: 'Morning Runners', members: 31, image: 'https://via.placeholder.com/60', createdBy: 'otherUser4' },
];

export default function GroupsScreen() {
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [selectedActivityId, setSelectedActivityId] = useState<string | undefined>(undefined);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [groups, setGroups] = useState<Group[]>(INITIAL_GROUPS);

  // Listen for navigation from other tabs
  useFocusEffect(
    useCallback(() => {
      const navTarget = getNavigationTarget();
      if (navTarget.groupId && navTarget.activityId) {
        const group = groups.find(g => g.id === navTarget.groupId);
        if (group) {
          setSelectedGroup(group);
          setSelectedActivityId(navTarget.activityId);
          clearNavigationTarget();
        }
      }
    }, [groups])
  );

  const handleCreateGroup = (groupName: string, banner: string | null, profilePic: string | null, password: string) => {
    const newGroup: Group = {
      id: Date.now().toString(),
      name: groupName,
      members: 1, // Creator is the first member
      image: profilePic || 'https://via.placeholder.com/60',
      banner: banner || undefined,
      createdBy: CURRENT_USER_ID,
    };
    setGroups([...groups, newGroup]);
    setShowCreateGroup(false);
  };

  if (showCreateGroup) {
    return (
      <CreateGroup 
        onBack={() => setShowCreateGroup(false)}
        onCreateGroup={handleCreateGroup}
      />
    );
  }

  // Show Group Profile if selected
  if (selectedGroup) {
    return (
      <GroupProfile 
        group={selectedGroup} 
        onBack={() => {
          setSelectedGroup(null);
          setSelectedActivityId(undefined);
        }}
        initialActivityId={selectedActivityId}
      />
    );
  }

  // Group List View
  return (
    <View style={styles.container}>
      <FlatList
        data={groups}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <TouchableOpacity 
            style={styles.createGroupButton}
            onPress={() => setShowCreateGroup(true)}
          >
            <Ionicons name="add-circle" size={24} color="#000" />
            <Text style={styles.createGroupButtonText}>Create New Group</Text>
          </TouchableOpacity>
        }
        renderItem={({ item, index }) => (
          <TouchableOpacity 
            style={styles.groupItem}
            onPress={() => setSelectedGroup(item)}
          >
            <View style={styles.groupItemImageContainer}>
              {item.image.startsWith('file://') || item.image.startsWith('content://') ? (
                <>
                  <Image source={{ uri: item.image }} style={styles.groupItemImageBackground} />
                  <View style={styles.groupItemImageMask} />
                </>
              ) : (
                <View style={[styles.groupItemDiamond, { backgroundColor: GROUP_COLORS[index % GROUP_COLORS.length] }]} />
              )}
            </View>
            <View style={styles.groupItemInfo}>
              <Text style={styles.groupItemName}>{item.name}</Text>
              <Text style={styles.groupItemMembers}>{item.members} members</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#666" />
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  groupItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#000',
  },
  groupItemImageContainer: {
    width: 60,
    height: 60,
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  groupItemDiamond: {
    width: 0,
    height: 0,
    borderLeftWidth: 25,
    borderRightWidth: 25,
    borderBottomWidth: 45,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderRadius: 5,
  },
  groupItemImageBackground: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  groupItemImageMask: {
    width: 0,
    height: 0,
    borderLeftWidth: 25,
    borderRightWidth: 25,
    borderBottomWidth: 45,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'rgba(0,0,0,0.3)',
    borderRadius: 5,
  },
  groupItemInfo: {
    flex: 1,
  },
  groupItemName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  groupItemMembers: {
    color: '#666',
    fontSize: 14,
  },
  separator: {
    height: 1,
    backgroundColor: '#222',
    marginLeft: 90,
  },
  createGroupButton: {
    flexDirection: 'row',
    backgroundColor: '#C3F73A',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    margin: 20,
    shadowColor: '#C3F73A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  createGroupButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});