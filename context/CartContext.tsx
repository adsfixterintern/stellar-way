/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { ICartItem } from "@/types/menu";
import toast from "react-hot-toast";

interface CartContextType {
  cartItems: ICartItem[];
  addToCart: (item: any) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, setCartItems] = useState<ICartItem[]>([]);

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  const saveToLocalStorage = (items: ICartItem[]) => {
    setCartItems(items);
    localStorage.setItem("cart", JSON.stringify(items));
  };

  const addToCart = (item: any) => {
    const isExist = cartItems.find((i) => i._id === item._id);
    let updatedCart;

    if (isExist) {
      updatedCart = cartItems.map((i) =>
        i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i
      );
    } else {
      updatedCart = [
        ...cartItems,
        {
          _id: item._id,
          title: item.title,
          price: item.price,
          image: item.image,
          quantity: 1,
          size: "Medium",
        },
      ];
    }
    saveToLocalStorage(updatedCart);
    toast.success(`${item.title} added to cart!`, { icon: '🛒' });
  };

  const removeFromCart = (id: string) => {
    const updatedCart = cartItems.filter((i) => i._id !== id);
    saveToLocalStorage(updatedCart);
  };

  const updateQuantity = (id: string, delta: number) => {
    const updatedCart = cartItems.map((i) => {
      if (i._id === id) {
        const newQty = Math.max(1, i.quantity + delta);
        return { ...i, quantity: newQty };
      }
      return i;
    });
    saveToLocalStorage(updatedCart);
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cart");
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, subtotal }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};