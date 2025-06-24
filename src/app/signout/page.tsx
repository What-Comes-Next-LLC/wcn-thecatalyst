'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { supabase } from '../../lib/supabaseClient';
import { uploadContent } from '@/content/uploadContent';

export default function SignOutPage() {
  const router = useRouter();
  const [message, setMessage] = useState(uploadContent.signout.signingOut);

  useEffect(() => {
    const signOut = async () => {
      await supabase.auth.signOut();
      setMessage(uploadContent.signout.signedOut);
      setTimeout(() => {
        setMessage(uploadContent.signout.redirecting);
        router.replace('/');
      }, 1200);
    };
    signOut();
  }, [router]);

  return (
    <main className="min-h-screen bg-wcn-gradient from-wcn-primary to-wcn-accent1 relative overflow-hidden">
      {/* Watermark Logo */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
        <div className="absolute inset-0 bg-wcn-primary/5"></div>
        <div className="absolute inset-0 w-full h-full">
          <Image
            src="/images/logo-official.png"
            alt="What Comes Next Logo"
            fill
            className="object-contain opacity-[0.15] mix-blend-overlay"
            priority
          />
        </div>
      </div>

      <div className="relative flex flex-col items-center justify-center p-4 min-h-screen">
        <div className="w-full max-w-md mx-auto bg-wcn-primary/80 backdrop-blur-sm rounded-2xl p-8 border-2 border-wcn-card shadow-2xl text-center">
        <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-wcn-text via-wcn-accent2 to-wcn-accent1 bg-clip-text text-transparent">
          {uploadContent.signout.signedOut}
        </h1>
          <p className="text-wcn-text/80 text-lg">{message}</p>
        </div>
      </div>
    </main>
  );
} 