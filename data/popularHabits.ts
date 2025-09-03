// data/popularHabits.ts
export type PopularHabit = { id: string; label: string; value: string };

export const POPULAR_HABITS: PopularHabit[] = [
    {id: 'read', label: '📚 Reading', value: 'Reading'},
    {id: 'workout', label: '💪 Morning Exercise', value: 'Morning Exercise'},
    {id: 'meditate', label: '🧘 10 min Meditation', value: '10 min Meditation'},
    {id: 'water', label: '💧 8 glass of water', value: '8 glass of water'},
    {id: 'journal', label: '✍️ Writing Journal', value: 'Writing Journal'},
];
