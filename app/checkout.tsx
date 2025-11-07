import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { addOrder, generateVietQR } from '../api/BidaAPI'; // Đảm bảo import generateVietQR
import Colors from '../constants/Colors';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

type PaymentMethod = 'COD' | 'BANK_TRANSFER';

export default function CheckoutScreen() {
    const { cartItems, clearCart } = useCart();
    const { user } = useAuth();
    const router = useRouter();

    const initialName = user?.name ? `${user.name.firstname} ${user.name.lastname}` : '';
    const [name, setName] = useState(initialName);
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState(user?.phone || '');
    const [isLoading, setIsLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('COD');

    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const formatPrice = (price: number) => price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

    const handlePlaceOrder = async () => {
        if (!user) { Alert.alert('Lỗi', 'Vui lòng đăng nhập để đặt hàng.'); return; }
        if (!name || !address || !phone) { Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin giao hàng.'); return; }

        setIsLoading(true);

        const orderId = Date.now().toString();
        await addOrder({
            userId: user.id, date: new Date().toISOString(),
            products: cartItems.map(item => ({ productId: item.id, quantity: item.quantity })),
        });

        const orderDataForStorage = {
            id: orderId, date: new Date().toISOString(), total, items: cartItems,
            shippingInfo: { name, address, phone }, paymentMethod: paymentMethod, status: 'Đang xử lý',
        };

        try {
            const userOrdersKey = `orders_${user.username}`;
            const existingOrdersJson = await AsyncStorage.getItem(userOrdersKey);
            const existingOrders = existingOrdersJson ? JSON.parse(existingOrdersJson) : [];
            existingOrders.push(orderDataForStorage);
            await AsyncStorage.setItem(userOrdersKey, JSON.stringify(existingOrders));

            clearCart();
            setIsLoading(false);

            // === LOGIC PHÂN LUỒNG QUAN TRỌNG NHẤT NẰM Ở ĐÂY ===
            console.log('Phương thức thanh toán đã chọn:', paymentMethod); // Thêm dòng này để debug

            if (paymentMethod === 'BANK_TRANSFER') {
                const qrCodeUrl = generateVietQR({
                    bankBin: '970415', // Vietinbank
                    accountNo: '102868688868', // STK của bạn
                    amount: total * 24000,
                    orderId: `DH${orderId.slice(-6)}`,
                });

                console.log('Đang điều hướng đến order-success với QR:', qrCodeUrl); // Thêm dòng này để debug
                router.replace({
                    pathname: '/order-success',
                    params: { orderId, total: total * 24000, qrCodeUrl },
                });
            } else { // Xử lý cho COD
                console.log('Đang điều hướng đến order-success (COD)'); // Thêm dòng này để debug
                router.replace({
                    pathname: '/order-success',
                    params: { orderId, total: total * 24000 },
                });
            }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            setIsLoading(false);
            Alert.alert('Lỗi', 'Đã có lỗi xảy ra khi lưu đơn hàng.');
        }
    };

    return (
        <View style={styles.outerContainer}>
            <Stack.Screen options={{
                headerStyle: { backgroundColor: Colors.surface },
                headerTintColor: Colors.text,
                headerTitle: "Thông Tin Giao Hàng"
            }} />
            <ScrollView style={styles.container} contentContainerStyle={styles.content}>
                <Text style={styles.title}>Thông tin người nhận</Text>
                <View style={styles.inputContainer}><Ionicons name="person-outline" size={22} color={Colors.textSecondary} style={styles.inputIcon} /><TextInput style={styles.input} placeholder="Họ và Tên" placeholderTextColor={Colors.textSecondary} value={name} onChangeText={setName} /></View>
                <View style={styles.inputContainer}><Ionicons name="location-outline" size={22} color={Colors.textSecondary} style={styles.inputIcon} /><TextInput style={styles.input} placeholder="Địa chỉ" placeholderTextColor={Colors.textSecondary} value={address} onChangeText={setAddress} /></View>
                <View style={styles.inputContainer}><Ionicons name="call-outline" size={22} color={Colors.textSecondary} style={styles.inputIcon} /><TextInput style={styles.input} placeholder="Số điện thoại" placeholderTextColor={Colors.textSecondary} value={phone} onChangeText={setPhone} keyboardType="phone-pad" /></View>

                <Text style={styles.title}>Phương thức thanh toán</Text>
                <TouchableOpacity style={[styles.paymentOption, paymentMethod === 'COD' && styles.activePaymentOption]} onPress={() => setPaymentMethod('COD')}>
                    <Ionicons name={paymentMethod === 'COD' ? 'radio-button-on' : 'radio-button-off'} size={24} color={paymentMethod === 'COD' ? Colors.primary : Colors.textSecondary} />
                    <Text style={styles.paymentText}>Thanh toán khi nhận hàng (COD)</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.paymentOption, paymentMethod === 'BANK_TRANSFER' && styles.activePaymentOption]} onPress={() => setPaymentMethod('BANK_TRANSFER')}>
                    <Ionicons name={paymentMethod === 'BANK_TRANSFER' ? 'radio-button-on' : 'radio-button-off'} size={24} color={paymentMethod === 'BANK_TRANSFER' ? Colors.primary : Colors.textSecondary} />
                    <Text style={styles.paymentText}>Chuyển khoản ngân hàng</Text>
                </TouchableOpacity>

                <View style={styles.summaryContainer}>
                    <Text style={styles.summaryTitle}>Tóm tắt đơn hàng</Text>
                    {cartItems.map(item => (<View key={item.id} style={styles.summaryItem}><Text style={styles.summaryItemName} numberOfLines={1}>{item.name} (x{item.quantity})</Text><Text style={styles.summaryItemPrice}>{formatPrice(item.price * item.quantity * 24000)}</Text></View>))}
                    <View style={styles.divider} />
                    <View style={styles.summaryItem}><Text style={styles.summaryTotalLabel}>Tổng cộng</Text><Text style={styles.summaryTotalPrice}>{formatPrice(total * 24000)}</Text></View>
                </View>
            </ScrollView>
            <View style={styles.footer}>
                <TouchableOpacity style={styles.button} onPress={handlePlaceOrder} disabled={isLoading}>
                    {isLoading ? <ActivityIndicator color={Colors.surface} /> : <Text style={styles.buttonText}>Xác nhận đặt hàng</Text>}
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    outerContainer: { flex: 1, backgroundColor: Colors.background },
    container: { flex: 1 },
    content: { padding: 20, paddingBottom: 120 },
    loader: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background },
    title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, color: Colors.text, marginTop: 10 },
    inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface, borderRadius: 10, marginBottom: 15, borderWidth: 1, borderColor: Colors.border },
    inputIcon: { paddingHorizontal: 15 },
    input: { flex: 1, paddingVertical: 15, fontSize: 16, color: Colors.text },
    paymentOption: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface, padding: 15,
        borderRadius: 10, marginBottom: 10, borderWidth: 1, borderColor: Colors.border,
    },
    activePaymentOption: { borderColor: Colors.primary, backgroundColor: '#E0EFFF' },
    paymentText: { fontSize: 16, marginLeft: 10, color: Colors.text },
    summaryContainer: { marginVertical: 20, padding: 15, backgroundColor: Colors.surface, borderRadius: 10 },
    summaryTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: Colors.text },
    summaryItem: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 5 },
    summaryItemName: { fontSize: 16, color: Colors.textSecondary, flex: 1 },
    summaryItemPrice: { fontSize: 16, color: Colors.text, fontWeight: '500' },
    divider: { height: 1, backgroundColor: Colors.border, marginVertical: 10 },
    summaryTotalLabel: { fontSize: 18, color: Colors.text, fontWeight: 'bold' },
    summaryTotalPrice: { fontSize: 20, color: Colors.price, fontWeight: 'bold' },
    footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, backgroundColor: Colors.surface, borderTopWidth: 1, borderColor: Colors.border, paddingBottom: Platform.OS === 'ios' ? 34 : 20 },
    button: { backgroundColor: Colors.primary, padding: 15, borderRadius: 10, alignItems: 'center' },
    buttonText: { color: Colors.surface, fontSize: 18, fontWeight: 'bold' },
});