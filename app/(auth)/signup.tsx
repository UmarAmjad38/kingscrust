import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Dimensions, SafeAreaView, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, Lock, Mail, ArrowLeft, Phone } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const SignUpScreen = () => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!name || !email || !phone || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
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
                <Text style={styles.title}>Create Account</Text>
                <Text style={styles.subtitle}>Join the King's Crust family!</Text>

                <View style={styles.inputContainer}>
                    <User size={20} color="#BDBDBD" style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Full Name"
                        placeholderTextColor="#BDBDBD"
                        value={name}
                        onChangeText={setName}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Mail size={20} color="#BDBDBD" style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Email Address"
                        placeholderTextColor="#BDBDBD"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Phone size={20} color="#BDBDBD" style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Phone Number"
                        placeholderTextColor="#BDBDBD"
                        value={phone}
                        onChangeText={setPhone}
                        keyboardType="phone-pad"
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

                <View style={styles.inputContainer}>
                    <Lock size={20} color="#BDBDBD" style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Confirm Password"
                        placeholderTextColor="#BDBDBD"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry
                    />
                </View>

                <TouchableOpacity style={styles.button} onPress={handleSignUp} disabled={loading}>
                    {loading ? <ActivityIndicator color="#333" /> : <Text style={styles.buttonText}>Sign Up</Text>}
                </TouchableOpacity>

                <View style={styles.loginContainer}>
                    <Text style={styles.loginText}>Already have an account? </Text>
                    <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
                        <Text style={styles.loginLink}>Login</Text>
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
    width: width * 0.20,
    height: width * 0.20,
    resizeMode: 'contain',
    marginBottom: 15,
    borderRadius: (width * 0.20) /2,
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
    marginBottom: 25,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 18,
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
  button: {
    backgroundColor: '#fedc00',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
    marginTop: 10,
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
  loginContainer: {
    flexDirection: 'row',
    marginTop: 30,
    alignItems: 'center',
  },
  loginText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 15,
    color: '#BDBDBD',
  },
  loginLink: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 15,
    color: '#fedc00',
    marginLeft: 5,
  },
});

export default SignUpScreen;