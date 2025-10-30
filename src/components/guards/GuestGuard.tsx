'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '../../store/hooks';
import { authUtils } from '../../utils';
import type { RouteGuardProps } from '../../types';

interface GuestGuardProps extends RouteGuardProps {
  redirectTo?: string;
}

const GuestGuard: React.FC<GuestGuardProps> = ({ 
  children, 
  fallback = null,
  redirectTo = '/dashboard' 
}) => {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const isClientAuthenticated = authUtils.isAuthenticated();
    
    if (!isLoading && (isAuthenticated || isClientAuthenticated)) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, isLoading, router, redirectTo]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated || authUtils.isAuthenticated()) {
    return fallback ? <>{fallback}</> : null;
  }

  return <>{children}</>;
};

export default GuestGuard;