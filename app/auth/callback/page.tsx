'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Card, CardBody, Spinner } from '@heroui/react';

/**
 * @description Auth callback page for handling authentication redirects
 */
export default function AuthCallbackPage() {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        // Successful sign-in, redirect to home.
        router.push('/');
        router.refresh();
      } else if (event === 'TOKEN_REFRESHED') {
        // This can happen in the background, no redirect needed typically
        console.log('Token refreshed');
      }
      // You can handle other events like SIGNED_OUT if needed
    });

    // When the component is unmounted, unsubscribe from the listener
    return () => {
      subscription?.unsubscribe();
    };
  }, [router, supabase]);

  return (
    <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
       <Card className="w-full max-w-md p-6 text-center">
        <CardBody className="flex flex-col items-center justify-center gap-4">
          <Spinner size="lg" />
          <h1 className="text-xl font-medium">Verifying your session...</h1>
          <p className="text-default-500">Please wait while we securely log you in.</p>
        </CardBody>
      </Card>
    </div>
  );
}
