import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, Dimensions, Platform, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';
import { MenuItem } from '../data/menu';
import { useCart } from '../context/CartContext';

const ORANGE_COLOR = '#FF6600';
const LIGHT_GREY_COLOR = '#F0F0F0';
const MEDIUM_GREY_COLOR = '#A0A0A0';
const DARK_TEXT_COLOR = '#333333';
const SUBTLE_RED_COLOR = '#E91E63';
const WHITE_COLOR = '#FFFFFF';
const SUCCESS_GREEN_COLOR = '#4CAF50';
const MODAL_BACKDROP_COLOR = 'rgba(0, 0, 0, 0.6)';

const { width } = Dimensions.get('window');

const SkeletonElement = ({ style, width, height, borderRadius = 4 }: { style?: object, width?: number | string, height?: number | string, borderRadius?: number }) => (
  <View style={[{ backgroundColor: LIGHT_GREY_COLOR, borderRadius }, style, width !== undefined ? { width } : {}, height !== undefined ? { height } : {}]} />
);

const DetailScreenSkeleton = () => {
  const bottomBarHeight = Platform.OS === 'ios' ? 95 : 80;
  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: bottomBarHeight }}
      >
        <SkeletonElement width={width} height={width * 0.7} borderRadius={0} />
        <View style={styles.detailsContainer}>
          <SkeletonElement width="70%" height={28} style={{ marginBottom: 15 }} />
          <SkeletonElement width="100%" height={18} style={{ marginBottom: 8 }} />
          <SkeletonElement width="90%" height={18} style={{ marginBottom: 8 }} />
          <SkeletonElement width="95%" height={18} style={{ marginBottom: 25 }} />
          <SkeletonElement width="40%" height={24} style={{ marginBottom: 30 }} />

          <View style={styles.drinkSection}>
            <View style={styles.drinkHeader}>
              <SkeletonElement width="50%" height={20} />
              <SkeletonElement width={80} height={20} />
            </View>
            {[1, 2].map(i => (
              <View key={`skel_drink_${i}`} style={styles.radioButtonContainer}>
                <SkeletonElement width={22} height={22} borderRadius={11} />
                <SkeletonElement width="70%" height={18} style={{ marginLeft: 15 }} />
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
      <View style={[styles.bottomBar, { paddingBottom: Platform.OS === 'ios' ? 25 : 16 }]}>
        <View style={styles.quantitySelector}>
          <SkeletonElement width={30} height={30} borderRadius={15} />
          <SkeletonElement width={35} height={20} style={{ marginHorizontal: 15 }} />
          <SkeletonElement width={30} height={30} borderRadius={15} />
        </View>
        <SkeletonElement width={150} height={50} borderRadius={25} style={{ flex: 1 }} />
      </View>
    </View>
  );
};

interface CustomAlertProps {
  visible: boolean;
  title: string;
  message: string;
  onClose: () => void;
  iconName?: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
}

const CustomAlert: React.FC<CustomAlertProps> = ({ visible, title, message, onClose, iconName, iconColor }) => {
  if (!visible) return null;

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <View style={styles.alertOverlay}>
        <View style={styles.alertContainer}>
          {iconName && (
            <Ionicons
              name={iconName}
              size={60}
              color={iconColor || ORANGE_COLOR}
              style={styles.alertIcon}
            />
          )}
          <Text style={styles.alertTitle}>{title}</Text>
          <Text style={styles.alertMessage}>{message}</Text>
          <TouchableOpacity style={styles.alertButton} onPress={onClose}>
            <Text style={styles.alertButtonText}>YAY, LET'S GO!</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const DetailScreen = () => {
  const params = useLocalSearchParams<{ item?: string }>();
  const { addToCart } = useCart();

  const [item, setItem] = useState<MenuItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedDrink, setSelectedDrink] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState({ title: '', message: '' });


  useEffect(() => {
    if (params.item) {
      try {
        const parsedItem = JSON.parse(params.item) as MenuItem;
        setItem(parsedItem);
        if (parsedItem.drinkOptions && parsedItem.drinkOptions.length > 0) {
          setSelectedDrink(parsedItem.drinkOptions[0]);
        } else {
          setSelectedDrink(null);
        }
      } catch (e) {
        console.error("Failed to parse item params:", e);
        router.back();
      } finally {
        setTimeout(() => setIsLoading(false), 500);
      }
    } else {
        router.back();
        setIsLoading(false);
    }
  }, [params.item]);

  const toggleFavorite = () => {
    if (item) {
      setItem(prev => prev ? { ...prev, isFavorite: !prev.isFavorite } : null);
    }
  };

  const handleQuantityChange = (change: number) => {
    setQuantity(prev => Math.max(1, prev + change));
  };

  const handleAddToCart = () => {
    if (item) {
      addToCart(item, quantity, selectedDrink);
      setAlertConfig({
        title: "Awesome Choice!",
        message: `${item.name} (x${quantity}) is happily hopping into your cart.`,
      });
      setIsAlertVisible(true);
    }
  };

  const handleAlertClose = () => {
    setIsAlertVisible(false);
    router.push('/CartScreen');
  };

  if (isLoading) {
    return <DetailScreenSkeleton />;
  }

  if (!item) {
    return (
        <View style={styles.loadingContainer}><Text>Item not found.</Text></View>
    );
  }

  const totalPrice = item.price * quantity;
  const bottomBarHeight = Platform.OS === 'ios' ? 95 : 80;

  return (
    <View style={styles.container}>
      <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: bottomBarHeight }}
      >
        <View style={styles.imageContainer}>
          <Image source={item.image} style={styles.itemImage} />
          <TouchableOpacity style={styles.favIconOnImage} onPress={toggleFavorite}>
            <Ionicons
              name={item.isFavorite ? "heart" : "heart-outline"}
              size={24}
              color={item.isFavorite ? SUBTLE_RED_COLOR : DARK_TEXT_COLOR}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.detailsContainer}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemFullDescription}>{item.fullDescription}</Text>
          <Text style={styles.itemPriceLarge}>PKR {item.price.toLocaleString()}</Text>

          {item.drinkOptions && item.drinkOptions.length > 0 && (
            <View style={styles.drinkSection}>
              <View style={styles.drinkHeader}>
                <Text style={styles.drinkTitle}>Drink Flavour</Text>
                <Text style={styles.optionalTag}>OPTIONAL</Text>
              </View>
              {item.drinkOptions.map(drink => (
                <TouchableOpacity
                  key={drink}
                  style={styles.radioButtonContainer}
                  onPress={() => setSelectedDrink(drink)}
                >
                  <Ionicons
                    name={selectedDrink === drink ? 'radio-button-on' : 'radio-button-off'}
                    size={22}
                    color={selectedDrink === drink ? ORANGE_COLOR : MEDIUM_GREY_COLOR}
                  />
                  <Text style={styles.radioText}>{drink}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      <View style={[styles.bottomBar, { paddingBottom: Platform.OS === 'ios' ? 25 : 16 }]}>
        <View style={styles.quantitySelector}>
          <TouchableOpacity onPress={() => handleQuantityChange(-1)} style={styles.quantityButton} disabled={quantity <=1}>
            <Ionicons name="remove" size={20} color={quantity > 1 ? DARK_TEXT_COLOR : MEDIUM_GREY_COLOR} />
          </TouchableOpacity>
          <Text style={styles.quantityText}>{quantity}</Text>
          <TouchableOpacity onPress={() => handleQuantityChange(1)} style={styles.quantityButton}>
            <Ionicons name="add" size={20} color={DARK_TEXT_COLOR} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={handleAddToCart}>
          <Text style={styles.addButtonText}>ADD</Text>
          <Text style={styles.addButtonPrice}>Rs: {totalPrice.toLocaleString()}</Text>
        </TouchableOpacity>
      </View>
       <CustomAlert
        visible={isAlertVisible}
        title={alertConfig.title}
        message={alertConfig.message}
        onClose={handleAlertClose}
        iconName="checkmark-circle"
        iconColor={SUCCESS_GREEN_COLOR}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE_COLOR,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    width: width,
    height: width * 0.7,
  },
  itemImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  favIconOnImage: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 8,
    borderRadius: 20,
  },
  detailsContainer: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  itemName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: DARK_TEXT_COLOR,
    marginBottom: 10,
  },
  itemFullDescription: {
    fontSize: 15,
    color: '#4A4A4A',
    lineHeight: 22,
    marginBottom: 20,
  },
  itemPriceLarge: {
    fontSize: 20,
    fontWeight: 'bold',
    color: DARK_TEXT_COLOR,
    marginBottom: 28,
  },
  drinkSection: {
    marginTop: 10,
    marginBottom: 25,
  },
  drinkHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  drinkTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: DARK_TEXT_COLOR,
  },
  optionalTag: {
    fontSize: 11,
    fontWeight: '500',
    color: MEDIUM_GREY_COLOR,
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 5,
    overflow: 'hidden',
  },
  radioButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: LIGHT_GREY_COLOR,
  },
  radioText: {
    fontSize: 16,
    color: DARK_TEXT_COLOR,
    marginLeft: 15,
  },
  bottomBar: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: LIGHT_GREY_COLOR,
    backgroundColor: WHITE_COLOR,
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F7F7',
    borderRadius: 25,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginRight: 15,
  },
  quantityButton: {
    padding: 10,
  },
  quantityText: {
    fontSize: 17,
    fontWeight: '600',
    color: DARK_TEXT_COLOR,
    minWidth: 35,
    textAlign: 'center',
    marginHorizontal: 8,
  },
  addButton: {
    flex: 1,
    backgroundColor: ORANGE_COLOR,
    paddingVertical: 16,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: WHITE_COLOR,
    fontSize: 17,
    fontWeight: 'bold',
    marginRight: 8,
  },
  addButtonPrice: {
    color: WHITE_COLOR,
    fontSize: 15,
    fontWeight: '500',
  },
  alertOverlay: {
    flex: 1,
    backgroundColor: MODAL_BACKDROP_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  alertContainer: {
    backgroundColor: WHITE_COLOR,
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    width: '100%',
    maxWidth: 350,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  alertIcon: {
    marginBottom: 20,
  },
  alertTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: DARK_TEXT_COLOR,
    textAlign: 'center',
    marginBottom: 10,
  },
  alertMessage: {
    fontSize: 16,
    color: MEDIUM_GREY_COLOR,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 25,
  },
  alertButton: {
    backgroundColor: ORANGE_COLOR,
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 25,
    width: '80%',
    alignItems: 'center',
  },
  alertButtonText: {
    color: WHITE_COLOR,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
export default DetailScreen;