import React from 'react';
// === THAY ĐỔI 1: Thay FlatList bằng ScrollView ===
import { ScrollView, StyleSheet, View } from 'react-native';
import { BidaCue } from '../api/BidaAPI';
import Colors from '../constants/Colors';
import HorizontalProductCard from './HorizontalProductCard';
import SectionHeader from './SectionHeader';

interface FeaturedProductsProps {
    products: BidaCue[];
}

const FeaturedProducts = ({ products }: FeaturedProductsProps) => {
    // Thêm một bước kiểm tra để không render gì nếu không có sản phẩm
    if (!products || products.length === 0) {
        return null;
    }

    return (
        <View style={styles.container}>
            <SectionHeader title="Sản Phẩm Nổi Bật" iconName="star-outline" />

            {/* === THAY ĐỔI 2: Dùng ScrollView và .map() thay thế FlatList === */}
            <ScrollView
                horizontal // Giữ nguyên để cuộn ngang
                showsHorizontalScrollIndicator={false} // Ẩn thanh cuộn
                contentContainerStyle={styles.listContent}
            >
                {/* Render các item bằng .map() */}
                {products.map(item => (
                    <HorizontalProductCard key={item.id.toString()} product={item} />
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.surface,
        paddingBottom: 24,
        marginBottom: 10,
    },
    listContent: {
        paddingHorizontal: 16, // Để item đầu tiên không bị dính sát lề trái
        paddingTop: 8,
    },
});

export default FeaturedProducts;