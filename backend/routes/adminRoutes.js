import express from 'express';
import { getApplicants, approveApplicant, rejectApplicant, verifyQR } from '../controllers/adminController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';

const router = express.Router();

router.get('/applicants', authMiddleware, getApplicants);
router.post('/approve/:id', authMiddleware, roleMiddleware.requireAdmin, approveApplicant);
router.post('/reject/:id', authMiddleware, roleMiddleware.requireAdmin, rejectApplicant);
router.get('/verify-qr/:id', authMiddleware, roleMiddleware.requireAdmin, verifyQR);

export default router;