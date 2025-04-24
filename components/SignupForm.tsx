'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import SignInGoogleButton from '@/components/SignInGoogleButton';
import SignInDiscordButton from '@/components/SignInDiscordButton';
import Link from 'next/link';

const signupSchema = z
  .object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = (data: SignupFormData) => {
    console.log(data);
  };

  return (
    <div className="relative flex min-h-svh w-full flex-col items-center justify-center gap-5 overflow-hidden p-6 md:p-10">
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-4xl font-bold">Roamr</h1>
        <p className="text-sm text-gray-500">Create your account</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
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

          <div>
            <label className="label" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="input"
              placeholder="confirm password"
              {...register('confirmPassword')}
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
            )}
          </div>

          <button type="submit" className="btn btn-neutral mt-4">
            Sign Up
          </button>
          <div className="divider">Or</div>
          <div className="flex flex-col gap-2">
            <SignInGoogleButton />
            <SignInDiscordButton />
          </div>
        </fieldset>
      </form>
      <div>
        <Link href="/login">
          Already have an account? <span className="text-primary-content underline">Login</span>
        </Link>
      </div>
    </div>
  );
}
