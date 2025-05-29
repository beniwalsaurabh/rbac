import connectDB from '../config/db.js';
const db = await connectDB();

export const submitRating = async (req, res) => {
  const { storeId, value } = req.body;
  const userId = req.user.id;
  try {
    const [existing] = await db.execute(
      'SELECT id FROM ratings WHERE user_id = ? AND store_id = ?',
      [userId, storeId]
    );

    if (existing.length) {
      await db.execute('UPDATE ratings SET value = ? WHERE id = ?', [value, existing[0].id]);
      res.json({ message: 'Rating updated' });
    } else {
      await db.execute('INSERT INTO ratings (user_id, store_id, value) VALUES (?, ?, ?)', [userId, storeId, value]);
      res.status(201).json({ message: 'Rating submitted' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getUserRatings = async (req, res) => {
  const userId = req.user.id;
  const [ratings] = await db.execute(
    `SELECT r.*, s.name AS store_name FROM ratings r 
     JOIN stores s ON r.store_id = s.id WHERE r.user_id = ?`,
    [userId]
  );
  res.json(ratings);
};