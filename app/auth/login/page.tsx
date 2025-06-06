'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input, Card, CardHeader, CardBody, CardFooter, Link } from '@heroui/react';
import NextLink from 'next/link';
import { useAuth } from '@/providers/auth-provider';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { refreshAuthState } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to login.');
      }
      
      await refreshAuthState();
      
      router.push('/');

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
      <Card className="w-full max-w-md p-4">
        <CardHeader className="justify-center">
          <h1 className="text-2xl font-bold">Login</h1>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <Input
              isRequired
              label="Email"
              placeholder="Enter your email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
            <Input
              isRequired
              label="Password"
              placeholder="Enter your password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
            {error && <p className="text-danger text-sm text-center">{error}</p>}
            <Button color="primary" type="submit" isLoading={isLoading} fullWidth>
              Login
            </Button>
          </form>
        </CardBody>
        <CardFooter className="justify-center">
          <p className="text-sm">
            Don&apos;t have an account?{' '}
            <Link as={NextLink} href="/auth/signup" size="sm">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
} 