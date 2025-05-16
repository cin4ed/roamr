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
    <div className="text-primary flex w-full flex-col items-center justify-center gap-5 p-6 md:p-10">
      <form onSubmit={handleSubmit(onSubmit)} className="flex w-full max-w-md flex-col gap-5">
        <h1 className="font-title mb-2 text-4xl">Create your account</h1>
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
        <div className="flex flex-col gap-2">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            className="focus:ring-accent-4 border-secondary h-[61px] w-full rounded-md border px-3 py-2 text-base focus:ring-2 focus:outline-none"
            placeholder="Confirm your password"
            {...register('confirmPassword')}
          />
          {errors.confirmPassword && (
            <p className="text-destructive mt-1 text-sm">{errors.confirmPassword.message}</p>
          )}
        </div>
        <button
          type="submit"
          className="bg-primary hover:bg-primary/90 mt-2 rounded-md py-4 text-white"
        >
          Sign Up
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
          Already have an account?{' '}
          <Link href="/login" className="text-primary underline">
            Login
          </Link>
        </div>
      </form>
    </div>
  );
}
