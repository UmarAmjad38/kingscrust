import React, { createContext, useState, useContext, ReactNode, useRef } from 'react';
import { Modalize } from 'react-native-modalize';

export interface Address {
  id: string;
  label: string;
  fullAddress: string;
  details?: string;
  latitude: number;
  longitude: number;
}

interface AddressContextType {
  selectedAddress: Address | null;
  setSelectedAddress: (address: Address | null) => void;
  savedAddresses: Address[];
  addSavedAddress: (address: Omit<Address, 'id'>) => void;
  updateSavedAddress: (address: Address) => void;
  removeSavedAddress: (id: string) => void;
  defaultAddress: Address | null;
  openAddressSheet: () => void;
  closeAddressSheet: () => void;
  setAddressModalRef: (ref: React.RefObject<Modalize>) => void;
}

const AddressContext = createContext<AddressContextType | undefined>(undefined);

export const useAddress = () => {
  const context = useContext(AddressContext);
  if (!context) {
    throw new Error('useAddress must be used within an AddressProvider');
  }
  return context;
};

interface AddressProviderProps {
  children: ReactNode;
}

export const AddressProvider: React.FC<AddressProviderProps> = ({ children }) => {
  const [selectedAddress, setSelectedAddressState] = useState<Address | null>(null);
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const addressModalRefFromAppLayout = useRef<React.RefObject<Modalize> | null>(null);

  const defaultAddress = savedAddresses.find(addr => addr.label === 'Home') || savedAddresses[0] || null;

  const setSelectedAddress = (address: Address | null) => {
    setSelectedAddressState(address);
  };

  const addSavedAddress = (address: Omit<Address, 'id'>) => {
    const newAddress = { ...address, id: Date.now().toString() + Math.random().toString(36).substring(2, 15) };
    setSavedAddresses(prev => [...prev, newAddress]);
    setSelectedAddressState(newAddress);
  };

  const updateSavedAddress = (updatedAddress: Address) => {
    setSavedAddresses(prev =>
      prev.map(addr => (addr.id === updatedAddress.id ? updatedAddress : addr))
    );
    if (selectedAddress?.id === updatedAddress.id) {
        setSelectedAddressState(updatedAddress);
    }
  };

  const removeSavedAddress = (id: string) => {
    setSavedAddresses(prev => prev.filter(addr => addr.id !== id));
    if (selectedAddress?.id === id) {
        setSelectedAddressState(defaultAddress);
    }
  };

  const openAddressSheet = () => {
    if (addressModalRefFromAppLayout.current && addressModalRefFromAppLayout.current.current) {
      addressModalRefFromAppLayout.current.current.open();
    } else {
      console.warn("AddressBottomSheet ref not set in context or not yet available.");
    }
  };

  const closeAddressSheet = () => {
     if (addressModalRefFromAppLayout.current && addressModalRefFromAppLayout.current.current) {
      addressModalRefFromAppLayout.current.current.close();
    }
  };

  const setAddressModalRef = (ref: React.RefObject<Modalize>) => {
    addressModalRefFromAppLayout.current = ref;
  };

  return (
    <AddressContext.Provider
      value={{
        selectedAddress,
        setSelectedAddress,
        savedAddresses,
        addSavedAddress,
        updateSavedAddress,
        removeSavedAddress,
        defaultAddress,
        openAddressSheet,
        closeAddressSheet,
        setAddressModalRef,
      }}
    >
      {children}
    </AddressContext.Provider>
  );
};