import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Animated,
  Pressable,
  Platform,
  Dimensions,
} from "react-native";
import {
  ChevronLeft,
  History,
  Heart,
  Grid,
  MapPin,
  LogOut,
  PhoneCall,
  LogIn,
  User,
} from "lucide-react-native";
import { StatusBar } from "expo-status-bar";
import Constants from 'expo-constants';
import { router } from 'expo-router';

interface SidebarProps {
  isVisible: boolean;
  onClose: () => void;
  isLoggedIn: boolean;
  onLoginPress?: () => void;
  onLogoutPress?: () => void;
  onContactPress?: () => void;
  onOpenAddressSheet?: () => void; // Prop to open the address sheet
}

const ICON_SIZE = 22;
const ACTION_ICON_SIZE = 18;
const ICON_COLOR = "#333";
const BORDER_COLOR = "#e0e0e0";
const PRIMARY_ACCENT_COLOR = "#fedc00"; // You might want to theme this
const SECONDARY_TEXT_COLOR = "#666";
const PRIMARY_TEXT_COLOR = "#222";
const ACTION_BUTTON_TEXT_COLOR = "#333";

const SIDEBAR_WIDTH_PERCENT = 80;
const screenWidth = Dimensions.get('window').width;
const sidebarCalculatedWidth = (screenWidth * SIDEBAR_WIDTH_PERCENT) / 100;
const initialTranslateX = -Math.min(sidebarCalculatedWidth, 350);

