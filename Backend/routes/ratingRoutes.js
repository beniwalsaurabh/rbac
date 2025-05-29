import express from 'express';
import { submitRating, getUserRatings } from '../controllers/ratingController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
const router = express.Router();
router.use(verifyToken);
router.post('/', submitRating);
router.get('/my', getUserRatings);
export default router;