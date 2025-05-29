import connectDB from '../config/db.js';
import { isValidRating } from '../utils/validators.js';

export const getAllStores = async (req, res) => {
  try {
    const db = await connectDB();
    const [stores] = await db.execute(
      `SELECT s.*, 
              ROUND(AVG(r.value), 1) AS avg_rating
       FROM stores s
       LEFT JOIN ratings r ON s.id = r.store_id
       GROUP BY s.id`
    );
    res.json(stores);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getStoreRatings = async (req, res) => {
  const ownerId = req.user?.id;

  try {
    const db = await connectDB();

    
    const [storeOwner] = await db.execute(
      'SELECT id FROM users WHERE id = ? AND role = "store_owner"',
      [ownerId]
    );
    if (!storeOwner.length) {
      return res.status(403).json({ message: 'Only store owners can access this data.' });
    }

    
    const [ratings] = await db.execute(
      `SELECT u.name AS user_name, r.value 
       FROM ratings r 
       JOIN users u ON r.user_id = u.id 
       WHERE r.store_id IN (
         SELECT id FROM stores WHERE email = (SELECT email FROM users WHERE id = ?)
       )`,
      [ownerId]
    );

    
    const [[{ avg_rating }]] = await db.execute(
      `SELECT ROUND(AVG(value), 1) AS avg_rating 
       FROM ratings 
       WHERE store_id IN (
         SELECT id FROM stores WHERE email = (SELECT email FROM users WHERE id = ?)
       )`,
      [ownerId]
    );

    res.json({ ratings, avg_rating });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
