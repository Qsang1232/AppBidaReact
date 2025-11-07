import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Colors from '../constants/Colors';

interface ProductTabsProps {
    activeTab: 'Pool' | 'Carom';
    onTabPress: (tab: 'Pool' | 'Carom') => void;
}

const ProductTabs = ({ activeTab, onTabPress }: ProductTabsProps) => {
    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={[styles.tab, activeTab === 'Pool' && styles.activeTab]}
                onPress={() => onTabPress('Pool')}
            >
                <Text style={[styles.tabText, activeTab === 'Pool' && styles.activeTabText]}>Cơ Pool</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.tab, activeTab === 'Carom' && styles.activeTab]}
                onPress={() => onTabPress('Carom')}
            >
                <Text style={[styles.tabText, activeTab === 'Carom' && styles.activeTabText]}>Cơ Carom</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: 16,
    },
    tab: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        marginHorizontal: 8,
        backgroundColor: Colors.surface,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    activeTab: {
        backgroundColor: Colors.primaryLight,
        borderColor: Colors.primaryLight,
    },
    tabText: {
        color: Colors.text,
        fontSize: 16,
        fontWeight: '500',
    },
    activeTabText: {
        color: Colors.text,
        fontWeight: 'bold',
    },
});

export default ProductTabs;