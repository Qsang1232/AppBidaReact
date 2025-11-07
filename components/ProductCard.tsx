import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import React from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BidaCue } from '../api/BidaAPI';
import Colors from '../constants/Colors';

const { width } = Dimensions.get('window');

const ProductCard = ({ product }: { product: BidaCue }) => {
    const formatPrice = (price: number) => price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

    // Giả lập giá gốc và rating
    const originalPrice = product.price * 1.3;
    const rating = 4;

    return (
        <Link href={`/products/${product.id}`} asChild>
            {/* === THAY ĐỔI Ở ĐÂY: Chỉ dùng style từ file này === */}
            <TouchableOpacity style={styles.container}>
                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: product.image }}
                        style={styles.image}
                        contentFit="contain"
                        transition={300}
                    />
                </View>

                <View style={styles.infoContainer}>
                    <Text style={styles.nameText} numberOfLines={2}>{product.name}</Text>

                    <View style={styles.ratingContainer}>
                        {[...Array(5)].map((_, index) => (
                            <Ionicons
                                key={index}
                                name={index < rating ? "star" : "star-outline"}
                                size={16}
                                color={Colors.star}
                            />
                        ))}
                    </View>

                    <View style={styles.priceContainer}>
                        <Text style={styles.originalPriceText}>{formatPrice(originalPrice * 24000)}</Text>
                        <Text style={styles.salePriceText}>{formatPrice(product.price * 24000)}</Text>
                    </View>

                    <TouchableOpacity style={styles.buyButton}>
                        <Text style={styles.buyButtonText}>Buy now</Text>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        </Link>
    );
};

const styles = StyleSheet.create({
    container: {
        width: (width / 2) - 16,
        margin: 8,
        borderRadius: 8,
        backgroundColor: Colors.surface,
        // === THAY ĐỔI Ở ĐÂY: Thêm trực tiếp style đổ bóng vào đây ===
        // Shadow cho iOS
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        // Shadow cho Android
        elevation: 5,
    },
    imageContainer: {
        backgroundColor: '#E60005',
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        padding: 10,
    },
    image: {
        width: '100%',
        height: 150,
    },
    infoContainer: {
        padding: 12,
        alignItems: 'center',
    },
    nameText: {
        fontSize: 15,
        fontWeight: '600',
        color: Colors.text,
        minHeight: 40,
        textAlign: 'center',
    },
    ratingContainer: {
        flexDirection: 'row',
        marginVertical: 8,
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    originalPriceText: {
        fontSize: 13,
        color: Colors.textSecondary,
        textDecorationLine: 'line-through',
        marginRight: 8,
    },
    salePriceText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.price,
    },
    buyButton: {
        marginTop: 12,
        backgroundColor: Colors.buttonBuyNow,
        paddingVertical: 8,
        paddingHorizontal: 24,
        borderRadius: 6,
    },
    buyButtonText: {
        color: Colors.surface,
        fontWeight: 'bold',
        fontSize: 14,
    },
});

export default ProductCard;