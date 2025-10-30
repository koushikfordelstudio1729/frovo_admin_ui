import { appConfig } from '../config';

export class ValidationUtils {
  static isValidEmail(email: string): boolean {
    return appConfig.validation.email.pattern.test(email);
  }

  static isValidPassword(password: string): boolean {
    const { validation } = appConfig;
    const rules = validation.password;

    if (password.length < rules.minLength) return false;
    if (rules.requireUppercase && !/[A-Z]/.test(password)) return false;
    if (rules.requireLowercase && !/[a-z]/.test(password)) return false;
    if (rules.requireNumbers && !/\d/.test(password)) return false;
    if (rules.requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) return false;

    return true;
  }

  static getPasswordStrength(password: string): {
    score: number;
    feedback: string[];
  } {
    const feedback: string[] = [];
    let score = 0;

    if (password.length >= 8) score += 1;
    else feedback.push('At least 8 characters');

    if (/[A-Z]/.test(password)) score += 1;
    else feedback.push('Include uppercase letters');

    if (/[a-z]/.test(password)) score += 1;
    else feedback.push('Include lowercase letters');

    if (/\d/.test(password)) score += 1;
    else feedback.push('Include numbers');

    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;
    else feedback.push('Include special characters');

    return { score, feedback };
  }

  static isValidName(name: string): boolean {
    return name.trim().length >= 2 && name.trim().length <= 50;
  }

  static sanitizeInput(input: string): string {
    return input.trim().replace(/[<>]/g, '');
  }

  static formatError(error: unknown): string {
    if (typeof error === 'string') return error;
    if (error instanceof Error) return error.message;
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      return axiosError.response?.data?.message || 'An unexpected error occurred';
    }
    return 'An unexpected error occurred';
  }
}

export const validation = ValidationUtils;