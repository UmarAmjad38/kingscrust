import React, { createContext, useState, useContext, ReactNode } from 'react';
import { MenuItem } from '../data/menu'; // Adjust path as needed

export interface CartItem extends MenuItem {
  cartQuantity: number;
  selectedDrink?: string | null; // If applicable from DetailScreen
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: MenuItem, quantity: number, selectedDrink?: string | null) => void;
  updateCartItemQuantity: (itemId: string, newQuantity: number) => void;
  removeFromCart: (itemId: string) => void;
  getCartTotal: () => number;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (item: MenuItem, quantity: number, selectedDrink?: string | null) => {
    setCartItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(ci => ci.id === item.id);
      if (existingItemIndex > -1) {
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].cartQuantity += quantity;
        // Optionally update selectedDrink if needed for existing items
        return updatedItems;
      } else {
        return [...prevItems, { ...item, cartQuantity: quantity, selectedDrink }];
      }
    });
  };

  const updateCartItemQuantity = (itemId: string, newQuantity: number) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, cartQuantity: Math.max(1, newQuantity) } : item
      )
    );
  };

  const removeFromCart = (itemId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.cartQuantity, 0);
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateCartItemQuantity,
        removeFromCart,
        getCartTotal,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};