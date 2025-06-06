'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardHeader, CardBody, CardFooter, Button } from '@heroui/react';
import { XCircleIcon } from 'lucide-react';

const errorMessages: { [key: string]: string } = {
  invalid_parameters: 'The verification link is missing required parameters. Please try signing up again.',
  invalid_token: 'The verification token is invalid or has expired. Please try again.',
  unknown_error: 'An unknown error occurred. Please try again or contact support.',
  default: 'An unexpected error occurred. Please return to the homepage and try again.'
};

/**
 * @description Error page shown when authentication fails
 */
export default function ErrorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const errorKey = searchParams.get('error') || 'default';
  const message = errorMessages[errorKey] || errorMessages.default;

  return (
    <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
      <Card className="w-full max-w-md p-6 text-center">
        <CardHeader className="justify-center flex-col items-center gap-4">
          <XCircleIcon className="w-12 h-12 text-danger" />
          <h1 className="text-2xl font-bold">Authentication Error</h1>
        </CardHeader>
        <CardBody>
          <p className="text-default-600">
            {message}
          </p>
        </CardBody>
        <CardFooter>
            <Button color="primary" onClick={() => router.push('/')} fullWidth>
                Return to Homepage
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
