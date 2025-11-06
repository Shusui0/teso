// backend/src/services/detection.service.ts

import { ViolationReport } from '../models/violation.model';

export const detectViolation = async (image: Express.Multer.File): Promise<ViolationReport> => {
    // Mock detection logic
    const violationType = 'Speeding'; // Example violation type
    const confidenceScore = Math.random(); // Random confidence score for demonstration
    const timestamp = new Date().toISOString();
    const location = { lat: 12.9716, lng: 77.5946 }; // Example coordinates

    return {
        violation_type: violationType,
        confidence_score: confidenceScore,
        timestamp: timestamp,
        location: location,
        image_url: `http://localhost:8000/uploads/${image.filename}`, // Example image URL
    };
};