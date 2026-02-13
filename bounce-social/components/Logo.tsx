import { Image, StyleSheet } from 'react-native';

export default function Logo() {
  return (
    <Image 
      source={require('@/assets/logos/bounce_together.png')}
      style={styles.logo}
      resizeMode="contain"
    />
  );
}

const styles = StyleSheet.create({
  logo: {
    width: 180,
    height: 60
  },
});
