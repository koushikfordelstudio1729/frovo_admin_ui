'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import RegisterForm from '../../components/auth/RegisterForm';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { registerUser, clearError } from '../../store/slices/authSlice';

const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  const { isLoading, error, isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !password || !confirmPassword) {
      return;
    }

    if (password !== confirmPassword) {
      return;
    }

    try {
      const result = await dispatch(registerUser({ name, email, password }));
      if (registerUser.fulfilled.match(result)) {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  const handleInputChange = (setter: (value: string) => void) => (value: string) => {
    setter(value);
    if (error) {
      dispatch(clearError());
    }
  };

  return (
    <RegisterForm
      name={name}
      email={email}
      password={password}
      confirmPassword={confirmPassword}
      isLoading={isLoading}
      error={error}
      onNameChange={handleInputChange(setName)}
      onEmailChange={handleInputChange(setEmail)}
      onPasswordChange={handleInputChange(setPassword)}
      onConfirmPasswordChange={handleInputChange(setConfirmPassword)}
      onSubmit={handleSubmit}
    />
  );
};

export default RegisterPage;