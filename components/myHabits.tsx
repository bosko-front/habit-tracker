import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import { useHabitStore } from '@/stores/habitStore';
import { scale, verticalScale, moderateScale } from '@/utils/scaling';
import { HabitWithStats } from '@/types';

export default function MyHabits({
                                     onPick,
                                 }: {
    onPick?: (value: string) => void;
    maxHeight?: number;
}) {
    const { habits } = useHabitStore();
    const router = useRouter();

    const goToDetails = (habitId: number) => {
        router.push(`/habit-detail?id=${habitId}`);
    };

    return (
        <View style={styles.card}>
            <Text style={styles.title}>Your habits</Text>

            {habits.length === 0 ? (
                <Text style={styles.empty}> No saved habits. </Text>
            ) : (
                <FlatList
                    data={habits}
                    keyExtractor={(item) => String(item.id)}
                    scrollEnabled={false}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                        paddingTop: verticalScale(6),
                        paddingBottom: verticalScale(8)
                    }}
                    style={{ flexGrow: 1 }}
                    ItemSeparatorComponent={() => (
                        <View style={{ height: verticalScale(8) }} />
                    )}
                    renderItem={({ item }: { item: HabitWithStats }) => (
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => goToDetails(item.id)}
                            onLongPress={() => onPick?.(item.name)}
                            hitSlop={{
                                top: scale(6),
                                bottom: scale(6),
                                left: scale(6),
                                right: scale(6)
                            }}
                            style={styles.item}
                        >
                            <View style={{ flex: 1, marginRight: scale(12) }}>
                                <Text style={styles.name} numberOfLines={1}>
                                    {item.name}
                                </Text>
                                <Text style={styles.date}>
                                    {new Date(item.created_at).toLocaleDateString('sr-RS')}
                                </Text>
                            </View>
                            <ChevronRight size={scale(18)} color="#9CA3AF" />
                        </TouchableOpacity>
                    )}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: scale(12),
        padding: scale(16),
        marginTop: verticalScale(8),
        marginHorizontal:  scale(16),
    },
    title: {
        fontSize: moderateScale(16),
        fontWeight: '600',
        color: '#374151',
        marginBottom: verticalScale(8),
    },
    empty: {
        color: '#6B7280',
        fontSize: moderateScale(13),
        textAlign: 'center',
        paddingVertical: verticalScale(20)
    },
    item: {
        backgroundColor: '#F9FAFB',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: scale(10),
        paddingVertical: verticalScale(10),
        paddingHorizontal: scale(12),
        flexDirection: 'row',
        alignItems: 'center',
        minHeight: verticalScale(56),
    },
    name: {
        color: '#111827',
        fontWeight: '600',
        fontSize: moderateScale(15)
    },
    date: {
        color: '#6B7280',
        fontSize: moderateScale(12),
        marginTop: verticalScale(2)
    },
});