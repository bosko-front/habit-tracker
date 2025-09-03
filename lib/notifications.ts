import * as Notifications from 'expo-notifications';
import {Platform} from "react-native";




export async function scheduleDailyReminder(hour = 20, minute = 0) {
    // optional: avoid duplicates
    await Notifications.cancelAllScheduledNotificationsAsync();

    const trigger: Notifications.DailyTriggerInput = {
        hour,
        minute,
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        ...(Platform.OS === "android" ? { channelId: "habits" } : {}),
    };

    const id = await Notifications.scheduleNotificationAsync({
        content: {
            title: "Habit reminder",
            body: "Don't forget to complete your daily habits 💪",
            sound: "default",
        },
        trigger,
    });


    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
}

export async function disableDailyReminder() {
    await Notifications.cancelAllScheduledNotificationsAsync();

}
