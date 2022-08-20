import redis from 'redis';

import getEnvVar from '../utils/getEnvVar.js';
import logger from './logger.js';

const options = {
  socket: {
    host: getEnvVar('REDIS_HOST', true),
    port: parseInt(getEnvVar('REDIS_PORT', true), 10),
  },
  password: getEnvVar('REDIS_PASSWORD', true),
};

let cacheClient: any;

try {
  cacheClient = redis.createClient(options);

  cacheClient
    .on('connect', () => {
      logger.info(
        `Redis client connected to ${options.socket.host}:${options.socket.port}`
      );
    })
    .on('error', (err: any) => {
      logger.error(`Redis error: ${err}`);
    })
    .on('end', () => {
      logger.info('Redis client disconnected');
    });

  await cacheClient.connect();
} catch (error: any) {
  logger.error('in-memory cache connection failed!');
  logger.error(`Error: ${error.message}`);
}
// key is the name of the cache object. e.g. cards
// record is the json object to be cached and must include id field (database record)
export async function cacheMe(key: string, record: any) {
  try {
    let cachedData = await cacheClient.get(key);
    if (cachedData) {
      cachedData = JSON.parse(cachedData|| '{}');
      cachedData[record.id] = record;
      await cacheClient.set(key, JSON.stringify(cachedData));
    } else {
      const value = { [record.id]: record };
      await cacheClient.set(key, JSON.stringify(value));
    }
  } catch (error: any) {
    logger.error('in-memory cache failed!');
    logger.error(`Error: ${error.message}`);
  }
}
export default cacheClient;
