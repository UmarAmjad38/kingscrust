import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Dimensions, SafeAreaView, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, Lock, ArrowLeft } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const LoginScreen = () => {
  const router = useRouter();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!identifier || !password) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    const dummyToken = `fake-jwt-token-${Date.now()}`;
    await AsyncStorage.setItem('userToken', dummyToken);
    await AsyncStorage.removeItem('guestMode');
    setLoading(false);
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
    <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
    >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <ArrowLeft size={28} color="#FFFFFF" />
                </TouchableOpacity>
            </View>
            <View style={styles.container}>
                <Image
                    source={require('../../assets/images/logo.png')}
                    style={styles.logo}
                />
                <Text style={styles.title}>Welcome Back!</Text>
                <Text style={styles.subtitle}>Login to continue your pizza journey</Text>

                <View style={styles.inputContainer}>
                    <User size={20} color="#BDBDBD" style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Email or Phone"
                        placeholderTextColor="#BDBDBD"
                        value={identifier}
                        onChangeText={setIdentifier}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Lock size={20} color="#BDBDBD" style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        placeholderTextColor="#BDBDBD"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />
                </View>

                <TouchableOpacity style={styles.forgotPasswordButton} onPress={() => router.push('/(auth)/forgotPassword')}>
                    <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
                    {loading ? <ActivityIndicator color="#333" /> : <Text style={styles.buttonText}>Login</Text>}
                </TouchableOpacity>

                <View style={styles.signUpContainer}>
                    <Text style={styles.signUpText}>Don't have an account? </Text>
                    <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
                        <Text style={styles.signUpLink}>Sign Up</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    </KeyboardAvoidingView>
    </LinearGradient>
    </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#000' },
  backgroundImage: { flex: 1 },
  gradient: { flex: 1 },
  scrollContainer: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 25, },
  header: { position: 'absolute', top: Platform.OS === 'ios' ? 20 : 30, left: 20, zIndex: 1, },
  backButton: { padding: 10, },
  container: {
    alignItems: 'center',
    paddingTop: height * 0.05,
    paddingBottom: height * 0.05,
  },
  logo: {
    width: width * 0.25,
    height: width * 0.25,
    resizeMode: 'contain',
    marginBottom: 20,
    borderRadius: (width * 0.25) /2,
    borderWidth: 2,
    borderColor: '#fedc00'
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 28,
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: '#E0E0E0',
    textAlign: 'center',
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 20,
    width: '100%',
    maxWidth: 400,
    height: 55,
  },
  inputIcon: { marginRight: 10, },
  input: {
    flex: 1,
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: '#FFFFFF',
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginBottom: 25,
  },
  forgotPasswordText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#fedc00',
  },
  button: {
    backgroundColor: '#fedc00',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    minHeight: 55,
    justifyContent: 'center',
  },
  buttonText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#333333',
  },
  signUpContainer: {
    flexDirection: 'row',
    marginTop: 30,
    alignItems: 'center',
  },
  signUpText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 15,
    color: '#BDBDBD',
  },
  signUpLink: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 15,
    color: '#fedc00',
    marginLeft: 5,
  },
});

export default LoginScreen;