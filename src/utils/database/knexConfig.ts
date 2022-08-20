'use strict';
import logger from '../logger.js';
import getEnvVar from '../getEnvVar.js';

const afterConnCreate = (conn: any, done: any): void => {
  logger.info('database connection established');
  conn.query('SELECT NOW();', function (err: any, result: any): void {
    if (err) {
      logger.error(err);
      done(err, conn);
    } else {
      // logger.info('database query successful');
      done(null, conn);
    }
  });
};
const processEnv = {
  NODE_ENV: getEnvVar('NODE_ENV', true),
  DB_ENGINE: getEnvVar('DB_ENGINE', true),
  DB_HOST: getEnvVar('DB_HOST', true),
  DB_PORT: getEnvVar('DB_PORT', true),
  DB_NAME: getEnvVar('DB_NAME', true),
  DB_USERNAME: getEnvVar('DB_USERNAME', true),
  DB_PASSWORD: getEnvVar('DB_PASSWORD', true),
};
// logger.debug(`processEnv: ${JSON.stringify(processEnv, null, 2)}`);
// set knex configs
const setKnexConfig = (secret: any): any => {
  // logger.info(`Secret: ${JSON.stringify(secret, null, 2)}`);
  return {
    local: {
      client: processEnv.DB_ENGINE || 'postgresql',
      connection: {
        host: processEnv.DB_HOST || 'localhost',
        port: parseInt(processEnv.DB_PORT, 10) || 5432,
        database: processEnv.DB_NAME || 'postgres',
        user: processEnv.DB_USERNAME || 'postgres',
        password: processEnv.DB_PASSWORD || 'postgres',
      },
      pool: {
        min: 0,
        max: 10,
        afterCreate: afterConnCreate,
      },
      migrations: {
        tableName: 'knex_migrations',
      },
    },

    development: {
      client: processEnv.DB_ENGINE,
      connection: {
        host:  processEnv.DB_HOST,
        port:  parseInt(processEnv.DB_PORT, 10),
        database: processEnv.DB_NAME,
        user:  processEnv.DB_USERNAME,
        password: processEnv.DB_PASSWORD,
      },
      pool: {
        min: 0,
        max: 10,
        // 'propagateCreateError': false, // set False to automatically reconnect on create connection failure
        afterCreate: afterConnCreate,
      },
      migrations: {
        tableName: 'knex_migrations',
      },
    },

    production: {
      client: secret.DB_ENGINE || processEnv.DB_ENGINE,
      connection: {
        host: secret.DB_HOST || processEnv.DB_HOST,
        port: parseInt(secret.DB_PORT, 10) || parseInt(processEnv.DB_PORT, 10),
        database: secret.DB_NAME || processEnv.DB_NAME,
        user: secret.DB_USERNAME || processEnv.DB_USERNAME,
        password: secret.DB_PASSWORD || processEnv.DB_PASSWORD,
      },
      pool: {
        min: 2,
        max: 10,
        afterCreate: afterConnCreate,
      },
      migrations: {
        tableName: 'knex_migrations',
      },
    },
  };
};

export default setKnexConfig;
