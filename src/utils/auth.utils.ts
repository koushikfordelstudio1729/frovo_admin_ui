import { storageUtils } from './storage.utils';

export class AuthUtils {
  static isTokenExpired(token: string): boolean {
    if (!token) return true;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const now = Date.now() / 1000;
      return payload.exp < now;
    } catch {
      return true;
    }
  }

  static getTokenPayload(token: string): Record<string, unknown> | null {
    if (!token) return null;
    
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch {
      return null;
    }
  }

  static isAuthenticated(): boolean {
    const token = storageUtils.getToken();
    return !!(token && !this.isTokenExpired(token));
  }

  static getAuthHeader(): { Authorization: string } | Record<string, never> {
    const token = storageUtils.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  static logout(): void {
    storageUtils.clearAuthData();
  }

  static redirectToLogin(): void {
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }

  static getTokenTimeRemaining(token: string): number {
    if (!token) return 0;
    
    try {
      const payload = this.getTokenPayload(token);
      if (!payload || !('exp' in payload) || typeof payload.exp !== 'number') return 0;
      const now = Date.now() / 1000;
      return Math.max(0, payload.exp - now);
    } catch {
      return 0;
    }
  }

  static shouldRefreshToken(token: string, bufferTime = 300): boolean {
    const timeRemaining = this.getTokenTimeRemaining(token);
    return timeRemaining > 0 && timeRemaining < bufferTime;
  }
}

export const authUtils = AuthUtils;