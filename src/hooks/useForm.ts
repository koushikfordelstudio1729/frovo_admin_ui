"use client";
import { useState, useCallback } from "react";
import { validation } from "../utils";

interface FormField {
  value: string;
  error?: string;
  touched?: boolean;
}

interface FormState {
  [key: string]: FormField;
}

interface FormValidation {
  [key: string]: (value: string, formData?: FormState) => string | undefined;
}

interface UseFormOptions {
  initialValues: { [key: string]: string };
  validationRules?: FormValidation;
  onSubmit?: (values: { [key: string]: string }) => void | Promise<void>;
}

export const useForm = ({
  initialValues,
  validationRules,
  onSubmit,
}: UseFormOptions) => {
  const [formState, setFormState] = useState<FormState>(() => {
    const initialState: FormState = {};
    Object.keys(initialValues).forEach((key) => {
      initialState[key] = {
        value: initialValues[key],
        error: undefined,
        touched: false,
      };
    });
    return initialState;
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = useCallback(
    (name: string, value: string): string | undefined => {
      if (!validationRules || !validationRules[name]) return undefined;
      return validationRules[name](value, formState);
    },
    [validationRules, formState]
  );

  const setFieldValue = useCallback((name: string, value: string) => {
    setFormState((prev) => ({
      ...prev,
      [name]: {
        value: validation.sanitizeInput(value),
        error: undefined,
        touched: true,
      },
    }));
  }, []);

  const setFieldError = useCallback((name: string, error: string) => {
    setFormState((prev) => ({
      ...prev,
      [name]: {
        ...prev[name],
        error,
      },
    }));
  }, []);

  const clearFieldError = useCallback((name: string) => {
    setFormState((prev) => ({
      ...prev,
      [name]: {
        ...prev[name],
        error: undefined,
      },
    }));
  }, []);

  const validateForm = useCallback((): boolean => {
    if (!validationRules) return true;

    let isValid = true;
    const newFormState = { ...formState };

    Object.keys(formState).forEach((name) => {
      const error = validateField(name, formState[name].value);
      newFormState[name] = {
        ...newFormState[name],
        error,
        touched: true,
      };
      if (error) isValid = false;
    });

    setFormState(newFormState);
    return isValid;
  }, [formState, validateField, validationRules]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!validateForm()) return;

      setIsSubmitting(true);
      try {
        const values: { [key: string]: string } = {};
        Object.keys(formState).forEach((key) => {
          values[key] = formState[key].value;
        });

        if (onSubmit) {
          await onSubmit(values);
        }
      } catch (error) {
        console.error("Form submission error:", error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [formState, validateForm, onSubmit]
  );

  const reset = useCallback(() => {
    const resetState: FormState = {};
    Object.keys(initialValues).forEach((key) => {
      resetState[key] = {
        value: initialValues[key],
        error: undefined,
        touched: false,
      };
    });
    setFormState(resetState);
    setIsSubmitting(false);
  }, [initialValues]);

  const getFieldProps = useCallback(
    (name: string) => ({
      value: formState[name]?.value || "",
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        setFieldValue(name, e.target.value);
      },
      onBlur: () => {
        const error = validateField(name, formState[name].value);
        setFieldError(name, error || "");
      },
    }),
    [formState, setFieldValue, validateField, setFieldError]
  );

  return {
    formState,
    isSubmitting,
    setFieldValue,
    setFieldError,
    clearFieldError,
    validateForm,
    handleSubmit,
    reset,
    getFieldProps,
    values: Object.keys(formState).reduce((acc, key) => {
      acc[key] = formState[key].value;
      return acc;
    }, {} as { [key: string]: string }),
    errors: Object.keys(formState).reduce((acc, key) => {
      if (formState[key].error) acc[key] = formState[key].error;
      return acc;
    }, {} as { [key: string]: string }),
  };
};
