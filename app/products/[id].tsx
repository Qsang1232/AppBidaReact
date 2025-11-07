import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// === THAY ĐỔI 1: Import thêm useRouter ===
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import { BidaCue, getBidaCueById } from '../../api/BidaAPI';
import Colors from '../../constants/Colors';
import { useCart } from '../../context/CartContext';

export default function ProductDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { addToCart } = useCart();
    // === THAY ĐỔI 2: Khởi tạo router ===
    const router = useRouter();

    const [product, setProduct] = useState<BidaCue | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const formatPrice = (price: number) => price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

    useEffect(() => {
        if (id) {
            const fetchProduct = async () => {
                setIsLoading(true);
                const data = await getBidaCueById(Number(id));
                setProduct(data);
                setIsLoading(false);
            };
            fetchProduct();
        }
    }, [id]);

    // === THAY ĐỔI 3: Cập nhật toàn bộ hàm handleAddToCart ===
    const handleAddToCart = () => {
        if (product) {
            addToCart(product, quantity);

            Toast.show({
                type: 'success',
                text1: 'Thêm thành công!',
                text2: `Đã thêm ${quantity} "${product.name}" vào giỏ hàng.`,
                position: 'bottom',
                visibilityTime: 2000, // Toast hiển thị trong 2 giây
                bottomOffset: 90,
                // Sau khi Toast ẩn đi, thực hiện hành động quay về trang chủ
                onHide: () => {
                    if (router.canGoBack()) {
                        router.back();
                    }
                }
            });
        }
    };

    if (isLoading) { return (<View style={styles.loader}><ActivityIndicator size="large" color={Colors.primary} /></View>); }
    if (!product) { return (<View style={styles.loader}><Text>Không tìm thấy sản phẩm.</Text></View>); }

    return (
        <SafeAreaView style={styles.outerContainer}>
            <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 120 }}>
                <Stack.Screen options={{ title: product.brand }} />
                <Image source={{ uri: product.image }} style={styles.image} contentFit="contain" transition={300} />
                <View style={styles.infoContainer}>
                    <Text style={styles.brand}>{product.brand} - {product.type}</Text>
                    <Text style={styles.name}>{product.name}</Text>
                    <View style={styles.ratingContainer}>
                        <Text style={styles.ratingText}>4.8</Text>
                        {[...Array(4)].map((_, i) => <Ionicons key={i} name="star" size={16} color="#FFC700" />)}
                        <Ionicons name="star-half" size={16} color="#FFC700" />
                        <Text style={styles.reviewCount}>(125 đánh giá)</Text>
                    </View>
                    <Text style={styles.price}>{formatPrice(product.price * 24000)}</Text>
                    <View style={styles.section}>
                        <View style={styles.quantitySelector}>
                            <Text style={styles.sectionTitle}>Số lượng</Text>
                            <View style={styles.quantityControls}>
                                <TouchableOpacity style={styles.quantityButton} onPress={() => setQuantity(q => Math.max(1, q - 1))}>
                                    <Ionicons name="remove" size={22} color={Colors.text} />
                                </TouchableOpacity>
                                <Text style={styles.quantityText}>{quantity}</Text>
                                <TouchableOpacity style={styles.quantityButton} onPress={() => setQuantity(q => q + 1)}>
                                    <Ionicons name="add" size={22} color={Colors.text} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Mô tả sản phẩm</Text>
                        <Text style={styles.description}>{product.description}</Text>
                    </View>
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Thông số</Text>
                        <Text style={styles.description}>- Cân nặng: {product.weight}</Text>
                    </View>
                </View>
            </ScrollView>
            <View style={styles.footer}>
                <TouchableOpacity onPress={handleAddToCart}>
                    <LinearGradient colors={[Colors.primary, Colors.primaryDark]} style={styles.addToCartButton}>
                        <Ionicons name="cart" size={22} color="white" />
                        <Text style={styles.addToCartButtonText}>Thêm vào giỏ</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    outerContainer: { flex: 1, backgroundColor: Colors.background },
    container: { flex: 1 },
    loader: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background },
    errorText: { color: Colors.textSecondary, fontSize: 16 },
    image: { width: '100%', height: 400, backgroundColor: Colors.surface },
    infoContainer: { paddingHorizontal: 20, paddingTop: 20, backgroundColor: Colors.surface },
    brand: { fontSize: 16, color: Colors.textSecondary, marginBottom: 4 },
    name: { fontSize: 24, fontWeight: 'bold', color: Colors.text, marginBottom: 12, lineHeight: 32 },
    ratingContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    ratingText: { fontSize: 16, fontWeight: 'bold', color: Colors.text, marginRight: 8 },
    reviewCount: { fontSize: 14, color: Colors.textSecondary, marginLeft: 8 },
    price: { fontSize: 32, fontWeight: 'bold', color: Colors.primaryLight },
    section: { backgroundColor: Colors.surface, padding: 20, marginVertical: 8, marginHorizontal: 16, borderRadius: 12 },
    sectionTitle: { fontSize: 18, fontWeight: '600', color: Colors.text },
    description: { fontSize: 16, lineHeight: 24, color: Colors.textSecondary, paddingTop: 8 },
    quantitySelector: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    quantityControls: { flexDirection: 'row', alignItems: 'center' },
    quantityButton: { padding: 8, backgroundColor: Colors.background, borderRadius: 20 },
    quantityText: { fontSize: 18, fontWeight: 'bold', marginHorizontal: 20, color: Colors.text },
    footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 15, backgroundColor: 'transparent', paddingBottom: Platform.OS === 'ios' ? 34 : 15 },
    addToCartButton: { paddingVertical: 15, paddingHorizontal: 20, borderRadius: 30, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', shadowColor: Colors.primaryLight, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5, elevation: 8 },
    addToCartButtonText: { color: Colors.text, fontSize: 18, fontWeight: 'bold', marginLeft: 10 },
});