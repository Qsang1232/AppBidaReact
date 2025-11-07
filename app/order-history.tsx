import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack, useFocusEffect } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { BidaCue, getOrdersByUserId } from '../api/BidaAPI';
import Colors from '../constants/Colors';
import { useAuth } from '../context/AuthContext';

// Định nghĩa các trạng thái có thể có
type OrderStatus = 'Đang xử lý' | 'Đã giao' | 'Đã hủy';

// Cập nhật kiểu dữ liệu cho đơn hàng, thêm status
interface Order {
    id: string;
    date: string;
    total: number;
    items: (BidaCue & { quantity: number })[];
    shippingInfo: { name: string; phone: string; address: string; };
    status: OrderStatus;
}

export default function OrderHistoryScreen() {
    const { user } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const formatPrice = (price: number) => price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

    useFocusEffect(
        React.useCallback(() => {
            const fetchOrders = async () => {
                setIsLoading(true);
                if (!user) {
                    setOrders([]);
                    setIsLoading(false);
                    return;
                }

                // === LOGIC MỚI: CALL API VÀ LẤY DỮ LIỆU LOCAL ===

                // 1. Call API để lấy đơn hàng "trên server" (chủ yếu để demo)
                console.log(`Đang lấy đơn hàng từ API cho user ID: ${user.id}`);
                const apiOrders = await getOrdersByUserId(user.id);
                // Bạn có thể console.log(apiOrders) ở đây để thấy kết quả từ API

                // 2. Vẫn lấy đơn hàng từ AsyncStorage để hiển thị ra giao diện
                const userOrdersKey = `orders_${user.username}`;
                const storedOrders = await AsyncStorage.getItem(userOrdersKey);

                if (storedOrders) {
                    setOrders(JSON.parse(storedOrders).reverse());
                } else {
                    setOrders([]);
                }
                setIsLoading(false);
            };

            fetchOrders();
        }, [user])
    );

    // Hàm helper để lấy style cho từng trạng thái
    const getStatusStyle = (status: OrderStatus) => {
        switch (status) {
            case 'Đã giao':
                return { backgroundColor: '#D4EDDA', color: '#155724' };
            case 'Đã hủy':
                return { backgroundColor: '#F8D7DA', color: '#721C24' };
            default: // Đang xử lý
                return { backgroundColor: '#FFF3CD', color: '#856404' };
        }
    }

    const renderOrderItem = ({ item }: { item: Order }) => {
        const statusStyle = getStatusStyle(item.status);
        return (
            <View style={styles.orderCard}>
                <View style={styles.orderHeader}>
                    <Text style={styles.orderId}>Đơn hàng #{item.id.slice(-6)}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: statusStyle.backgroundColor }]}>
                        <Text style={[styles.statusText, { color: statusStyle.color }]}>{item.status}</Text>
                    </View>
                </View>
                <Text style={styles.orderDate}>{new Date(item.date).toLocaleString('vi-VN')}</Text>
                <View style={styles.divider} />
                <View style={styles.orderBody}>
                    {item.items.map((product) => (
                        <Text key={product.id} style={styles.productItem}>- {product.name} (x{product.quantity})</Text>
                    ))}
                </View>
                <View style={styles.divider} />
                <Text style={styles.orderTotal}>Tổng cộng: {formatPrice(item.total * 24000)}</Text>
                <View style={styles.shippingInfo}>
                    <Text style={styles.shippingTitle}>Thông tin giao hàng:</Text>
                    <Text style={styles.shippingText}>{item.shippingInfo.name} - {item.shippingInfo.phone}</Text>
                    <Text style={styles.shippingText}>{item.shippingInfo.address}</Text>
                </View>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{
                headerStyle: { backgroundColor: Colors.surface },
                headerTintColor: Colors.text,
                headerTitle: "Lịch Sử Đơn Hàng"
            }} />
            {isLoading ? (
                <ActivityIndicator style={styles.loader} size="large" color={Colors.primary} />
            ) : !user || orders.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Ionicons name="receipt-outline" size={80} color={Colors.textSecondary} />
                    <Text style={styles.emptyText}>{!user ? 'Vui lòng đăng nhập để xem' : 'Bạn chưa có đơn hàng nào.'}</Text>
                </View>
            ) : (
                <FlatList
                    data={orders}
                    renderItem={renderOrderItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContainer}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    listContainer: { padding: 16 },
    emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    emptyText: { fontSize: 18, color: Colors.textSecondary, marginTop: 16 },
    orderCard: { backgroundColor: Colors.surface, padding: 16, marginBottom: 16, borderRadius: 12 },
    orderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
    orderId: { fontWeight: 'bold', fontSize: 16, color: Colors.text },
    statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
    statusText: { fontSize: 12, fontWeight: 'bold' },
    orderDate: { color: Colors.textSecondary, fontSize: 13, marginBottom: 12 },
    divider: { height: 1, backgroundColor: Colors.border, marginVertical: 12 },
    orderBody: {},
    productItem: { fontSize: 15, color: Colors.text, marginBottom: 5 },
    orderTotal: { fontWeight: 'bold', fontSize: 18, marginTop: 12, color: Colors.price, textAlign: 'right' },
    shippingInfo: { marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: Colors.border },
    shippingTitle: { fontWeight: 'bold', marginBottom: 5, color: Colors.text, fontSize: 15 },
    shippingText: { color: Colors.textSecondary, fontSize: 14, lineHeight: 20 }
});