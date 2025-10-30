'use client';

import React from 'react';
import { AuthGuard, Header } from '../../components';
import { useAuth } from '../../hooks';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Dashboard Content
                </h2>
                <p className="text-gray-600">
                  Welcome to your admin dashboard. Add your content here.
                </p>
                {user && (
                  <div className="mt-6 bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      User Information
                    </h3>
                    <p className="text-sm text-gray-600">ID: {user.id}</p>
                    <p className="text-sm text-gray-600">Email: {user.email}</p>
                    <p className="text-sm text-gray-600">Name: {user.name}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
};

export default DashboardPage;