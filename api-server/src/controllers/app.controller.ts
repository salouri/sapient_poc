import db from '../utils/database/index.js';

import type { Request, Response } from 'express';

export const heartBeat = (req: Request, res: Response) => {
  res.status(200).send('OK');
};

export const healthCheck = async (req: Request, res: Response) => {
  const response = await db.raw('SELECT NOW()');

  if (!response) {
    return res.status(404).send('Database connection failed');
  }

  return res.status(200).send('OK');
};
