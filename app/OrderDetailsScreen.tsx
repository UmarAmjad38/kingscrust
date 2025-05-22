import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Platform, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { Address } from '../context/AddressContext'; // Adjust path if needed


const ORANGE_COLOR = '#F15B25';
const DARK_TEXT_COLOR = '#212529';
const MEDIUM_GREY_COLOR = '#6C757D';
const LIGHT_GREY_COLOR = '#F8F9FA';
const BACKGROUND_COLOR = '#FFFFFF';
const BORDER_COLOR = '#E9ECEF';
const SKELETON_LIGHT_GREY = '#E0E0E0';
const SUCCESS_GREEN_COLOR = '#4CAF50';


interface OrderItemMock {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: any; // From require
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

const OrderDetailsScreenSkeleton = () => (
    <View style={styles.container}>
        <View style={styles.headerSkeleton}>
            <SkeletonElement width={30} height={30} borderRadius={15} />
            <SkeletonElement width="50%" height={24} />
        </View>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{padding: 16}}>
            {[1,2].map(i => (
                <View key={`skel_card_info_${i}`} style={styles.cardSkeleton}>
                    <SkeletonElement width="40%" height={20} style={{marginBottom: 8}}/>
                    <SkeletonElement width="70%" height={16} />
                    {i === 1 && <SkeletonElement width="90%" height={14} style={{marginTop: 4}}/>}
                </View>
            ))}
            <View style={styles.cardSkeleton}>
                <SkeletonElement width="30%" height={20} style={{marginBottom: 8}}/>
                <SkeletonElement width="60%" height={18} />
            </View>
            <View style={styles.cardSkeleton}>
                <SkeletonElement width="50%" height={20} style={{marginBottom: 8}}/>
                <View style={{flexDirection:'row', justifyContent: 'space-between'}}>
                    <SkeletonElement width="30%" height={18}/>
                    <SkeletonElement width="30%" height={18}/>
                </View>
            </View>
             <View style={styles.cardSkeleton}>
                <SkeletonElement width="25%" height={20} style={{marginBottom: 15}}/>
                <View style={styles.itemSkeleton}>
                    <SkeletonElement width={50} height={50} borderRadius={8}/>
                    <View style={{flex:1, marginLeft: 10}}>
                        <SkeletonElement width="70%" height={18} style={{marginBottom: 6}}/>
                        <SkeletonElement width="40%" height={16}/>
                    </View>
                </View>
            </View>
        </ScrollView>
    </View>
);


