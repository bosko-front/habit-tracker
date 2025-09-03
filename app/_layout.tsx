import { Stack} from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {Platform} from "react-native";
import * as Notifications from 'expo-notifications';
import {useEffect} from "react";


export default function RootLayout() {

    useEffect(() => {
        // default ponašanje: prikaži alert kada notifikacija stigne
        Notifications.setNotificationHandler({
            handleNotification: async () => ({
                shouldShowBanner: true,
                shouldShowList: true,
                shouldPlaySound: false,
                shouldSetBadge: false,
            }),
        });

        // traži permissione
        const askPermissions = async () => {
            const { status } = await Notifications.getPermissionsAsync();
            if (status !== 'granted') {
                await Notifications.requestPermissionsAsync();
            }

            // Android: napravi kanal (obavezno za notifikacije)
            if (Platform.OS === "android") {
                await Notifications.setNotificationChannelAsync("habits", {
                    name: "Habits",
                    importance: Notifications.AndroidImportance.HIGH,
                });
            }
        };

        askPermissions();
    }, []);



    return (
        <>
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="habit-detail" options={{ headerShown: false }} />
                <Stack.Screen name="+not-found" />
            </Stack>
            <StatusBar style="auto" />
        </>
    );
}