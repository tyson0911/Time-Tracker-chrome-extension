import express from 'express';
import cors from 'cors';
import { initTimeEntryTable, addTimeEntry, getWeeklyAnalytics } from './models/timeEntry.js';

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

// Initialize DB table
initTimeEntryTable();

// POST /api/time { domain, seconds, date }
app.post('/api/time', async (req, res) => {
  const { domain, seconds, date } = req.body;
  if (!domain || !seconds || !date) {
    return res.status(400).json({ error: 'Missing fields' });
  }
  await addTimeEntry(domain, seconds, date);
  res.json({ success: true });
});

// GET /api/analytics/weekly?start=YYYY-MM-DD&end=YYYY-MM-DD
app.get('/api/analytics/weekly', async (req, res) => {
  const { start, end } = req.query;
  if (!start || !end) {
    return res.status(400).json({ error: 'Missing date range' });
  }
  const data = await getWeeklyAnalytics(start, end);
  res.json(data);
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
}); 