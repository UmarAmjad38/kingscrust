import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const ORANGE_COLOR = "#F15B25";
const DARK_TEXT_COLOR = "#212529";
const MEDIUM_GREY_COLOR = "#6C757D";
const LIGHT_GREY_COLOR = "#F8F9FA";
const BACKGROUND_COLOR = "#FFFFFF";
const BORDER_COLOR = "#E9ECEF";
const SKELETON_LIGHT_GREY = "#E0E0E0";
const GREEN_COLOR = "#4CAF50";
const SUBTLE_RED_COLOR = "#E57373";

interface MockOrderItem {
  id: string;
  orderId: string;
  date: string;
  totalAmount: number;
  itemCount: number;
  status: "Delivered" | "Cancelled" | "Processing";
  firstItemName: string;
}

const mockOrders: MockOrderItem[] = [
  {
    id: "1",
    orderId: "#ORD789123",
    date: "2024-03-10",
    totalAmount: 1250,
    itemCount: 3,
    status: "Delivered",
    firstItemName: "Zinger Burger Combo",
  },
  {
    id: "2",
    orderId: "#ORD456789",
    date: "2024-03-05",
    totalAmount: 800,
    itemCount: 2,
    status: "Delivered",
    firstItemName: "Chicken Tikka Pizza",
  },
  {
    id: "3",
    orderId: "#ORD123450",
    date: "2024-02-28",
    totalAmount: 550,
    itemCount: 1,
    status: "Cancelled",
    firstItemName: "Pepsi 1.5L",
  },
  {
    id: "4",
    orderId: "#ORD987654",
    date: "2024-03-11",
    totalAmount: 1500,
    itemCount: 4,
    status: "Processing",
    firstItemName: "Family Deal 1",
  },
];

const SkeletonElement = ({
  style,
  width,
  height,
  borderRadius = 4,
}: {
  style?: object;
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
}) => (
  <View
    style={[
      { backgroundColor: SKELETON_LIGHT_GREY, borderRadius },
      style,
      width !== undefined ? { width } : {},
      height !== undefined ? { height } : {},
    ]}
  />
);

const OrderHistoryItemSkeleton = () => (
  <View style={styles.itemContainer}>
    <View style={styles.itemInfo}>
      <SkeletonElement width="50%" height={18} style={{ marginBottom: 6 }} />
      <SkeletonElement width="70%" height={14} style={{ marginBottom: 4 }} />
      <SkeletonElement width="40%" height={14} style={{ marginBottom: 8 }} />
    </View>
    <View style={styles.itemStatusAmount}>
      <SkeletonElement width={70} height={18} style={{ marginBottom: 6 }} />
      <SkeletonElement width={90} height={16} />
    </View>
  </View>
);

const OrderHistoryScreenSkeleton = () => (
  <View style={styles.container}>
    <View style={styles.header}>
      <SkeletonElement width={30} height={30} borderRadius={15} />
      <SkeletonElement width="60%" height={24} style={{ marginLeft: 15 }} />
    </View>
    <FlatList
      data={[1, 2, 3, 4]}
      renderItem={() => <OrderHistoryItemSkeleton />}
      keyExtractor={(item) => `skel_order_hist_${item}`}
      contentContainerStyle={{ padding: 16 }}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
    />
  </View>
);

export default function OrderHistoryScreen() {
  const [orders, setOrders] = useState<MockOrderItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    setOrders(mockOrders);
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const getStatusColor = (status: MockOrderItem["status"]) => {
    if (status === "Delivered") return GREEN_COLOR;
    if (status === "Cancelled") return SUBTLE_RED_COLOR;
    return ORANGE_COLOR;
  };

  const handleViewOrder = (order: MockOrderItem) => {
    const mockFullOrder = {
      id: order.id,
      shortId: order.orderId,
      estimatedArrival: "N/A",
      status: order.status,
      progress:
        order.status === "Delivered"
          ? 1
          : order.status === "Processing"
          ? 0.5
          : 0,
      address: {
        label: "Home",
        fullAddress: "123 Main St, Anytown",
        details: "Apt 4B",
      },
      paymentMethod: "Cash on Delivery",
      totalAmount: order.totalAmount,
      items: [
        {
          id: "item1",
          name: order.firstItemName,
          price: order.totalAmount,
          quantity: 1,
          image: require("../assets/images/Home/11.webp"),
        },
      ],
    };
    router.push({
      pathname: "/OrderDetailsScreen",
      params: { order: JSON.stringify(mockFullOrder) },
    });
  };

  const renderOrderItem = ({ item }: { item: MockOrderItem }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => handleViewOrder(item)}
    >
      <View style={styles.itemInfo}>
        <Text style={styles.orderId}>{item.orderId}</Text>
        <Text style={styles.itemDate}>{item.date}</Text>
        <Text style={styles.itemDetails}>
          {item.firstItemName}
          {item.itemCount > 1 ? ` & ${item.itemCount - 1} more` : ""}
        </Text>
      </View>
      <View style={styles.itemStatusAmount}>
        <Text
          style={[styles.itemStatus, { color: getStatusColor(item.status) }]}
        >
          {item.status}
        </Text>
        <Text style={styles.itemAmount}>
          PKR {item.totalAmount.toLocaleString()}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return <OrderHistoryScreenSkeleton />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={DARK_TEXT_COLOR} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order History</Text>
      </View>
      {orders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons
            name="receipt-outline"
            size={70}
            color={MEDIUM_GREY_COLOR}
          />
          <Text style={styles.emptyText}>No Orders Yet</Text>
          <Text style={styles.emptySubText}>
            Your past orders will appear here once you've made a purchase.
          </Text>
          <TouchableOpacity
            style={styles.exploreButton}
            onPress={() => router.push("/(tabs)/menu")}
          >
            <Text style={styles.exploreButtonText}>START SHOPPING</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={orders}
          renderItem={renderOrderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16 }}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "ios" ? 50 : 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: BORDER_COLOR,
    backgroundColor: BACKGROUND_COLOR,
  },
  backButton: {
    padding: 5,
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: DARK_TEXT_COLOR,
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: LIGHT_GREY_COLOR,
    borderRadius: 10,
    padding: 15,
    marginBottom: 12,
  },
  itemInfo: {
    flex: 1,
    marginRight: 10,
  },
  orderId: {
    fontSize: 15,
    fontWeight: "bold",
    color: DARK_TEXT_COLOR,
    marginBottom: 4,
  },
  itemDate: {
    fontSize: 13,
    color: MEDIUM_GREY_COLOR,
    marginBottom: 2,
  },
  itemDetails: {
    fontSize: 13,
    color: MEDIUM_GREY_COLOR,
  },
  itemStatusAmount: {
    alignItems: "flex-end",
  },
  itemStatus: {
    fontSize: 13,
    fontWeight: "bold",
    marginBottom: 6,
  },
  itemAmount: {
    fontSize: 15,
    fontWeight: "bold",
    color: ORANGE_COLOR,
  },
  separator: {
    height: 1,
    backgroundColor: BORDER_COLOR,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "bold",
    color: DARK_TEXT_COLOR,
    marginTop: 15,
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: MEDIUM_GREY_COLOR,
    textAlign: "center",
    marginBottom: 20,
  },
  exploreButton: {
    backgroundColor: ORANGE_COLOR,
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  exploreButtonText: {
    color: BACKGROUND_COLOR,
    fontSize: 15,
    fontWeight: "bold",
  },
});
