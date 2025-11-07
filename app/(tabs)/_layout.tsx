import { Ionicons } from '@expo/vector-icons';
import { Link, Tabs } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Colors from '../../constants/Colors';
import { useCart } from '../../context/CartContext'; // Đường dẫn đúng

// Component header tùy chỉnh
const CustomHeaderTitle = () => (
    <View style={styles.headerTitleContainer}>
        <Ionicons name="game-controller" size={24} color={Colors.text} />
        <Text style={styles.headerTitleText}>XBILLIARD</Text>
    </View>
);

export default function TabLayout() {
    const { cartItems } = useCart();
    const cartBadge = cartItems.reduce((sum: any, item: { quantity: any; }) => sum + item.quantity, 0);

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colors.primaryLight,
                tabBarInactiveTintColor: Colors.textSecondary,
                tabBarStyle: {
                    backgroundColor: '#000',
                    borderTopColor: Colors.border,
                },
                headerStyle: {
                    backgroundColor: Colors.primary,
                },
                headerTintColor: Colors.text,
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Gậy Bi-a',
                    headerTitle: () => <CustomHeaderTitle />,
                    tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />,
                    headerRight: () => (
                        <Link href="/cart" asChild>
                            <Pressable style={{ marginRight: 15 }}>
                                <Ionicons
                                    name="cart"
                                    size={28}
                                    color={Colors.text}
                                />
                                {cartBadge > 0 && (
                                    <View style={styles.badgeContainer}>
                                        <Text style={styles.badgeText}>{cartBadge}</Text>
                                    </View>
                                )}
                            </Pressable>
                        </Link>
                    ),
                }}
            />
            <Tabs.Screen
                name="cart"
                options={{
                    href: null, // Ẩn tab này khỏi Tab Bar
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Tài Khoản',
                    headerTitle: 'Tài Khoản',
                    tabBarIcon: ({ color, size }) => <Ionicons name="person" size={size} color={color} />,
                }}
            />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    headerTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerTitleText: {
        color: Colors.text,
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 8,
        letterSpacing: 1,
    },
    badgeContainer: {
        position: 'absolute', right: -8, top: -4,
        backgroundColor: Colors.text, borderRadius: 10,
        width: 20, height: 20,
        justifyContent: 'center', alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.primary,
    },
    badgeText: {
        color: Colors.primary,
        fontWeight: 'bold',
        fontSize: 12,
    },
});