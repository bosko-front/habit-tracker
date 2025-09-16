import React, { useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Check, Trash2, TrendingUp } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useHabitStore } from '@/stores/habitStore';
import { initializeDatabase } from '@/lib/database';
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {moderateScale, scale} from "@/utils/scaling";
import { HabitWithStats } from '@/types';

export default function HomeScreen() {
    const router = useRouter();
    const {
        habits,
        isLoading,
        error,
        loadHabits,
        toggleHabit,
        removeHabit,
        clearError
    } = useHabitStore();

    const inset = useSafeAreaInsets();


    useEffect(() => {
        const setup = async () => {
            try {
                await initializeDatabase();
                await loadHabits();
            } catch (error) {
                console.error('Setup failed:', error);
            }
        };
        setup();
    }, []);

    const handleToggleHabit = async (habitId: number) => {
        await toggleHabit(habitId);
    };

    const handleDeleteHabit = (habitId: number, habitName: string) => {
        Alert.alert(
            'Delete Habit',
            `Are you sure you want to delete habit "${habitName}"?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => removeHabit(habitId),
                },
            ]
        );
    };

    const handleHabitPress = (habitId: number) => {
        router.push(`/habit-detail?id=${habitId}`);
    };

    const renderHabitItem = ({ item }: { item: HabitWithStats }) => (
        <TouchableOpacity
            style={styles.habitCard}
            onPress={() => handleHabitPress(item.id)}
            activeOpacity={0.7}>
            <LinearGradient
                colors={['#FFFFFF', '#F9FAFB']}
                style={styles.habitCardGradient}>
                <View style={styles.habitHeader}>
                    <Text style={[styles.habitName, { fontSize: moderateScale(18) }]}>{item.name}</Text>
                    <TouchableOpacity
                        onPress={() => handleDeleteHabit(item.id, item.name)}
                        style={styles.deleteButton}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                        <Trash2 size={scale(18)} color="#EF4444" />
                    </TouchableOpacity>
                </View>

                <View style={styles.habitStats}>
                    <View style={styles.statItem}>
                        <TrendingUp size={scale(16)} color="#10B981" />
                        <Text style={[styles.statText, { fontSize: moderateScale(14) }]}>{item.total_completions} times</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={[styles.streakText, { fontSize: moderateScale(14) }]}>🔥 {item.current_streak}</Text>
                    </View>
                </View>

                <TouchableOpacity
                    style={[
                        styles.completeButton,
                        item.completed_today && styles.completedButton,
                    ]}
                    onPress={() => handleToggleHabit(item.id)}>
                    <Check
                        size={scale(20)}
                        color={item.completed_today ? '#FFFFFF' : '#10B981'}
                    />
                    <Text style={[
                        styles.completeButtonText,
                        { fontSize: moderateScale(16) },
                        item.completed_today && styles.completedButtonText,
                    ]}>
                        {item.completed_today ? 'Done today' : 'Mark as done'}
                    </Text>
                </TouchableOpacity>
            </LinearGradient>
        </TouchableOpacity>
    );
    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#3B82F6', '#1D4ED8']}
                style={[styles.header, { paddingTop: inset.top + scale(20) }]}>
                <Text style={[styles.headerTitle, { fontSize: moderateScale(28) }]}>My Habits</Text>
                <Text style={[styles.headerSubtitle, { fontSize: moderateScale(16) }]}>
                    {habits.length} {habits.length === 1 ? 'habit' : 'habits'}
                </Text>
            </LinearGradient>

            {error && (
                <View style={styles.errorContainer}>
                    <Text style={[styles.errorText, { fontSize: moderateScale(14) }]}>{error}</Text>
                    <TouchableOpacity onPress={clearError} style={styles.errorButton}>
                        <Text style={[styles.errorButtonText, { fontSize: moderateScale(14) }]}>Close</Text>
                    </TouchableOpacity>
                </View>
            )}

            {habits.length === 0 && !isLoading ? (
                <View style={styles.emptyState}>
                    <Text style={[styles.emptyTitle, { fontSize: moderateScale(24) }]}>No habits</Text>
                    <Text style={[styles.emptyText, { fontSize: moderateScale(16) }]}>
                        Add your first routine using the &#34;Add" button at the bottom.
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={habits}
                    renderItem={renderHabitItem}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.habitsList}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F4F6',
    },
    header: {
        paddingHorizontal: scale(20),
        paddingVertical: scale(30),
    },
    headerTitle: {
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: scale(4),
    },
    headerSubtitle: {
        color: '#BFDBFE',
    },
    errorContainer: {
        backgroundColor: '#FEE2E2',
        margin: scale(16),
        padding: scale(12),
        borderRadius: scale(8),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    errorText: {
        color: '#DC2626',
        flex: 1,
    },
    errorButton: {
        padding: scale(4),
    },
    errorButtonText: {
        color: '#DC2626',
        fontWeight: '600',
    },
    habitsList: {
        padding: scale(16),
    },
    habitCard: {
        marginBottom: scale(12),
        borderRadius: scale(12),
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: scale(1) },
        shadowOpacity: 0.1,
        shadowRadius: scale(3),
    },
    habitCardGradient: {
        padding: scale(16),
        borderRadius: scale(12),
    },
    habitHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: scale(12),
    },
    habitName: {
        fontWeight: '600',
        color: '#1F2937',
        flex: 1,
    },
    deleteButton: {
        padding: scale(4),
    },
    habitStats: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: scale(16),
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(6),
    },
    statText: {
        color: '#6B7280',
        fontWeight: '500',
    },
    streakText: {
        fontWeight: '600',
        color: '#F97316',
    },
    completeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F0FDF4',
        borderColor: '#10B981',
        borderWidth: 1,
        borderRadius: scale(8),
        paddingVertical: scale(12),
        paddingHorizontal: scale(16),
        gap: scale(8),
    },
    completedButton: {
        backgroundColor: '#10B981',
        borderColor: '#10B981',
    },
    completeButtonText: {
        fontWeight: '600',
        color: '#10B981',
    },
    completedButtonText: {
        color: '#FFFFFF',
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: scale(40),
    },
    emptyTitle: {
        fontWeight: 'bold',
        color: '#374151',
        marginBottom: scale(12),
    },
    emptyText: {
        color: '#6B7280',
        textAlign: 'center',
        lineHeight: moderateScale(24),
    },
});