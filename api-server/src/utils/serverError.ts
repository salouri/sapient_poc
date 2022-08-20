import logger from '../utils/logger.js';

export default (err: any, server: any | null = null): void => {
  logger.error(`${JSON.stringify(err, null, 2)} error received!`);
  logger.info('Shutting down the app gracefully...');
  if (server) {
    server.close(() => {
      logger.info(`Process ${process.pid} Terminated!`);
      process.exit(1); // crash the app
    });
  } else {
    process.exit(1); // crash the app
  }
  //Note: another 3rd party tool, on the host, should be set to restart the app once it crashes
};
