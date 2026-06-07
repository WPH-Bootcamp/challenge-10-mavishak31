'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { Eye } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { loginUser } from '@/lib/api/auth';
import { loginSchema } from '@/lib/validations/auth';
import { useAuthStore } from '@/store/auth';

const rememberedLoginKey = 'foody-remembered-login';

// Schema login utama
const loginFormSchema = loginSchema.extend({
  rememberMe: z.boolean(),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

export default function LoginPage() {
  const router = useRouter();
  const setToken = useAuthStore((state) => state.setToken);

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  // Remember me checkbox untuk login
  useEffect(() => {
    const rememberedLogin = window.localStorage.getItem(rememberedLoginKey);

    if (!rememberedLogin) {
      return;
    }

    const parsed = JSON.parse(rememberedLogin) as Pick<
      LoginFormValues,
      'email' | 'password' | 'rememberMe'
    >;

    reset({
      email: parsed.email,
      password: parsed.password,
      rememberMe: parsed.rememberMe,
    });
  }, [reset]);

  // Submit login lalu redirect ke homepage
  const onSubmit = async (values: LoginFormValues) => {
    try {
      const response = await loginUser({
        email: values.email,
        password: values.password,
      });

      // Remember Me save email/password terakhir di localStorage
      if (values.rememberMe) {
        window.localStorage.setItem(
          rememberedLoginKey,
          JSON.stringify({
            email: values.email,
            password: values.password,
            rememberMe: values.rememberMe,
          })
        );
      } else {
        window.localStorage.removeItem(rememberedLoginKey);
      }

      setToken(response.data.token);
      router.push('/');
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.message || 'Login failed.'
        : 'Login failed.';

      setError('root', { message });
    }
  };

  return (
    <main className='min-h-screen bg-[#111111] flex items-center justify-center p-4'>
      <div className='w-full max-w-5xl bg-white overflow-hidden shadow-2xl grid md:grid-cols-[360px_1fr]'>
        <div className='relative hidden md:block h-[660px]'>
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
              <Image
                src='/images/logo.png'
                alt='Foody logo'
                width={30}
                height={30}
              />
              <h1 className='text-2xl font-bold text-black'>Foody</h1>
            </div>

            <h2 className='mb-1 text-2xl font-bold text-black'>Welcome Back</h2>
            <p className='mb-6 text-sm text-gray-600'>
              Good to see you again! Let&apos;s eat
            </p>

            <div className='mb-6 grid grid-cols-2 rounded-lg bg-[#f7f1ff] p-1'>
              <Button
                type='button'
                className='h-10 bg-white text-black shadow-sm hover:bg-white'
              >
                Sign in
              </Button>

              <Button
                asChild
                variant='ghost'
                className='h-10 text-gray-500 hover:bg-white/60'
              >
                <Link href='/register'>Sign up</Link>
              </Button>
            </div>

            {errors.root?.message && (
              <p className='mb-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600'>
                {errors.root.message}
              </p>
            )}

            <div className='mb-4'>
              <Input
                type='email'
                placeholder='Email'
                aria-invalid={Boolean(errors.email)}
                className='border-x-0 border-t-0 rounded-none px-0 focus:ring-0'
                {...register('email')}
              />
              {errors.email?.message && (
                <p className='mt-2 text-sm text-red-600'>
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className='mb-4'>
              <div className='relative'>
                <Input
                  type='password'
                  placeholder='Password'
                  aria-invalid={Boolean(errors.password)}
                  className='border-x-0 border-t-0 rounded-none px-0 pr-10 focus:ring-0'
                  {...register('password')}
                />
                <Eye className='absolute right-1 top-1/2 size-4 -translate-y-1/2 text-gray-500' />
              </div>
              {errors.password?.message && (
                <p className='mt-2 text-sm text-red-600'>
                  {errors.password.message}
                </p>
              )}
            </div>

            <label className='mb-7 flex items-center gap-2 text-sm text-black'>
              <input
                type='checkbox'
                className='size-4 rounded border-gray-300'
                {...register('rememberMe')}
              />
              Remember Me
            </label>

            <Button
              type='submit'
              disabled={isSubmitting}
              className='h-12 w-full rounded-full bg-red-600 text-white hover:bg-red-700'
            >
              {isSubmitting ? 'Logging in...' : 'Login'}
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
