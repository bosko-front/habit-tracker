import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { scale, moderateScale, isTablet } from '@/utils/scaling';
import CompletionDonut from './CompletionDonut';
import StreakVisualization from './StreakVisualization';
import MiniSparkline from './MiniSparkline';
import { HabitAnalytics} from "@/types";

interface InsightsCardProps {
    analytics: HabitAnalytics;
    days: 7 | 14;
}

export default function InsightsCard({ analytics, days }: InsightsCardProps) {
    const {
        completionRate,
        currentStreak,
        bestStreak,
        totalCompletions,
        streakData,
        sparklineData
    } = analytics;

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.content}>
                <Text style={[styles.sectionTitle, { fontSize: moderateScale(18) }]}>
                    Insights & Analytics
                </Text>

                {/* Main metrics row */}
                <View style={styles.metricsRow}>
                    <CompletionDonut
                        completionRate={completionRate}
                        totalCompletions={totalCompletions}
                        totalDays={streakData.length}
                    />
                </View>

                {/* Streak visualization */}
                <StreakVisualization
                    streakData={streakData}
                    currentStreak={currentStreak}
                    bestStreak={bestStreak}
                />

                {/* Trend sparkline */}
                <MiniSparkline
                    data={sparklineData}
                    color="#8B5CF6"
                    showTrend={true}
                />

                {/* Quick stats */}
                <View style={styles.quickStats}>
                    <Text style={[styles.quickStatsTitle, { fontSize: moderateScale(16) }]}>
                        Quick Stats
                    </Text>

                    <View style={styles.statsGrid}>
                        <View style={styles.statCard}>
                            <Text style={[styles.statNumber, { fontSize: moderateScale(20) }]}>
                                {totalCompletions}
                            </Text>
                            <Text style={[styles.statDescription, { fontSize: moderateScale(12) }]}>
                                Total Completions
                            </Text>
                        </View>

                        <View style={styles.statCard}>
                            <Text style={[styles.statNumber, { fontSize: moderateScale(20) }]}>
                                {analytics.weeklyAverage.toFixed(1)}
                            </Text>
                            <Text style={[styles.statDescription, { fontSize: moderateScale(12) }]}>
                                Weekly Average
                            </Text>
                        </View>

                        <View style={styles.statCard}>
                            <Text style={[styles.statNumber, { fontSize: moderateScale(20) }]}>
                                {days}
                            </Text>
                            <Text style={[styles.statDescription, { fontSize: moderateScale(12) }]}>
                                Days Tracked
                            </Text>
                        </View>

                        <View style={styles.statCard}>
                            <Text style={[styles.statNumber, { fontSize: moderateScale(20) }]}>
                                {Math.round(sparklineData[sparklineData.length - 1] || 0)}%
                            </Text>
                            <Text style={[styles.statDescription, { fontSize: moderateScale(12) }]}>
                                Recent Rate
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    content: {
        padding: scale(16),
    },
    sectionTitle: {
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: scale(16),
        textAlign: 'center',
    },
    metricsRow: {
        alignItems: 'center',
    },
    quickStats: {
        backgroundColor: '#FFFFFF',
        borderRadius: scale(12),
        padding: scale(16),
        marginTop: scale(8),
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: scale(2),
        },
        shadowOpacity: 0.1,
        shadowRadius: scale(4),
        elevation: 3,
    },
    quickStatsTitle: {
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: scale(12),
        textAlign: 'center',
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: scale(12),
        justifyContent: 'space-between',
    },
    statCard: {
        backgroundColor: '#F9FAFB',
        borderRadius: scale(8),
        padding: scale(12),
        alignItems: 'center',
        minWidth: isTablet ? scale(120) : scale(80),
        flex: 1,
    },
    statNumber: {
        fontWeight: '700',
        color: '#3B82F6',
    },
    statDescription: {
        color: '#6B7280',
        textAlign: 'center',
        marginTop: scale(4),
        lineHeight: moderateScale(16),
    },
});