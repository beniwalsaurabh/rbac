import express from 'express';
import { getUserRatings } from '../controllers/ratingController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
const router = express.Router();
router.get('/ratings', verifyToken, getUserRatings);
export default router;