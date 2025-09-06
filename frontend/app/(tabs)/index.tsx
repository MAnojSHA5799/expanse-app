import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Image, StyleSheet, Text, TouchableOpacity } from 'react-native';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <LinearGradient
      colors={['#4facfe', '#00f2fe']}
      style={styles.container}
    >
      <Image
        source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3314/3314195.png' }}
        style={styles.image}
      />
      <Text style={styles.title}>Welcome to Expense Manager 💰</Text>
      <Text style={styles.subtitle}>
        Track your daily expenses easily and stay on top of your budget!
      </Text>

      {/* Expenses Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/(tabs)/expenses')}
      >
        <Text style={styles.buttonText}>Go to Expenses</Text>
      </TouchableOpacity>

      {/* Dashboard Button */}
    
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  image: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#fff',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#000',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#000000ff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    marginTop: 15,
    width: 220,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
