// reminderStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { scheduleDailyReminder, disableDailyReminder} from "@/lib/notifications";

type State = { enabled: boolean; hour: number; minute: number };

type Actions = {
    setEnabled: (v: boolean) => void;
    setTime: (h: number, m: number) => void;
};

export const useReminderStore = create<State & Actions>()(
    persist(
        (set, get) => ({
            enabled: false,
            hour: 20,
            minute: 0,
            setEnabled: (v) => set({ enabled: v }),
            setTime: (h, m) => set({ hour: h, minute: m }),
        }),
        {
            name: "reminder-settings-v1",
            storage: createJSONStorage(() => AsyncStorage),
            // After state is rehydrated, (re)schedule if needed
            onRehydrateStorage: () => (state) => {
                if (!state) return;
                const { enabled, hour, minute } = state;
                if (enabled) scheduleDailyReminder(hour, minute).catch(() => {});
                else disableDailyReminder().catch(() => {});
            },
        }
    )
);
