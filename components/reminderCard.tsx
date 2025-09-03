import React, { useMemo, useState} from "react";
import {View, Text, Switch, TouchableOpacity, StyleSheet} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";

import {disableDailyReminder, scheduleDailyReminder} from "@/lib/notifications";
import {useReminderStore} from "@/stores/reminderStore";
import { moderateScale, scale, verticalScale} from "@/utils/scaling";


export default function ReminderCard() {
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const {enabled: reminderEnabled, hour, minute, setEnabled, setTime} = useReminderStore();


    const showDatePicker = () => setDatePickerVisibility(true);

    const hideDatePicker = () => setDatePickerVisibility(false);
    const formatTime = (d: Date) =>
        new Intl.DateTimeFormat(undefined, {hour: "2-digit", minute: "2-digit", hour12: false}).format(d);

    const handleConfirm = async (date: Date) => {
        hideDatePicker();
        setTime(date.getHours(), date.getMinutes());

        try {
            await scheduleDailyReminder(date.getHours(), date.getMinutes());
        } catch (e) {
            console.warn("Failed to schedule", e);
        }


    };



    const onToggle = async (value: boolean) => {
        setEnabled(value);

        if (value) {
            try {
                await scheduleDailyReminder(hour, minute);
            } catch (e) {
                console.warn("Failed to schedule", e);
            }
        } else {
            try {
                await disableDailyReminder();
            } catch (e) {
                console.warn("Failed to disable", e);
            }
        }
    };

    const reminderTime = useMemo(() => {
        const d = new Date();
        d.setHours(hour, minute, 0, 0);
        return d;
    }, [hour, minute]);


    return (
        <View style={styles.reminderCard}>
            <View style={styles.reminderHeader}>
                <Text style={styles.reminderTitle}>Dnevni podsetnik</Text>
                <Switch
                    value={reminderEnabled}
                    onValueChange={onToggle}
                />
            </View>

            {reminderEnabled && (
                <View style={styles.reminderRow}>
                    <Text style={styles.reminderTimeText}>
                        Remind me at {formatTime(reminderTime)}
                    </Text>
                    <TouchableOpacity onPress={showDatePicker}>
                        <Text style={styles.changeBtn}>Change</Text>
                    </TouchableOpacity>
                </View>
            )}

            <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="time"
                is24Hour
                pickerContainerStyleIOS={{
                    alignSelf: "center",
                    width: 360,
                    borderRadius: 16,
                    overflow: "hidden",
                    backgroundColor: "#fff",
                }}
                date={reminderTime}
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
            />
        </View>
    );
}

const styles = StyleSheet.create({
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

})