import { useState, useMemo } from "react";

export interface PasswordValidation {
  password: string;
  setPassword: (password: string) => void;
  confirmPassword: string;
  setConfirmPassword: (password: string) => void;
  hasMinLength: boolean;
  hasUpper: boolean;
  hasNumberOrSpecial: boolean;
  passwordsMatch: boolean;
  allValid: boolean;
  validationRules: ValidationRule[];
}

export interface ValidationRule {
  id: string;
  label: string;
  isValid: boolean;
}

export const usePasswordValidation = (
  initialPassword = "",
  initialConfirmPassword = ""
): PasswordValidation => {
  const [password, setPassword] = useState(initialPassword);
  const [confirmPassword, setConfirmPassword] = useState(
    initialConfirmPassword
  );

  const validationRules = useMemo(
    (): ValidationRule[] => [
      {
        id: "minLength",
        label: "Password must be at least 8 characters long",
        isValid: password.length >= 8,
      },
      {
        id: "upperCase",
        label: "Password must contain at least one uppercase letter",
        isValid: /[A-Z]/.test(password),
      },
      {
        id: "numberOrSpecial",
        label: "Password must contain at least one number or special character",
        isValid: /[0-9!@#$%^&*()_\-+={}[\]|;:"'<>,.?/~`]/.test(password),
      },
      {
        id: "passwordsMatch",
        label: "New password and confirm password must match",
        isValid: password === confirmPassword && password !== "",
      },
    ],
    [password, confirmPassword]
  );

  const hasMinLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasNumberOrSpecial = /[0-9!@#$%^&*()_\-+={}[\]|;:"'<>,.?/~`]/.test(
    password
  );
  const passwordsMatch = password === confirmPassword && password !== "";
  const allValid =
    hasMinLength && hasUpper && hasNumberOrSpecial && passwordsMatch;

  return {
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    hasMinLength,
    hasUpper,
    hasNumberOrSpecial,
    passwordsMatch,
    allValid,
    validationRules,
  };
};
