import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import Colors from '../constants/Colors';

const SearchBar = ({ value, onChangeText }: { value: string, onChangeText: (text: string) => void }) => {
    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Tìm sản phẩm..."
                placeholderTextColor={Colors.textSecondary}
                value={value}
                onChangeText={onChangeText}
            />
            <Ionicons name="search" size={20} color={Colors.textSecondary} style={styles.icon} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.surface,
        borderRadius: 8,
        marginHorizontal: 16,
        marginTop: 16,
        marginBottom: 8,
    },
    input: { flex: 1, height: 48, fontSize: 16, color: Colors.text, paddingHorizontal: 15 },
    icon: { marginRight: 15 },
});

export default SearchBar;