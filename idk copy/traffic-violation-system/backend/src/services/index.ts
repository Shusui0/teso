import { detectionService } from '../services/detection.service';

export const violationService = {
  detectViolation: async (file) => {
    return await detectionService.detect(file);
  },
  // Additional service functions can be added here
};