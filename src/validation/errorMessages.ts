export const errorMessages = {
  // Required field errors
  required: {
    email: 'Email is required',
    password: 'Password is required',
    name: 'Name is required',
    confirmPassword: 'Please confirm your password',
    currentPassword: 'Current password is required',
    newPassword: 'New password is required',
  },

  // Validation errors
  invalid: {
    email: 'Please enter a valid email address',
    password: 'Password must meet the requirements',
    name: 'Name can only contain letters and spaces',
  },

  // Length errors
  length: {
    nameMin: 'Name must be at least 2 characters',
    nameMax: 'Name must be less than 50 characters',
    passwordMin: (min: number) => `Password must be at least ${min} characters`,
  },

  // Password specific errors
  password: {
    uppercase: 'Password must contain at least one uppercase letter',
    lowercase: 'Password must contain at least one lowercase letter',
    numbers: 'Password must contain at least one number',
    special: 'Password must contain at least one special character',
    match: 'Passwords must match',
  },

  // Auth errors
  auth: {
    invalidCredentials: 'Invalid email or password',
    emailExists: 'An account with this email already exists',
    tokenExpired: 'Your session has expired. Please log in again',
    unauthorized: 'You are not authorized to access this resource',
    networkError: 'Network error. Please check your connection',
    serverError: 'Server error. Please try again later',
  },

  // API errors
  api: {
    timeout: 'Request timeout. Please try again',
    notFound: 'The requested resource was not found',
    forbidden: 'Access denied',
    badRequest: 'Invalid request. Please check your input',
    conflict: 'This action conflicts with existing data',
    tooManyRequests: 'Too many requests. Please try again later',
  },

  // Form errors
  form: {
    submitError: 'There was an error submitting the form',
    validationError: 'Please correct the errors below',
    required: 'This field is required',
  },

  // Generic errors
  generic: {
    unexpected: 'An unexpected error occurred',
    tryAgain: 'Please try again',
    contactSupport: 'If the problem persists, please contact support',
  },
} as const;

export type ErrorMessageKeys = typeof errorMessages;