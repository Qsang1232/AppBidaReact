import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Link, Stack } from 'expo-router';
import React from 'react';
import { ActivityIndicator, FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Colors from '../../constants/Colors';
import { useCart } from '../../context/CartContext';

export default function CartScreen() {
    const { cartItems, removeFromCart, updateQuantity, isLoading } = useCart();
    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const formatPrice = (price: number) => price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

    if (isLoading) {
        return <ActivityIndicator style={styles.loader} size="large" color={Colors.primary} />;
    }

    if (cartItems.length === 0) {
        return (
            <SafeAreaView style={styles.container}>
                <Stack.Screen options={{ headerTitle: "Giỏ Hàng" }} />
                <View style={styles.emptyContainer}>
                    <Ionicons name="cart-outline" size={80} color={Colors.textSecondary} />
                    <Text style={styles.emptyText}>Giỏ hàng của bạn đang trống</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ headerTitle: "Giỏ Hàng Của Bạn" }} />
            <FlatList
                data={cartItems}
                keyExtractor={item => item.id.toString()}
                contentContainerStyle={{ padding: 16, paddingBottom: 150 }}
                renderItem={({ item }) => (
                    <View style={styles.cartItem}>
                        <Image source={{ uri: item.image }} style={styles.image} />
                        <View style={styles.itemDetails}>
                            <Text style={styles.itemTitle} numberOfLines={2}>{item.name}</Text>
                            <Text style={styles.itemPrice}>{formatPrice(item.price * 24000)}</Text>
                            <View style={styles.quantityContainer}>
                                <TouchableOpacity style={styles.quantityButton} onPress={() => updateQuantity(item.id, item.quantity - 1)}>
                                    <Ionicons name="remove" size={20} color={Colors.text} />
                                </TouchableOpacity>
                                <Text style={styles.quantity}>{item.quantity}</Text>
                                <TouchableOpacity style={styles.quantityButton} onPress={() => updateQuantity(item.id, item.quantity + 1)}>
                                    <Ionicons name="add" size={20} color={Colors.text} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <TouchableOpacity onPress={() => removeFromCart(item.id)} style={styles.removeButton}>
                            <Ionicons name="trash-outline" size={24} color={Colors.price} />
                        </TouchableOpacity>
                    </View>
                )}
            />

            <View style={styles.summaryContainer}>
                <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>Tổng cộng:</Text>
                    <Text style={styles.totalText}>{formatPrice(total * 24000)}</Text>
                </View>
                <Link href="/checkout" asChild>
                    <TouchableOpacity style={styles.checkoutButton}>
                        <Text style={styles.checkoutButtonText}>Tiến hành thanh toán</Text>
                    </TouchableOpacity>
                </Link>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    loader: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background },
    emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    emptyText: { fontSize: 18, color: Colors.textSecondary, marginTop: 16 },
    cartItem: {
        flexDirection: 'row',
        padding: 12,
        backgroundColor: Colors.surface,
        marginBottom: 12,
        borderRadius: 12,
        alignItems: 'center',
        // Thêm shadow trực tiếp vào đây
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 3,
    },
    image: {
        width: 90,
        height: 90,
        resizeMode: 'contain',
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 8
    },
    itemDetails: { flex: 1, marginLeft: 15, height: '100%', justifyContent: 'space-between' },
    itemTitle: { fontSize: 16, fontWeight: 'bold', color: Colors.text },
    itemPrice: { fontSize: 15, color: Colors.price, fontWeight: '600' },
    quantityContainer: { flexDirection: 'row', alignItems: 'center' },
    quantityButton: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: Colors.background,
        justifyContent: 'center',
        alignItems: 'center',
    },
    quantity: { fontSize: 18, marginHorizontal: 15, fontWeight: 'bold', color: Colors.text },
    removeButton: {
        position: 'absolute',
        top: 10,
        right: 10
    },
    summaryContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 20,
        paddingBottom: 34,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        backgroundColor: Colors.surface,
        borderTopWidth: 1,
        borderColor: Colors.border,
        // Thêm shadow trực tiếp vào đây
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 20,
    },
    totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
    totalLabel: { fontSize: 18, color: Colors.textSecondary },
    totalText: { fontSize: 22, fontWeight: 'bold', color: Colors.price },
    checkoutButton: {
        backgroundColor: Colors.primary,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center'
    },
    checkoutButtonText: {
        color: Colors.surface,
        fontSize: 18,
        fontWeight: 'bold'
    }
});