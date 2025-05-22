import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Platform, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { Address } from '../../context/AddressContext'; // Adjust path if needed

const ORANGE_COLOR = '#F15B25';
const DARK_TEXT_COLOR = '#212529';
const MEDIUM_GREY_COLOR = '#6C757D';
const LIGHT_GREY_COLOR = '#F8F9FA'; // Card background
const BACKGROUND_COLOR = '#FFFFFF';
const BORDER_COLOR = '#E9ECEF';
const SKELETON_LIGHT_GREY = '#E0E0E0';
const SUCCESS_GREEN_COLOR = '#4CAF50';

interface OrderItemMock {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: any;
}

interface MockOrder {
  id: string;
  shortId: string;
  estimatedArrival: string;
  status: "Preparing Food" | "On The Way" | "Delivered";
  progress: number;
  address: Address | null;
  paymentMethod: string;
  totalAmount: number;
  items: OrderItemMock[];
  deliveryInstructions?: string;
}

const SkeletonElement = ({ style, width, height, borderRadius = 4 }: { style?: object, width?: number | string, height?: number | string, borderRadius?: number }) => (
  <View style={[{ backgroundColor: SKELETON_LIGHT_GREY, borderRadius }, style, width !== undefined ? { width } : {}, height !== undefined ? { height } : {}]} />
);

const DeliveryScreenSkeleton = () => (
  <View style={styles.container}>
    <View style={styles.headerSkeleton}>
      <SkeletonElement width="40%" height={24} />
      <View style={{ flexDirection: 'row' }}>
        <SkeletonElement width={30} height={30} borderRadius={15} style={{ marginRight: 10 }} />
        <SkeletonElement width={30} height={30} borderRadius={15} />
      </View>
    </View>
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingHorizontal: 16, paddingTop: 10}}>
        <View style={styles.statusCardSkeleton}>
            <SkeletonElement width="50%" height={20} style={{marginBottom: 8}}/>
            <SkeletonElement width="30%" height={10} style={{marginBottom: 15}}/>
            <SkeletonElement width="100%" height={8} borderRadius={4} style={{marginBottom: 8}}/>
            <SkeletonElement width="60%" height={18}/>
        </View>
        <View style={styles.cardSkeleton}>
            <SkeletonElement width="70%" height={20} />
        </View>
        <View style={styles.cardSkeleton}>
            <SkeletonElement width="50%" height={20} style={{marginBottom: 8}}/>
            <SkeletonElement width="80%" height={16} />
        </View>
         <View style={styles.cardSkeleton}>
            <SkeletonElement width="60%" height={20} style={{marginBottom: 8}}/>
            <SkeletonElement width="40%" height={16} />
        </View>
    </ScrollView>
  </View>
);


