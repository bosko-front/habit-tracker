import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Calendar, CircleCheck as CheckCircle, Circle as XCircle } from 'lucide-react-native';
import InsightsCard from '@/components/charts/InsightsCard';
import { calculateHabitAnalytics } from '@/utils/habitAnalytics';
import { scale, moderateScale } from '@/utils/scaling';
import {useHabitStore} from "@/stores/habitStore";
import {HabitAnalytics} from "@/types";

// Types matching your Zustand store
interface HabitLog {
    id: number;
    habit_id: number;
    date: string;
    status: number; // 0 = not completed, 1 = completed
}

interface HabitWithStats {
    id: number;
    name: string;
    created_at: string;
    total_completions: number;
    completed_today: boolean;
    current_streak: number;
}


export default function HabitDetailScreen() {
    const { id } = useLocalSearchParams();
    const { habits, habitLogs, loadHabitLogs } = useHabitStore();
    const [habit, setHabit] = useState<HabitWithStats | null>(null);
    const [analytics, setAnalytics] = useState<HabitAnalytics | null>(null);
    const inset = useSafeAreaInsets();
    const [days, setDays] = useState<7 | 14>(7);

    const habitId = parseInt(id as string);

    useEffect(() => {
        const foundHabit = habits.find(h => h.id === habitId);
        setHabit(foundHabit || null);

        if (habitId) {
            loadHabitLogs(habitId);
        }
    }, [habitId, habits]);

    useEffect(() => {
        if (habitId && habitLogs[habitId]) {
            const logs = habitLogs[habitId];
            // Convert status to completed boolean for analytics
            const analyticsLogs = logs.map(log => ({
                ...log,
                completed: log.status === 1,
                created_at: log.date
            }));
            const calculatedAnalytics = calculateHabitAnalytics(analyticsLogs, days);
            setAnalytics(calculatedAnalytics);
        }
    }, [habitId, habitLogs, days]);

    const logs = habitLogs[habitId] || [];

    const renderLogItem = ({ item }: { item: HabitLog }) => (
        <View style={styles.logItem}>
            <View style={styles.logIcon}>
                {item.status === 1 ? (
                    <CheckCircle size={scale(20)} color="#10B981" />
                ) : (
                    <XCircle size={scale(20)} color="#EF4444" />
                )}
            </View>
            <View style={styles.logContent}>
                <Text style={[styles.logDate, { fontSize: moderateScale(14) }]}>
                    {new Date(item.date).toLocaleDateString('sr-RS', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}
                </Text>
                <Text style={[styles.logStatus, { fontSize: moderateScale(12) }]}>
                    {item.status === 1 ? 'Done' : 'Skipped'}
                </Text>
            </View>
        </View>
    );

    if (!habit) {
        return (
            <View style={styles.loadingContainer}>
                <LinearGradient
                    colors={['#3B82F6', '#1D4ED8']}
                    style={[styles.header, { paddingTop: inset.top + 20 }]}
                >
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={styles.backButton}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <ArrowLeft size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                    <View style={styles.headerContent}>
                        <Text style={styles.headerTitle}>Loading...</Text>
                    </View>
                </LinearGradient>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#3B82F6', '#1D4ED8']}
                style={[styles.header, { paddingTop: inset.top + 20 }]}
            >
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={styles.backButton}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <ArrowLeft size={24} color="#FFFFFF" />
                </TouchableOpacity>
                <View style={styles.headerContent}>
                    <Text style={styles.headerTitle}>{habit.name}</Text>
                    <Text style={styles.headerSubtitle}>
                        Created at {new Date(habit.created_at).toLocaleDateString('sr-RS')}
                    </Text>
                </View>
            </LinearGradient>

            {analytics && (
                <InsightsCard
                    analytics={analytics}
                    days={days}
                />
            )}

            <View style={styles.historyContainer}>
                <Text style={[styles.historyTitle, { fontSize: moderateScale(18) }]}>
                   Activity history
                </Text>

                {logs.length === 0 ? (
                    <View style={styles.emptyHistory}>
                        <Calendar size={48} color="#D1D5DB" />
                        <Text style={[styles.emptyHistoryText, { fontSize: moderateScale(16) }]}>
                            No activity history yet.
                        </Text>
                    </View>
                ) : (
                    <FlatList
                        data={logs}
                        renderItem={renderLogItem}
                        keyExtractor={(item) => item.id.toString()}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.logsList}
                    />
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    loadingContainer: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: scale(16),
        paddingBottom: scale(20),
    },
    backButton: {
        padding: scale(8),
        borderRadius: scale(8),
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    headerContent: {
        flex: 1,
        marginLeft: scale(12),
    },
    headerTitle: {
        fontSize: moderateScale(24),
        fontWeight: '700',
        color: '#FFFFFF',
    },
    headerSubtitle: {
        fontSize: moderateScale(14),
        color: 'rgba(255, 255, 255, 0.8)',
        marginTop: scale(4),
    },
    historyContainer: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        marginTop: scale(16),
        marginHorizontal: scale(16),
        borderRadius: scale(12),
        padding: scale(16),
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: scale(2),
        },
        shadowOpacity: 0.1,
        shadowRadius: scale(4),
        elevation: 3,
    },
    historyTitle: {
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: scale(16),
    },
    emptyHistory: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: scale(40),
    },
    emptyHistoryText: {
        color: '#6B7280',
        marginTop: scale(12),
        textAlign: 'center',
    },
    logsList: {
        paddingBottom: scale(20),
    },
    logItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: scale(12),
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    logIcon: {
        marginRight: scale(12),
    },
    logContent: {
        flex: 1,
    },
    logDate: {
        fontWeight: '600',
        color: '#1F2937',
    },
    logStatus: {
        color: '#6B7280',
        marginTop: scale(2),
    },
});