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
    <div className="min-h-screen bg-gradient-to-b from-wcn-primary via-wcn-dark to-black flex flex-col items-center justify-center p-4">
      {/* Watermark Logo */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-wcn-primary/10"></div>
        <div className="absolute inset-0 w-full h-full rotate-12 scale-125">
          <Image
            src="/images/logo.png"
            alt="Company Logo"
            fill
            className="object-contain opacity-[0.08] mix-blend-soft-light"
            priority
          />
        </div>
      </div>
      <div className="relative z-10 w-full max-w-md mx-auto bg-black/30 backdrop-blur-lg rounded-2xl p-8 border-2 border-wcn-mid/20 text-center">
        <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-wcn-text via-wcn-accent2 to-wcn-accent1 bg-clip-text text-transparent">
          {uploadContent.signout.signedOut}
        </h1>
        <p className="text-wcn-text/80 text-lg">{message}</p>
      </div>
    </div>
  );
} 