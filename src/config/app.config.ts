import { env } from './environment';

export const appConfig = {
  name: env.appName,
  version: env.version,
  
  storage: {
    keys: {
      token: 'frovo_auth_token',
      user: 'frovo_user_data',
      theme: 'frovo_theme',
      preferences: 'frovo_user_preferences',
    },
  },

  routes: {
    home: '/',
    login: '/login',
    register: '/register',
    dashboard: '/dashboard',
    profile: '/profile',
    settings: '/settings',
  },

  validation: {
    password: {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: false,
    },
    email: {
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
  },

  ui: {
    toastDuration: 5000,
    debounceDelay: 300,
    animationDuration: 200,
  },

  features: {
    darkMode: true,
    rememberMe: true,
    socialLogin: false,
    emailVerification: true,
  },
};