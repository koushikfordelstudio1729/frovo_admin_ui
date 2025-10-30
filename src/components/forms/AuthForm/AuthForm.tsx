import React from 'react';
import { Button, Input } from '../../common';

interface AuthFormField {
  name: string;
  type: string;
  label: string;
  placeholder: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
}

interface AuthFormProps {
  title: string;
  fields: AuthFormField[];
  isLoading: boolean;
  error?: string | null;
  submitButtonText: string;
  onSubmit: (e: React.FormEvent) => void;
  footerContent?: React.ReactNode;
}

const AuthForm: React.FC<AuthFormProps> = ({
  title,
  fields,
  isLoading,
  error,
  submitButtonText,
  onSubmit,
  footerContent,
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {title}
          </h2>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={onSubmit}>
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-800">{error}</div>
            </div>
          )}
          
          <div className="space-y-4">
            {fields.map((field) => (
              <Input
                key={field.name}
                id={field.name}
                name={field.name}
                type={field.type}
                label={field.label}
                placeholder={field.placeholder}
                value={field.value}
                error={field.error}
                onChange={(e) => field.onChange(e.target.value)}
                disabled={isLoading}
                required
              />
            ))}
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            isLoading={isLoading}
            fullWidth
          >
            {submitButtonText}
          </Button>

          {footerContent && (
            <div className="text-center">
              {footerContent}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default AuthForm;