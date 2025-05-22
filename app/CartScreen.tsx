import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, Platform, FlatList, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useCart, CartItem } from '../context/CartContext';
import { menuDataSource, MenuItem } from '../data/menu';

const ORANGE_COLOR = '#FF6600';
const YELLOW_COLOR = '#FFC107';
const LIGHT_GREY_COLOR_SKELETON = '#E0E0E0'; // Slightly darker for skeleton elements
const LIGHT_GREY_BACKGROUND = '#F8F9FA';
const MEDIUM_GREY_COLOR = '#6C757D';
const DARK_TEXT_COLOR = '#212529';
const WHITE_COLOR = '#FFFFFF';
const BORDER_COLOR = '#E9ECEF';


const SkeletonElement = ({ style, width, height, borderRadius = 4 }: { style?: object, width?: number | string, height?: number | string, borderRadius?: number }) => (
  <View style={[{ backgroundColor: LIGHT_GREY_COLOR_SKELETON, borderRadius }, style, width !== undefined ? { width } : {}, height !== undefined ? { height } : {}]} />
);

const CartItemSkeleton = () => (
  <View style={styles.cartItemContainer}>
    <SkeletonElement width={60} height={60} borderRadius={8} style={{ marginRight: 15 }} />
    <View style={styles.cartItemInfo}>
      <SkeletonElement width="70%" height={18} style={{ marginBottom: 6 }} />
      <SkeletonElement width="40%" height={16} style={{ marginBottom: 4 }}/>
      <SkeletonElement width="50%" height={14} />
    </View>
    <View style={styles.cartItemActions}>
      <SkeletonElement width={50} height={18} borderRadius={4} style={{ marginBottom: 15 }} />
      <View style={styles.quantityControl}>
        <SkeletonElement width={24} height={24} borderRadius={4} />
        <SkeletonElement width={20} height={20} borderRadius={4} style={{ marginHorizontal: 12 }} />
        <SkeletonElement width={24} height={24} borderRadius={4} />
      </View>
    </View>
  </View>
);

const SuggestedItemSkeleton = () => (
  <View style={styles.suggestedItemCard}>
    <SkeletonElement width="100%" height={100} borderRadius={8} style={{ marginBottom: 8 }} />
    <SkeletonElement width="80%" height={16} style={{ marginBottom: 4 }}/>
    <SkeletonElement width="90%" height={12} style={{ marginBottom: 4 }}/>
    <SkeletonElement width="90%" height={12} style={{ marginBottom: 6 }}/>
    <SkeletonElement width="50%" height={14} />
  </View>
);

const CartScreenSkeleton = () => {
  const bottomBarHeight = Platform.OS === 'ios' ? 110 : 90;
  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: bottomBarHeight }}
      >
        <View style={{marginTop: 10}}>
          {[1, 2, 3].map(i => <CartItemSkeleton key={`cart_skel_${i}`} />)}
        </View>

        <SkeletonElement width="60%" height={22} borderRadius={4} style={{ marginHorizontal: 16, marginTop: 24, marginBottom: 12 }}/>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.suggestedListContent}>
          {[1, 2, 3].map(i => <SuggestedItemSkeleton key={`suggest_skel_${i}`} />)}
        </ScrollView>

        <View style={styles.exploreMenuButton}>
          <View style={styles.exploreMenuContent}>
            <SkeletonElement width="40%" height={18} borderRadius={4} style={{marginBottom: 6}}/>
            <SkeletonElement width="70%" height={14} borderRadius={4} />
          </View>
          <SkeletonElement width={24} height={24} borderRadius={4}/>
        </View>
      </ScrollView>
      <View style={[styles.bottomBarFixed, {paddingBottom: Platform.OS === 'ios' ? 25 : 15}]}>
          <View style={styles.bottomBarCartInfo}>
              <SkeletonElement width={24} height={24} borderRadius={12} style={{marginRight: 8}}/>
              <SkeletonElement width={100} height={20} borderRadius={4}/>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <SkeletonElement width={120} height={20} borderRadius={4} style={{marginRight: 5}}/>
            <SkeletonElement width={18} height={18} borderRadius={4}/>
          </View>
      </View>
    </View>
  );
};

