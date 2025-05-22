// app/mapScreen.tsx (or maybe (modals)/mapScreen.tsx)
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ActivityIndicator, Alert, Platform } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAddress } from '@/context/AddressContext';
import { ChevronLeft, MapPin } from 'lucide-react-native';

interface SelectedLocation {
    latitude: number;
    longitude: number;
    address: string;
}

const formatAddress = (addressDetails: Location.LocationGeocodedAddress[] | any): string => {
    if (!addressDetails || addressDetails.length === 0) {
        return 'Address not found';
    }
    const addr = addressDetails[0];
    // console.log("Geocoding Result:", addr); // Uncomment for debugging address fields

    const parts: string[] = [];

    // More specific details first
    if (addr.name) {
        parts.push(addr.name);
    }

    const streetAddress = [addr.streetNumber, addr.street].filter(Boolean).join(' ');
    // Add street address if it's different from the name or if name is missing
    if (streetAddress && (!addr.name || addr.name !== streetAddress)) {
        parts.push(streetAddress);
    }

    // Add neighbourhood/district if available and different from city
    if (addr.district && addr.district !== addr.city) {
        parts.push(addr.district);
    } else if (addr.sublocality && addr.sublocality !== addr.city) {
        // Use sublocality as fallback for neighbourhood
         parts.push(addr.sublocality);
    }

    // City, Region, Postal Code, Country
    if (addr.city) parts.push(addr.city);
    if (addr.region) parts.push(addr.region);
    if (addr.postalCode) parts.push(addr.postalCode);
    if (addr.country) parts.push(addr.country);

    // Remove duplicates (e.g., if name included street) and filter empty parts
    const uniqueParts = [...new Set(parts.filter(Boolean))];

    let finalAddress = uniqueParts.join(', ');

    // Fallback if somehow everything was null/empty
    return finalAddress || 'Address details unavailable';
};


