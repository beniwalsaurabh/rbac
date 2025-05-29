import express from 'express';
import {
  getAdminStats,
  createUser,
  createStore,
  listUsers,
  listStores
} from '../controllers/adminController.js';
import { verifyToken, isAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();
router.use(verifyToken, isAdmin);
router.get('/stats', getAdminStats);
router.post('/create-user', createUser);
router.post('/create-store', createStore);
router.get('/users/:id', listUsers);
router.get('/stores/:id', listStores);
export default router;
