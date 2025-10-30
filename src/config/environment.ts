const environment = {
  development: {
    apiUrl: 'http://localhost:3001/api',
    appName: 'Frovo Admin (Dev)',
    logLevel: 'debug',
  },
  staging: {
    apiUrl: 'https://staging-api.frovo.com/api',
    appName: 'Frovo Admin (Staging)',
    logLevel: 'info',
  },
  production: {
    apiUrl: 'https://api.frovo.com/api',
    appName: 'Frovo Admin',
    logLevel: 'error',
  },
};

const currentEnv = (process.env.NODE_ENV as keyof typeof environment) || 'development';

export const env = {
  ...environment[currentEnv],
  nodeEnv: process.env.NODE_ENV || 'development',
  apiUrl: process.env.NEXT_PUBLIC_API_URL || environment[currentEnv].apiUrl,
  version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
  isDevelopment: currentEnv === 'development',
  isProduction: currentEnv === 'production',
  isStaging: currentEnv === 'staging',
};