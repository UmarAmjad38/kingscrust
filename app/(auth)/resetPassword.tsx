import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Dimensions, SafeAreaView, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, ImageBackground } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Lock, ArrowLeft } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const ResetPasswordScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [loading, setLoading] = useState(false);


  const handleResetPassword = async () => {
    if (!newPassword || !confirmNewPassword) {
      Alert.alert('Error', 'Please fill in all password fields.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLoading(false);
    Alert.alert('Success', 'Your password has been reset successfully. Please login.', [
      { text: 'OK', onPress: () => router.replace('/(auth)/login') }
    ]);
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
                <Text style={styles.title}>Reset Password</Text>
                <Text style={styles.subtitle}>Enter your new password below.</Text>


                <View style={styles.inputContainer}>
                    <Lock size={20} color="#BDBDBD" style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder="New Password"
                        placeholderTextColor="#BDBDBD"
                        value={newPassword}
                        onChangeText={setNewPassword}
                        secureTextEntry
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Lock size={20} color="#BDBDBD" style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Confirm New Password"
                        placeholderTextColor="#BDBDBD"
                        value={confirmNewPassword}
                        onChangeText={setConfirmNewPassword}
                        secureTextEntry
                    />
                </View>

                <TouchableOpacity style={styles.button} onPress={handleResetPassword} disabled={loading}>
                    {loading ? <ActivityIndicator color="#333" /> : <Text style={styles.buttonText}>Reset Password</Text>}
                </TouchableOpacity>
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
    paddingHorizontal: 20,
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
});

export default ResetPasswordScreen;