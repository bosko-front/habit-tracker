import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { scale, moderateScale, isTablet } from '@/utils/scaling';
import { getDateLabel } from '@/utils/habitAnalytics';

interface StreakData {
    date: string;
    completed: boolean;
}

interface StreakVisualizationProps {
    streakData: StreakData[];
    currentStreak: number;
    bestStreak: number;
}

export default function StreakVisualization({
                                                streakData,
                                                currentStreak,
                                                bestStreak
                                            }: StreakVisualizationProps) {
    const tileSize = isTablet ? scale(32) : scale(28);
    const tileSpacing = scale(4);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={[styles.title, { fontSize: moderateScale(16) }]}>
                    Daily Pattern
                </Text>
                <View style={styles.streakStats}>
                    <View style={styles.statItem}>
                        <Text style={[styles.statValue, { fontSize: moderateScale(14) }]}>
                            {currentStreak}
                        </Text>
                        <Text style={[styles.statLabel, { fontSize: moderateScale(11) }]}>
                            Current
                        </Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={[styles.statValue, { fontSize: moderateScale(14) }]}>
                            {bestStreak}
                        </Text>
                        <Text style={[styles.statLabel, { fontSize: moderateScale(11) }]}>
                            Best
                        </Text>
                    </View>
                </View>
            </View>

            <View style={styles.streakGrid}>
                {streakData.map((day, index) => (
                    <View
                        key={day.date}
                        style={[
                            styles.dayTile,
                            {
                                width: tileSize,
                                height: tileSize,
                                marginRight: index < streakData.length - 1 ? tileSpacing : 0,
                                backgroundColor: day.completed ? '#10B981' : '#F3F4F6',
                            }
                        ]}
                    >
                        <Text style={[
                            styles.dayLabel,
                            {
                                fontSize: moderateScale(9),
                                color: day.completed ? '#FFFFFF' : '#9CA3AF'
                            }
                        ]}>
                            {new Date(day.date).getDate()}
                        </Text>
                    </View>
                ))}
            </View>

            <View style={styles.dateLabels}>
                <Text style={[styles.dateLabel, { fontSize: moderateScale(10) }]}>
                    {getDateLabel(streakData[0]?.date)}
                </Text>
                <Text style={[styles.dateLabel, { fontSize: moderateScale(10) }]}>
                    {getDateLabel(streakData[streakData.length - 1]?.date)}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        borderRadius: scale(12),
        padding: scale(16),
        marginVertical: scale(8),
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: scale(2),
        },
        shadowOpacity: 0.1,
        shadowRadius: scale(4),
        elevation: 3,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: scale(12),
    },
    title: {
        fontWeight: '600',
        color: '#1F2937',
    },
    streakStats: {
        flexDirection: 'row',
        gap: scale(16),
    },
    statItem: {
        alignItems: 'center',
    },
    statValue: {
        fontWeight: '700',
        color: '#3B82F6',
    },
    statLabel: {
        color: '#6B7280',
        marginTop: scale(2),
    },
    streakGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: scale(8),
    },
    dayTile: {
        borderRadius: scale(6),
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    dayLabel: {
        fontWeight: '600',
    },
    dateLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: scale(4),
    },
    dateLabel: {
        color: '#9CA3AF',
        fontWeight: '500',
    },
});