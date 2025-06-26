import express from 'express';
import { limitAIResumeGeneratorForFree } from '../middleware/resumeScriptMiddleware/featureLimitMiddleware';
import { deleteResumeScript, generateAIResumeFromScratch, getAllResumeScripts, getResumeScriptById, regenerateAIResumeScript, updateResumeScript } from '../controllers/resumeScriptController';
import { restrictTo } from '../middleware/verifyAccessToken';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.use(protect);

router.post('/generate', limitAIResumeGeneratorForFree, generateAIResumeFromScratch);

router.post('/regenerate/:id', restrictTo('premium', 'admin'), regenerateAIResumeScript);

router.get('/', getAllResumeScripts);

router.get('/:id', getResumeScriptById);

router.put('/:id', updateResumeScript);

router.delete('/:id', deleteResumeScript);

export default router;
