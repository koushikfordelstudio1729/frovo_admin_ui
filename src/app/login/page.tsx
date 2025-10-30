'use client';

import React, { useState } from 'react';
import { GuestGuard, AuthForm } from '../../components';
import { useAuth } from '../../hooks';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error, clearAuthError } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      return;
    }

    await login({ email, password });
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (error) {
      clearAuthError();
    }
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (error) {
      clearAuthError();
    }
  };

  const fields = [
    {
      name: 'email',
      type: 'email',
      label: 'Email address',
      placeholder: 'Enter your email',
      value: email,
      onChange: handleEmailChange,
    },
    {
      name: 'password',
      type: 'password',
      label: 'Password',
      placeholder: 'Enter your password',
      value: password,
      onChange: handlePasswordChange,
    },
  ];

  const footerContent = (
    <p className="text-sm text-gray-600">
      Don&apos;t have an account?{' '}
      <a href="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
        Sign up here
      </a>
    </p>
  );

  return (
    <GuestGuard>
      <AuthForm
        title="Sign in to your account"
        fields={fields}
        isLoading={isLoading}
        error={error}
        submitButtonText="Sign in"
        onSubmit={handleSubmit}
        footerContent={footerContent}
      />
    </GuestGuard>
  );
};

export default LoginPage;