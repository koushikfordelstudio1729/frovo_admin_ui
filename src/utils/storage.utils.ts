import { appConfig } from '../config';

class StorageUtils {
  private isClient = typeof window !== 'undefined';

  setItem(key: string, value: unknown): void {
    if (!this.isClient) return;
    
    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(key, serializedValue);
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }

  getItem<T>(key: string, defaultValue?: T): T | null {
    if (!this.isClient) return defaultValue || null;
    
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue || null;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return defaultValue || null;
    }
  }

  removeItem(key: string): void {
    if (!this.isClient) return;
    
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  }

  clear(): void {
    if (!this.isClient) return;
    
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }

  // App-specific storage methods
  setToken(token: string): void {
    this.setItem(appConfig.storage.keys.token, token);
  }

  getToken(): string | null {
    return this.getItem<string>(appConfig.storage.keys.token);
  }

  removeToken(): void {
    this.removeItem(appConfig.storage.keys.token);
  }

  setUser(user: unknown): void {
    this.setItem(appConfig.storage.keys.user, user);
  }

  getUser<T>(): T | null {
    return this.getItem<T>(appConfig.storage.keys.user);
  }

  removeUser(): void {
    this.removeItem(appConfig.storage.keys.user);
  }

  clearAuthData(): void {
    this.removeToken();
    this.removeUser();
  }
}

export const storageUtils = new StorageUtils();