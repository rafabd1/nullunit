import React from 'react';
import { Card, CardHeader, CardBody } from '@heroui/react';
import { MailIcon } from 'lucide-react';

export default function PendingVerificationPage() {
  return (
    <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
      <Card className="w-full max-w-md p-6 text-center">
        <CardHeader className="justify-center flex-col items-center gap-4">
          <MailIcon className="w-12 h-12 text-success" />
          <h1 className="text-2xl font-bold">Check Your Email</h1>
        </CardHeader>
        <CardBody>
          <p className="text-default-600">
            We&apos;ve sent a verification link to your email address. Please click the link to complete your registration.
          </p>
          <p className="text-sm text-default-500 mt-4">
            If you don&apos;t see the email, please check your spam folder.
          </p>
        </CardBody>
      </Card>
    </div>
  );
} 