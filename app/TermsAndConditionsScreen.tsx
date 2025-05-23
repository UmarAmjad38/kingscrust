import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Platform, Image } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

const PRIMARY_COLOR = '#D9534F'; // A warm, inviting red, common for pizza brands
const ACCENT_COLOR = '#F0AD4E'; // A cheesy yellow/orange accent
const DARK_TEXT_COLOR = '#2A2A2A';
const MEDIUM_TEXT_COLOR = '#585858';
const LIGHT_BACKGROUND_COLOR = '#FFF9F2'; // Very light cream/beige
const CARD_BACKGROUND_COLOR = '#FFFFFF';
const BORDER_COLOR = '#F0E6D8';
const SKELETON_COLOR = '#F5F0E9';

const SkeletonElement = ({ style, width, height, borderRadius = 8 }: { style?: object, width?: number | string, height?: number | string, borderRadius?: number }) => (
  <View style={[{ backgroundColor: SKELETON_COLOR, borderRadius }, style, width !== undefined ? { width } : {}, height !== undefined ? { height } : {}]} />
);

const TermsAndConditionsScreenSkeleton = () => (
  <View style={styles.container}>
    <View style={styles.header}>
      <SkeletonElement width={36} height={36} borderRadius={18} />
      <SkeletonElement width="65%" height={28} style={{ marginLeft: 15 }} />
    </View>
    <ScrollView contentContainerStyle={styles.scrollContainerSkeleton}>
      <SkeletonElement width={70} height={70} borderRadius={35} style={{ alignSelf: 'center', marginBottom: 10 }} />
      <SkeletonElement width="75%" height={26} style={{ marginBottom: 8, alignSelf: 'center' }} />
      <SkeletonElement width="45%" height={16} style={{ marginBottom: 30, alignSelf: 'center' }} />
      {[...Array(4)].map((_, sectionIndex) => (
        <View key={`skel_section_${sectionIndex}`} style={styles.skeletonSection}>
          <View style={styles.skeletonSectionHeader}>
            <SkeletonElement width={30} height={30} borderRadius={15} />
            <SkeletonElement width="55%" height={22} style={{ marginLeft: 12 }} />
          </View>
          {[...Array(3)].map((_, pIndex) => (
            <SkeletonElement key={`skel_p_${sectionIndex}_${pIndex}`} width="100%" height={15} style={{ marginBottom: 9 }} />
          ))}
          <SkeletonElement width="90%" height={15} style={{ marginBottom: 9 }} />
        </View>
      ))}
    </ScrollView>
  </View>
);

