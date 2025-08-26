// File path: arioncomply-v1/frontend-web/src/components/providers/Providers.tsx
'use client';

import React, { useEffect } from 'react';
import { useUserStore } from '@/stores/userStore';

export function Providers({ children }: { children: React.ReactNode }) {
  const { initializeSession } = useUserStore();
  
  // Initialize user session on app start
  useEffect(() => {
    if (typeof window !== 'undefined') {
      initializeSession();
    }
  }, [initializeSession]);

  return <>{children}</>;
}