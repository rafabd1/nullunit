'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * @description Auth callback page for handling authentication redirects
 */
export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        if (typeof window === 'undefined') return;

        const hash = window.location.hash;
        const params = new URLSearchParams(hash.replace('#', ''));
        
        const access_token = params.get('access_token');
        const type = params.get('type');
        
        const getEmailFromToken = (token: string) => {
          try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.email;
          } catch {
            return null;
          }
        };

        if (!access_token || !type || type !== 'signup') {
          router.push('/auth/error?error=invalid_parameters');
          return;
        }

        const email = getEmailFromToken(access_token);
        
        if (!email) {
          router.push('/auth/error?error=invalid_token');
          return;
        }

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        const response = await fetch(
          `${apiUrl}/api/auth/verify?access_token=${access_token}&type=${type}&email=${encodeURIComponent(email)}`,          {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            mode: 'cors'
          }
        );

        if (!response.ok) {
          const error = await response.text();
          router.push(`/auth/error?error=${encodeURIComponent(error)}`);
          return;
        }

        router.push('/auth/success');
      } catch (error) {
        console.error('Auth callback error:', error);
        router.push('/auth/error?error=unexpected_error');
      }
    };

    handleCallback();
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Verificando...</h1>
        <p className="mb-6">Por favor, aguarde enquanto verificamos sua conta.</p>
      </div>
    </div>
  );
}
