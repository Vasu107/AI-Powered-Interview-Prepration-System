'use client'
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Shield, AlertTriangle } from 'lucide-react';

const ADMIN_EMAILS = [
  'admin@askup.com',
  'vasux@admin.com', // Add your admin emails here
];

export default function AdminProtection({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (status === 'loading') return;

    if (!session) {
      router.push('/auth');
      return;
    }

    const isAdmin = ADMIN_EMAILS.includes(session.user?.email);
    
    if (!isAdmin) {
      setIsAuthorized(false);
      return;
    }

    setIsAuthorized(true);
  }, [session, status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null; // Will redirect to auth
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-8 bg-white rounded-lg shadow-lg">
          <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-6">
            You don't have permission to access the admin panel.
          </p>
          <button
            onClick={() => router.push('/(main)/dashboard')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-green-100 border-l-4 border-green-500 p-4 mb-4">
        <div className="flex items-center">
          <Shield className="h-5 w-5 text-green-500 mr-2" />
          <p className="text-green-700 text-sm">
            Admin access granted for: {session.user?.email}
          </p>
        </div>
      </div>
      {children}
    </div>
  );
}