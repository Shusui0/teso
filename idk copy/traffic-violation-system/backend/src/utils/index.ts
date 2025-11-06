// backend/src/utils/index.ts

export const extractGPSFromImage = (image: File): Promise<{ lat: number; lng: number }> => {
    // Mock implementation for extracting GPS data from an image
    return new Promise((resolve) => {
        const mockGPSData = { lat: 12.9716, lng: 77.5946 }; // Example coordinates
        resolve(mockGPSData);
    });
};

export const formatViolationReport = (report: any): string => {
    return `Violation Type: ${report.violation_type}, Time: ${new Date(report.timestamp).toLocaleString()}, Confidence: ${(report.confidence_score * 100).toFixed(2)}%`;
};