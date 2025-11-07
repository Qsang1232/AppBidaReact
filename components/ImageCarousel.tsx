import { Image } from 'expo-image';
import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { BidaCue } from '../api/BidaAPI';

const { width } = Dimensions.get('window');

function ImageCarousel({ banners }: { banners: BidaCue[] }) {
    if (!banners || banners.length === 0) {
        return null;
    }

    return (
        <View style={styles.container}>
            <Carousel
                loop
                width={width}
                // === THAY ĐỔI Ở ĐÂY: Giảm chiều cao của banner ===
                // Tỷ lệ 16:9 hoặc tương tự sẽ đẹp hơn
                height={width / 1.8}
                autoPlay={true}
                autoPlayInterval={3000}
                data={banners}
                scrollAnimationDuration={1000}
                renderItem={({ item }) => (
                    <Image
                        style={styles.image}
                        source={item.image}
                        contentFit="cover"
                        transition={300}
                    />
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        // Có thể thêm hiệu ứng đổ bóng nhẹ cho banner
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    image: {
        width: '100%',
        height: '100%',
    },
});

export default ImageCarousel;