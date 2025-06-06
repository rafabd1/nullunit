'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useAuth } from '@/providers/auth-provider';
import { Button, Input, Textarea } from '@heroui/react';
import { toast } from 'sonner';
import { useEffect } from 'react';

const profileFormSchema = z.object({
  username: z
    .string()
    .min(3, { message: 'Username must be at least 3 characters.' })
    .max(30, { message: 'Username must not be longer than 30 characters.' }),
  bio: z.string().max(160, { message: 'Bio must not be longer than 160 characters.' }).optional(),
  website: z.string().url({ message: 'Please enter a valid URL.' }).optional().or(z.literal('')),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export function ProfileSettingsForm() {
  const { profile, fetchUserProfile } = useAuth();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isValid, isSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      username: '',
      bio: '',
      website: '',
    },
    mode: 'onChange',
  });

  useEffect(() => {
    if (profile) {
      reset({
        username: profile.username || '',
        bio: profile.bio || '',
        website: profile.website || '',
      });
    }
  }, [profile, reset]);


  async function onSubmit(data: ProfileFormValues) {
    toast.info('Updating profile...');
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/members/me`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to update profile.');
        }

        if(fetchUserProfile) {
            await fetchUserProfile();
        }
        
        toast.success('Profile updated successfully!');
        reset(data); // Resets the form's dirty state

    } catch (error) {
        const err = error as Error;
        toast.error(err.message);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="space-y-2">
        <label htmlFor="username" className="text-sm font-medium">Username</label>
        <Input
          id="username"
          placeholder="your_username"
          {...register('username')}
        />
        {errors.username && <p className="text-sm text-danger">{errors.username.message}</p>}
        <p className="text-sm text-default-500">
          This is your public display name. It can be your real name or a pseudonym.
        </p>
      </div>

      <div className="space-y-2">
        <label htmlFor="bio" className="text-sm font-medium">Bio</label>
        <Textarea
          id="bio"
          placeholder="Tell us a little bit about yourself"
          {...register('bio')}
        />
        {errors.bio && <p className="text-sm text-danger">{errors.bio.message}</p>}
        <p className="text-sm text-default-500">
          You can <span>@mention</span> other users and organizations to link to them.
        </p>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="website" className="text-sm font-medium">Website</label>
        <Input
          id="website"
          placeholder="https://yourwebsite.com"
          {...register('website')}
        />
        {errors.website && <p className="text-sm text-danger">{errors.website.message}</p>}
        <p className="text-sm text-default-500">
          Your personal website, portfolio, or social media link.
        </p>
      </div>

      <Button type="submit" color="primary" disabled={!isDirty || !isValid} isLoading={isSubmitting}>
          Update profile
      </Button>
    </form>
  );
} 