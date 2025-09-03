import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { scale, verticalScale, moderateScale, isTablet } from '@/utils/scaling';
import {POPULAR_HABITS} from "@/data/popularHabits";


export default function PopularHabitsList({
                                              onPick,
                                              horizontal = true,
                                          }: {
    onPick: (value: string) => void;
    horizontal?: boolean;
}) {
    return (
        <View style={styles.card}>
            <Text style={styles.title}>Popular Habits</Text>
            <FlatList
                data={POPULAR_HABITS}
                keyExtractor={(item) => item.id}
                horizontal={horizontal}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={horizontal ? styles.listH : undefined}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.chip}
                        onPress={() => onPick(item.value)}
                        hitSlop={{
                            top: scale(6),
                            bottom: scale(6),
                            left: scale(6),
                            right: scale(6)
                        }}
                    >
                        <Text style={styles.chipText}>{item.label}</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: scale(12),
        paddingVertical: verticalScale(14),
        paddingHorizontal: scale(16),
        marginBottom: verticalScale(16),
        // marginHorizontal: isTablet ? 0 : scale(16),
    },
    title: {
        fontSize: moderateScale(16),
        fontWeight: '600',
        color: '#374151',
        marginBottom: verticalScale(10),
    },
    listH: {
        paddingRight: scale(4),
        gap: scale(8),
    },
    chip: {
        backgroundColor: '#F3F4F6',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        paddingHorizontal: scale(12),
        paddingVertical: verticalScale(8),
        borderRadius: scale(999),
        marginRight: scale(8),
        minHeight: verticalScale(36),
        justifyContent: 'center',
    },
    chipText: {
        fontSize: moderateScale(13),
        color: '#374151',
        fontWeight: '500',
    },
});