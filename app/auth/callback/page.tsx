'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Card, CardBody, Spinner, Button } from '@heroui/react';
import Link from 'next/link';

/**
 * @description Auth callback page for handling authentication redirects
 */
export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const type = searchParams.get('type');

  useEffect(() => {
    // Only set up the auth listener if it's not a specific callback type we handle separately
    if (type) return;

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, _session) => {
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
  }, [router, supabase, type]);

  if (type === 'email_change') {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
         <Card className="w-full max-w-md p-6 text-center">
          <CardBody className="flex flex-col items-center justify-center gap-4">
            <h1 className="text-xl font-medium">Email Successfully Updated!</h1>
            <p className="text-default-500">
              Your email address has been changed. You can now use your new email to log in.
            </p>
            <Link href="/login">
                <Button variant="solid" color="primary">Go to Login</Button>
            </Link>
          </CardBody>
        </Card>
      </div>
    );
  }

  // Default view for standard sign-in callbacks
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
