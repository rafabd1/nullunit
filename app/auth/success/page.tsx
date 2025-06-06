'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardHeader, CardBody, CardFooter, Button } from '@heroui/react';
import { CheckCircleIcon } from 'lucide-react';

const successMessages: { [key: string]: string } = {
  already_verified: 'Your email address was already verified. You can now log in.',
  default: 'Your email has been successfully verified! You can now proceed.'
};

/**
 * @description Success page shown after email verification
 */
export default function SuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const messageKey = searchParams.get('message') || 'default';
  const message = successMessages[messageKey] || successMessages.default;

  return (
    <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
      <Card className="w-full max-w-md p-6 text-center">
        <CardHeader className="justify-center flex-col items-center gap-4">
          <CheckCircleIcon className="w-12 h-12 text-success" />
          <h1 className="text-2xl font-bold">Success!</h1>
        </CardHeader>
        <CardBody>
          <p className="text-default-600">
            {message}
          </p>
        </CardBody>
        <CardFooter>
            <Button color="primary" onClick={() => router.push('/auth/login')} fullWidth>
                Go to Login
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
