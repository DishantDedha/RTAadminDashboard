'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    router.push('/login');   // instantly sends user to login page
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0a0f1c] text-white">
      <p className="text-lg">Redirecting to Login...</p>
    </div>
  );
}