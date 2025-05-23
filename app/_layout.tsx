import "react-native-get-random-values";
import "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState, useRef } from "react";
import "react-native-reanimated";
import { Header } from "@/components/Headers";
import { Sidebar } from "@/components/Sidebar";
import { StyleSheet, View, ActivityIndicator } from "react-native";
import { AddressProvider, useAddress, Address } from "@/context/AddressContext";
import { AddressBottomSheet } from "@/components/AddressBottomSheet";
import { Modalize } from "react-native-modalize";
import { Host } from "react-native-portalize";
import { CartProvider } from "@/context/CartContext";
import AsyncStorage from '@react-native-async-storage/async-storage';

SplashScreen.preventAutoHideAsync();

function MainAppStack() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();
  const segments = useSegments();

  const {
    selectedAddress,
    setSelectedAddress,
    savedAddresses,
    openAddressSheet: openGlobalAddressSheet,
    setAddressModalRef,
  } = useAddress();

  const addressModalizeRef = useRef<Modalize>(null);

  const [authStatusChecked, setAuthStatusChecked] = useState(false);
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);

  useEffect(() => {
    const checkInitialAuthStatus = async () => {
      try {
        const userToken = await AsyncStorage.getItem('userToken');
        const guestModeActive = await AsyncStorage.getItem('guestMode');

        if (userToken) {
          setIsUserAuthenticated(true);
        } else if (guestModeActive === 'true') {
          setIsUserAuthenticated(false);
        } else {
          setIsUserAuthenticated(false);
          router.replace('/(auth)/welcome');
        }
      } catch (e) {
        setIsUserAuthenticated(false);
        router.replace('/(auth)/welcome');
      } finally {
        setAuthStatusChecked(true);
        SplashScreen.hideAsync();
      }
    };
    checkInitialAuthStatus();
  }, [router]);

  useEffect(() => {
    if (addressModalizeRef) {
      setAddressModalRef(addressModalizeRef);
    }
  }, [setAddressModalRef, addressModalizeRef]);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const closeLocalAddressSheet = () => addressModalizeRef.current?.close();

  const handleSelectNewLocation = () => {
    closeLocalAddressSheet();
    router.push({ pathname: "/mapScreen", params: { mode: "select" } });
  };

  const handleAddNewAddress = () => {
    closeLocalAddressSheet();
    router.push({ pathname: "/mapScreen", params: { mode: "add" } });
  };

  const handleSelectExisting = (address: Address) => {
    setSelectedAddress(address);
    closeLocalAddressSheet();
  };

  const handleLoginRequestFromSidebar = async () => {
    if (isSidebarOpen) toggleSidebar();
    await AsyncStorage.removeItem('guestMode');
    setIsUserAuthenticated(false);
    router.replace('/(auth)/login');
  };

  const handleLogout = async () => {
    if (isSidebarOpen) toggleSidebar();
    await AsyncStorage.multiRemove(['userToken', 'guestMode']);
    setIsUserAuthenticated(false);
    router.replace('/(auth)/welcome');
  };

  if (!authStatusChecked) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#fedc00" />
      </View>
    );
  }

  const isInAuthFlow = segments[0] === '(auth)';
  const sidebarShouldBeLoggedIn = isUserAuthenticated;

  return (
    <>
      <StatusBar style={isInAuthFlow ? "light" : "auto"} />
      {!isInAuthFlow && (
        <Sidebar
          isVisible={isSidebarOpen}
          onClose={toggleSidebar}
          isLoggedIn={sidebarShouldBeLoggedIn}
          onOpenAddressSheet={openGlobalAddressSheet}
          onLoginPress={handleLoginRequestFromSidebar}
          onLogoutPress={handleLogout}
        />
      )}
      <Stack
        screenOptions={{
          header: (props) => (
            <Header
              currentAddress={selectedAddress}
              onMenuPress={toggleSidebar}
              onDeliveryPress={openGlobalAddressSheet}
              onCartPress={() => router.push("/CartScreen")}
            />
          ),
        }}
      >
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: true }} />
        <Stack.Screen name="mapScreen" options={{ headerShown: false }} />
        <Stack.Screen name="newAddressScreen" options={{ headerShown: false }} />
        <Stack.Screen name="CartScreen" options={{ title: "My Cart", headerShown: true }} />
        <Stack.Screen name="DetailScreen" options={{ headerShown: true }} />
        <Stack.Screen name="OrderDetailsScreen" options={{ headerShown: true }} />
        <Stack.Screen name="CheckoutScreen" options={{ title: "Review Order", headerShown: true }} />
        <Stack.Screen name="MyFavoritesScreen" options={{ title: "My Favorites", headerShown: true }} />
        <Stack.Screen name="OrderHistoryScreen" options={{ title: "Order History", headerShown: true }} />
        <Stack.Screen name="TermsAndConditionsScreen" options={{ title: "Terms & Conditions", headerShown: true }} />
        <Stack.Screen name="ViewProfileScreen" options={{ title: "My Profile", headerShown: true }} />
      </Stack>

      {!isInAuthFlow && (
        <AddressBottomSheet
          ref={addressModalizeRef}
          savedAddresses={savedAddresses || []}
          selectedAddress={selectedAddress}
          onSelectNewLocation={handleSelectNewLocation}
          onAddNewAddress={handleAddNewAddress}
          loading={false}
          onSelectExisting={handleSelectExisting}
        />
      )}
    </>
  );
}

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf")
  });

  useEffect(() => {
    if (error) {
      console.error("Font loading error:", error);
      SplashScreen.hideAsync();
    }
  }, [error]);


  if (!loaded && !error) {
    return null;
  }


  return (
    <GestureHandlerRootView style={styles.flexOne}>
      <Host>
        <AddressProvider>
          <CartProvider>
            <ThemeProvider value={DefaultTheme}>
              <MainAppStack />
            </ThemeProvider>
          </CartProvider>
        </AddressProvider>
      </Host>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  flexOne: {
    flex: 1,
  },
});