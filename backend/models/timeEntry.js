import dbPromise from '../db.js';

export async function initTimeEntryTable() {
  const db = await dbPromise;
  await db.run(`
    CREATE TABLE IF NOT EXISTS time_entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      domain TEXT NOT NULL,
      seconds INTEGER NOT NULL,
      date TEXT NOT NULL
    )
  `);
}

export async function addTimeEntry(domain, seconds, date) {
  const db = await dbPromise;
  await db.run(
    'INSERT INTO time_entries (domain, seconds, date) VALUES (?, ?, ?)',
    [domain, seconds, date]
  );
}

export async function getWeeklyAnalytics(startDate, endDate) {
  const db = await dbPromise;
  return db.all(
    `SELECT domain, SUM(seconds) as total_seconds
     FROM time_entries
     WHERE date BETWEEN ? AND ?
     GROUP BY domain
     ORDER BY total_seconds DESC`,
    [startDate, endDate]
  );
} 