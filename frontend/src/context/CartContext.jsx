import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const stored = localStorage.getItem('cart');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, size) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.product._id === product._id && item.size === size);
      if (existing) {
        return prev.map(item => 
          item.product._id === product._id && item.size === size
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, size, quantity: 1 }];
    });
  };

  const updateQuantity = (productId, size, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId, size);
      return;
    }
    setCartItems(prev => prev.map(item => 
      item.product._id === productId && item.size === size
        ? { ...item, quantity }
        : item
    ));
  };

  const removeFromCart = (productId, size) => {
    setCartItems(prev => prev.filter(item => !(item.product._id === productId && item.size === size)));
  };

  const clearCart = () => setCartItems([]);

  const getSubtotal = () => {
    return cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      getSubtotal
    }}>
      {children}
    </CartContext.Provider>
  );
};
