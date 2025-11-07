import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Colors from '../constants/Colors';

interface SectionHeaderProps {
    title: string;
    iconName: React.ComponentProps<typeof Ionicons>['name'];
    onPressSeeAll?: () => void;
}

const SectionHeader = ({ title, iconName, onPressSeeAll }: SectionHeaderProps) => {
    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Ionicons name={iconName} size={20} color={Colors.primary} />
                <Text style={styles.title}>{title}</Text>
            </View>
            <TouchableOpacity onPress={onPressSeeAll}>
                <Text style={styles.seeAll}>Xem tất cả</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 24,
        paddingBottom: 12,
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.text,
        marginLeft: 8,
    },
    seeAll: {
        fontSize: 14,
        color: Colors.primary,
        fontWeight: '500',
    },
});

export default SectionHeader;   