Sure, here's the contents for the file: /traffic-violation-system/traffic-violation-system/backend/src/routes/violation.routes.ts

import { Router } from 'express';
import { uploadViolationImage, getViolationReports } from '../controllers/violation.controller';

const router = Router();

router.post('/upload', uploadViolationImage);
router.get('/reports', getViolationReports);

export default router;