const CartScreen = () => {
  const { cartItems, updateCartItemQuantity, removeFromCart, getCartTotal } = useCart();
  const [isLoading, setIsLoading] = useState(true);

  const suggestedProducts = useMemo(() => menuDataSource
    .flatMap(category => category.items)
    .slice(0, 4)
    .filter(Boolean), []);


  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);


  const handleEditItem = (item: CartItem) => {
    router.push({
      pathname: '/DetailScreen',
      params: { item: JSON.stringify({ ...item, price: item.price / item.cartQuantity }) },
    });
  };

  const navigateToProductDetail = (item: MenuItem) => {
    router.push({
      pathname: '/DetailScreen',
      params: { item: JSON.stringify(item) },
    });
  };

  const renderCartItem = ({ item }: { item: CartItem }) => (
    <View style={styles.cartItemContainer}>
      <Image source={item.image} style={styles.cartItemImage} />
      <View style={styles.cartItemInfo}>
        <Text style={styles.cartItemName}>{item.name}</Text>
        <Text style={styles.cartItemPrice}>PKR {item.price.toLocaleString()}</Text>
        {item.selectedDrink && <Text style={styles.cartItemDrink}>Drink: {item.selectedDrink}</Text>}
      </View>
      <View style={styles.cartItemActions}>
        <TouchableOpacity onPress={() => handleEditItem(item)} style={styles.editButton}>
          <Text style={styles.editButtonText}>EDIT</Text>
        </TouchableOpacity>
        <View style={styles.quantityControl}>
          <TouchableOpacity onPress={() => removeFromCart(item.id)} style={styles.deleteIcon}>
             <Ionicons name="trash-outline" size={20} color={MEDIUM_GREY_COLOR} />
          </TouchableOpacity>
          <Text style={styles.quantityText}>{item.cartQuantity}</Text>
          <TouchableOpacity onPress={() => updateCartItemQuantity(item.id, item.cartQuantity + 1)} style={styles.quantityButton}>
            <Ionicons name="add-outline" size={22} color={DARK_TEXT_COLOR} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderSuggestedItem = ({ item }: { item: MenuItem }) => (
    <TouchableOpacity style={styles.suggestedItemCard} onPress={() => navigateToProductDetail(item)}>
      <Image source={item.image} style={styles.suggestedItemImage} />
      <Text style={styles.suggestedItemName} numberOfLines={1}>{item.name}</Text>
      <Text style={styles.suggestedItemDescription} numberOfLines={2}>{item.description}</Text>
      <Text style={styles.suggestedItemPrice}>PKR {item.price.toLocaleString()}</Text>
    </TouchableOpacity>
  );

  const cartTotal = getCartTotal();

  if (isLoading) {
    return <CartScreenSkeleton />;
  }

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: Platform.OS === 'ios' ? 110 : 90 }}
      >
        {cartItems.length === 0 ? (
          <View style={styles.emptyCartContainer}>
            <Ionicons name="cart-outline" size={80} color={MEDIUM_GREY_COLOR} />
            <Text style={styles.emptyCartText}>Your cart is empty</Text>
            <Text style={styles.emptyCartSubText}>Looks like you haven't added anything to your cart yet.</Text>
            <TouchableOpacity style={styles.exploreButtonEmpty} onPress={() => router.push('/(tabs)/menu')}>
              <Text style={styles.exploreButtonTextEmpty}>START SHOPPING</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={cartItems}
            renderItem={renderCartItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            ListHeaderComponent={<View style={{marginTop:10}}/>}
          />
        )}

        <Text style={styles.sectionTitle}>More Products You May Love</Text>
        <FlatList
          data={suggestedProducts}
          renderItem={renderSuggestedItem}
          keyExtractor={(item) => `suggest-${item.id}`}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.suggestedListContent}
        />

        <TouchableOpacity style={styles.exploreMenuButton} onPress={() => router.push('/(tabs)/menu')}>
          <View style={styles.exploreMenuContent}>
            <Text style={styles.exploreMenuTitle}>Explore Menu</Text>
            <Text style={styles.exploreMenuSubtitle}>Add more items in your cart</Text>
          </View>
          <Ionicons name="chevron-forward-outline" size={24} color={DARK_TEXT_COLOR} />
        </TouchableOpacity>
      </ScrollView>

      {cartItems.length > 0 && (
         <TouchableOpacity onPress={() => router.push('/CheckoutScreen')} style={[styles.bottomBarFixed, {paddingBottom: Platform.OS === 'ios' ? 25 : 15}]}>
             <View style={styles.bottomBarCartInfo}>
                 <Ionicons name="cart" size={24} color={DARK_TEXT_COLOR} style={styles.bottomBarCartIcon}/>
                 <Text style={styles.bottomBarPrice}>PKR {cartTotal.toLocaleString()}</Text>
             </View>
             <TouchableOpacity style={styles.reviewPaymentButton}>
                 <Text style={styles.reviewPaymentText}>REVIEW PAYMENT</Text>
                 <Ionicons name="chevron-forward-outline" size={18} color={DARK_TEXT_COLOR} />
                 <Ionicons name="chevron-forward-outline" size={18} color={DARK_TEXT_COLOR} style={{marginLeft: -10}}/>
             </TouchableOpacity>
         </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: LIGHT_GREY_BACKGROUND,
  },
  cartItemContainer: {
    flexDirection: 'row',
    backgroundColor: WHITE_COLOR,
    padding: 15,
    marginHorizontal: 16,
    marginBottom: 1,
    borderRadius: 0,
    borderBottomWidth: 1,
    borderBottomColor: BORDER_COLOR,
    alignItems: 'center',
  },
  cartItemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 15,
  },
  cartItemInfo: {
    flex: 1,
  },
  cartItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: DARK_TEXT_COLOR,
    marginBottom: 4,
  },
  cartItemPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: ORANGE_COLOR,
  },
  cartItemDrink: {
     fontSize: 12,
     color: MEDIUM_GREY_COLOR,
     marginTop: 2,
  },
  cartItemActions: {
    alignItems: 'flex-end',
  },
  editButton: {
    marginBottom: 12,
  },
  editButtonText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: ORANGE_COLOR,
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: WHITE_COLOR,
    borderRadius: 6,
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  deleteIcon: {
     paddingHorizontal: 8,
     paddingVertical: 6,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    color: DARK_TEXT_COLOR,
    marginHorizontal: 12,
    minWidth: 15,
    textAlign: 'center',
  },
  quantityButton: {
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: DARK_TEXT_COLOR,
    paddingHorizontal: 16,
    marginTop: 24,
    marginBottom: 12,
  },
  suggestedListContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  suggestedItemCard: {
    backgroundColor: WHITE_COLOR,
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
    width: 150,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  suggestedItemImage: {
    width: '100%',
    height: 100,
    borderRadius: 8,
    marginBottom: 8,
  },
  suggestedItemName: {
    fontSize: 14,
    fontWeight: '600',
    color: DARK_TEXT_COLOR,
  },
  suggestedItemDescription: {
    fontSize: 11,
    color: MEDIUM_GREY_COLOR,
    marginTop: 2,
    marginBottom: 4,
    minHeight: 28,
  },
  suggestedItemPrice: {
    fontSize: 13,
    fontWeight: 'bold',
    color: ORANGE_COLOR,
  },
  exploreMenuButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: WHITE_COLOR,
    paddingVertical: 18,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    borderRadius: 12,
    marginTop: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  exploreMenuContent: {},
  exploreMenuTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: DARK_TEXT_COLOR,
  },
  exploreMenuSubtitle: {
    fontSize: 13,
    color: MEDIUM_GREY_COLOR,
    marginTop: 2,
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
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
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
  reviewPaymentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  reviewPaymentText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: DARK_TEXT_COLOR,
    marginRight: 0,
  },
  emptyCartContainer: {
     flex: 1,
     justifyContent: 'center',
     alignItems: 'center',
     padding: 30,
     minHeight: Dimensions.get('window').height * 0.5,
  },
  emptyCartText: {
     fontSize: 22,
     fontWeight: 'bold',
     color: DARK_TEXT_COLOR,
     marginTop: 20,
     marginBottom: 8,
  },
  emptyCartSubText: {
     fontSize: 15,
     color: MEDIUM_GREY_COLOR,
     textAlign: 'center',
     marginBottom: 25,
  },
  exploreButtonEmpty: {
     backgroundColor: ORANGE_COLOR,
     paddingVertical: 14,
     paddingHorizontal: 30,
     borderRadius: 8,
  },
  exploreButtonTextEmpty: {
     color: WHITE_COLOR,
     fontSize: 16,
     fontWeight: 'bold',
  }
});

export default CartScreen;