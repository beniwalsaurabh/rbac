import connectDB from '../config/db.js';
import bcrypt from 'bcrypt';
import {
  isValidEmail,
  isValidPassword,
  isValidName,
  isValidAddress,
  isValidRole,
  areFieldsPresent
} from '../utils/validators.js';

export const getAdminStats = async (req, res) => {
  try {
    const db = await connectDB();
    const [[{ userCount }]] = await db.execute('SELECT COUNT(*) AS userCount FROM users');
    const [[{ storeCount }]] = await db.execute('SELECT COUNT(*) AS storeCount FROM stores');
    const [[{ ratingCount }]] = await db.execute('SELECT COUNT(*) AS ratingCount FROM ratings');
    res.json({ userCount, storeCount, ratingCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Create User with validation
export const createUser = async (req, res) => {
  const { name, email, password, address, role } = req.body;

  // Validate required fields
  if (!areFieldsPresent(req.body, ['name', 'email', 'password', 'address', 'role'])) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  if (!isValidName(name)) return res.status(400).json({ error: 'Name must be 20–60 characters.' });
  if (!isValidEmail(email)) return res.status(400).json({ error: 'Invalid email format.' });
  if (!isValidPassword(password)) return res.status(400).json({ error: 'Password must be 8–16 characters, include one uppercase and one special character.' });
  if (!isValidAddress(address)) return res.status(400).json({ error: 'Address must be up to 400 characters.' });
  if (!isValidRole(role)) return res.status(400).json({ error: 'Invalid user role.' });

  try {
    const db = await connectDB();

    // Optional: check if email exists
    const [existing] = await db.execute('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(409).json({ error: 'Email already exists.' });
    }

    const hash = await bcrypt.hash(password, 10);
    await db.execute(
      'INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)',
      [name, email, hash, address, role]
    );
    res.status(201).json({ message: 'User created' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Create Store with validation
export const createStore = async (req, res) => {
  const { name, email, address } = req.body;

  if (!areFieldsPresent(req.body, ['name', 'email', 'address'])) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  //if (!isValidName(name)) return res.status(400).json({ error: 'Store name must be 20–60 characters.' });
  if (!isValidEmail(email)) return res.status(400).json({ error: 'Invalid email format.' });
  if (!isValidAddress(address)) return res.status(400).json({ error: 'Address must be up to 400 characters.' });

  try {
    const db = await connectDB();
    await db.execute('INSERT INTO stores (name, email, address) VALUES (?, ?, ?)', [name, email, address]);
    res.status(201).json({ message: 'Store created' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get all users
export const listUsers = async (req, res) => {
  try {
    const db = await connectDB();
    const [users] = await db.execute('SELECT id, name, email, address, role FROM users');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get all stores with average rating
export const listStores = async (req, res) => {
  try {
    const db = await connectDB();
    const [stores] = await db.execute(`
      SELECT s.*, (SELECT ROUND(AVG(r.value), 1) FROM ratings r WHERE r.store_id = s.id) AS average_rating
      FROM stores s
    `);
    res.json(stores);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
