'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { Eye } from 'lucide-react';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { registerUser } from '@/lib/api/auth';
import { registerSchema } from '@/lib/validations/auth';

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    try {
      await registerUser({
        name: values.name,
        email: values.email,
        phone: values.phone,
        password: values.password,
      });

      router.push('/login');
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.message || 'Registration failed.'
        : 'Registration failed.';

      setError('root', { message });
    }
  };

  return (
    <main className='min-h-screen bg-[#111111] flex items-center justify-center p-4'>
      <div className='w-full max-w-5xl bg-white overflow-hidden shadow-2xl grid md:grid-cols-[360px_1fr]'>
        <div className='relative hidden md:block h-[720px]'>
          <Image
            src='/images/login-image.png'
            alt='Burger'
            fill
            className='object-cover'
            priority
          />
        </div>

        <div className='flex items-center justify-center px-8 py-12 md:px-10'>
          <form onSubmit={handleSubmit(onSubmit)} className='w-full max-w-sm'>
            <div className='mb-5 flex items-center gap-3'>
              <Image src='/images/logo.png' alt='Foody logo' width={30} height={30} />
              <h1 className='text-2xl font-bold text-black'>Foody</h1>
            </div>

            <h2 className='mb-1 text-2xl font-bold text-black'>Welcome Back</h2>
            <p className='mb-6 text-sm text-gray-600'>
              Good to see you again! Let&apos;s eat
            </p>

            <div className='mb-6 grid grid-cols-2 rounded-lg bg-[#f7f1ff] p-1'>
              <Button
                asChild
                variant='ghost'
                className='h-10 text-gray-500 hover:bg-white/60'
              >
                <Link href='/login'>Sign in</Link>
              </Button>

              <Button
                type='button'
                className='h-10 bg-white text-black shadow-sm hover:bg-white'
              >
                Sign up
              </Button>
            </div>

            {errors.root?.message && (
              <p className='mb-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600'>
                {errors.root.message}
              </p>
            )}

            <div className='mb-4'>
              <Input
                type='text'
                placeholder='Name'
                aria-invalid={Boolean(errors.name)}
                {...register('name')}
              />
              {errors.name?.message && (
                <p className='mt-2 text-sm text-red-600'>
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className='mb-4'>
              <Input
                type='email'
                placeholder='Email'
                aria-invalid={Boolean(errors.email)}
                {...register('email')}
              />
              {errors.email?.message && (
                <p className='mt-2 text-sm text-red-600'>
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className='mb-4'>
              <Input
                type='tel'
                placeholder='Number Phone'
                aria-invalid={Boolean(errors.phone)}
                {...register('phone')}
              />
              {errors.phone?.message && (
                <p className='mt-2 text-sm text-red-600'>
                  {errors.phone.message}
                </p>
              )}
            </div>

            <div className='mb-4'>
              <div className='relative'>
                <Input
                  type='password'
                  placeholder='Password'
                  aria-invalid={Boolean(errors.password)}
                  className='pr-10'
                  {...register('password')}
                />
                <Eye className='absolute right-3 top-1/2 size-4 -translate-y-1/2 text-gray-500' />
              </div>
              {errors.password?.message && (
                <p className='mt-2 text-sm text-red-600'>
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className='mb-6'>
              <div className='relative'>
                <Input
                  type='password'
                  placeholder='Confirm Password'
                  aria-invalid={Boolean(errors.confirmPassword)}
                  className='pr-10'
                  {...register('confirmPassword')}
                />
                <Eye className='absolute right-3 top-1/2 size-4 -translate-y-1/2 text-gray-500' />
              </div>
              {errors.confirmPassword?.message && (
                <p className='mt-2 text-sm text-red-600'>
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <Button
              type='submit'
              disabled={isSubmitting}
              className='h-12 w-full rounded-full bg-red-600 text-white hover:bg-red-700'
            >
              {isSubmitting ? 'Creating account...' : 'Register'}
            </Button>

            <Button
              asChild
              type='button'
              variant='outline'
              className='mt-4 h-12 w-full rounded-full border-gray-200 bg-white text-black hover:bg-gray-50'
            >
              <Link href='/'>Continue as a guest</Link>
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
}
