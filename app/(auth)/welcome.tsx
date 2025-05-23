import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, SafeAreaView, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const WelcomeScreen = () => {
  const router = useRouter();

  const handleLogin = () => {
    router.push('/(auth)/login');
  };

  const handleSignUp = () => {
    router.push('/(auth)/signup');
  };

  const handleGuest = async () => {
    await AsyncStorage.setItem('guestMode', 'true');
    await AsyncStorage.removeItem('userToken');
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
        <ImageBackground
            source={require('../../assets/images/bg3.jpg')}
            resizeMode="cover"
            style={styles.backgroundImage}
        >
        <LinearGradient
            colors={['rgba(0,0,0,0.6)', 'rgba(0,0,0,0.8)']}
            style={styles.gradient}
        >
            <View style={styles.container}>
                <Image
                source={require('../../assets/images/logo.png')}
                style={styles.logo}
                />
                <Text style={styles.title}>King's Crust</Text>
                <Text style={styles.subtitle}>Delicious Pizza, Delivered Fast.</Text>

                <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.signUpButton]} onPress={handleSignUp}>
                    <Text style={[styles.buttonText, styles.signUpButtonText]}>Sign Up</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.guestButton} onPress={handleGuest}>
                    <Text style={styles.guestButtonText}>Continue as Guest</Text>
                </TouchableOpacity>
                </View>
            </View>
        </LinearGradient>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#000' },
  backgroundImage: { flex: 1, justifyContent: 'center' },
  gradient: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20, },
  container: {
    width: '100%',
    alignItems: 'center',
    paddingBottom: height * 0.05,
  },
  logo: {
    width: width * 0.4,
    height: width * 0.4,
    resizeMode: 'contain',
    marginBottom: 20,
    borderRadius: (width * 0.4) /2,
    borderWidth: 3,
    borderColor: '#fedc00'
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 36,
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 18,
    color: '#E0E0E0',
    textAlign: 'center',
    marginBottom: 40,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 350,
  },
  button: {
    backgroundColor: '#fedc00',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 15,
    width: '100%',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#333333',
  },
  signUpButton: {
    backgroundColor: 'transparent',
    borderColor: '#fedc00',
    borderWidth: 2,
  },
  signUpButtonText: {
    color: '#fedc00',
  },
  guestButton: {
    marginTop: 10,
    paddingVertical: 12,
  },
  guestButtonText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: '#BDBDBD',
    textDecorationLine: 'underline',
  },
});

export default WelcomeScreen;