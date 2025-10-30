export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

export interface FormField {
  value: string;
  error?: string;
  touched?: boolean;
}

export interface FormState {
  [key: string]: FormField;
}

export type Theme = 'light' | 'dark' | 'system';

export interface AppConfig {
  apiUrl: string;
  appName: string;
  version: string;
  environment: 'development' | 'staging' | 'production';
}

export interface RouteGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export type AsyncThunkStatus = 'idle' | 'pending' | 'fulfilled' | 'rejected';