export default function TermsAndConditionsScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <TermsAndConditionsScreenSkeleton />;
  }

  const Section = ({ title, children, iconName }: {title: string, children: React.ReactNode, iconName: keyof typeof MaterialCommunityIcons.glyphMap }) => (
    <View style={styles.sectionContainer}>
        <View style={styles.sectionHeaderContainer}>
            <View style={styles.sectionIconBackground}>
                <MaterialCommunityIcons name={iconName} size={20} color={PRIMARY_COLOR} />
            </View>
            <Text style={styles.sectionTitle}>{title}</Text>
        </View>
        {children}
    </View>
  );

  return (
    <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back-outline" size={28} color={PRIMARY_COLOR} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            Our Slice of <Text style={styles.headerTitleHighlight}>Policy</Text>
          </Text>
        </View>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.pageTitleContainer}>
            <Image source={require('../assets/images/logo.png')} style={styles.logoImage} />
            <Text style={styles.pageTitle}>King's Crust Pizzeria Terms</Text>
            <Text style={styles.lastUpdated}>Last Updated: {formattedDate}</Text>
          </View>

          <Section title="1. Accepting Our Terms" iconName="file-document-outline">
            <Text style={styles.paragraph}>
              Welcome to King's Crust! By using our mobile app (the "Service"), you agree to these Terms and Conditions (our "Pizza Policy"). If you don't agree with any part, please don't use the Service.
            </Text>
          </Section>

          <Section title="2. Your License to Order" iconName="pizza">
            <Text style={styles.paragraph}>
              We grant you a temporary license to use the King's Crust app for personal, non-commercial ordering. This means you can't:
            </Text>
            <Text style={styles.listItem}><MaterialCommunityIcons name="minus-circle-outline" size={16} color={MEDIUM_TEXT_COLOR} style={styles.listItemIcon} /> Modify or copy our app's content or code.</Text>
            <Text style={styles.listItem}><MaterialCommunityIcons name="minus-circle-outline" size={16} color={MEDIUM_TEXT_COLOR} style={styles.listItemIcon} /> Use it for commercial purposes or public display.</Text>
            <Text style={styles.listItem}><MaterialCommunityIcons name="minus-circle-outline" size={16} color={MEDIUM_TEXT_COLOR} style={styles.listItemIcon} /> Try to decompile or reverse engineer our software.</Text>
            <Text style={styles.listItem}><MaterialCommunityIcons name="minus-circle-outline" size={16} color={MEDIUM_TEXT_COLOR} style={styles.listItemIcon} /> Remove our branding or copyright notices.</Text>
            <Text style={styles.paragraph}>
              This license can be terminated if you violate these terms.
            </Text>
          </Section>

          <Section title="3. As Is Pizza Service" iconName="silverware-fork-knife">
            <Text style={styles.paragraph}>
              The King's Crust app and services are provided "as is." We don't make any warranties, expressed or implied, about merchantability, fitness for a particular purpose, or non-infringement. We strive for deliciousness, but can't guarantee perfection in every digital slice!
            </Text>
          </Section>

          <Section title="4. Limitation of Liability" iconName="shield-alert-outline">
            <Text style={styles.paragraph}>
              King's Crust (or our suppliers) won't be liable for any damages (like lost profits, data, or pizza cravings due to app issues) arising from using or not being able to use our app, even if we've been notified of such possibilities.
            </Text>
          </Section>

          <Section title="5. Content & Pricing Accuracy" iconName="tag-text-outline">
            <Text style={styles.paragraph}>
                Our menu, pricing, and app content might occasionally have errors (typographical, photographic, or technical). We don't warrant that all materials are 100% accurate, complete, or current. We may update content at any time, but we're not obligated to.
            </Text>
          </Section>

          <Section title="6. Governing Law" iconName="gavel">
            <Text style={styles.paragraph}>
                These terms are governed by the laws of Government of Punjab. You agree to the exclusive jurisdiction of the courts in that location for any disputes.
            </Text>
          </Section>
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
    paddingHorizontal: 15,
    paddingTop: 15,
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
    padding: 6, // Increased padding for easier touch
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 21,
    fontWeight: '700',
    color: DARK_TEXT_COLOR,
    fontFamily: Platform.OS === 'ios' ? 'AvenirNext-Bold' : 'sans-serif-condensed-bold',
  },
  headerTitleHighlight: {
    color: PRIMARY_COLOR,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40, // More space at the bottom
  },
  scrollContainerSkeleton: {
    padding: 20,
  },
  pageTitleContainer: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  logoImage: {
    width: 80, // Adjust size as needed
    height: 80,
    resizeMode: 'contain',
    marginBottom: 12,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: PRIMARY_COLOR,
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'MarkerFelt-Wide' : 'sans-serif-condensed-medium', // Fun, thematic font
    marginBottom: 6,
  },
  lastUpdated: {
    fontSize: 13,
    color: MEDIUM_TEXT_COLOR,
  },
  sectionContainer: {
    backgroundColor: CARD_BACKGROUND_COLOR,
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    shadowColor: '#C0C0C0',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  sectionHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionIconBackground: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${ACCENT_COLOR}30`, // Light accent color for icon bg
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: DARK_TEXT_COLOR,
    fontFamily: Platform.OS === 'ios' ? 'AvenirNext-DemiBold' : 'sans-serif-medium',
  },
  paragraph: {
    fontSize: 15,
    color: MEDIUM_TEXT_COLOR,
    lineHeight: 23,
    marginBottom: 10,
  },
  listItem: {
    fontSize: 15,
    color: MEDIUM_TEXT_COLOR,
    lineHeight: 23,
    marginBottom: 7,
    flexDirection: 'row',
    alignItems: 'center', // Align icon and text
  },
  listItemIcon: {
    marginRight: 8,
  },
  skeletonSection: {
    backgroundColor: `${SKELETON_COLOR}99`,
    borderRadius: 12,
    padding: 18,
    marginBottom: 20,
  },
  skeletonSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
});