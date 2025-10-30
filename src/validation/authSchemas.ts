import * as yup from 'yup';
import { appConfig } from '../config';

const { validation: validationConfig } = appConfig;

export const loginSchema = yup.object().shape({
  email: yup
    .string()
    .required('Email is required')
    .matches(validationConfig.email.pattern, 'Please enter a valid email address'),
  password: yup
    .string()
    .required('Password is required')
    .min(1, 'Password is required'),
});

export const registerSchema = yup.object().shape({
  name: yup
    .string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .matches(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),
  email: yup
    .string()
    .required('Email is required')
    .matches(validationConfig.email.pattern, 'Please enter a valid email address'),
  password: yup
    .string()
    .required('Password is required')
    .min(validationConfig.password.minLength, `Password must be at least ${validationConfig.password.minLength} characters`)
    .test('uppercase', 'Password must contain at least one uppercase letter', (value) => 
      validationConfig.password.requireUppercase ? /[A-Z]/.test(value || '') : true
    )
    .test('lowercase', 'Password must contain at least one lowercase letter', (value) =>
      validationConfig.password.requireLowercase ? /[a-z]/.test(value || '') : true
    )
    .test('numbers', 'Password must contain at least one number', (value) =>
      validationConfig.password.requireNumbers ? /\d/.test(value || '') : true
    )
    .test('special', 'Password must contain at least one special character', (value) =>
      validationConfig.password.requireSpecialChars ? /[!@#$%^&*(),.?":{}|<>]/.test(value || '') : true
    ),
  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password')], 'Passwords must match'),
});

export const forgotPasswordSchema = yup.object().shape({
  email: yup
    .string()
    .required('Email is required')
    .matches(validationConfig.email.pattern, 'Please enter a valid email address'),
});

export const resetPasswordSchema = yup.object().shape({
  password: yup
    .string()
    .required('Password is required')
    .min(validationConfig.password.minLength, `Password must be at least ${validationConfig.password.minLength} characters`)
    .test('uppercase', 'Password must contain at least one uppercase letter', (value) => 
      validationConfig.password.requireUppercase ? /[A-Z]/.test(value || '') : true
    )
    .test('lowercase', 'Password must contain at least one lowercase letter', (value) =>
      validationConfig.password.requireLowercase ? /[a-z]/.test(value || '') : true
    )
    .test('numbers', 'Password must contain at least one number', (value) =>
      validationConfig.password.requireNumbers ? /\d/.test(value || '') : true
    )
    .test('special', 'Password must contain at least one special character', (value) =>
      validationConfig.password.requireSpecialChars ? /[!@#$%^&*(),.?":{}|<>]/.test(value || '') : true
    ),
  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password')], 'Passwords must match'),
});

export const changePasswordSchema = yup.object().shape({
  currentPassword: yup
    .string()
    .required('Current password is required'),
  newPassword: yup
    .string()
    .required('New password is required')
    .min(validationConfig.password.minLength, `Password must be at least ${validationConfig.password.minLength} characters`)
    .test('uppercase', 'Password must contain at least one uppercase letter', (value) => 
      validationConfig.password.requireUppercase ? /[A-Z]/.test(value || '') : true
    )
    .test('lowercase', 'Password must contain at least one lowercase letter', (value) =>
      validationConfig.password.requireLowercase ? /[a-z]/.test(value || '') : true
    )
    .test('numbers', 'Password must contain at least one number', (value) =>
      validationConfig.password.requireNumbers ? /\d/.test(value || '') : true
    )
    .test('special', 'Password must contain at least one special character', (value) =>
      validationConfig.password.requireSpecialChars ? /[!@#$%^&*(),.?":{}|<>]/.test(value || '') : true
    ),
  confirmNewPassword: yup
    .string()
    .required('Please confirm your new password')
    .oneOf([yup.ref('newPassword')], 'Passwords must match'),
});