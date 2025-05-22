import React, {
  useState,
  useRef,
  useMemo,
  useCallback,
  useEffect,
} from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Platform,
  ActivityIndicator,
  Linking,
  Alert,
} from "react-native";
import MapView, { Marker, Circle, PROVIDER_GOOGLE } from "react-native-maps";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { MaterialCommunityIcons, FontAwesome } from "@expo/vector-icons";
import * as Location from "expo-location";

const { width, height } = Dimensions.get("window");
const MAP_HEIGHT = height * 0.64;
const DELIVERY_RADIUS_KM = 10; // Changed to 10km
const DELIVERY_RADIUS_METERS = DELIVERY_RADIUS_KM * 1000;

const branches_initial_data = [
  {
    id: "2",
    name: "Daska Branch",
    latitude: 32.3299887,
    longitude: 74.323584,
    services: ["DELIVERY", "DINE IN", "PICK-UP"],
    hours: {
      "Monday - Thursday": "03:00PM - 01:30AM",
      Friday: "03:30PM - 01:30AM",
      "Saturday - Sunday": "03:00PM - 01:30AM",
    },
    address: "Sambrial Road, Main Muzaffar Center, Daska, Pakistan",
  },
];

const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function getCurrentDayString(date) {
  return daysOfWeek[date.getDay()];
}

// Updated parseTime function
function parseTime(timeStr) {
  const match = timeStr.trim().toUpperCase().match(/^(\d{1,2}:\d{2})\s*(AM|PM)$/);
  if (!match) return { hours: -1, minutes: -1 };

  let [hours, minutes] = match[1].split(':').map(Number);
  const modifier = match[2];

  if (isNaN(hours) || isNaN(minutes)) return { hours: -1, minutes: -1 };

  if (modifier === 'PM' && hours !== 12) {
    hours += 12;
  }
  if (modifier === 'AM' && hours === 12) {
    hours = 0;
  }
  return { hours, minutes };
}

function isBranchOpenCurrently(branchHours) {
  const now = new Date();
  const currentDayName = getCurrentDayString(now);
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  let scheduleForToday = null;

  for (const dayRange in branchHours) {
    const dayKeys = dayRange.split(" - ");
    if (dayKeys.length === 2) {
      const [startDay, endDay] = dayKeys.map(d => d.trim());
      const startIndex = daysOfWeek.indexOf(startDay);
      const endIndex = daysOfWeek.indexOf(endDay);
      const currentDayIndex = daysOfWeek.indexOf(currentDayName);

      if (startIndex === -1 || endIndex === -1) continue;

      if (startIndex <= endIndex) {
        if (currentDayIndex >= startIndex && currentDayIndex <= endIndex) {
          scheduleForToday = branchHours[dayRange];
          break;
        }
      } else {
        if (currentDayIndex >= startIndex || currentDayIndex <= endIndex) {
          scheduleForToday = branchHours[dayRange];
          break;
        }
      }
    } else if (dayRange.trim() === currentDayName) {
      scheduleForToday = branchHours[dayRange];
      break;
    }
  }

  if (!scheduleForToday) {
    return { isOpen: false, status: "Closed" };
  }

  const [openTimeStr, closeTimeStr] = scheduleForToday.split(" - ");
  if (!openTimeStr || !closeTimeStr) return { isOpen: false, status: "Closed" };

  const openTime = parseTime(openTimeStr.trim());
  const closeTime = parseTime(closeTimeStr.trim());

  if (openTime.hours === -1 || closeTime.hours === -1) {
    return { isOpen: false, status: "Closed" };
  }

  const currentTimeInMinutes = currentHour * 60 + currentMinute;
  const openTimeInMinutes = openTime.hours * 60 + openTime.minutes;
  let closeTimeInMinutes = closeTime.hours * 60 + closeTime.minutes;

  let isOpen;
  if (closeTimeInMinutes <= openTimeInMinutes) {
     if (openTimeInMinutes === closeTimeInMinutes) {
        isOpen = true;
    } else {
        isOpen = (currentTimeInMinutes >= openTimeInMinutes) || (currentTimeInMinutes < closeTimeInMinutes);
    }
  } else {
    isOpen = currentTimeInMinutes >= openTimeInMinutes && currentTimeInMinutes < closeTimeInMinutes;
  }
  return { isOpen, status: isOpen ? "Open Now" : "Closed" };
}


