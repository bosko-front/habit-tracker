import {HabitAnalytics, HabitLog} from "@/types";

export function calculateHabitAnalytics(logs: HabitLog[], days: 7 | 14 = 7): HabitAnalytics {
    if (!logs || logs.length === 0) {
        return {
            completionRate: 0,
            currentStreak: 0,
            bestStreak: 0,
            totalCompletions: 0,
            weeklyAverage: 0,
            monthlyAverage: 0,
            streakData: [],
            sparklineData: []
        };
    }

    // Sort logs by date (newest first)
    const sortedLogs = [...logs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Calculate completion rate
    const completedLogs = sortedLogs.filter(log => log.status === 1);
    const completionRate = (completedLogs.length / sortedLogs.length) * 100;

    // Calculate streaks
    let currentStreak = 0;
    let bestStreak = 0;
    let tempStreak = 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Calculate current streak (from today backwards)
    for (let i = 0; i < days; i++) {
        const checkDate = new Date(today);
        checkDate.setDate(today.getDate() - i);
        const dateStr = checkDate.toISOString().split('T')[0];

        const dayLog = sortedLogs.find(log => log.date === dateStr);
        if (dayLog && dayLog.status === 1) {
            if (i === 0 || currentStreak > 0) {
                currentStreak++;
            }
        } else {
            break;
        }
    }

    // Calculate best streak
    for (const log of sortedLogs) {
        if (log.status === 1) {
            tempStreak++;
            bestStreak = Math.max(bestStreak, tempStreak);
        } else {
            tempStreak = 0;
        }
    }

    // Generate streak data for visualization (last N days)
    const streakData = [];
    for (let i = days - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];

        const dayLog = sortedLogs.find(log => log.date === dateStr);
        streakData.push({
            date: dateStr,
            completed: dayLog ? dayLog.status === 1 : false
        });
    }

    // Generate sparkline data (7-day rolling completion rate)
    const sparklineData = [];
    for (let i = days - 1; i >= 0; i--) {
        const endDate = new Date(today);
        endDate.setDate(today.getDate() - i);

        let weeklyCompleted = 0;
        for (let j = 0; j < 7; j++) {
            const checkDate = new Date(endDate);
            checkDate.setDate(endDate.getDate() - j);
            const dateStr = checkDate.toISOString().split('T')[0];

            const dayLog = sortedLogs.find(log => log.date === dateStr);
            if (dayLog && dayLog.status === 1) {
                weeklyCompleted++;
            }
        }

        sparklineData.push((weeklyCompleted / 7) * 100);
    }

    // Calculate averages
    const weeklyAverage = completedLogs.length > 0 ? (completedLogs.length / Math.ceil(sortedLogs.length / 7)) : 0;
    const monthlyAverage = completedLogs.length > 0 ? (completedLogs.length / Math.ceil(sortedLogs.length / 30)) : 0;

    return {
        completionRate,
        currentStreak,
        bestStreak,
        totalCompletions: completedLogs.length,
        weeklyAverage,
        monthlyAverage,
        streakData,
        sparklineData
    };
}
export const NO_DATE_LABEL = 'No date available';

const parseDate = (input?: string | Date | null): Date | null => {
    if (!input) return null;
    if (input instanceof Date) return isNaN(input.getTime()) ? null : input;

    const s = String(input).trim();
    if (!s) return null;

    // Handle plain YYYY-MM-DD as UTC to avoid TZ shifts
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
    if (m) {
        const [, y, mo, d] = m;
        const dt = new Date(Date.UTC(+y, +mo - 1, +d));
        return isNaN(dt.getTime()) ? null : dt;
    }

    const dt = new Date(s);
    return isNaN(dt.getTime()) ? null : dt;
};

export function formatDate(
    dateLike?: string | Date | null,
    opts?: { locale?: string; fallback?: string }
): string {
    const { locale = 'en-US', fallback = NO_DATE_LABEL } = opts || {};
    const date = parseDate(dateLike);
    if (!date) return fallback;

    return date.toLocaleDateString(locale, {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
    });
}

export function getDateLabel(
    dateLike?: string | Date | null,
    opts?: { locale?: string; fallback?: string }
): string {
    const { locale = 'en-US', fallback = NO_DATE_LABEL } = opts || {};
    const date = parseDate(dateLike);
    if (!date) return fallback;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const d = new Date(date);
    d.setHours(0, 0, 0, 0);

    const dayMs = 24 * 60 * 60 * 1000;
    const diffDays = Math.round((today.getTime() - d.getTime()) / dayMs);

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays > 1 && diffDays < 7) return `${diffDays}d ago`;
    if (diffDays === -1) return 'Tomorrow';
    if (diffDays < -1 && diffDays > -7) return `in ${Math.abs(diffDays)}d`;

    return formatDate(date, { locale, fallback });
}