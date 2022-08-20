import morgan from 'morgan';
import getEnvVar from './getEnvVar.js';

  const httpLogger = getEnvVar('NODE_ENV', true) === 'development'? morgan('dev') : morgan('tiny');

export default httpLogger;