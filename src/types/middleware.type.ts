import type { Request, Response, NextFunction } from 'express';

type MidwareFunction = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

export default MidwareFunction;
