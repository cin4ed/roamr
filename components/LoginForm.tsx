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
    <div className="relative flex min-h-svh w-full flex-col items-center justify-center gap-5 overflow-hidden p-6 md:p-10">
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-4xl font-bold">Roamr</h1>
        <p className="text-sm text-gray-500">Login to your account</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
          {loginError && (
            <div role="alert" className="alert alert-error alert-soft">
              {loginError}
            </div>
          )}
          <div>
            <label className="label" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="input"
              placeholder="email"
              {...register('email')}
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
          </div>

          <div>
            <label className="label" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="input"
              placeholder="password"
              {...register('password')}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          <button type="submit" className="btn btn-neutral mt-4">
            Login
          </button>
          <div className="divider">Or</div>
          <div className="flex flex-col gap-2">
            <SignInGoogleButton />
            <SignInDiscordButton />
          </div>
        </fieldset>
      </form>
      <div>
        <Link href="/signup">
          Don&apos;t have an account?{' '}
          <span className="text-primary-content underline">Sign up</span>
        </Link>
      </div>
    </div>
  );
}
