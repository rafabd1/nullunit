'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useAuth } from '@/providers/auth-provider';
import { Button, Input, Divider } from '@heroui/react';
import { toast } from 'sonner';
import { useEffect } from 'react';

// Schema for email change
const emailFormSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
});
type EmailFormValues = z.infer<typeof emailFormSchema>;

// Schema for password change
const passwordFormSchema = z.object({
  password: z.string().min(8, { message: 'Password must be at least 8 characters long.' }),
});
type PasswordFormValues = z.infer<typeof passwordFormSchema>;

export function AccountSettingsForm() {
  const { user } = useAuth();

  const {
    register: registerEmail,
    handleSubmit: handleEmailSubmit,
    reset: resetEmail,
    formState: { errors: emailErrors, isDirty: emailIsDirty, isValid: emailIsValid, isSubmitting: emailIsSubmitting },
  } = useForm<EmailFormValues>({
    resolver: zodResolver(emailFormSchema),
    defaultValues: { email: '' },
    mode: 'onChange',
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPassword,
    formState: { errors: passwordErrors, isValid: passwordIsValid, isSubmitting: passwordIsSubmitting },
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: { password: '' },
    mode: 'onChange',
  });

  useEffect(() => {
    if (user?.email) {
      resetEmail({ email: user.email });
    }
  }, [user, resetEmail]);

  async function onEmailSubmit(data: EmailFormValues) {
    toast.info('Sending confirmation email...');
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/user/email`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: data.email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to start email change process.');
      }
      
      const result = await response.json();
      toast.success(result.message || 'Confirmation email sent. Please check your new email address.');
      resetEmail({ email: data.email });

    } catch (error) {
      const err = error as Error;
      toast.error(err.message);
    }
  }

  async function onPasswordSubmit(data: PasswordFormValues) {
    toast.info('Updating password...');
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/user/password`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ password: data.password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update password.');
      }
      
      toast.success('Password updated successfully!');
      resetPassword();

    } catch (error) {
      const err = error as Error;
      toast.error(err.message);
    }
  }

  return (
    <div className="space-y-12">
      {/* Email Form */}
      <form onSubmit={handleEmailSubmit(onEmailSubmit)} className="space-y-8">
        <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">Email</label>
            <Input
                id="email"
                placeholder="your.email@example.com"
                {...registerEmail('email')}
            />
            {emailErrors.email && <p className="text-sm text-danger">{emailErrors.email.message}</p>}
            <p className="text-sm text-default-500">
                A confirmation will be sent to your new email address.
            </p>
        </div>
        <Button type="submit" color="primary" disabled={!emailIsDirty || !emailIsValid} isLoading={emailIsSubmitting}>
            Update Email
        </Button>
      </form>
      
      <Divider />

      {/* Password Form */}
      <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-8">
        <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">New Password</label>
            <Input
                id="password"
                type="password"
                placeholder="********"
                {...registerPassword('password')}
            />
            {passwordErrors.password && <p className="text-sm text-danger">{passwordErrors.password.message}</p>}
            <p className="text-sm text-default-500">
                Password must be at least 8 characters long.
            </p>
        </div>
        <Button type="submit" color="primary" disabled={!passwordIsValid} isLoading={passwordIsSubmitting}>
            Update Password
        </Button>
      </form>
    </div>
  );
} 