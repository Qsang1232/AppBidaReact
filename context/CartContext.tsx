import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

import { BidaCue, getCartByUserId, updateCart } from '../api/BidaAPI';
import { useAuth } from './AuthContext';

export interface CartItem extends BidaCue {
    quantity: number;
}

interface CartContextType {
    cartItems: CartItem[];
    addToCart: (product: BidaCue, quantity: number) => void;
    removeFromCart: (productId: number) => void;
    updateQuantity: (productId: number, quantity: number) => void;
    clearCart: () => void;
    isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const { user, isAuthenticated } = useAuth();
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [apiCartId, setApiCartId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchUserCart = async () => {
            if (isAuthenticated && user) {
                setIsLoading(true);
                const apiCart = await getCartByUserId(user.id);
                if (apiCart) {
                    setCartItems([]);
                    setApiCartId(apiCart.id);
                }
                setIsLoading(false);
            } else {
                setCartItems([]);
                setApiCartId(null);
            }
        };
        fetchUserCart();
    }, [isAuthenticated, user]);

    const syncCartWithApi = async (newCartItems: CartItem[]) => {
        if (!isAuthenticated || !apiCartId) return;
        const apiProducts = newCartItems.map(item => ({
            productId: item.id,
            quantity: item.quantity,
        }));
        await updateCart(apiCartId, apiProducts);
    };

    const addToCart = (product: BidaCue, quantity: number) => {
        setCartItems(prevItems => {
            let updatedItems: CartItem[];
            const existingItem = prevItems.find(item => item.id === product.id);
            if (existingItem) {
                updatedItems = prevItems.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
                );
            } else {
                updatedItems = [...prevItems, { ...product, quantity }];
            }
            syncCartWithApi(updatedItems);
            return updatedItems;
        });
    };

    const updateQuantity = (productId: number, quantity: number) => {
        setCartItems(prevItems => {
            let updatedItems: CartItem[];
            if (quantity <= 0) {
                updatedItems = prevItems.filter(item => item.id !== productId);
            } else {
                updatedItems = prevItems.map(item =>
                    item.id === productId ? { ...item, quantity } : item
                );
            }
            syncCartWithApi(updatedItems);
            return updatedItems;
        });
    };

    const removeFromCart = (productId: number) => {
        setCartItems(prevItems => {
            const updatedItems = prevItems.filter(item => item.id !== productId);
            syncCartWithApi(updatedItems);
            return updatedItems;
        });
    };

    const clearCart = () => {
        setCartItems([]);
        if (isAuthenticated) {
            syncCartWithApi([]);
        }
    };

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, isLoading }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};