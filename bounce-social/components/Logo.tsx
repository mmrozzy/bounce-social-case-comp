import { Image, StyleSheet } from 'react-native';

export default function Logo() {
  return (
    <Image 
      source={require('@/assets/logos/together.png')}
      style={styles.logo}
      resizeMode="contain"
    />
  );
}

const styles = StyleSheet.create({
  logo: {
    width: 280,  
    height: 150,  
  },
});