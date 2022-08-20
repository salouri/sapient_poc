import knex, { Knex } from 'knex';
import getSecretValue from '../secretManager.js';
import setKnexConfig from '../database/knexConfig.js';
import getEnvVar from '../getEnvVar.js';
import logger from '../logger.js';

// get secret value from AWS secret manager
const region = getEnvVar('AWS_REGION', true);
const secretName = getEnvVar('SM_SECRET_NAME', true);
const env: string = getEnvVar('NODE_ENV', true) || 'development';

let secret;
try {
  if (env === 'development') {
    secret = process.env;
  } else {
    secret = await getSecretValue(region, secretName);
    logger.info('getting secret manager values successful');
  }
} catch (error) {
  logger.error(error);
  logger.info(`using environment: ${env}`);
  if (env === 'development') {
    logger.error('access to secret manager failed');
    secret = process.env;
  } else {
    throw new Error('getting secret manager values failed'); // throw error to stop the app
  }
}

const knexConfig = setKnexConfig(secret);

const config = knexConfig[env];

// initiate the knex instance
const db: Knex = knex(config);

export async function checkDbConnection(): Promise<void> {
  try {
    await db.raw('SELECT NOW()');
    // logger.info('Database connection successful');
  } catch (error: any) {
    logger.error('Database connection failed');
    logger.error(error);
  }
}
export default db;
