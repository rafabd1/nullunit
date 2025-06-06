'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input, Card, CardHeader, CardBody, CardFooter, Link } from '@heroui/react';
import NextLink from 'next/link';

export default function SignupPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      setIsLoading(false);
      return;
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to sign up.');
      }

      // On successful signup, redirect to a page that tells the user to check their email.
      router.push('/auth/pending-verification');

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
          <h1 className="text-2xl font-bold">Create an Account</h1>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSignup} className="flex flex-col gap-4">
            <Input
              isRequired
              label="Username"
              placeholder="Choose a unique username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
            />
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
              placeholder="Must be at least 6 characters"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
            {error && <p className="text-danger text-sm text-center">{error}</p>}
            <Button color="primary" type="submit" isLoading={isLoading} fullWidth>
              Sign Up
            </Button>
          </form>
        </CardBody>
        <CardFooter className="justify-center">
          <p className="text-sm">
            Already have an account?{' '}
            <Link as={NextLink} href="/auth/login" size="sm">
              Login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
} 