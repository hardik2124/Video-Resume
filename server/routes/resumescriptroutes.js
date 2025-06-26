import express from 'express';
import {
  generateAIResumeFromScratch,
  regenerateAIResumeScript,
  getAllResumeScripts,
  getResumeScriptById,
  updateResumeScript,
  deleteResumeScript
} from '../controllers/resumeScriptController.js';
import { protect } from '../middleware/authMiddleware.js';
import { restrictTo } from '../middleware/verifyAccessToken.js';
import { limitAIResumeGeneratorForFree } from '../middleware/resumeScriptMiddleware/featureLimitMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/generate', limitAIResumeGeneratorForFree, generateAIResumeFromScratch);
router.post('/regenerate/:id', restrictTo('premium', 'admin'), regenerateAIResumeScript);
router.get('/', getAllResumeScripts);
router.get('/:id', getResumeScriptById);
router.put('/:id', updateResumeScript);
router.delete('/:id', deleteResumeScript);

export default router;