import express from 'express';
import cors from 'cors';
import helmet from 'helmet'; // Security
import compression from 'compression';
import cookieParser from 'cookie-parser';

import AppError from './utils/appError.js';
import errorHandler from './middlewares/errorHandler.mid.js';
import httpLogger from './utils/httpLogger.js';
import appRouter from './routes/app.router.js';
import hookRouter from './routes/hook.router.js';
import cardRouter from './routes/card.router.js';

import type { Request, Response, NextFunction } from 'express';
// -----------------------------------------------------------------------
// -----------------------------------------------------------------------

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

  const apiRoute = '/api'; // or '/api/v1'

  const app = express();

  app.use(httpLogger); // uses Morgan Middleware for logging HTTP requests


  // enable ONLY if your website is running behind a proxy (e.g. allows to check on "X-Forwarded-Proto" header)
  app.enable('trust proxy');
  // Implement CORS to allow other domains to request our API
  app.use(cors()); // Acess-Control-Allow-Origin *

  //set Security HTTP headers
  app.use(helmet());

  // handle cookies (for authentication from web browser)
  app.use(cookieParser());

  //Body parser, reading data from body into req.body (with size limit of 10 kb)
  app.use(express.json({ limit: '10kb' }));
  // Url-Encoded Form Parser
  app.use(express.urlencoded({ extended: true, limit: '10kb' }));

  //Prevent paramter pollution (duplicate parameters in the query string)
  // app.use(hpp({whitelist: ['duration',],}));
  // The middleware will attempt to compress response bodies ,
  // except when response has "Cache-Control" header with "no-transform" directive.
  app.use(compression());

  // **** Routes ****
  // app.use('/api/users', userRouter);
  app.use(`${apiRoute}`, appRouter);
  app.use(`${apiRoute}/hooks`, hookRouter);
  app.use(`${apiRoute}/cards`,cardRouter);

  // A midleware to handle ALL other (undefined) routes
  app.all('*', (req: Request, res: Response, next: NextFunction) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
  });

  // Error Handling Middleware:
  app.use(errorHandler);

export default app;
