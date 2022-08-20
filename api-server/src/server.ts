import os from 'os';
import cluster from 'cluster';

import app from './app.js';
import getEnvVar from './utils/getEnvVar.js';
import logger from './utils/logger.js';
import getServerError from './utils/serverError.js';
import { checkDbConnection } from './utils/database/index.js';
// import { checkDbConnection } from './utils/database/index.js';

// -----------------------------------------------------------------------
// -----------------------------------------------------------------------

if (cluster.isPrimary) {
  const numWorkers = os.cpus().length;
  logger.info(`Master cluster setting up ${numWorkers} workers...`);
  for (let i = 0; i < numWorkers; i++) {
    cluster.fork();
  }
  cluster.on('online', (worker) => {
    logger.info(`Worker ${worker.process.pid} is online`);
  });
  cluster.on('exit', (worker, code, signal) => {
    logger.info(
      `Worker ${worker.process.pid} died with code: ${code} and signal: ${signal}`
    );
    logger.info('Starting a new worker...');
    cluster.fork();
  });
} else {
  const env = getEnvVar('NODE_ENV', true);

  process.on('uncaughtException', (err: any, origin: string) => {
    logger.error(`Uncaught exception: ${JSON.stringify(err)}`);
    getServerError(origin);
  });
  process.on('unhandledRejection', (err: any) => {
    getServerError(err);
  });

  // Start listening to the http server
  const httpPort = parseInt(getEnvVar('HTTP_PORT', true) || '3000', 10);

  const server = app.listen(httpPort, async () => {
    logger.info(
      `Server is running on port ${httpPort}, "${env.toUpperCase()}" environment`
    );
    await checkDbConnection();
  });

  process.on('SIGTERM', (err: any) => {
    getServerError(err, server);
  });
  process.on('SIGINT', (err: any) => {
    getServerError(err, server);
  });
  //(ctrl+c) is received
  process.on('SIGQUIT', (err: any) => {
    getServerError(err, server);
  });
}