export const Sidebar = ({
  isVisible,
  onClose,
  isLoggedIn,
  onLoginPress,
  onLogoutPress,
  onContactPress,
  onOpenAddressSheet,
}: SidebarProps) => {
  const slideAnim = useRef(new Animated.Value(initialTranslateX)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: isVisible ? 0 : initialTranslateX,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: isVisible ? 1 : 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isVisible, slideAnim, fadeAnim, initialTranslateX]);

  const handleNavigation = (path: string) => {
    onClose();
    setTimeout(() => {
      router.push(path as any);
    }, 150);
  };

  const handleOpenAddressModalFromSidebar = () => {
    onClose();
    setTimeout(() => {
        onOpenAddressSheet?.();
    }, 150);
  };

  const loggedInMenuItems = [
    { icon: <History size={ICON_SIZE} color={ICON_COLOR} />, label: "Order History", action: () => handleNavigation('/OrderHistoryScreen') },
    { icon: <Heart size={ICON_SIZE} color={ICON_COLOR} />, label: "My Favorites", action: () => handleNavigation('/MyFavoritesScreen') },
    { icon: <Grid size={ICON_SIZE} color={ICON_COLOR} />, label: "Explore Menu", action: () => handleNavigation('/(tabs)/menu') },
    { icon: <MapPin size={ICON_SIZE} color={ICON_COLOR} />, label: "Saved Addresses", action: handleOpenAddressModalFromSidebar },
  ];

  const loggedOutMenuItems = [
    { icon: <Grid size={ICON_SIZE} color={ICON_COLOR} />, label: "Explore Menu", action: () => handleNavigation('/(tabs)/menu') },
  ];

  const menuItems = isLoggedIn ? loggedInMenuItems : loggedOutMenuItems;

  return (
    <>
      {isVisible && <StatusBar style="light" backgroundColor="rgba(0, 0, 0, 0.5)" />}
      <Pressable
        style={[styles.overlay, !isVisible && styles.overlayHidden]}
        onPress={onClose}
      >
        <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]} />
        <Animated.View
          style={[
            styles.container,
            {
              width: `${SIDEBAR_WIDTH_PERCENT}%`,
              transform: [{ translateX: slideAnim }],
            },
          ]}
          pointerEvents={isVisible ? "auto" : "none"}
        >
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <ChevronLeft size={28} color={ICON_COLOR} />
            </TouchableOpacity>
          </View>
          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContentContainer}
          >
            <View style={styles.topSection}>
              {isLoggedIn ? (
                <View style={styles.profileInfo}>
                  <Image
                    source={require("../assets/images/th.jpeg")}
                    style={styles.profileImage}
                  />
                  <Text style={styles.profileName}>Umar</Text>
                  <Text style={styles.phoneNumber}>+923240771561</Text>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.profileButton]}
                    onPress={() => handleNavigation('/ViewProfileScreen')}
                  >
                    <User size={ACTION_ICON_SIZE} color={ACTION_BUTTON_TEXT_COLOR} style={styles.actionButtonIcon} />
                    <Text style={styles.actionButtonText}>VIEW PROFILE</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.loginSection}>
                   <Image
                    source={require("../assets/images/th.jpeg")}
                    style={styles.profileImage}
                  />
                   <Text style={styles.loginPromptText}>Log in for a personalized experience</Text>
                   <TouchableOpacity
                    style={[styles.actionButton, styles.loginButton]}
                    onPress={onLoginPress}
                   >
                    <LogIn size={ACTION_ICON_SIZE} color={ACTION_BUTTON_TEXT_COLOR} style={styles.actionButtonIcon} />
                    <Text style={styles.actionButtonText}>LOGIN / SIGN UP</Text>
                   </TouchableOpacity>
                </View>
              )}
            </View>
            <View style={styles.menuItems}>
              {menuItems.map((item, index) => (
                <TouchableOpacity
                    key={index}
                    style={styles.menuItem}
                    onPress={item.action}
                >
                  <View style={styles.menuIcon}>{item.icon}</View>
                  <Text style={styles.menuText}>{item.label}</Text>
                </TouchableOpacity>
              ))}
              {isLoggedIn && (
                 <TouchableOpacity
                    style={styles.menuItem}
                    onPress={onLogoutPress}
                 >
                  <View style={styles.menuIcon}><LogOut size={ICON_SIZE} color={ICON_COLOR} /></View>
                  <Text style={styles.menuText}>Logout</Text>
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.spacer} />
            <View style={styles.footer}>
              <TouchableOpacity
                style={[styles.actionButton, styles.contactButton]}
                onPress={onContactPress}
              >
                 <PhoneCall size={ACTION_ICON_SIZE} color={ACTION_BUTTON_TEXT_COLOR} style={styles.actionButtonIcon}/>
                 <Text style={styles.actionButtonText}>CONTACT US</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleNavigation('/TermsAndConditionsScreen')}>
                <Text style={styles.termsText}>Terms & Conditions</Text>
              </TouchableOpacity>
              <Text style={styles.versionText}>V-13.1-U</Text>
            </View>
          </ScrollView>
        </Animated.View>
      </Pressable>
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: 999,
  },
  overlayHidden: {
     pointerEvents: 'none',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  container: {
    position: "absolute", top: 0, left: 0, maxWidth: 350, height: "100%",
    backgroundColor: "#ffffff", zIndex: 1000,
    paddingTop: Constants.statusBarHeight + 5,
    elevation: 8, shadowColor: "#000", shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25, shadowRadius: 5,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row", justifyContent: "flex-start", alignItems: "center",
    paddingBottom: 5,
    marginLeft: -10,
  },
  closeButton: {
    padding: 10,
  },
  content: {
    flex: 1,
  },
  scrollContentContainer: {
     paddingBottom: 20,
     flexGrow: 1,
     justifyContent: 'space-between'
  },
  topSection: {
    borderBottomWidth: 1,
    borderBottomColor: BORDER_COLOR,
    paddingBottom: 25,
    marginBottom: 10,
    alignItems: 'center',
  },
  profileInfo: {
    alignItems: 'center',
    width: '100%',
  },
  loginSection: {
      alignItems: 'center',
      width: '100%',
      paddingTop: 20,
  },
  profileImage: {
    width: 70, height: 70, borderRadius: 35,
    marginBottom: 12, backgroundColor: '#eee',
  },
  profileName: {
    fontSize: 18, fontWeight: "600", color: PRIMARY_TEXT_COLOR, marginBottom: 4,
  },
  phoneNumber: {
    fontSize: 14, color: SECONDARY_TEXT_COLOR, marginBottom: 20,
  },
  loginPromptText: {
    fontSize: 15,
    color: SECONDARY_TEXT_COLOR,
    textAlign: 'center',
    marginBottom: 20,
  },
  actionButton: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  actionButtonIcon: {
    marginRight: 10,
  },
  actionButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: ACTION_BUTTON_TEXT_COLOR,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  profileButton: {
    backgroundColor: PRIMARY_ACCENT_COLOR,
  },
  loginButton: {
     backgroundColor: PRIMARY_ACCENT_COLOR,
  },
  contactButton: {
     backgroundColor: PRIMARY_ACCENT_COLOR,
     marginTop: 5,
  },
  menuItems: {
    paddingVertical: 10,
  },
  menuItem: {
    flexDirection: "row", alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1, borderBottomColor: BORDER_COLOR,
  },
  menuIcon: {
    marginRight: 20, width: 24, alignItems: "center",
  },
  menuText: {
    fontSize: 16, color: ICON_COLOR, fontWeight: '500',
  },
  spacer: {
    flex: 1,
  },
  footer: {
    alignItems: "center",
    paddingTop: 15,
    paddingBottom: Platform.OS === 'ios' ? 15 : 10,
    borderTopWidth: 1, borderTopColor: BORDER_COLOR,
  },
  termsText: {
    color: "red", fontSize: 14, marginTop: 15,
    textDecorationLine: 'underline',
  },
  versionText: {
    marginTop: 8, fontSize: 12, color: "#888",
  },
});