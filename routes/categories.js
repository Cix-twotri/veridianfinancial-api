// routes/categories.js
import express from 'express';
import { db } from '../connect.js';

const router = express.Router();

// Endpoint to get categories
router.get('/', async (req, res) => {
  try {
    const [categories] = await db.promise().query('SELECT * FROM categories'); // Use .promise()
    res.json(categories);
  } catch (err) {
    console.error('Error fetching categories:', err);
    res.status(500).json({ error: 'Database query failed', details: err.message });
  }
});

export default router;
