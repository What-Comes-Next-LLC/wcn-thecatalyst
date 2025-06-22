'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function OnboardRedirect() {
  const router = useRouter();

  useEffect(() => {
    // 301 redirect to /the-spark
    router.replace('/the-spark');
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-wcn-accent1 via-wcn-primary to-wcn-accent2 flex flex-col items-center justify-center p-4">
      <div className="text-white text-xl font-semibold">Redirecting...</div>
    </div>
  );
}