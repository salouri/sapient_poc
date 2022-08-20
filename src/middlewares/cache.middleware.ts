import type { Request, Response, NextFunction } from 'express';

// this middleware takes in a redis client and check if object/record exists in the cache
export const checkCache =
  (client: any, key: string) =>
  async (req: Request, res: Response, next: NextFunction) => {
    // if "id" is present in the request, then check if it exists in the "key" object in the cache
    try {
        if(!req.params?.id) return next();

        const id = req.params.id;
        const myKey = `${key}_${id}`;

        const existingRecord = await client.get(myKey);
        if(!existingRecord) return next();

        res.status(200).json({
          status: 'success',
          data: {
            [myKey]: JSON.parse(existingRecord || '{}'),
          },
        });
    } catch (err) {
      next(err);
    }
  };
