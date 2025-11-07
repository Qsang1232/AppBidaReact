import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import Colors from '../constants/Colors';

interface CategoryFiltersProps {
    categories: string[];
    activeCategory: string;
    onSelectCategory: (category: string) => void;
}

const CategoryFilters = ({ categories, activeCategory, onSelectCategory }: CategoryFiltersProps) => {
    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.container}
        >
            {categories.map((category) => (
                <TouchableOpacity
                    key={category}
                    style={[
                        styles.chip,
                        activeCategory === category ? styles.activeChip : styles.inactiveChip,
                    ]}
                    onPress={() => onSelectCategory(category)}
                >
                    <Text style={activeCategory === category ? styles.activeChipText : styles.inactiveChipText}>
                        {category}
                    </Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    chip: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        marginRight: 10,
        borderWidth: 1,
    },
    activeChip: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    inactiveChip: {
        backgroundColor: Colors.surface,
        borderColor: Colors.border,
    },
    activeChipText: {
        color: Colors.surface,
        fontWeight: 'bold',
    },
    inactiveChipText: {
        color: Colors.text,
    },
});

export default CategoryFilters;