export default function MapScreen() {
    const router = useRouter();
    const params = useLocalSearchParams<{ mode: 'select' | 'add' }>();
    const { setSelectedAddress } = useAddress();

    const [mapRegion, setMapRegion] = useState<Region | null>(null);
    const [selectedLocation, setSelectedLocation] = useState<SelectedLocation | null>(null);
    const [isMapReady, setIsMapReady] = useState(false);
    const [isGeocoding, setIsGeocoding] = useState(false);
    const [initialLocationFetched, setInitialLocationFetched] = useState(false);

    const mapRef = useRef<MapView>(null);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission Denied', 'Permission to access location was denied. Please enable it in settings to use this feature.');
                const defaultRegion = {
                    latitude: 31.5497,
                    longitude: 74.3436,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                };
                setMapRegion(defaultRegion);
                fetchAddressForCoords(defaultRegion.latitude, defaultRegion.longitude);
                setInitialLocationFetched(true);
                return;
            }

            try {
                let location = await Location.getLastKnownPositionAsync({});
                 if (!location) {
                     console.log("Fetching current position...");
                     location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced }); // Balanced accuracy might be faster
                 }

                if (location) { // Ensure location is not null
                    const region = {
                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude,
                        latitudeDelta: 0.005, // Start more zoomed in
                        longitudeDelta: 0.005,
                    };
                    setMapRegion(region);
                    fetchAddressForCoords(region.latitude, region.longitude);
                } else {
                     // Handle case where location is still null (should be rare after asking for current)
                     console.error("Could not get any location data.");
                     throw new Error("Location fetch failed"); // Trigger catch block
                }

            } catch (error) {
                console.error("Error getting location:", error);
                Alert.alert("Error", "Could not fetch your current location. Showing default location.");
                 const defaultRegion = {
                    latitude: 31.5497,
                    longitude: 74.3436,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                };
                setMapRegion(defaultRegion);
                fetchAddressForCoords(defaultRegion.latitude, defaultRegion.longitude);
            } finally {
                 setInitialLocationFetched(true);
            }
        })();
    }, []);

    const fetchAddressForCoords = useCallback(async (lat: number, lon: number) => {
        if (isGeocoding) return; // Prevent multiple simultaneous requests

        setIsGeocoding(true);
        setSelectedLocation(prev => prev ? { ...prev, address: '' } : null); // Clear previous address immediately for skeleton

        try {
            let addressDetails = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lon });
            const formattedAddr = formatAddress(addressDetails);
            setSelectedLocation({
                latitude: lat,
                longitude: lon,
                address: formattedAddr,
            });
        } catch (error) {
            console.error("Error reverse geocoding:", error);
            setSelectedLocation({
                latitude: lat,
                longitude: lon,
                address: 'Could not fetch address',
            });
        } finally {
            setIsGeocoding(false);
        }
    }, [isGeocoding]); // Added isGeocoding dependency to prevent race conditions

    const handleRegionChangeComplete = (region: Region) => {
        setMapRegion(region);
        fetchAddressForCoords(region.latitude, region.longitude);
    };

    const handleConfirm = () => {
        if (!selectedLocation || !selectedLocation.address || selectedLocation.address === 'Could not fetch address' || selectedLocation.address === 'Address not found' || selectedLocation.address === 'Address details unavailable') {
            Alert.alert("Select Location", "Please wait for address to load or pan the map to a valid location.");
            return;
        }

        if (params.mode === 'select') {
            const newAddress = {
                 id: `temp-${Date.now()}`,
                 label: null,
                 fullAddress: selectedLocation.address,
                 latitude: selectedLocation.latitude,
                 longitude: selectedLocation.longitude,
             };
            setSelectedAddress(newAddress);
            router.back();
        } else if (params.mode === 'add') {
            router.push({
                pathname: '/newAddressScreen',
                params: {
                    address: selectedLocation.address,
                    latitude: selectedLocation.latitude.toString(), // Pass params as strings
                    longitude: selectedLocation.longitude.toString(),
                }
            });
        }
    };

    if (!initialLocationFetched || !mapRegion) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#F15B25" />
                <Text style={styles.loadingText}>Fetching Your Location...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
             <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <ChevronLeft size={28} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Select Delivery Location</Text>
            </View>

            <View style={styles.mapContainer}>
                <MapView
                    ref={mapRef}
                    style={styles.map}
                    provider={PROVIDER_GOOGLE}
                    initialRegion={mapRegion}
                    showsUserLocation={false} // Keep false if we have the central marker
                    onRegionChangeComplete={handleRegionChangeComplete}
                    onMapReady={() => setIsMapReady(true)}
                    pitchEnabled={false} // Optional: Disable tilt
                    rotateEnabled={false} // Optional: Disable rotation
                    moveOnMarkerPress={false} // Prevent map recentering on internal markers
                />
                <View style={styles.centerMarkerContainer}>
                     <MapPin size={40} color="#F15B25" style={styles.mapPinIcon}/>
                     <View style={styles.markerShadow} />
                </View>
            </View>

            <View style={styles.confirmationContainer}>
                <View style={styles.selectedAddressContainer}>
                    <MapPin size={20} color="#555" style={{ marginRight: 8, marginTop: 2 }} />
                    {isGeocoding || !selectedLocation?.address ? (
                         // Skeleton Loading Placeholder
                         <View style={styles.skeletonContainer}>
                            <View style={[styles.skeletonLine, { width: '90%' }]} />
                            <View style={[styles.skeletonLine, { width: '70%' }]} />
                         </View>
                    ) : (
                        <Text style={styles.selectedAddressText} numberOfLines={2}>
                            {selectedLocation?.address ?? 'Pan map to select location...'}
                        </Text>
                    )}
                </View>
                <TouchableOpacity
                    style={[
                        styles.confirmButton,
                        (!selectedLocation || isGeocoding || !selectedLocation.address || selectedLocation.address.startsWith('Could not') || selectedLocation.address === 'Address not found' || selectedLocation.address === 'Address details unavailable')
                        && styles.confirmButtonDisabled
                    ]}
                    onPress={handleConfirm}
                    disabled={!selectedLocation || isGeocoding || !selectedLocation.address || selectedLocation.address.startsWith('Could not') || selectedLocation.address === 'Address not found' || selectedLocation.address === 'Address details unavailable'}
                >
                    <Text style={styles.confirmButtonText}>
                        {params.mode === 'add' ? 'ENTER COMPLETE ADDRESS' : 'CONFIRM LOCATION'}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
     header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: Platform.OS === 'android' ? 40 : 50,
        paddingBottom: 12,
        paddingHorizontal: 10,
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#eaeaea',
    },
    backButton: {
        padding: 5,
    },
    headerTitle: {
        flex: 1,
        textAlign: 'center',
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        // Adjust marginRight if back button width changes
        marginRight: 38, // Approx width of touchable area for back button
    },
    mapContainer: {
        flex: 1,
        position: 'relative',
    },
    map: {
       ...StyleSheet.absoluteFillObject,
    },
    centerMarkerContainer: {
        position: 'absolute',
        left: '50%',
        top: '50%',
        marginLeft: -20, // Half of MapPin width (40/2)
        marginTop: -45, // Adjust to align the *tip* of the pin with the center
        alignItems: 'center',
        justifyContent: 'center',
    },
    mapPinIcon: {
        // Sometimes needed if icon has internal padding/margins
    },
    markerShadow: {
        width: 10,
        height: 5,
        borderRadius: 5,
        backgroundColor: 'rgba(0,0,0,0.2)',
        marginTop: -4, // Position shadow slightly below the pin tip
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#555',
    },
    confirmationContainer: {
        backgroundColor: 'white',
        paddingHorizontal: 15,
        paddingTop: 15,
        paddingBottom: Platform.OS === 'ios' ? 30 : 20, // Safe area padding
        borderTopWidth: 1,
        borderTopColor: '#eaeaea',
        elevation: 5, // Android shadow
        shadowColor: '#000', // iOS shadow
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
     selectedAddressContainer:{
        flexDirection: 'row',
        alignItems: 'flex-start', // Align icon to top with text
        marginBottom: 15,
        minHeight: 42, // Approx height for 2 lines of text + icon
     },
     selectedAddressText:{
        flex: 1,
        fontSize: 14,
        lineHeight: 20, // Improve readability for two lines
        color: '#333',
        marginLeft: 8, // Ensure consistent spacing with skeleton
     },
     skeletonContainer: {
        flex: 1,
        marginLeft: 8, // Match text margin
        justifyContent: 'center',
     },
     skeletonLine: {
         height: 12, // Approx height of a line of text
         backgroundColor: '#e0e0e0', // Light gray for skeleton
         borderRadius: 4,
         marginBottom: 8, // Space between skeleton lines
     },
    confirmButton: {
        backgroundColor: '#F15B25',
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 48, // Ensure consistent button height
    },
    confirmButtonDisabled: {
        backgroundColor: '#FADBCF',
    },
    confirmButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});