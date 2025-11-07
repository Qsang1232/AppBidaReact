import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Button, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import Colors from '../constants/Colors';

export default function OrderSuccessScreen() {
    const params = useLocalSearchParams();
    const router = useRouter();
    // Lấy các tham số được truyền từ trang checkout
    const { orderId, total, qrCodeUrl } = params;

    // Hàm format giá tiền, thêm kiểm tra để tránh lỗi
    const formatPrice = (price: any) => {
        const numberPrice = Number(price);
        if (isNaN(numberPrice)) return '0 đ';
        return numberPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    };

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen
                options={{
                    title: "Đặt Hàng Thành Công",
                    headerLeft: () => null, // Ẩn nút back
                    gestureEnabled: false, // Vô hiệu hóa cử chỉ vuốt để quay lại
                }}
            />
            <View style={styles.content}>
                <Ionicons name="checkmark-circle" size={80} color={Colors.success} />
                <Text style={styles.title}>Cảm ơn bạn đã đặt hàng!</Text>
                <Text style={styles.subtitle}>Mã đơn hàng của bạn là:</Text>
                <Text style={styles.orderId}>#{orderId}</Text>

                {/* Chỉ hiển thị khu vực QR nếu có qrCodeUrl được truyền vào */}
                {qrCodeUrl ? (
                    <View style={styles.qrContainer}>
                        <Text style={styles.qrInstruction}>Vui lòng quét mã VietQR dưới đây để hoàn tất thanh toán:</Text>
                        <Image source={{ uri: qrCodeUrl as string }} style={styles.qrImage} />
                        <Text style={styles.totalText}>Số tiền cần thanh toán:</Text>
                        <Text style={styles.totalAmount}>{formatPrice(total)}</Text>
                    </View>
                ) : (
                    <Text style={styles.codMessage}>Đơn hàng sẽ được giao và thanh toán tại nhà (COD).</Text>
                )}

                <Button title="Quay về Trang chủ" onPress={() => router.replace('/(tabs)')} />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.surface },
    content: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    title: { fontSize: 22, fontWeight: 'bold', color: Colors.text, marginTop: 16, textAlign: 'center' },
    subtitle: { fontSize: 16, color: Colors.textSecondary, marginTop: 20 },
    orderId: { fontSize: 20, fontWeight: 'bold', color: Colors.primary, marginBottom: 20, letterSpacing: 1 },
    codMessage: { fontSize: 16, color: Colors.text, textAlign: 'center', marginVertical: 30, lineHeight: 24 },
    qrContainer: { alignItems: 'center', marginVertical: 20, padding: 20, backgroundColor: Colors.background, borderRadius: 12, width: '100%' },
    qrInstruction: { fontSize: 16, color: Colors.text, textAlign: 'center', marginBottom: 15, lineHeight: 22 },
    qrImage: { width: 220, height: 220, marginBottom: 10, borderWidth: 1, borderColor: Colors.border },
    totalText: { fontSize: 16, color: Colors.textSecondary, marginTop: 10 },
    totalAmount: { fontSize: 22, fontWeight: 'bold', color: Colors.price }
});