export default function DeliveryScreen() {
  const params = useLocalSearchParams<{ order?: string }>();
  const [activeOrder, setActiveOrder] = useState<MockOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      setIsLoading(true);
      if (params.order) {
        try {
          const parsedOrder = JSON.parse(params.order) as MockOrder;
          setActiveOrder(parsedOrder);
        } catch (e) {
          console.error("Failed to parse order params for delivery:", e);
          setActiveOrder(null);
        }
      } else {
        setActiveOrder(null);
      }
      const timer = setTimeout(() => setIsLoading(false), 700);
      return () => clearTimeout(timer);
    }, [params.order])
  );

  const handleViewOrderDetails = () => {
    if (activeOrder) {
      router.push({ pathname: '/OrderDetailsScreen', params: { order: JSON.stringify(activeOrder) } });
    }
  };

  if (isLoading) {
    return <DeliveryScreenSkeleton />;
  }

  if (!activeOrder) {
    return (
      <View style={styles.emptyContainer}>
        {/* Replace with your unique and good-looking icon */}
        <Ionicons name="file-tray-outline" size={80} color={MEDIUM_GREY_COLOR} style={{marginBottom: 20}} />
        <Text style={styles.emptyTitle}>No Active Deliveries</Text>
        <Text style={styles.emptySubtitle}>When you place an order, its tracking details will appear here.</Text>
        <TouchableOpacity style={styles.shopNowButton} onPress={() => router.push('/(tabs)/menu')}>
            <Text style={styles.shopNowButtonText}>SHOP NOW</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* <Image source={require('../../assets/images/map_background.png')} style={styles.mapBackground} /> */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Order Tracking</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="headset-outline" size={24} color={DARK_TEXT_COLOR} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton} onPress={() => router.push('/(tabs)/menu')}>
            <Ionicons name="close-outline" size={28} color={DARK_TEXT_COLOR} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingHorizontal: 16, paddingTop: 10}}>
        <View style={styles.statusCard}>
          <Text style={styles.statusETA}>{activeOrder.estimatedArrival}</Text>
          <Text style={styles.statusSubtext}>Estimated Arrival</Text>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBarFill, { width: `${activeOrder.progress * 100}%` }]} />
          </View>
          <Text style={styles.statusText}>{activeOrder.status}</Text>
        </View>

        <TouchableOpacity style={styles.detailsLinkCard} onPress={handleViewOrderDetails}>
            <Text style={styles.detailsLinkText}>Order <Text style={{color: ORANGE_COLOR}}>{activeOrder.shortId}</Text> Details</Text>
            <Ionicons name="chevron-forward-outline" size={20} color={DARK_TEXT_COLOR} />
        </TouchableOpacity>

        <View style={styles.infoCard}>
            <View style={styles.infoCardHeader}>
                <Text style={styles.infoCardTitle}>Deliver To</Text>
                <View style={styles.verifiedIconContainer}>
                    <Ionicons name="checkmark-sharp" size={12} color={BACKGROUND_COLOR} />
                </View>
            </View>
            <Text style={styles.infoCardText}>{activeOrder.address?.label}</Text>
            <Text style={styles.infoCardSubtext}>
                 {activeOrder.address?.details ? `${activeOrder.address.details}, ` : ''}
                 {activeOrder.address?.fullAddress}
            </Text>
        </View>

        <View style={styles.infoCard}>
            <View style={styles.infoCardHeader}>
                <Text style={styles.infoCardTitle}>Payment Method</Text>
                 <View style={styles.verifiedIconContainer}>
                    <Ionicons name="checkmark-sharp" size={12} color={BACKGROUND_COLOR} />
                </View>
            </View>
            <Text style={styles.infoCardText}>{activeOrder.paymentMethod}</Text>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
  },
  mapBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '40%', // Adjust as needed
    opacity: 0.15,
    zIndex: -1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 10,
    backgroundColor: 'transparent', // Or BACKGROUND_COLOR if map is not full screen
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: DARK_TEXT_COLOR,
  },
  headerActions: {
    flexDirection: 'row',
  },
  headerButton: {
    marginLeft: 15,
    padding: 5,
  },
  statusCard: {
    backgroundColor: BACKGROUND_COLOR,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 3,
  },
  statusETA: {
    fontSize: 18,
    fontWeight: 'bold',
    color: DARK_TEXT_COLOR,
  },
  statusSubtext: {
    fontSize: 13,
    color: MEDIUM_GREY_COLOR,
    marginBottom: 16,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: BORDER_COLOR,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: ORANGE_COLOR,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 15,
    fontWeight: '600',
    color: ORANGE_COLOR,
  },
  detailsLinkCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: LIGHT_GREY_COLOR,
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
  },
  detailsLinkText: {
    fontSize: 15,
    fontWeight: '600',
    color: DARK_TEXT_COLOR,
  },
  infoCard: {
    backgroundColor: LIGHT_GREY_COLOR,
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
  },
  infoCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  infoCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: DARK_TEXT_COLOR,
  },
  verifiedIconContainer:{
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: SUCCESS_GREEN_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoCardText: {
    fontSize: 14,
    color: DARK_TEXT_COLOR,
    fontWeight: '500',
    marginBottom: 2,
  },
  infoCardSubtext: {
    fontSize: 13,
    color: MEDIUM_GREY_COLOR,
    lineHeight: 18,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: BACKGROUND_COLOR,
    padding: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: DARK_TEXT_COLOR,
    textAlign: 'center',
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 15,
    color: MEDIUM_GREY_COLOR,
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 22,
  },
  shopNowButton: {
    backgroundColor: ORANGE_COLOR,
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  shopNowButtonText: {
    color: BACKGROUND_COLOR,
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerSkeleton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 10,
  },
  statusCardSkeleton: {
    backgroundColor: SKELETON_LIGHT_GREY,
    opacity: 0.3,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  cardSkeleton: {
     backgroundColor: SKELETON_LIGHT_GREY,
     opacity: 0.3,
     borderRadius: 10,
     padding: 16,
     marginBottom: 16,
  }
});