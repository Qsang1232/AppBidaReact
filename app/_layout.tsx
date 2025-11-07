import { Stack } from 'expo-router';
import React from 'react';
import 'react-native-reanimated';
import Toast from 'react-native-toast-message';
import { AuthProvider } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <CartProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="products/[id]" />
          <Stack.Screen name="checkout" options={{ title: 'Thanh toán', presentation: 'modal' }} />
          <Stack.Screen name="order-history" options={{ title: 'Lịch sử đơn hàng', presentation: 'modal' }} />
          <Stack.Screen name="cart" options={{ title: 'Giỏ Hàng', presentation: 'modal' }} />
          {/* === ĐẢM BẢO DÒNG NÀY TỒN TẠI === */}
          <Stack.Screen name="order-success" options={{ presentation: 'modal' }} />
        </Stack>
        <Toast />
      </CartProvider>
    </AuthProvider>
  );
}