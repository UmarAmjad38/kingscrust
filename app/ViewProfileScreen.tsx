import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Platform, Image, TextInput } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { router } from 'expo-router';

const PRIMARY_COLOR = '#D9534F';
const ACCENT_COLOR = '#F0AD4E';
const DARK_TEXT_COLOR = '#2A2A2A';
const MEDIUM_TEXT_COLOR = '#585858';
const LIGHT_BACKGROUND_COLOR = '#FFF9F2';
const CARD_BACKGROUND_COLOR = '#FFFFFF';
const BORDER_COLOR = '#F0E6D8';
const SKELETON_COLOR = '#F5F0E9';

const SkeletonElement = ({ style, width, height, borderRadius = 8 }: { style?: object, width?: number | string, height?: number | string, borderRadius?: number }) => (
  <View style={[{ backgroundColor: SKELETON_COLOR, borderRadius }, style, width !== undefined ? { width } : {}, height !== undefined ? { height } : {}]} />
);

const ViewProfileScreenSkeleton = () => (
  <View style={styles.container}>
    <View style={styles.header}>
      <SkeletonElement width={36} height={36} borderRadius={18} />
      <SkeletonElement width="50%" height={28} style={{ marginLeft: 15 }} />
    </View>
    <ScrollView contentContainerStyle={styles.scrollContentContainerSkeleton}>
      <View style={styles.profileHeaderSkeleton}>
        <SkeletonElement width={100} height={100} borderRadius={50} />
        <SkeletonElement width="60%" height={24} style={{ marginTop: 15 }} />
        <SkeletonElement width="40%" height={18} style={{ marginTop: 8 }} />
      </View>
      <View style={styles.infoCardSkeleton}>
        <SkeletonElement width="30%" height={18} style={{ marginBottom: 10 }} />
        <SkeletonElement width="80%" height={40} borderRadius={10} />
      </View>
      <View style={styles.infoCardSkeleton}>
        <SkeletonElement width="30%" height={18} style={{ marginBottom: 10 }} />
        <SkeletonElement width="80%" height={40} borderRadius={10} />
      </View>
      <View style={styles.infoCardSkeleton}>
        <SkeletonElement width="30%" height={18} style={{ marginBottom: 10 }} />
        <SkeletonElement width="80%" height={40} borderRadius={10} />
      </View>
      <SkeletonElement width="90%" height={50} borderRadius={25} style={{ alignSelf: 'center', marginTop: 20 }} />
    </ScrollView>
  </View>
);

export default function ViewProfileScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('Umar Farooq');
  const [phone, setPhone] = useState('+92 324 0771561');
  const [email, setEmail] = useState('umar@kingscrust.com');

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleSaveChanges = () => {
    setIsEditing(false);
  };

  if (isLoading) {
    return <ViewProfileScreenSkeleton />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back-outline" size={28} color={PRIMARY_COLOR} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Profile</Text>
        <TouchableOpacity onPress={() => setIsEditing(!isEditing)} style={styles.editButton}>
          <Feather name={isEditing ? "check" : "edit-2"} size={22} color={PRIMARY_COLOR} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContentContainer}>
        <View style={styles.profileHeader}>
          <Image
            source={require('../assets/images/th.jpeg')}
            style={styles.profileImage}
          />
          {!isEditing && (
            <>
              <Text style={styles.profileNameText}>{name}</Text>
              <Text style={styles.profilePhoneText}>{phone}</Text>
            </>
          )}
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Full Name</Text>
          <TextInput
            style={[styles.infoInput, !isEditing && styles.infoInputDisabled]}
            value={name}
            onChangeText={setName}
            editable={isEditing}
            placeholder="Enter your full name"
            placeholderTextColor={MEDIUM_TEXT_COLOR}
          />
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Phone Number</Text>
          <TextInput
            style={[styles.infoInput, !isEditing && styles.infoInputDisabled]}
            value={phone}
            onChangeText={setPhone}
            editable={isEditing}
            keyboardType="phone-pad"
            placeholder="Enter your phone number"
            placeholderTextColor={MEDIUM_TEXT_COLOR}
          />
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Email Address</Text>
          <TextInput
            style={[styles.infoInput, !isEditing && styles.infoInputDisabled]}
            value={email}
            onChangeText={setEmail}
            editable={isEditing}
            keyboardType="email-address"
            placeholder="Enter your email address"
            placeholderTextColor={MEDIUM_TEXT_COLOR}
            autoCapitalize="none"
          />
        </View>

        {isEditing && (
          <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: LIGHT_BACKGROUND_COLOR,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingTop: Platform.OS === 'ios' ? 50 : 25,
    paddingBottom: 15,
    backgroundColor: CARD_BACKGROUND_COLOR,
    borderBottomWidth: 1,
    borderBottomColor: BORDER_COLOR,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  backButton: {
    padding: 6,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: DARK_TEXT_COLOR,
  },
  editButton: {
    padding: 6,
  },
  scrollContentContainer: {
    paddingHorizontal: 20,
    paddingVertical: 25,
  },
  scrollContentContainerSkeleton: {
    paddingHorizontal: 20,
    paddingVertical: 25,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profileHeaderSkeleton: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: SKELETON_COLOR,
    marginBottom: 15,
    borderWidth: 3,
    borderColor: PRIMARY_COLOR,
  },
  profileNameText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: DARK_TEXT_COLOR,
    marginBottom: 5,
  },
  profilePhoneText: {
    fontSize: 16,
    color: MEDIUM_TEXT_COLOR,
  },
  infoCard: {
    backgroundColor: CARD_BACKGROUND_COLOR,
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 15,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
  },
  infoCardSkeleton: {
    backgroundColor: SKELETON_COLOR,
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 15,
    marginBottom: 18,
  },
  infoLabel: {
    fontSize: 13,
    color: MEDIUM_TEXT_COLOR,
    marginBottom: 8,
    fontWeight: '500',
  },
  infoInput: {
    fontSize: 16,
    color: DARK_TEXT_COLOR,
    paddingVertical: Platform.OS === 'ios' ? 10 : 8,
    borderBottomWidth: 1,
    borderBottomColor: BORDER_COLOR,
  },
  infoInputDisabled: {
    color: MEDIUM_TEXT_COLOR,
    backgroundColor: 'transparent',
  },
  saveButton: {
    backgroundColor: PRIMARY_COLOR,
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});