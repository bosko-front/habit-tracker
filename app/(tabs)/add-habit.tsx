import React, {useState} from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    KeyboardAvoidingView,
    Platform,
    FlatList,
    ScrollView,
} from 'react-native';
import {useRouter} from 'expo-router';
import {LinearGradient} from 'expo-linear-gradient';
import {Check} from 'lucide-react-native';
import {useHabitStore} from '@/stores/habitStore';
import {useSafeAreaInsets} from "react-native-safe-area-context";
import PopularHabitsList from "@/components/PopularHabitsList";
import MyHabits from "@/components/myHabits";

import {isTablet, moderateScale, scale, verticalScale} from "@/utils/scaling";
import ReminderCard from "@/components/reminderCard";

type ListHeaderProps = {
    error: string | null;
    clearError: () => void;
    habitName: string;
    setHabitName: (s: string) => void;
    handlePickPopular: (s: string) => void;
};

const ListHeader = React.memo(function ListHeader({
    error,
    clearError,
    habitName,
    setHabitName,
    handlePickPopular,
}: ListHeaderProps) {
    return (
        <View style={styles.content}>
            {error && (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity onPress={clearError} style={styles.errorButton}>
                        <Text style={styles.errorButtonText}>Close</Text>
                    </TouchableOpacity>
                </View>
            )}

            <View style={styles.form}>
                <Text style={styles.label}>Habit name</Text>
                <TextInput
                    style={styles.input}
                    value={habitName}
                    onChangeText={setHabitName}
                    placeholder="Reading, exercise, meditation etc."
                    placeholderTextColor="#9CA3AF"
                    autoFocus
                    maxLength={50}
                />
                <Text style={styles.characterCount}>{habitName.length}/50 characters</Text>
            </View>

            <ReminderCard />
            <PopularHabitsList onPick={handlePickPopular} />
        </View>
    );
});

