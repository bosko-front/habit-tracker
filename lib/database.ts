import * as SQLite from 'expo-sqlite';
import { Habit, HabitLog } from '@/types';

const DATABASE_NAME = 'habits.db';

let db: SQLite.SQLiteDatabase;

export const initializeDatabase = async (): Promise<void> => {
    try {
        db = await SQLite.openDatabaseAsync(DATABASE_NAME);

        // Create tables
        await db.execAsync(`
      CREATE TABLE IF NOT EXISTS habits (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        created_at TEXT NOT NULL
      );
    `);

        await db.execAsync(`
      CREATE TABLE IF NOT EXISTS habit_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        habit_id INTEGER NOT NULL,
        date TEXT NOT NULL,
        status INTEGER NOT NULL,
        FOREIGN KEY (habit_id) REFERENCES habits (id),
        UNIQUE(habit_id, date)
      );
    `);

        console.log('Database initialized successfully');
    } catch (error) {
        console.error('Database initialization failed:', error);
        throw error;
    }
};

export const getDatabase = (): SQLite.SQLiteDatabase => {
    if (!db) {
        throw new Error('Database not initialized. Call initializeDatabase first.');
    }
    return db;
};

// Habit operations
export const createHabit = async (name: string, createdAt?: string): Promise<Habit> => {
    const database = getDatabase();
    const createdAtFinal = createdAt ?? new Date().toISOString();

    // ✅ provjera duplikata (case-insensitive)
    const existing = await database.getFirstAsync(
        'SELECT * FROM habits WHERE LOWER(name) = LOWER(?)',
        [name.trim()]
    );

    if (existing) {
        throw new Error('Already exists.');
    }

    const result = await database.runAsync(
        'INSERT INTO habits (name, created_at) VALUES (?, ?)',
        [name.trim(), createdAtFinal]
    );

    return {
        id: result.lastInsertRowId,
        name: name.trim(),
        created_at: createdAtFinal,
    };
};


export const getAllHabits = async (): Promise<Habit[]> => {
    const database = getDatabase();
    const result = await database.getAllAsync('SELECT * FROM habits ORDER BY created_at DESC');
    return result as Habit[];
};

export const deleteHabit = async (id: number): Promise<void> => {
    const database = getDatabase();
    await database.runAsync('DELETE FROM habits WHERE id = ?', [id]);
    await database.runAsync('DELETE FROM habit_logs WHERE habit_id = ?', [id]);
};

// Habit log operations
export const toggleHabitCompletion = async (habitId: number, date: string): Promise<void> => {
    const database = getDatabase();

    // Check if log exists for this habit and date
    const existingLog = await database.getFirstAsync(
        'SELECT * FROM habit_logs WHERE habit_id = ? AND date = ?',
        [habitId, date]
    ) as HabitLog | null;

    if (existingLog) {
        // Toggle status
        const newStatus = existingLog.status === 1 ? 0 : 1;
        await database.runAsync(
            'UPDATE habit_logs SET status = ? WHERE id = ?',
            [newStatus, existingLog.id]
        );
    } else {
        // Create new log with completed status
        await database.runAsync(
            'INSERT INTO habit_logs (habit_id, date, status) VALUES (?, ?, ?)',
            [habitId, date, 1]
        );
    }
};

export const getHabitLogs = async (habitId: number): Promise<HabitLog[]> => {
    const database = getDatabase();
    const result = await database.getAllAsync(
        'SELECT * FROM habit_logs WHERE habit_id = ? ORDER BY date DESC',
        [habitId]
    );
    return result as HabitLog[];
};

export const getHabitsWithStats = async (): Promise<any[]> => {
    const database = getDatabase();
    const today = new Date().toISOString().split('T')[0];

    const result = await database.getAllAsync(`
        SELECT
            h.id,
            h.name,
            h.created_at,
            COALESCE(stats.total_completions, 0) as total_completions,
            COALESCE(today_log.status, 0) as completed_today,
            COALESCE(streak.current_streak, 0) as current_streak
        FROM habits h
                 LEFT JOIN (
            SELECT
                habit_id,
                COUNT(*) as total_completions
            FROM habit_logs
            WHERE status = 1
            GROUP BY habit_id
        ) stats ON h.id = stats.habit_id
                 LEFT JOIN (
            SELECT
                habit_id,
                status
            FROM habit_logs
            WHERE date = ? AND status = 1
        ) today_log ON h.id = today_log.habit_id
                 LEFT JOIN (
            SELECT
                habit_id,
                COUNT(*) as current_streak
            FROM habit_logs hl1
            WHERE status = 1
              AND NOT EXISTS (
                SELECT 1 FROM habit_logs hl2
                WHERE hl2.habit_id = hl1.habit_id
                  AND hl2.date > hl1.date
                  AND hl2.status = 0
            )
            GROUP BY habit_id
        ) streak ON h.id = streak.habit_id
        ORDER BY h.created_at DESC
    `, [today]);

    return result;
};

export const getTodayDate = (): string => {
    return new Date().toISOString().split('T')[0];
};