// File path: src/app/login/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginRedirect() {
  const router = useRouter();
  const [redirected, setRedirected] = useState(false);
  
  useEffect(() => {
    if (!redirected) {
      console.log("Login redirect triggered - redirecting to /auth");
      setRedirected(true);
      
      // Add a slight delay to avoid immediate redirect
      setTimeout(() => {
        router.replace('/auth');
      }, 100);
    }
  }, [router, redirected]);
  
  return <div className="flex items-center justify-center h-screen">
    <div className="text-center">
      <h1 className="text-xl font-bold mb-4">Redirecting to login...</h1>
      <p>If you are not redirected, <button 
        onClick={() => router.push('/auth')}
        className="text-blue-600 underline"
      >
        click here
      </button>
      </p>
    </div>
  </div>;
}