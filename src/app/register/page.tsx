'use client';

import React, { useState } from 'react';
import { GuestGuard, AuthForm } from '../../components';
import { useAuth } from '../../hooks';

const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { register, isLoading, error, clearAuthError } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !password || !confirmPassword) {
      return;
    }

    if (password !== confirmPassword) {
      return;
    }

    await register({ name, email, password });
  };

  const handleInputChange = (setter: (value: string) => void) => (value: string) => {
    setter(value);
    if (error) {
      clearAuthError();
    }
  };

  const fields = [
    {
      name: 'name',
      type: 'text',
      label: 'Full Name',
      placeholder: 'Enter your full name',
      value: name,
      onChange: handleInputChange(setName),
    },
    {
      name: 'email',
      type: 'email',
      label: 'Email address',
      placeholder: 'Enter your email',
      value: email,
      onChange: handleInputChange(setEmail),
    },
    {
      name: 'password',
      type: 'password',
      label: 'Password',
      placeholder: 'Enter your password',
      value: password,
      onChange: handleInputChange(setPassword),
    },
    {
      name: 'confirmPassword',
      type: 'password',
      label: 'Confirm Password',
      placeholder: 'Confirm your password',
      value: confirmPassword,
      error: password !== confirmPassword && confirmPassword ? 'Passwords do not match' : undefined,
      onChange: handleInputChange(setConfirmPassword),
    },
  ];

  const footerContent = (
    <p className="text-sm text-gray-600">
      Already have an account?{' '}
      <a href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
        Sign in here
      </a>
    </p>
  );

  return (
    <GuestGuard>
      <AuthForm
        title="Create your account"
        fields={fields}
        isLoading={isLoading}
        error={error}
        submitButtonText="Create account"
        onSubmit={handleSubmit}
        footerContent={footerContent}
      />
    </GuestGuard>
  );
};

export default RegisterPage;