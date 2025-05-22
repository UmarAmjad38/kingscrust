import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ShoppingCart, AlignLeft, MapPin, ChevronDown } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { Address } from '../context/AddressContext'; // Import Address type

interface HeaderProps {
  currentAddress: Address | null; // Accept current address
  onMenuPress?: () => void;
  onDeliveryPress?: () => void;
  onCartPress?: () => void;
}

export const Header = ({
  currentAddress,
  onMenuPress,
  onDeliveryPress,
  onCartPress
}: HeaderProps) => {

  const displayShortAddress = currentAddress
    ? currentAddress.fullAddress // Or create a shorter version if needed
    : 'Home'; // Default placeholder

  return (
    <>
      <StatusBar style="inverted" />
      <SafeAreaView edges={['top']} style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={onMenuPress}
          >
            <AlignLeft size={24} color="white" />
          </TouchableOpacity>

          <View style={styles.deliveryContainer}>
            <TouchableOpacity
              style={styles.deliveryButton}
              onPress={onDeliveryPress} // This triggers the bottom sheet
            >
              <View style={styles.deliveryContent}>
                <Text numberOfLines={1} ellipsizeMode="tail" style={styles.deliveryText}>
                  Deliver to <Text style={styles.deliveryLocation}>{displayShortAddress}</Text>
                </Text>
                <ChevronDown size={16} color="black" style={styles.dropdownIcon} />
              </View>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.cartButton}
            onPress={onCartPress}
          >
            <ShoppingCart size={20} color="black" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F5F5F5',
  },
  header: {
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  menuButton: {
    width: 45,
    height: 45,
    justifyContent: 'center',
    backgroundColor: '#F15B25', // Orange color from figma
    borderRadius: 30,
    alignItems: 'center',
  },
  deliveryContainer: {
    flex: 1,
    marginHorizontal: 8, // Adjust spacing
    alignItems: 'center', // Center the button
  },
  deliveryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5, // Add some padding
  },
  deliveryContent: {
    flexDirection: 'row',
    alignItems: 'center',
     maxWidth: '100%', // Allow text to take space
  },
  deliveryText: {
    color: '#888', // Lighter text for "Deliver to"
    fontSize: 15,
    marginRight: 4,
  },
  deliveryLocation: {
    color: 'black',
    fontWeight: '600', // Bold location text
    fontSize: 16,
  },
  dropdownIcon: {
    marginLeft: 4,
  },
  cartButton: {
    width: 45,
    height: 45,
    borderRadius: 30,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
});