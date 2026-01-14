'use client';

import { MsalProvider } from '@azure/msal-react';
import { PublicClientApplication } from '@azure/msal-browser';
import { msalConfig } from '@/lib/msal-config';
import { ReactNode, useEffect, useState } from 'react';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [msalInstance, setMsalInstance] = useState<PublicClientApplication | null>(null);

  // POC Mode: Skip authentication if environment variable is set
  const isPocMode = process.env.NEXT_PUBLIC_POC_MODE === 'true';

  useEffect(() => {
    if (isPocMode) {
      // In POC mode, skip MSAL initialization
      return;
    }

    // Only create MSAL instance on client side
    if (typeof window !== 'undefined') {
      const instance = new PublicClientApplication(msalConfig);
      setMsalInstance(instance);
    }
  }, [isPocMode]);

  // POC Mode: Skip authentication entirely
  if (isPocMode) {
    return <div>{children}</div>;
  }

  // Show loading while MSAL initializes
  if (!msalInstance) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing authentication...</p>
        </div>
      </div>
    );
  }

  return <MsalProvider instance={msalInstance}>{children}</MsalProvider>;
}