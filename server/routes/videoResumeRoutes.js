import express from 'express';
import { protect } from '../middleware/authMiddleware';
import { restrictTo } from '../middleware/verifyAccessToken';
import { deleteVideoResume, generateVideoResume, getAllVideoResumes, getVideoResumeById } from '../controllers/videoResumeController';

const router = express.Router();

// 🔐 Protect all routes (requires login)
router.use(protect);

// 💼 Restrict all video resume features to premium or admin users only
router.use(restrictTo('premium', 'admin'));

router.post('/generate', generateVideoResume);
router.get('/', getAllVideoResumes);
router.get('/:id', getVideoResumeById);
router.delete('/:id', deleteVideoResume);

export default router;
