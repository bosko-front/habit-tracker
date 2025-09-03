import { create } from 'zustand';
import { HabitLog, HabitWithStats } from '@/types';
import {
    createHabit,
    deleteHabit,
    toggleHabitCompletion,
    getHabitLogs,
    getHabitsWithStats,
    getTodayDate,
} from '@/lib/database';

interface HabitStore {
    habits: HabitWithStats[];
    habitLogs: { [habitId: number]: HabitLog[] };
    isLoading: boolean;
    error: string | null;

    // Actions
    loadHabits: () => Promise<void>;
    addHabit: (name: string) => Promise<void>;
    removeHabit: (id: number) => Promise<void>;
    toggleHabit: (habitId: number) => Promise<void>;
    loadHabitLogs: (habitId: number) => Promise<void>;
    setError: (error: string | null) => void;
    clearError: () => void;
}

export const useHabitStore = create<HabitStore>((set, get) => ({
    habits: [],
    habitLogs: {},
    isLoading: false,
    error: null,

    loadHabits: async () => {
        try {
            set({ isLoading: true, error: null });
            const habits = await getHabitsWithStats();
            set({ habits, isLoading: false });
        } catch (error) {
            console.error('Failed to load habits:', error);
            set({
                error: 'Failed to load habits. Please try again.',
                isLoading: false
            });
        }
    },

    addHabit: async (name: string) => {
        try {
            set({ isLoading: true, error: null });
            await createHabit(name.trim());
            await get().loadHabits();
        } catch (error:any) {
            if (error.message.includes('Already exists')) {
                throw { code: 'DUPLICATE', message: 'Habit already exists.' };
            }
            set({
                error: 'Failed to add habit. Please try again.',
                isLoading: false
            });
            throw error;
        }
    },

    removeHabit: async (id: number) => {
        try {
            set({ isLoading: true, error: null });
            await deleteHabit(id);
            await get().loadHabits();
        } catch (error) {
            console.error('Failed to delete habit:', error);
            set({
                error: 'Failed to delete habit. Please try again.',
                isLoading: false
            });
        }
    },

    toggleHabit: async (habitId: number) => {
        try {
            const today = getTodayDate();
            await toggleHabitCompletion(habitId, today);
            await get().loadHabits();
        } catch (error) {
            console.error('Failed to toggle habit:', error);
            set({ error: 'Failed to update habit. Please try again.' });
        }
    },

    loadHabitLogs: async (habitId: number) => {
        try {
            const logs = await getHabitLogs(habitId);
            set(state => ({
                habitLogs: {
                    ...state.habitLogs,
                    [habitId]: logs,
                }
            }));
        } catch (error) {
            console.error('Failed to load habit logs:', error);
            set({ error: 'Failed to load habit history. Please try again.' });
        }
    },

    setError: (error: string | null) => set({ error }),
    clearError: () => set({ error: null }),
}));