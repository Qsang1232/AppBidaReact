import { Image } from 'expo-image';
import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { BidaCue } from '../api/BidaAPI'; // Import BidaCue
import Colors from '../constants/Colors';
import SectionHeader from './SectionHeader';

// Component giờ sẽ nhận props là một mảng các logo
const BrandLogos = ({ brands }: { brands: BidaCue[] }) => {
    // Nếu không có logo nào thì không hiển thị khu vực này
    if (!brands || brands.length === 0) {
        return null;
    }

    return (
        <View style={styles.container}>
            <SectionHeader title="Thương Hiệu Nổi Bật" iconName="bookmark-outline" />
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollViewContent}
            >
                {/* Lặp qua mảng brands được truyền vào từ props */}
                {brands.map((brand) => (
                    <TouchableOpacity key={brand.id} style={styles.logoContainer}>
                        <Image
                            source={{ uri: brand.image }}
                            style={styles.logo}
                            contentFit="contain"
                            transition={300}
                        />
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.surface,
        paddingBottom: 16,
        marginBottom: 10,
    },
    scrollViewContent: {
        paddingHorizontal: 16,
        paddingTop: 8,
    },
    logoContainer: {
        width: 100,
        height: 60,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: Colors.border,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
        backgroundColor: '#fff',
    },
    logo: {
        width: '80%',
        height: '80%',
    },
});

export default BrandLogos;