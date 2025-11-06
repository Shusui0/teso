import { Router } from 'express';
import { uploadViolationImage, getViolationReports } from '../controllers';

const router = Router();

router.post('/upload', uploadViolationImage);
router.get('/reports', getViolationReports);

export default router;