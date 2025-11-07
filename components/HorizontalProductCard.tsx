import { Image } from 'expo-image';
import { Link } from 'expo-router';
import React from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BidaCue } from '../api/BidaAPI';
import Colors from '../constants/Colors';

// === LỖI ĐÃ ĐƯỢC SỬA Ở ĐÂY: Thêm lại các hằng số ===
const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.4;
const SPACING = 12;

const HorizontalProductCard = ({ product }: { product: BidaCue }) => {
    const formatPrice = (price: number) => price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

    return (
        <Link href={`/products/${product.id}`} asChild>
            <TouchableOpacity style={styles.container}>
                <Image
                    source={{ uri: product.image }}
                    style={styles.image}
                    contentFit="contain"
                    transition={300}
                />
                <View style={styles.infoContainer}>
                    <Text style={styles.nameText} numberOfLines={2}>{product.name}</Text>
                    <Text style={styles.priceText}>{formatPrice(product.price * 24000)}</Text>
                </View>
            </TouchableOpacity>
        </Link>
    );
};

const styles = StyleSheet.create({
    container: {
        width: CARD_WIDTH, // Sử dụng biến CARD_WIDTH
        borderRadius: 12,
        backgroundColor: Colors.surface,
        overflow: 'hidden',
        marginHorizontal: SPACING / 2, // Sử dụng biến SPACING
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    image: {
        width: '100%',
        height: 120,
        backgroundColor: '#f8f8f8',
    },
    infoContainer: {
        padding: 10,
    },
    nameText: {
        fontSize: 13,
        fontWeight: '600',
        color: Colors.text,
        minHeight: 32,
    },
    priceText: {
        marginTop: 6,
        fontSize: 15,
        fontWeight: 'bold',
        color: Colors.price,
    },
});

export default HorizontalProductCard;