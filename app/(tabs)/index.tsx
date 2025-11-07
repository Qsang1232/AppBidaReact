import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { BidaCue, getBidaCues } from '../../api/BidaAPI';
import Colors from '../../constants/Colors';

import FeaturedProducts from '../../components/FeaturedProducts';
import ImageCarousel from '../../components/ImageCarousel';
import ProductCard from '../../components/ProductCard';
import ProductTabs from '../../components/ProductTabs';
import SearchBar from '../../components/SearchBar';
import SectionHeader from '../../components/SectionHeader';

export default function HomeScreen() {
    const [allProducts, setAllProducts] = useState<BidaCue[]>([]);
    const [banners, setBanners] = useState<BidaCue[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState<'Pool' | 'Carom'>('Pool');

    useEffect(() => {
        const fetchAllData = async () => {
            const allData = await getBidaCues();
            setBanners(allData.filter(item => item.type === 'Banner'));
            setAllProducts(allData.filter(item => item.type === 'Pool' || item.type === 'Carom'));
            setIsLoading(false);
        };
        fetchAllData();
    }, []);

    // Sử dụng useMemo để chỉ tính toán lại danh sách khi cần thiết
    const filteredProducts = useMemo(() => {
        return allProducts.filter(p =>
            p.type === activeTab &&
            p.name.toLowerCase().includes(searchQuery.trim().toLowerCase())
        );
    }, [allProducts, activeTab, searchQuery]);

    const featuredProducts = useMemo(() => allProducts.slice(0, 6), [allProducts]);

    if (isLoading) {
        return (
            <View style={styles.loader}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        );
    }

    // Tách Header ra để tối ưu hóa
    const ListHeader = () => (
        <>
            <ImageCarousel banners={banners} />
            <FeaturedProducts products={featuredProducts} />
            <SectionHeader title="Tất Cả Sản Phẩm" iconName="grid-outline" />
            <ProductTabs activeTab={activeTab} onTabPress={setActiveTab} />
        </>
    );

    return (
        <View style={styles.container}>
            {/* SearchBar nằm ngoài FlatList */}
            <SearchBar value={searchQuery} onChangeText={setSearchQuery} />

            <FlatList
                ListHeaderComponent={<ListHeader />}
                data={filteredProducts}
                renderItem={({ item }) => <ProductCard product={item} />}
                keyExtractor={(item) => item.id.toString()}
                numColumns={2}
                contentContainerStyle={styles.listContainer}
                ListEmptyComponent={() => (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>Không tìm thấy sản phẩm nào</Text>
                    </View>
                )}
                keyboardShouldPersistTaps="handled"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    listContainer: { paddingHorizontal: 8, paddingBottom: 20 },
    emptyContainer: { height: 200, justifyContent: 'center', alignItems: 'center' },
    emptyText: { fontSize: 16, color: Colors.textSecondary },
});