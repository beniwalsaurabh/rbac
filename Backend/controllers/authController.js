import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import connectDB from '../config/db.js';

import {
  isValidEmail,
  isValidPassword,
  isValidName,
  isValidAddress,
  areFieldsPresent
} from '../utils/validators.js';

// ✅ Signup Controller with Validation
export const signup = async (req, res) => {
  const { name, email, address, password } = req.body;

  // Validate required fields
  if (!areFieldsPresent(req.body, ['name', 'email', 'address', 'password'])) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  // Field-specific validations
  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Invalid email format.' });
  }
  if (!isValidPassword(password)) {
    return res.status(400).json({ error: 'Password must be 8–16 characters, include one uppercase letter and one special character.' });
  }
  if (!isValidName(name)) {
    return res.status(400).json({ error: 'Name must be between 20 and 60 characters.' });
  }
  if (!isValidAddress(address)) {
    return res.status(400).json({ error: 'Address must not exceed 400 characters.' });
  }

  try {
    const db = await connectDB();

    // Optional: Check for existing user
    const [existing] = await db.execute('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length) {
      return res.status(409).json({ error: 'Email already registered.' });
    }

    const hashed = await bcrypt.hash(password, 10);
    await db.execute(
      'INSERT INTO users (name, email, address, password) VALUES (?, ?, ?, ?)',
      [name, email, address, hashed]
    );
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Login Controller (no changes needed for validators here)
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const db = await connectDB();
    const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (!rows.length) return res.status(404).json({ message: 'User not found' });

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid password' });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, role: user.role });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
