import { Request, Response } from "express";
import Log from "../models/log";

// Save a new log
export const createLog = async (req: Request, res: Response) => {
  try {
    const log = await Log.create(req.body);
    res.status(201).json(log);
  } catch (err: any) {
    res.status(500).json({ message: "Failed to save log", error: err.message });
  }
};

// Get all logs (admin only)
export const getLogs = async (_req: Request, res: Response) => {
  try {
    const logs = await Log.find().sort({ timestamp: -1 });
    res.json(logs);
  } catch (err: any) {
    res
      .status(500)
      .json({ message: "Failed to fetch logs", error: err.message });
  }
};

// Delete ALL logs (optional)
export const deleteLogs = async (_req: Request, res: Response) => {
  try {
    await Log.deleteMany({});
    res.json({ message: "All logs cleared" });
  } catch (err: any) {
    res
      .status(500)
      .json({ message: "Failed to clear logs", error: err.message });
  }
};
