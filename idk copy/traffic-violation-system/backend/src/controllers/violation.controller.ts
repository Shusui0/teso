import { Request, Response } from 'express';
import { ViolationReport } from '../models/violation.model';
import { detectViolation } from '../services/detection.service';

// Function to handle image upload and violation detection
export const uploadViolationImage = async (req: Request, res: Response) => {
    try {
        const file = req.file;
        if (!file) {
            return res.status(400).json({ message: 'No file uploaded.' });
        }

        const violationData = await detectViolation(file);
        const violationReport = new ViolationReport(violationData);
        await violationReport.save();

        res.status(201).json(violationReport);
    } catch (error) {
        res.status(500).json({ message: 'Error processing the file.', error });
    }
};

// Function to retrieve all violation reports
export const getViolationReports = async (req: Request, res: Response) => {
    try {
        const reports = await ViolationReport.find();
        res.status(200).json(reports);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving violation reports.', error });
    }
};