export default function AddHabitScreen() {
    const [habitName, setHabitName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();
    const inset = useSafeAreaInsets();
    const {addHabit, error, clearError} = useHabitStore();
    const handlePickPopular = (v: string) => setHabitName(v);


    const onChangeHabitName = React.useCallback(setHabitName, []);


    const handleSubmit = async () => {
        if (!habitName.trim()) {
            Alert.alert('Error', 'Please enter a habit name before adding it.');
            return;
        }

        if (habitName.trim().length < 3) {
            Alert.alert('Error', 'Habit name must be at least 3 characters long.');
            return;
        }

        try {
            setIsSubmitting(true);
            clearError();
            await addHabit(habitName);

            Alert.alert(
                'Success',
                'Habit added successfully! You can now track your progress and complete it on the Home screen!',
                [
                    {
                        text: 'OK',
                        onPress: () => {
                            setHabitName('');
                            router.push('/(tabs)');
                        },
                    },
                ]
            );
        } catch (error: any) {
            if (error.code === 'DUPLICATE') {
                Alert.alert('Error', error.message);
            } else {
                console.error('Failed to add habit:', error);
                Alert.alert('Error', 'Something went wrong. Please try again later.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <View style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={styles.keyboardView}
            >
                <LinearGradient
                    colors={['#10B981', '#059669']}
                    style={[styles.header, { paddingTop: inset.top + verticalScale(20) }]}
                >
                    <Text style={styles.headerTitle}>Add New Habit</Text>
                    <Text style={styles.headerSubtitle}>Create positive routines</Text>
                </LinearGradient>

                <ScrollView
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: verticalScale(80) }}
                >
                    <ListHeader
                        error={error}
                        clearError={clearError}
                        habitName={habitName}
                        setHabitName={setHabitName}
                        handlePickPopular={handlePickPopular}
                    />

                    <MyHabits onPick={(name) => setHabitName(name)} />
                </ScrollView>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={[
                            styles.submitButton,
                            (!habitName.trim() || isSubmitting) && styles.submitButtonDisabled,
                        ]}
                        onPress={handleSubmit}
                        disabled={!habitName.trim() || isSubmitting}
                    >
                        <LinearGradient
                            colors={
                                !habitName.trim() || isSubmitting
                                    ? ['#D1D5DB', '#9CA3AF']
                                    : ['#10B981', '#059669']
                            }
                            style={styles.submitButtonGradient}>
                            <Check size={scale(20)} color="#FFFFFF"/>
                            <Text style={styles.submitButtonText}>
                                {isSubmitting ? 'Adding...' : 'Add Habit'}
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </View>
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F4F6',
        alignSelf: 'center',
        width: '100%'
    },
    keyboardView: {flex: 1},
    header: {
        paddingHorizontal: scale(20),
        paddingVertical: verticalScale(30)
    },
    headerTitle: {
        fontSize: moderateScale(28),
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: verticalScale(4),
    },
    headerSubtitle: {
        fontSize: moderateScale(16),
        color: '#A7F3D0'
    },
    scroll: {flex: 1},
    content: {
        flex: 1,
        padding: scale(20),
        paddingHorizontal: isTablet ? scale(20) : scale(20)
    },
    errorContainer: {
        backgroundColor: '#FEE2E2',
        padding: scale(12),
        borderRadius: scale(8),
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: verticalScale(20),
    },
    errorText: {
        color: '#DC2626',
        fontSize: moderateScale(14),
        flex: 1
    },
    errorButton: {padding: scale(4)},
    errorButtonText: {
        color: '#DC2626',
        fontWeight: '600',
        fontSize: moderateScale(14)
    },
    form: {marginBottom: verticalScale(30)},
    label: {
        fontSize: moderateScale(16),
        fontWeight: '600',
        color: '#374151',
        marginBottom: verticalScale(8)
    },
    input: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: scale(12),
        paddingHorizontal: scale(16),
        paddingVertical: verticalScale(12),
        fontSize: moderateScale(16),
        color: '#374151',
        minHeight: verticalScale(48)
    },
    characterCount: {
        fontSize: moderateScale(12),
        color: '#9CA3AF',
        textAlign: 'right',
        marginTop: verticalScale(4),
    },
    reminderCard: {
        marginTop: verticalScale(20),
        backgroundColor: '#FFF',
        borderRadius: scale(12),
        padding: scale(16),
        marginBottom: verticalScale(20),
    },
    reminderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    reminderTitle: {
        fontSize: moderateScale(16),
        fontWeight: '600',
        color: '#374151'
    },
    reminderTime: {
        marginTop: verticalScale(12),
        paddingBottom: verticalScale(12)
    },
    reminderTimeLabel: {
        fontSize: moderateScale(14),
        color: '#6B7280',
        marginBottom: verticalScale(6)
    },
    reminderSaveBtn: {
        marginTop: verticalScale(12),
        backgroundColor: '#10B981',
        borderRadius: scale(10),
        paddingVertical: verticalScale(10),
        alignItems: 'center',
    },
    reminderSaveText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: moderateScale(14)
    },
    buttonContainer: {
        padding: scale(20),
        paddingBottom: verticalScale(20),
        paddingHorizontal: scale(20)
    },
    submitButton: {
        borderRadius: scale(12),
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: verticalScale(2)},
        shadowOpacity: 0.1,
        shadowRadius: scale(4),
    },
    submitButtonDisabled: {elevation: 0, shadowOpacity: 0},
    submitButtonGradient: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        paddingVertical: verticalScale(16),
        borderRadius: scale(12),
        gap: scale(8),
    },
    submitButtonText: {
        color: '#FFFFFF',
        fontSize: moderateScale(16),
        fontWeight: '600'
    },
    reminderRow: {
        marginTop: verticalScale(12),
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    reminderTimeText: {
        fontSize: moderateScale(14),
        opacity: 0.9
    },
    changeBtn: {
        fontSize: moderateScale(14),
        textDecorationLine: "underline"
    },
});

