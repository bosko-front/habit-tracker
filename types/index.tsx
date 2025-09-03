export interface Habit {
    id: number;
    name: string;
    created_at: string;
}


export interface HabitWithStats {
    id: number;
    name: string;
    created_at: string;
    total_completions: number;
    completed_today: boolean;
    current_streak: number;
}

export interface HabitLog {
    id: number;
    habit_id: number;
    date: string;
    status: number; // 0 = not completed, 1 = completed
    created_at: string;
}

export interface HabitAnalytics {
    completionRate: number;
    currentStreak: number;
    bestStreak: number;
    totalCompletions: number;
    weeklyAverage: number;
    monthlyAverage: number;
    streakData: { date: string; completed: boolean }[];
    sparklineData: number[];
}
