import { View, Image, StyleSheet, ScrollView } from 'react-native';

export default function ProfileScreen() {
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
      
      {/* Profile content goes below */}
      <View style={styles.content}>
        {/* Add profile info here */}
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
    alignItems: 'center',
  },
});