export default function OrderDetailsScreen() {
  const params = useLocalSearchParams<{ order?: string }>();
  const [order, setOrder] = useState<MockOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    if (params.order) {
      try {
        const parsedOrder = JSON.parse(params.order) as MockOrder;
        // Simulate item images if not passed (in a real app, items would be part of the order object fully)
        const itemsWithImages = parsedOrder.items?.map(item => ({
            ...item,
            image: item.image || require('../../assets/images/placeholder_dish.png') // Fallback
        })) || [{ // Default placeholder if no items are passed
            id: 'placeholder1',
            name: 'Zalmi Meal Deal',
            price: 2500,
            quantity: 1,
            image: require('../../assets/images/placeholder_dish.png')
        }];

        setOrder({...parsedOrder, items: itemsWithImages});
      } catch (e) {
        console.error("Failed to parse order params for details:", e);
        setOrder(null);
      }
    }
    const timer = setTimeout(() => setIsLoading(false), 700);
    return () => clearTimeout(timer);
  }, [params.order]);

  if (isLoading) {
    return <OrderDetailsScreenSkeleton />;
  }

  if (!order) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="sad-outline" size={70} color={MEDIUM_GREY_COLOR} style={{marginBottom:15}} />
        <Text style={styles.emptyText}>Order Not Found</Text>
        <Text style={styles.emptySubText}>We couldn't find the details for this order.</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backIconContainer}>
          <Ionicons name="arrow-back" size={24} color={DARK_TEXT_COLOR} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{order.shortId} <Text style={styles.headerSubtitle}>Order Details</Text></Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{padding: 16}}>
        <View style={styles.infoSectionCard}>
            <View style={styles.infoSectionHeader}>
                <Text style={styles.infoSectionTitle}>Delivered To</Text>
                <View style={styles.verifiedIcon}>
                    <Ionicons name="checkmark-sharp" size={12} color={BACKGROUND_COLOR} />
                </View>
            </View>
          <Text style={styles.addressLabel}>{order.address?.label}</Text>
          <Text style={styles.addressText}>
            {order.address?.details ? `${order.address.details}, ` : ''}
            {order.address?.fullAddress}
          </Text>
        </View>

        <View style={styles.infoSectionCard}>
            <View style={styles.infoSectionHeader}>
                <Text style={styles.infoSectionTitle}>Payment Method</Text>
                 <View style={styles.verifiedIcon}>
                    <Ionicons name="checkmark-sharp" size={12} color={BACKGROUND_COLOR} />
                </View>
            </View>
          <Text style={styles.infoText}>{order.paymentMethod}</Text>
        </View>

        <View style={styles.infoSectionCard}>
          <Text style={styles.infoSectionTitle}>Order Status: <Text style={styles.statusHighlight}>{order.status}</Text></Text>
        </View>

        <View style={styles.infoSectionCard}>
          <Text style={styles.infoSectionTitle}>Bill Summary</Text>
          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Total</Text>
            <Text style={styles.billValue}>PKR {order.totalAmount.toLocaleString()}</Text>
          </View>
        </View>

        <View style={styles.infoSectionCard}>
          <Text style={styles.infoSectionTitle}>Items ({order.items.length})</Text>
          {order.items.map((item) => (
            <View key={item.id} style={styles.itemRow}>
              <Image source={item.image} style={styles.itemImage} />
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemPrice}>PKR {(item.price * item.quantity).toLocaleString()}</Text>
              </View>
              {/* <Text style={styles.itemQuantity}>x{item.quantity}</Text> */}
            </View>
          ))}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: BORDER_COLOR,
  },
  backIconContainer: {
    padding: 5,
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: DARK_TEXT_COLOR,
  },
  headerSubtitle: {
    fontWeight: 'normal',
    color: MEDIUM_GREY_COLOR,
  },
  infoSectionCard: {
    backgroundColor: LIGHT_GREY_COLOR,
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
  },
  infoSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoSectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: DARK_TEXT_COLOR,
  },
  verifiedIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: SUCCESS_GREEN_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addressLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: DARK_TEXT_COLOR,
    marginBottom: 2,
  },
  addressText: {
    fontSize: 13,
    color: MEDIUM_GREY_COLOR,
    lineHeight: 18,
  },
  infoText: {
    fontSize: 14,
    color: DARK_TEXT_COLOR,
    marginTop: 4,
  },
  statusHighlight: {
    color: ORANGE_COLOR,
    fontWeight: 'bold',
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  billLabel: {
    fontSize: 14,
    color: MEDIUM_GREY_COLOR,
  },
  billValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: ORANGE_COLOR,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: BORDER_COLOR,
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '600',
    color: DARK_TEXT_COLOR,
  },
  itemPrice: {
    fontSize: 13,
    color: ORANGE_COLOR,
    fontWeight: '500',
    marginTop: 2,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: BACKGROUND_COLOR,
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: DARK_TEXT_COLOR,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubText: {
    fontSize: 14,
    color: MEDIUM_GREY_COLOR,
    textAlign: 'center',
    marginBottom: 20,
  },
  backButton: {
      backgroundColor: ORANGE_COLOR,
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 8,
  },
  backButtonText: {
      color: BACKGROUND_COLOR,
      fontWeight: 'bold',
  },
  headerSkeleton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: SKELETON_LIGHT_GREY,
  },
  cardSkeleton: {
    backgroundColor: SKELETON_LIGHT_GREY,
    opacity: 0.5,
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
  },
  itemSkeleton: {
      flexDirection: 'row',
      alignItems: 'center'
  }
});