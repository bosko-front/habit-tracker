import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, Text as SvgText } from 'react-native-svg';
import Animated, {
    useSharedValue,
    withTiming,
    useAnimatedProps,
    interpolate,
    Easing
} from 'react-native-reanimated';
import { scale, moderateScale } from '@/utils/scaling';

interface DonutChartProps {
    percentage: number;
    size?: number;
    strokeWidth?: number;
    color?: string;
    backgroundColor?: string;
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function DonutChart({
                                       percentage,
                                       size = scale(120),
                                       strokeWidth = scale(8),
                                       color = '#3B82F6',
                                       backgroundColor = '#E5E7EB'
                                   }: DonutChartProps) {
    const animatedValue = useSharedValue(0);

    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;

    useEffect(() => {
        animatedValue.value = withTiming(percentage, {
            duration: 1500,
            easing: Easing.bezier(0.4, 0, 0.2, 1),
        });
    }, [percentage]);

    const animatedProps = useAnimatedProps(() => {
        const strokeDashoffset = interpolate(
            animatedValue.value,
            [0, 100],
            [circumference, 0]
        );

        return {
            strokeDashoffset,
        };
    });

    return (
        <View style={[styles.container, { width: size, height: size }]}>
            <Svg width={size} height={size}>
                {/* Background circle */}
                <Circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={backgroundColor}
                    strokeWidth={strokeWidth}
                    fill="transparent"
                />

                {/* Progress circle */}
                <AnimatedCircle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={color}
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeLinecap="round"
                    transform={`rotate(-90 ${size / 2} ${size / 2})`}
                    animatedProps={animatedProps}
                />
            </Svg>

            {/* Center text */}
            <View style={styles.centerText}>
                <Text style={[styles.percentage, { fontSize: moderateScale(24) }]}>
                    {Math.round(percentage)}%
                </Text>
                <Text style={[styles.label, { fontSize: moderateScale(12) }]}>
                    Complete
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    centerText: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
    },
    percentage: {
        fontWeight: '700',
        color: '#1F2937',
        textAlign: 'center',
    },
    label: {
        color: '#6B7280',
        fontWeight: '500',
        textAlign: 'center',
        marginTop: scale(2),
    },
});