function calculateDistance(lat1, lon1, lat2, lon2) {
  if (lat1 == null || lon1 == null || lat2 == null || lon2 == null) return "N/A";
  const R = 6371;
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return d.toFixed(1);
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

const BranchMapScreen = () => {
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [initialRegion, setInitialRegion] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(true);
  const [showCardContainer, setShowCardContainer] = useState(true);
  const [displayBranch, setDisplayBranch] = useState(null);

  const bottomSheetRef = useRef(null);
  const mapRef = useRef(null);
  const snapPoints = useMemo(() => ["1%", "50%", "75%"], []);

  const updateBranchData = useCallback((currentLocation) => {
    if (branches_initial_data.length > 0) {
      const branch = branches_initial_data[0];
      const { isOpen, status } = isBranchOpenCurrently(branch.hours);
      const dist = calculateDistance(
        currentLocation?.latitude,
        currentLocation?.longitude,
        branch.latitude,
        branch.longitude
      );
      const distanceText = dist === "N/A" ? "N/A" : `${dist} KM`;
      setDisplayBranch({ ...branch, isOpen, status, distance: distanceText });
    } else {
      setDisplayBranch(null);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      setLoadingLocation(true);
      setShowCardContainer(true);

      let region;
      let locationCoords = null;

      const defaultBranch = branches_initial_data[0];
      const defaultRegion = {
        latitude: defaultBranch.latitude,
        longitude: defaultBranch.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };

      if (isMounted) {
        setInitialRegion(defaultRegion);
        updateBranchData(null);
      }

      let { status: permissionStatus } = await Location.requestForegroundPermissionsAsync();

      if (permissionStatus !== "granted") {
        Alert.alert(
          "Location Permission Denied",
          "Cannot calculate distance without location permission."
        );
      } else {
        try {
          const locationPromise = Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.High,
          });
          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Timeout")), 15000)
          );
          const location = await Promise.race([
            locationPromise,
            timeoutPromise,
          ]);

          locationCoords = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          };

          region = {
            ...locationCoords,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          };
          if (isMounted) {
            setInitialRegion(region);
          }
        } catch (error) {
          Alert.alert(
            "Location Error",
            "Could not get your current location. Distance calculation may be unavailable."
          );
        }
      }

      if (isMounted) {
        setUserLocation(locationCoords);
        updateBranchData(locationCoords);
        setLoadingLocation(false);
        setShowCardContainer(true);
        if (defaultBranch && mapRef.current) {
            mapRef.current.animateToRegion({
                latitude: defaultBranch.latitude,
                longitude: defaultBranch.longitude,
                latitudeDelta: 0.3,
                longitudeDelta: 0.3 * (width / height),
            }, 1000);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [updateBranchData]);

  const handleSheetChanges = useCallback((index) => {
    if (index <= 0) {
      setSelectedBranch(null);
      setShowCardContainer(true);
    } else {
      setShowCardContainer(false);
    }
  }, []);

  const focusMapOnBranch = (branch) => {
    if (mapRef.current && branch?.latitude && branch?.longitude) {
      mapRef.current.animateCamera(
        {
          center: {
            latitude: branch.latitude,
            longitude: branch.longitude,
          },
          zoom: 12.5,
        },
        { duration: 1000 }
      );
    }
  };

  const openBranchDetails = (branch) => {
    focusMapOnBranch(branch);
    setSelectedBranch(branch);
    setShowCardContainer(false);
    bottomSheetRef.current?.snapToIndex(1);
  };

  const handleGetDirections = (branch) => {
    if (!branch?.latitude || !branch?.longitude) {
      Alert.alert("Error", "Branch location is not available.");
      return;
    }
    const lat = branch.latitude;
    const lon = branch.longitude;
    const label = branch.name;
    const url = Platform.select({
      ios: `maps:0,0?q=${label}@${lat},${lon}`,
      android: `geo:0,0?q=${lat},${lon}(${label})`,
    });
    const webUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`;
    Linking.openURL(url).catch(() => {
      Linking.openURL(webUrl).catch(() => {
        Alert.alert("Error", "Could not open any map application.");
      });
    });
  };

  const renderSkeletonCard = () => (
    <View style={styles.branchCard}>
      <View
        style={[
          styles.cardIconContainer,
          styles.skeletonItem,
          { borderRadius: 22.5 },
        ]}
      />
      <View style={styles.cardTextContainer}>
        <View
          style={[
            styles.skeletonItem,
            { width: "70%", height: 16, marginBottom: 6 },
          ]}
        />
        <View
          style={[
            styles.skeletonItem,
            { width: "40%", height: 13, marginBottom: 4 },
          ]}
        />
        <View style={[styles.skeletonItem, { width: "55%", height: 13 }]} />
      </View>
    </View>
  );

  const renderNearestBranchCard = (branch) => {
    if (!branch) return null;
    return (
      <TouchableOpacity
        style={styles.branchCard}
        key={branch.id}
        onPress={() => openBranchDetails(branch)}
        activeOpacity={0.7}
      >
        <View style={styles.cardIconContainer}>
          <MaterialCommunityIcons
            name="storefront-outline"
            size={28}
            color="#F15B25"
          />
        </View>
        <View style={styles.cardTextContainer}>
          <Text style={styles.cardBranchName}>{branch.name}</Text>
          <Text
            style={[
              styles.cardStatus,
              { color: branch.isOpen ? "#4CAF50" : "#F44336" },
            ]}
          >
            {branch.status}
          </Text>
          <Text style={styles.cardDistance}>
            {loadingLocation
              ? "Calculating distance..."
              : branch.distance !== "..." && branch.distance !== "N/A"
              ? `${branch.distance} away from you`
              : branch.distance === "N/A"
              ? "Location unavailable"
              : "Calculating distance..."}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderBranchDetails = () => (
    <BottomSheetScrollView contentContainerStyle={styles.bottomSheetContent}>
      {!selectedBranch ? (
        <View style={{ alignItems: "center", paddingVertical: 30 }}>
          <ActivityIndicator size="small" color="#FF6347" />
        </View>
      ) : (
        <>
          <View style={styles.detailHeader}>
            <Text style={styles.detailBranchName}>{selectedBranch.name}</Text>
            <TouchableOpacity
              style={styles.directionsButton}
              onPress={() => handleGetDirections(selectedBranch)}
            >
              <Text style={styles.directionsButtonText}>GET DIRECTIONS</Text>
              <FontAwesome
                name="location-arrow"
                size={14}
                color="#FF6347"
                style={{ marginLeft: 5 }}
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.detailDistance}>
            {loadingLocation
              ? "Calculating distance..."
              : selectedBranch.distance !== "..." &&
                selectedBranch.distance !== "N/A"
              ? `${selectedBranch.distance} away from you`
              : "Distance not available"}
          </Text>
          <Text style={styles.serviceTitle}>Service Available</Text>
          <View style={styles.serviceTagsContainer}>
            {selectedBranch.services.map((service, index) => (
              <View key={index} style={styles.serviceTag}>
                <Text style={styles.serviceTagText}>{service}</Text>
              </View>
            ))}
          </View>
          <View style={styles.hoursContainer}>
            {Object.entries(selectedBranch.hours).map(
              ([dayRange, time], index) => (
                <View key={index} style={styles.hoursRow}>
                  <Text style={styles.hoursDay}>{dayRange}</Text>
                  <Text style={styles.hoursTime}>{time}</Text>
                </View>
              )
            )}
          </View>
        </>
      )}
    </BottomSheetScrollView>
  );

  const renderMapSkeleton = () => (
    <View style={styles.mapSkeletonContainer}>
      <ActivityIndicator size="large" color="#FF6347" />
      <Text style={styles.mapSkeletonText}>Loading Map...</Text>
    </View>
  );

  if (!initialRegion && loadingLocation) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6347" />
        <Text>Initializing...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {loadingLocation || !initialRegion ? (
        renderMapSkeleton()
      ) : (
        <View style={styles.mapContainer}>
          <MapView
            ref={mapRef}
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            initialRegion={initialRegion}
            showsUserLocation={false}
            showsMyLocationButton={true}
            onMapReady={() => {
                if (mapRef.current && displayBranch) {
                     mapRef.current.animateToRegion({
                        latitude: displayBranch.latitude,
                        longitude: displayBranch.longitude,
                        latitudeDelta: 0.3,
                        longitudeDelta: 0.3 * (width / height),
                    }, 100);
                }
            }}
          >
            {displayBranch && (
              <>
                <Marker
                  key={displayBranch.id}
                  coordinate={{
                    latitude: displayBranch.latitude,
                    longitude: displayBranch.longitude,
                  }}
                  title={displayBranch.name}
                  description={displayBranch.status}
                  onPress={() => openBranchDetails(displayBranch)}
                >
                  <View style={styles.customMarker}>
                    <View
                      style={[
                        styles.markerPin,
                        {
                          backgroundColor: displayBranch.isOpen
                            ? "#4CAF50"
                            : "#F44336",
                        },
                      ]}
                    >
                      <MaterialCommunityIcons
                        name="storefront-outline"
                        size={16}
                        color="white"
                      />
                    </View>
                    <View
                      style={[
                        styles.markerPoint,
                        {
                          borderTopColor: displayBranch.isOpen
                            ? "#4CAF50"
                            : "#F44336",
                        },
                      ]}
                    />
                  </View>
                </Marker>
                <Circle
                  center={{
                    latitude: displayBranch.latitude,
                    longitude: displayBranch.longitude,
                  }}
                  radius={DELIVERY_RADIUS_METERS}
                  fillColor="rgba(255, 166, 0, 0.1)"
                  strokeColor="rgba(255, 140, 0, 0.4)"
                  strokeWidth={1}
                />
              </>
            )}
            {userLocation && (
              <Marker
                coordinate={userLocation}
                title="Your Location"
                anchor={{ x: 0.5, y: 1 }}
              >
                <View style={styles.customMarker}>
                  <View style={styles.userMarkerPin}>
                    <FontAwesome name="user" size={12} color="white" />
                  </View>
                  <View style={styles.userMarkerPoint} />
                </View>
              </Marker>
            )}
          </MapView>
        </View>
      )}

      {showCardContainer && (
        <View style={styles.branchListOuterContainer}>
          <View style={styles.branchListInnerContainer}>
            <View style={styles.branchHeader}>
              <Text style={styles.branchHeaderText}>Nearest Branch</Text>
            </View>
            {loadingLocation ? (
              renderSkeletonCard()
            ) : displayBranch ? (
              renderNearestBranchCard(displayBranch)
            ) : (
              <Text style={styles.noBranchText}>
                Branch information unavailable.
              </Text>
            )}
          </View>
        </View>
      )}

      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        enablePanDownToClose={true}
        backgroundStyle={styles.bottomSheetBackground}
        style={styles.bottomSheet}
      >
        {renderBranchDetails()}
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  mapContainer: {
    width: width,
    height: MAP_HEIGHT,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  mapSkeletonContainer: {
    width: width,
    height: MAP_HEIGHT,
    backgroundColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
  },
  mapSkeletonText: {
    marginTop: 10,
    color: "#888",
    fontSize: 14,
  },
  deliveryRadiusTooltip: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    zIndex: 1,
  },
  deliveryRadiusTooltipText: {
    color: 'white',
    fontSize: 11,
    fontWeight: '600',
  },
  branchListOuterContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  branchListInnerContainer: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 15,
    paddingTop: 15,
    paddingBottom: Platform.OS === "ios" ? 30 : 20,
  },
  branchHeader: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginBottom: 15,
  },
  branchHeaderText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  branchCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 3,
  },
  cardIconContainer: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  cardTextContainer: {
    flex: 1,
    justifyContent: "center",
  },
  cardBranchName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 3,
  },
  cardStatus: {
    fontSize: 13,
    marginVertical: 2,
    fontWeight: "500",
  },
  cardDistance: {
    fontSize: 13,
    color: "#666",
    marginTop: 3,
  },
  noBranchText: {
    padding: 15,
    textAlign: "center",
    color: "#666",
    fontSize: 14,
  },
  skeletonItem: {
    backgroundColor: "#E0E0E0",
    borderRadius: 4,
  },
  customMarker: { alignItems: "center" },
  markerPin: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.8)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 3,
  },
  markerPoint: {
    width: 0,
    height: 0,
    borderStyle: "solid",
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 9,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "transparent",
    marginTop: -4,
    elevation: 2,
  },
  userMarkerPin: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#4285F4",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.8)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 3,
  },
  userMarkerPoint: {
    width: 0,
    height: 0,
    borderStyle: "solid",
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 9,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "transparent",
    borderTopColor: "#4285F4",
    marginTop: -4,
    elevation: 2,
  },
  bottomSheet: { zIndex: 20 },
  bottomSheetBackground: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
  bottomSheetContent: {
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 40,
  },
  detailHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 15,
  },
  detailBranchName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
    marginRight: 10,
  },
  directionsButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#FFF0EB",
    borderRadius: 18,
  },
  directionsButtonText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#FF6347",
    textTransform: "uppercase",
  },
  detailDistance: {
    fontSize: 14,
    color: "#666",
    marginTop: 15,
    marginBottom: 20,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  serviceTagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 20,
  },
  serviceTag: {
    backgroundColor: "#E8F5E9",
    borderRadius: 15,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 4,
  },
  serviceTagText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#388E3C",
    textTransform: "uppercase",
  },
  hoursContainer: {
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 20,
  },
  hoursRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  hoursDay: { fontSize: 14, color: "#555", flex: 1, marginRight: 10 },
  hoursTime: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
    textAlign: "right",
  },
});

export default BranchMapScreen;