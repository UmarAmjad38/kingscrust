import "react-native-get-random-values";
import "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState, useRef } from "react";
import "react-native-reanimated";
import { Header } from "@/components/Headers";
import { Sidebar } from "@/components/Sidebar";
import { StyleSheet, View } from "react-native"; // Added View
import { AddressProvider, useAddress, Address } from "@/context/AddressContext";
import { AddressBottomSheet } from "@/components/AddressBottomSheet";
import { Modalize } from "react-native-modalize";
import { Host } from "react-native-portalize";
import { CartProvider } from "@/context/CartContext";

SplashScreen.preventAutoHideAsync();

function AppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();

  const {
    selectedAddress,
    setSelectedAddress,
    savedAddresses,
    openAddressSheet: openGlobalAddressSheet, // This is the function to open the sheet
    setAddressModalRef,
  } = useAddress();

  const addressModalizeRef = useRef<Modalize>(null);

  useEffect(() => {
    if (addressModalizeRef) {
      setAddressModalRef(addressModalizeRef);
    }
  }, [setAddressModalRef, addressModalizeRef]); // Added addressModalizeRef dependency

  const isLoggedIn = false; // Replace with your actual login state

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

  return (
    <>
      <StatusBar style="auto" />
      <Sidebar
        isVisible={isSidebarOpen}
        onClose={toggleSidebar}
        isLoggedIn={isLoggedIn}
        onOpenAddressSheet={openGlobalAddressSheet} // Pass the function here
        // Add other necessary props like onLoginPress, onLogoutPress, onContactPress
        onLoginPress={() => console.log("Login pressed")}
        onLogoutPress={() => console.log("Logout pressed")}
        onContactPress={() => console.log("Contact pressed")}
      />
      <Stack
        screenOptions={({ navigation, route }) => ({
          header: () => (
            <Header
              currentAddress={selectedAddress}
              onMenuPress={toggleSidebar}
              onDeliveryPress={openGlobalAddressSheet}
              onCartPress={() => router.push("/CartScreen")}
            />
          ),
          headerShown: true,
        })}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: true }} />
        <Stack.Screen name="mapScreen" options={{ headerShown: false }} />
        <Stack.Screen
          name="newAddressScreen"
          options={{ headerShown: false }}
        />
        <Stack.Screen name="CartScreen" options={{ title: "My Cart" }} />
        <Stack.Screen name="DetailScreen" options={{ headerShown: true }}/>
        <Stack.Screen name="OrderDetailsScreen" options={{ headerShown: true }}/>
        <Stack.Screen name="CheckoutScreen" options={{ title: "Review Order" }}/>
        {/* Add new screens for Sidebar navigation if they are not tabs */}
        <Stack.Screen name="MyFavoritesScreen" options={{ title: "My Favorites" }} />
        <Stack.Screen name="OrderHistoryScreen" options={{ title: "Order History" }} />
        <Stack.Screen name="TermsAndConditionsScreen" options={{ title: "Terms & Conditions" }} />
        <Stack.Screen name="ViewProfileScreen" options={{ title: "My Profile" }} />
      </Stack>

      <AddressBottomSheet
        ref={addressModalizeRef}
        savedAddresses={savedAddresses || []} // Ensure savedAddresses is an array
        selectedAddress={selectedAddress}
        onSelectNewLocation={handleSelectNewLocation}
        onAddNewAddress={handleAddNewAddress}
        loading={false} // Or your actual loading state
        onSelectExisting={handleSelectExisting}
      />
    </>
  );
}

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    // Add other fonts if you defined them in previous screens (e.g., pizza theme)
    // 'MarkerFelt-Wide': require('../assets/fonts/MarkerFeltWide.ttf'),
    // 'AvenirNext-Bold': require('../assets/fonts/AvenirNext-Bold.ttf'),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }
  if (error && !loaded) {
    console.error("Font loading error:", error);
    return null;
  }

  return (
    <GestureHandlerRootView style={styles.flexOne}>
      <Host>
        <AddressProvider>
          <CartProvider>
            <ThemeProvider value={DefaultTheme}>
              <AppLayout />
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