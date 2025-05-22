import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, Platform, Modal, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { useCart } from '../context/CartContext';
import { useAddress, Address } from '../context/AddressContext';

const ORANGE_COLOR = '#F15B25';
const YELLOW_COLOR = '#FFC107';
const DARK_TEXT_COLOR = '#212529';
const MEDIUM_GREY_COLOR = '#6C757D';
const LIGHT_GREY_TEXT_COLOR = '#ADB5BD';
const BACKGROUND_COLOR = '#FFFFFF';
const CARD_BACKGROUND_COLOR = '#F8F9FA';
const BORDER_COLOR = '#E9ECEF';
const SKELETON_LIGHT_GREY = '#E0E0E0';
const SUCCESS_GREEN_COLOR = '#4CAF50';
const MODAL_BACKDROP_COLOR = 'rgba(0, 0, 0, 0.7)';


const SkeletonElement = ({ style, width, height, borderRadius = 4 }: { style?: object, width?: number | string, height?: number | string, borderRadius?: number }) => (
  <View style={[{ backgroundColor: SKELETON_LIGHT_GREY, borderRadius }, style, width !== undefined ? { width } : {}, height !== undefined ? { height } : {}]} />
);

const CheckoutScreenSkeleton = () => (
  <View style={styles.container}>
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContentContainer}
    >
      {[1, 2, 3, 4].map((i) => (
        <View key={`skel_card_${i}`} style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <SkeletonElement width="40%" height={20} />
            {i === 1 && <SkeletonElement width={50} height={18} />}
          </View>
          <SkeletonElement width="70%" height={16} style={{ marginTop: 8 }}/>
          <SkeletonElement width="90%" height={16} style={{ marginTop: 6 }}/>
          {i === 4 && <SkeletonElement width="100%" height={60} style={{ marginTop: 10 }} />}
        </View>
      ))}
    </ScrollView>
    <View style={[styles.bottomBarFixed, {paddingBottom: Platform.OS === 'ios' ? 25 : 15}]}>
        <View style={styles.bottomBarCartInfo}>
            <SkeletonElement width={24} height={24} borderRadius={12} style={{marginRight: 8}}/>
            <SkeletonElement width={100} height={20}/>
        </View>
        <SkeletonElement width={140} height={36} borderRadius={6}/>
    </View>
  </View>
);

interface OrderSuccessModalProps {
  visible: boolean;
  onClose: () => void;
  onTrackOrder: () => void;
}

const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({ visible, onClose, onTrackOrder }) => {
  if (!visible) return null;

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <View style={styles.successModalOverlay}>
        {/* Placeholder for confetti image - replace with your actual image */}
        {/* <Image source={require('../assets/confetti_background.png')} style={styles.confettiImage} resizeMode="cover" /> */}
        <View style={styles.successModalContainer}>
            <View style={styles.successIconContainer}>
                <Ionicons name="checkmark-sharp" size={40} color={BACKGROUND_COLOR} />
            </View>
            <Text style={styles.successModalTitle}>Thank You!</Text>
            <Text style={styles.successModalMessage}>Your order has been successfully placed.</Text>
            <TouchableOpacity style={styles.trackOrderButton} onPress={onTrackOrder}>
                <Text style={styles.trackOrderButtonText}>TRACK MY ORDER</Text>
            </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};


