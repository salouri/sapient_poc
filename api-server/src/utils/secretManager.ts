import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from '@aws-sdk/client-secrets-manager';
import logger from '../utils/logger.js';
import getEnvVar from '../utils/getEnvVar.js';

const getSecretValue = async (region: string, secretName: string): Promise<any> => {
  try {
    const getSecretsManagerClient = new SecretsManagerClient({ region });
    const getSecValCommand = new GetSecretValueCommand({ SecretId: secretName });
    const GetSecretValueResponse = await getSecretsManagerClient.send(
      getSecValCommand
    );
    let secret;
    if ('SecretString' in GetSecretValueResponse) {
      secret = JSON.parse(GetSecretValueResponse.SecretString || '{}');
    } else {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      const buff = Buffer.from(GetSecretValueResponse.SecretBinary, 'base64');
      secret = buff.toString('ascii');
    }
    return secret;
  } catch (error) {
    logger.error(error);
    const env = getEnvVar('NODE_ENV', true) || 'development';
    if (env === 'development') {
      logger.error('access to secret manager failed');
    } else {
      throw new Error('access to secret manager failed');
    }
  }
};

export default getSecretValue;
