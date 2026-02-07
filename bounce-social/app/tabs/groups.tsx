import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import GroupProfile from '@/components/GroupProfile';

interface Group {
  id: string;
  name: string;
  members: number;
  image: string;
}

// Sample groups data with colors
const SAMPLE_GROUPS: Group[] = [
  { id: '1', name: 'Basketball Crew', members: 24, image: 'https://via.placeholder.com/60' },
  { id: '2', name: 'Friday Night Football', members: 18, image: 'https://via.placeholder.com/60' },
  { id: '3', name: 'Tennis Club', members: 12, image: 'https://via.placeholder.com/60' },
  { id: '4', name: 'Morning Runners', members: 31, image: 'https://via.placeholder.com/60' },
];

const GROUP_COLORS = ['#C3F73A', '#FF6B6B', '#4FC3F7', '#FFD93D'];

export default function GroupsScreen() {
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);

  // Show Group Profile if selected
  if (selectedGroup) {
    return (
      <GroupProfile 
        group={selectedGroup} 
        onBack={() => setSelectedGroup(null)} 
      />
    );
  }

  // Group List View
  return (
    <View style={styles.container}>
      <FlatList
        data={SAMPLE_GROUPS}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <TouchableOpacity 
            style={styles.groupItem}
            onPress={() => setSelectedGroup(item)}
          >
            <View style={styles.groupItemImageContainer}>
              <View style={[styles.groupItemDiamond, { backgroundColor: GROUP_COLORS[index % GROUP_COLORS.length] }]} />
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
});