export default function CheckoutScreen() {
  const { getCartTotal, clearCart } = useCart();
  const { selectedAddress, defaultAddress, openAddressSheet } = useAddress();
  const [deliveryInstructions, setDeliveryInstructions] = useState('');
  const [currentAddress, setCurrentAddress] = useState<Address | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOrderSuccessModalVisible, setIsOrderSuccessModalVisible] = useState(false);

  const cartTotal = getCartTotal();

  useFocusEffect(
    React.useCallback(() => {
      setIsLoading(true);
      setCurrentAddress(selectedAddress || defaultAddress || null);
      const timer = setTimeout(() => setIsLoading(false), 700);
      return () => clearTimeout(timer);
    }, [selectedAddress, defaultAddress])
  );

  const handleEditAddress = () => {
    openAddressSheet();
  };

  const handlePlaceOrder = () => {
    if (!currentAddress || cartTotal === 0) {
        // Optionally show an alert if conditions aren't met
        return;
    }
    setIsOrderSuccessModalVisible(true);
  };

  const handleTrackOrder = () => {
    setIsOrderSuccessModalVisible(false);
    const orderId = `ORD-${Date.now().toString().slice(-6)}`;
    const mockOrderForTracking = {
        id: orderId,
        shortId: `#${orderId.slice(-6)}`,
        estimatedArrival: "30-45 Minutes",
        status: "Preparing Food",
        progress: 0.25,
        address: currentAddress,
        paymentMethod: "Cash on Delivery",
        totalAmount: cartTotal,
        items: [], // In a real app, you'd get cartItems here
        deliveryInstructions: deliveryInstructions,
    };
    clearCart(); // Clear cart after successful order
    router.replace({ pathname: '/(tabs)/delivery', params: { order: JSON.stringify(mockOrderForTracking) } });
  };


  if (isLoading) {
    return <CheckoutScreenSkeleton />;
  }

  if (!currentAddress && cartTotal === 0) {
    return (
        <View style={styles.centeredMessageContainer}>
            <Ionicons name="document-text-outline" size={60} color={MEDIUM_GREY_COLOR} style={{marginBottom: 15}} />
            <Text style={styles.centeredMessageText}>Address & Cart Empty</Text>
            <Text style={styles.centeredMessageSubText}>Please select an address and add items to your cart to proceed.</Text>
            <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/(tabs)/menu')}>
                <Text style={styles.actionButtonText}>Go to Menu</Text>
            </TouchableOpacity>
        </View>
    )
  }
  if (!currentAddress) {
    return (
        <View style={styles.centeredMessageContainer}>
            <Ionicons name="location-outline" size={60} color={MEDIUM_GREY_COLOR} style={{marginBottom: 15}} />
            <Text style={styles.centeredMessageText}>No Delivery Address</Text>
            <Text style={styles.centeredMessageSubText}>Please select or add a delivery address to continue.</Text>
            <TouchableOpacity style={styles.actionButton} onPress={handleEditAddress}>
                <Text style={styles.actionButtonText}>Select Address</Text>
            </TouchableOpacity>
        </View>
    )
  }
   if (cartTotal === 0) {
    return (
      <View style={styles.centeredMessageContainer}>
        <Ionicons name="cart-outline" size={60} color={MEDIUM_GREY_COLOR} style={{marginBottom: 15}} />
        <Text style={styles.centeredMessageText}>Your Cart is Empty</Text>
        <Text style={styles.centeredMessageSubText}>Add some delicious items to your cart before checking out.</Text>
        <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/(tabs)/menu')}>
          <Text style={styles.actionButtonText}>Browse Menu</Text>
        </TouchableOpacity>
      </View>
    );
  }


  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContentContainer}
      >
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Deliver To</Text>
            <TouchableOpacity onPress={handleEditAddress}>
              <Text style={styles.editText}>EDIT</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.addressLabel}>{currentAddress?.label || 'Address'}</Text>
          <Text style={styles.addressText}>
            {currentAddress?.details ? `${currentAddress.details}, ` : ''}
            {currentAddress?.fullAddress || 'No address selected'}
          </Text>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          <Text style={styles.paymentMethodText}>Cash on Delivery</Text>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Bill Summary</Text>
          <View style={styles.billRow}>
            <Text style={styles.billText}>Total</Text>
            <Text style={styles.billAmount}>PKR {cartTotal.toLocaleString()}</Text>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Delivery Instructions</Text>
          <Text style={styles.instructionsSubtext}>Are there any specific delivery instructions?</Text>
          <TextInput
            style={styles.instructionsInput}
            placeholder="e.g. No doorbell ring"
            placeholderTextColor={LIGHT_GREY_TEXT_COLOR}
            value={deliveryInstructions}
            onChangeText={setDeliveryInstructions}
            multiline
          />
        </View>
      </ScrollView>

      <TouchableOpacity onPress={handlePlaceOrder} style={[styles.bottomBarFixed, {paddingBottom: Platform.OS === 'ios' ? 25 : 15}]}>
        <View style={styles.bottomBarCartInfo}>
            <Ionicons name="cart" size={24} color={DARK_TEXT_COLOR} style={styles.bottomBarCartIcon}/>
            <Text style={styles.bottomBarPrice}>PKR {cartTotal.toLocaleString()}</Text>
        </View>
        <TouchableOpacity style={styles.placeOrderButton} disabled={!currentAddress || cartTotal === 0}>
            <Text style={styles.placeOrderText}>PLACE ORDER</Text>
            <Ionicons name="chevron-forward-outline" size={18} color={DARK_TEXT_COLOR} />
            <Ionicons name="chevron-forward-outline" size={18} color={DARK_TEXT_COLOR} style={{marginLeft: -10}}/>
        </TouchableOpacity>
      </TouchableOpacity>
      <OrderSuccessModal
        visible={isOrderSuccessModalVisible}
        onClose={() => setIsOrderSuccessModalVisible(false) }
        onTrackOrder={handleTrackOrder}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
  },
  scrollContentContainer: {
    paddingBottom: 100,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  sectionCard: {
    backgroundColor: CARD_BACKGROUND_COLOR,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: DARK_TEXT_COLOR,
  },
  editText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: ORANGE_COLOR,
  },
  addressLabel: {
    fontSize: 15,
    fontWeight: 'bold',
    color: DARK_TEXT_COLOR,
    marginBottom: 4,
  },
  addressText: {
    fontSize: 14,
    color: MEDIUM_GREY_COLOR,
    lineHeight: 20,
  },
  paymentMethodText: {
    fontSize: 14,
    color: MEDIUM_GREY_COLOR,
    marginTop: 4,
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  billText: {
    fontSize: 14,
    color: MEDIUM_GREY_COLOR,
  },
  billAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: ORANGE_COLOR,
  },
  instructionsSubtext: {
    fontSize: 13,
    color: MEDIUM_GREY_COLOR,
    marginTop: 4,
    marginBottom: 10,
  },
  instructionsInput: {
    backgroundColor: BACKGROUND_COLOR,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 10 : 8,
    fontSize: 14,
    color: DARK_TEXT_COLOR,
    minHeight: 60,
    textAlignVertical: 'top',
  },
  bottomBarFixed: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: YELLOW_COLOR,
    paddingHorizontal: 20,
    paddingTop: 15,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: BORDER_COLOR,
  },
  bottomBarCartInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bottomBarCartIcon: {
    marginRight: 8,
  },
  bottomBarPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: DARK_TEXT_COLOR,
  },
  placeOrderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  placeOrderText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: DARK_TEXT_COLOR,
    marginRight: 0,
  },
  centeredMessageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: BACKGROUND_COLOR,
  },
  centeredMessageText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: DARK_TEXT_COLOR,
    textAlign: 'center',
    marginBottom: 8,
  },
  centeredMessageSubText: {
    fontSize: 14,
    color: MEDIUM_GREY_COLOR,
    textAlign: 'center',
    marginBottom: 25,
    paddingHorizontal: 20,
  },
  actionButton: {
    backgroundColor: ORANGE_COLOR,
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  actionButtonText: {
    color: BACKGROUND_COLOR,
    fontSize: 15,
    fontWeight: 'bold',
  },
  successModalOverlay: {
    flex: 1,
    backgroundColor: MODAL_BACKDROP_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  successModalContainer: {
    backgroundColor: BACKGROUND_COLOR,
    borderRadius: 16,
    paddingVertical: 30,
    paddingHorizontal: 25,
    alignItems: 'center',
    width: '100%',
    maxWidth: 340,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
    overflow: 'hidden', // For confetti background if it extends
  },
  confettiImage: { // Add this if you have a confetti image
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 120, // Adjust as needed
    opacity: 0.7,
  },
  successIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: SUCCESS_GREEN_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
  },
  successModalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: DARK_TEXT_COLOR,
    textAlign: 'center',
    marginBottom: 10,
  },
  successModalMessage: {
    fontSize: 15,
    color: MEDIUM_GREY_COLOR,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 30,
  },
  trackOrderButton: {
    backgroundColor: YELLOW_COLOR,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    width: '100%',
    alignItems: 'center',
  },
  trackOrderButtonText: {
    color: DARK_TEXT_COLOR,
    fontSize: 16,
    fontWeight: 'bold',
  },
});