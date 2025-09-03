import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Polyline } from 'react-native-svg';
import Animated, {
    useSharedValue,
    withTiming,
    useAnimatedStyle,
    Easing
} from 'react-native-reanimated';
import { scale, moderateScale, isTablet } from '@/utils/scaling';

interface MiniSparklineProps {
    data: number[];
    color?: string;
    height?: number;
    width?: number;
    showTrend?: boolean;
}

export default function MiniSparkline({
                                          data,
                                          color = '#8B5CF6',
                                          height = scale(60),
                                          width = isTablet ? scale(200) : scale(160),
                                          showTrend = true
                                      }: MiniSparklineProps) {
    const animatedValue = useSharedValue(0);

    useEffect(() => {
        animatedValue.value = withTiming(1, {
            duration: 1200,
            easing: Easing.bezier(0.4, 0, 0.2, 1),
        });
    }, [data]);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: animatedValue.value,
        transform: [{ scaleX: animatedValue.value }],
    }));

    if (!data || data.length === 0) {
        return (
            <View style={[styles.container, { height, width }]}>
                <Text style={[styles.noData, { fontSize: moderateScale(12) }]}>
                    No data available
                </Text>
            </View>
        );
    }

    const maxValue = Math.max(...data, 1);
    const minValue = Math.min(...data, 0);
    const range = maxValue - minValue || 1;

    // Create points for the polyline
    const points = data.map((value, index) => {
        const x = (index / (data.length - 1)) * width;
        const y = height - ((value - minValue) / range) * height;
        return `${x},${y}`;
    }).join(' ');

    // Calculate trend
    const firstValue = data[0] || 0;
    const lastValue = data[data.length - 1] || 0;
    const trend = lastValue - firstValue;
    const trendDirection = trend > 0 ? '↗' : trend < 0 ? '↘' : '→';
    const trendColor = trend > 0 ? '#10B981' : trend < 0 ? '#EF4444' : '#6B7280';

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={[styles.title, { fontSize: moderateScale(16) }]}>
                    7-Day Trend
                </Text>
                {showTrend && (
                    <View style={styles.trendIndicator}>
                        <Text style={[
                            styles.trendIcon,
                            { fontSize: moderateScale(14), color: trendColor }
                        ]}>
                            {trendDirection}
                        </Text>
                        <Text style={[
                            styles.trendValue,
                            { fontSize: moderateScale(12), color: trendColor }
                        ]}>
                            {Math.abs(trend).toFixed(1)}%
                        </Text>
                    </View>
                )}
            </View>

            <Animated.View style={[{ height, width }, animatedStyle]}>
                <Svg height={height} width={width}>
                    <Polyline
                        points={points}
                        fill="none"
                        stroke={color}
                        strokeWidth={scale(2.5)}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </Svg>
            </Animated.View>

            <View style={styles.footer}>
                <Text style={[styles.footerText, { fontSize: moderateScale(10) }]}>
                    Rolling average completion rate
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
    trendIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(4),
    },
    trendIcon: {
        fontWeight: '700',
    },
    trendValue: {
        fontWeight: '600',
    },
    footer: {
        marginTop: scale(8),
    },
    footerText: {
        color: '#9CA3AF',
        textAlign: 'center',
    },
    noData: {
        color: '#9CA3AF',
        textAlign: 'center',
        fontStyle: 'italic',
    },
});