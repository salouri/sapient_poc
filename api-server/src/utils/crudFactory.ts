import AppError from '../utils/appError.js';
import { cacheMe } from '../utils/cache.js';

import type { Request, Response, NextFunction } from 'express';

class CRUD {
  Model: any;
  constructor(myModel: any) {
    this.Model = myModel;
  }

  createOne =
    (cacheIt: boolean, key: string) =>
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = await this.Model.query().insert(req.body);
        // cache new record if cacheIt is true
        const record = { ...req.body, id: result.id };
        if (cacheIt) cacheMe(key, record);

        const modelName = this.Model.tableName.slice(0, -1); // e.g. cards => card
        res.status(201).json({
          status: 'success',
          data: {
            [modelName]: record,
          },
        });
      } catch (err) {
        next(err);
      }
    };

  createOrUpdate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const modelName = this.Model.getTableName().slice(0, -1);
      let operation: string;
      let record: any;
      let statusCode: number;
      if (req.params?.id) {
        operation = 'update';
        const id = req.params.id;
        const record = await this.Model.query().findOne({ id });
        if (!record) {
          return next(new AppError('Record not found', 404));
        }
        await this.Model.query().patchAndFetchById(id, req.body);
        statusCode = 200;
      } else {
        operation = 'create';
        record = await this.Model.query().insert(req.body);
        statusCode = 201;
      }
      res.status(statusCode).json({
        status: 'success',
        data: {
          [modelName]: record,
          operation,
        },
      });
    } catch (err) {
      next(err);
    }
  };

  getOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const modelName = this.Model.getTableName().slice(0, -1);
      const record = await this.Model.query().findById(req.params.id);
      if (!record) {
        return next(new AppError(`No ${modelName} found with that ID`, 404));
      }

      res.status(200).json({
        status: 'success',
        data: {
          [modelName]: record,
        },
      });
    } catch (err) {
      next(err);
    }
  };

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tableName = this.Model.getTableName();

      const records = await this.Model.query();
      // SEND RESULTS
      res.status(200).json({
        status: 'success',
        results: records.length,
        data: {
          [tableName]: records,
        },
      });
    } catch (err) {
      next(err);
    }
  };

  updateOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const modelName = this.Model.getTableName().slice(0, -1);
      const record = await this.Model.query().updateAndFetchById(
        req.params.id,
        req.body
      );
      if (!record) {
        return next(new AppError(`No ${modelName} found with that ID`, 404));
      }

      res.status(200).json({
        status: 'success',
        data: {
          [modelName]: record,
        },
      });
    } catch (err) {
      next(err);
    }
  };

  deleteOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const modelName = this.Model.getTableName().slice(0, -1);
      const record = await this.Model.query().deleteById(req.params.id);

      if (!record) {
        return next(new AppError(`No ${modelName} found with that ID`, 404));
      }

      res.status(204).json({
        status: 'success',
        data: null,
      });
    } catch (err) {
      next(err);
    }
  };
}

export default CRUD;
