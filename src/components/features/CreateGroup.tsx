/**
 * @fileoverview Group creation form component.
 * Comprehensive form for creating new groups with name, password protection,
 * and optional banner/profile image uploads.
 */

import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface CreateGroupProps {
  onBack: () => void;
  onCreateGroup: (groupName: string, banner: string | null, profilePic: string | null, password: string) => void;
}

export default function CreateGroup({ onBack, onCreateGroup }: CreateGroupProps) {
  const [groupName, setGroupName] = useState('');
  const [password, setPassword] = useState('');
  const [bannerImage, setBannerImage] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'We need access to your photos to upload images.');
      }
    })();
  }, []);

  const pickBannerImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
    });

    if (!result.canceled) {
      setBannerImage(result.assets[0].uri);
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
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleCreate = () => {
    if (groupName.trim()) {
      onCreateGroup(groupName, bannerImage, profileImage, password.trim() || '');
      onBack();
    } else {
      Alert.alert('Missing Information', 'Please enter a group name.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="close" size={28} color="#C3F73A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Group</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Banner Upload */}
        <View style={styles.section}>
          <Text style={styles.label}>Group Banner (Optional)</Text>
          <TouchableOpacity style={styles.bannerUpload} onPress={pickBannerImage}>
            {bannerImage ? (
              <Image source={{ uri: bannerImage }} style={styles.bannerPreview} />
            ) : (
              <View style={styles.uploadPlaceholder}>
                <Ionicons name="image-outline" size={48} color="#666" />
                <Text style={styles.uploadText}>Tap to upload banner</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Profile Picture Upload */}
        <View style={styles.section}>
          <Text style={styles.label}>Group Picture (Optional)</Text>
          <TouchableOpacity style={styles.profileUpload} onPress={pickProfileImage}>
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.profilePreview} />
            ) : (
              <View style={styles.profilePlaceholder}>
                <Ionicons name="camera-outline" size={32} color="#666" />
                <Text style={styles.uploadText}>Upload</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Group Name */}
        <View style={styles.section}>
          <Text style={styles.label}>Group Name</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Basketball Crew"
            placeholderTextColor="#666"
            value={groupName}
            onChangeText={setGroupName}
          />
        </View>

        {/* Password */}
        <View style={styles.section}>
          <Text style={styles.label}>Group Password (Optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="Leave empty for open group"
            placeholderTextColor="#666"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <Text style={styles.helperText}>Leave empty if anyone can join without a password</Text>
        </View>

        <TouchableOpacity 
          style={[styles.createButton, !groupName.trim() && styles.createButtonDisabled]}
          onPress={handleCreate}
          disabled={!groupName.trim()}
        >
          <Ionicons name="checkmark-circle" size={24} color="#000" />
          <Text style={styles.createButtonText}>Create Group</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#333333',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    color: '#C3F73A',
    fontSize: 20,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 38,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    padding: 20,
    paddingTop: 15,
  },
  label: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  bannerUpload: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#222',
    borderWidth: 2,
    borderColor: '#333',
    borderStyle: 'dashed',
  },
  bannerPreview: {
    width: '100%',
    height: '100%',
  },
  uploadPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadText: {
    color: '#666',
    fontSize: 14,
    marginTop: 8,
  },
  profileUpload: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
    backgroundColor: '#222',
    borderWidth: 2,
    borderColor: '#333',
    borderStyle: 'dashed',
    alignSelf: 'center',
  },
  profilePreview: {
    width: '100%',
    height: '100%',
  },
  profilePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    backgroundColor: '#222',
    color: '#fff',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  helperText: {
    color: '#888',
    fontSize: 13,
    marginTop: 8,
  },
  createButton: {
    flexDirection: 'row',
    backgroundColor: '#C3F73A',
    paddingVertical: 18,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginHorizontal: 20,
    marginVertical: 30,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  createButtonDisabled: {
    backgroundColor: '#585858',
    opacity: 0.5,
  },
  createButtonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
