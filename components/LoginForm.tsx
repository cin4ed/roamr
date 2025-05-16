'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import SignInGoogleButton from '@/components/SignInGoogleButton';
import SignInDiscordButton from '@/components/SignInDiscordButton';
import Link from 'next/link';
import { login } from '@/lib/auth';
import { useState } from 'react';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const [loginError, setLoginError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoginError(null);
    const formData = new FormData();
    formData.append('email', data.email);
    formData.append('password', data.password);
    const result = await login(formData);

    if (result?.error) {
      setLoginError(result.error);
    }
  };

  return (
    <div className="text-primary flex w-full flex-col items-center justify-center gap-5 p-6 md:p-10">
      <form onSubmit={handleSubmit(onSubmit)} className="flex w-full max-w-md flex-col gap-5">
        <h1 className="font-title mb-2 text-4xl">Login to Roamr</h1>
        {loginError && (
          <div role="alert" className="text-destructive mt-1 text-sm">
            {loginError}
          </div>
        )}
        <div className="flex flex-col gap-2">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            className="focus:ring-accent-4 border-secondary h-[61px] w-full rounded-md border px-3 py-2 text-base focus:ring-2 focus:outline-none"
            placeholder="Enter your email"
            {...register('email')}
          />
          {errors.email && <p className="text-destructive mt-1 text-sm">{errors.email.message}</p>}
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            className="focus:ring-accent-4 border-secondary h-[61px] w-full rounded-md border px-3 py-2 text-base focus:ring-2 focus:outline-none"
            placeholder="Enter your password"
            {...register('password')}
          />
          {errors.password && (
            <p className="text-destructive mt-1 text-sm">{errors.password.message}</p>
          )}
        </div>
        <button
          type="submit"
          className="bg-primary hover:bg-primary/90 mt-2 rounded-md py-4 text-white"
        >
          Login
        </button>
        <div className="my-2 flex items-center gap-2">
          <div className="bg-secondary h-px flex-1" />
          <span className="text-muted text-sm">Or</span>
          <div className="bg-secondary h-px flex-1" />
        </div>
        <div className="flex flex-col gap-2">
          <SignInGoogleButton />
          <SignInDiscordButton />
        </div>
        <div className="text-muted mt-4 text-center text-sm">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-primary underline">
            Sign up
          </Link>
        </div>
      </form>
    </div>
  );
}
