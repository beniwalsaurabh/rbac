import express from 'express';
import { getAllStores, getStoreRatings } from '../controllers/storeController.js';
import { verifyToken, isStoreOwner } from '../middlewares/authMiddleware.js';
const router = express.Router();
router.get('/', getAllStores);
router.get('/owner', verifyToken, isStoreOwner, getStoreRatings);
export default router;