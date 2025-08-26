import { Request, Response } from 'express';
import { processImportData } from '../services/importServices';

export const importData = async (req: Request, res: Response) => {
    try {
        const logs = await processImportData(req.body);
        res.status(200).json({ status: 'Import processed', results: logs });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred during the import process.' });
    }
};