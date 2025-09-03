import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import DonutChart from './DonutChart';
import { scale, moderateScale, isTablet } from '@/utils/scaling';

interface CompletionDonutProps {
    completionRate: number;
    totalCompletions: number;
    totalDays: number;
}

export default function CompletionDonut({
                                            completionRate,
                                            totalCompletions,
                                            totalDays
                                        }: CompletionDonutProps) {
    const chartSize = isTablet ? scale(140) : scale(120);

    return (
        <View style={styles.container}>
            <Text style={[styles.title, { fontSize: moderateScale(16) }]}>
                Overall Progress
            </Text>

            <View style={styles.chartContainer}>
                <DonutChart
                    percentage={completionRate}
                    size={chartSize}
                    strokeWidth={scale(10)}
                    color="#3B82F6"
                    backgroundColor="#E5E7EB"
                />
            </View>

            <View style={styles.statsContainer}>
                <View style={styles.statRow}>
                    <Text style={[styles.statLabel, { fontSize: moderateScale(12) }]}>
                        Completed Days
                    </Text>
                    <Text style={[styles.statValue, { fontSize: moderateScale(14) }]}>
                        {totalCompletions} / {totalDays}
                    </Text>
                </View>

                <View style={styles.statRow}>
                    <Text style={[styles.statLabel, { fontSize: moderateScale(12) }]}>
                        Success Rate
                    </Text>
                    <Text style={[styles.statValue, { fontSize: moderateScale(14) }]}>
                        {Math.round(completionRate)}%
                    </Text>
                </View>
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
    title: {
        fontWeight: '600',
        color: '#1F2937',
        textAlign: 'center',
        marginBottom: scale(16),
    },
    chartContainer: {
        alignItems: 'center',
        marginBottom: scale(16),
    },
    statsContainer: {
        gap: scale(8),
    },
    statRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    statLabel: {
        color: '#6B7280',
        fontWeight: '500',
    },
    statValue: {
        color: '#1F2937',
        fontWeight: '600',
    },
});