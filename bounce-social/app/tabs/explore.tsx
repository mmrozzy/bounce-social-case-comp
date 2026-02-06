import { View, Text, StyleSheet, TextInput, ScrollView, Image } from 'react-native';

export default function ExploreScreen() {
  // Placeholder data for carousels
  const eventImages = [
    require('@/assets/images/events/event1.JPG'),
    require('@/assets/images/events/event2.JPG'),
    require('@/assets/images/events/event3.jpg'),
  ];
  
  const orgImages = [1, 2, 3, 4, 5];

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search events, organisations..."
          placeholderTextColor="#666"
        />
      </View>

      {/* Events Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Events</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.carousel}
        >
          {eventImages.map((imageSource, index) => (
          <View key={index} style={styles.carouselItem}>
            <Image 
              source={imageSource}
              style={styles.carouselImage}
            />
          </View>
        ))}
        </ScrollView>
      </View>

      {/* Organisations Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Organisations</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.carousel}
        >
          {orgImages.map((item, index) => (
            <View key={index} style={styles.carouselItem}>
              <Image 
                source={{ uri: `https://via.placeholder.com/250x150/C3F73A/000?text=Org+${item}` }}
                style={styles.carouselImage}
              />
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  searchContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  searchBar: {
    backgroundColor: '#1a1a1a',
    color: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  section: {
    flex: 1,
    paddingVertical: 20,
  },
  sectionTitle: {
    color: '#C3F73A',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    paddingHorizontal: 15,
  },
  carousel: {
    paddingHorizontal: 15,
  },
  carouselItem: {
    marginRight: 15,
    borderRadius: 10,
    overflow: 'hidden',
  },
  carouselImage: {
    width: 250,
    height: 150,
    borderRadius: 10,
  },
});