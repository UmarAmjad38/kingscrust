// components/AddressBottomSheet.tsx
import React, { forwardRef } from "react";
import { View, Text, StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Modalize } from "react-native-modalize";
import { Portal } from "react-native-portalize";
import { Send } from "lucide-react-native";
import { Address } from "../context/AddressContext";

interface Props {
  savedAddresses: Address[];
  selectedAddress: Address | null;
  loading: boolean; // Added loading prop
  onSelectNewLocation: () => void;
  onAddNewAddress: () => void;
  onSelectExisting: (address: Address) => void;
}

const SkeletonPlaceholder = () => (
    <View style={styles.content}>
        <View style={[styles.skeletonBase, styles.skeletonTitle]} />
        <View style={styles.skeletonOptionContainer}>
            <View style={[styles.skeletonBase, styles.skeletonIcon]} />
            <View style={[styles.skeletonBase, styles.skeletonOptionText]} />
        </View>
        {[1, 2, 3].map((i) => (
            <View key={i} style={styles.skeletonAddressItem}>
                <View style={[styles.skeletonBase, styles.skeletonRadio]} />
                <View style={styles.skeletonAddressDetails}>
                    <View style={[styles.skeletonBase, styles.skeletonTextShort]} />
                    <View style={[styles.skeletonBase, styles.skeletonTextLong]} />
                </View>
            </View>
        ))}
         <View style={[styles.skeletonBase, styles.skeletonAddButton]} />
    </View>
);


export const AddressBottomSheet = forwardRef<Modalize, Props>(
  (
    {
      savedAddresses,
      selectedAddress,
      loading, // Destructure loading prop
      onSelectNewLocation,
      onAddNewAddress,
      onSelectExisting,
    },
    ref
  ) => {
    return (
      <Portal>
        <Modalize
          ref={ref}
          adjustToContentHeight
          handleStyle={styles.handle}
          modalStyle={styles.modal}
        >
          {loading ? (
             <SkeletonPlaceholder />
          ) : (
            <View style={styles.content}>
              <Text style={styles.title}>Add or choose an address</Text>

              <TouchableOpacity
                style={styles.optionButton}
                onPress={onSelectNewLocation}
              >
                <Send size={22} color="#F15B25" style={styles.icon} />
                <Text style={styles.optionTextOrange}>Select new location</Text>
              </TouchableOpacity>

              {savedAddresses.map((address, index) => {
                const isSelected =
                  selectedAddress?.fullAddress === address.fullAddress;
                const itemKey = address.fullAddress || `address-${index}`;

                return (
                  <TouchableOpacity
                    key={itemKey}
                    style={styles.addressItem}
                    onPress={() => onSelectExisting(address)}
                  >
                    <View
                      style={[
                        styles.radioOuter,
                        isSelected && styles.radioOuterSelected,
                      ]}
                    >
                      {isSelected && <View style={styles.radioInnerSelected} />}
                    </View>
                    <View style={styles.addressDetails}>
                      <Text style={styles.addressLabel}>
                        {address.label || "Saved Address"}
                      </Text>
                      <Text style={styles.addressText}>
                        {address.fullAddress}{" "}
                        {address.details ? `, ${address.details}` : ""}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}

              <TouchableOpacity
                style={styles.addButton}
                onPress={onAddNewAddress}
              >
                <Text style={styles.addButtonText}>+ ADD NEW ADDRESS</Text>
              </TouchableOpacity>
            </View>
          )}
        </Modalize>
      </Portal>
    );
  }
);

const styles = StyleSheet.create({
  modal: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: "white",
  },
  handle: {
    width: 40,
    height: 5,
    backgroundColor: "#E0E0E0",
    borderRadius: 2.5,
    marginTop: 10,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: 25,
    textAlign: "center",
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  icon: {
    marginRight: 15,
  },
  optionTextOrange: {
    fontSize: 16,
    color: "#F15B25",
    fontWeight: "500",
  },
  addressItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#CCCCCC",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  radioOuterSelected: {
    borderColor: "#F15B25",
  },
  radioInnerSelected: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#F15B25",
  },
  addressDetails: {
    flex: 1,
  },
  addressLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 3,
  },
  addressText: {
    fontSize: 14,
    color: "#666",
  },
  addButton: {
    marginTop: 20,
    paddingVertical: 15,
  },
  addButtonText: {
    fontSize: 16,
    color: "#F15B25",
    fontWeight: "bold",
    textAlign: "center",
  },
  // Skeleton Styles
  skeletonBase: {
      backgroundColor: '#E0E0E0',
      borderRadius: 4,
  },
  skeletonTitle: {
      width: '60%',
      height: 20,
      marginBottom: 25,
      alignSelf: 'center',
  },
  skeletonOptionContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 15,
      borderBottomWidth: 1,
      borderBottomColor: "#f0f0f0",
  },
  skeletonIcon: {
      width: 22,
      height: 22,
      marginRight: 15,
      borderRadius: 11, // Circle for icon like Send
  },
  skeletonOptionText: {
      width: '50%',
      height: 16,
  },
  skeletonAddressItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 15,
      borderBottomWidth: 1,
      borderBottomColor: "#f0f0f0",
  },
  skeletonRadio: {
      width: 22,
      height: 22,
      borderRadius: 11,
      marginRight: 15,
  },
  skeletonAddressDetails: {
      flex: 1,
  },
  skeletonTextShort: {
      width: '40%',
      height: 16,
      marginBottom: 5,
  },
  skeletonTextLong: {
      width: '80%',
      height: 14,
  },
  skeletonAddButton: {
      width: '50%',
      height: 18,
      marginTop: 20,
      paddingVertical: 15, // Keep vertical padding for spacing
      alignSelf: 'center',
  },
});