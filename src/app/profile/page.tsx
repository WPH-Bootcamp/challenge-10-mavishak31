'use client';

import { FormEvent, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Camera, ClipboardList, LogOut, MapPin } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { getProfile, updateProfile } from '@/lib/api/auth';
import { useAuthStore } from '@/store/auth';

export default function ProfilePage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  // Token untuk protect halaman profile dari guest
  const token = useAuthStore((state) => state.token);
  const logout = useAuthStore((state) => state.logout);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) {
      router.push('/login');
    }
  }, [token, router]);

  const {
    data: profileResponse,
    isLoading,
    isError,
  } = useQuery({
    // Data profile diambil dari API supaya up to date
    queryKey: ['profile'],
    queryFn: getProfile,
    enabled: Boolean(token),
  });

  const profile = profileResponse?.data;
  const profileImage = profile?.avatar || '/images/profile.jpg';

  const updateProfileMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      setError('');
      setMessage('Profile updated successfully.');
      // Refresh cache profile
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
    onError: (err) => {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.message || 'Failed to update profile.'
        : 'Failed to update profile.';

      setMessage('');
      setError(message);
    },
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage('');
    setError('');

    // FormData
    const form = event.currentTarget;
    const formData = new FormData(form);
    const avatar = formData.get('avatar');

    // field avatar
    if (!(avatar instanceof File) || avatar.size === 0) {
      formData.delete('avatar');
    }

    updateProfileMutation.mutate(formData);
  };

  const handleLogout = () => {
    // Logout dari sidebar
    logout();
    router.push('/login');
  };

  if (isLoading) {
    return <main className='p-8'>Loading profile...</main>;
  }

  if (isError || !profile) {
    return (
      <main className='p-8'>
        <p className='text-red-600'>Failed to load profile.</p>
      </main>
    );
  }

  return (
    <main className='min-h-screen bg-white px-6 py-8 md:px-10'>
      <div className='mx-auto grid max-w-5xl gap-8 md:grid-cols-[240px_1fr]'>
        <aside className='h-fit rounded-lg border border-gray-100 p-5 shadow-sm'>
          <Link href='/profile' className='mb-5 flex items-center gap-3'>
            <Image
              src={profileImage}
              alt={profile.name}
              width={42}
              height={42}
              className='rounded-full'
            />
            <p className='font-semibold'>{profile.name}</p>
          </Link>

          <div className='space-y-1 border-t border-gray-100 pt-4 text-sm'>
            <a
              href='#delivery-address'
              className='flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-gray-50'
            >
              <MapPin className='size-4' />
              Delivery Address
            </a>

            <Link
              href='/orders'
              className='flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-gray-50'
            >
              <ClipboardList className='size-4' />
              My Orders
            </Link>

            <button
              type='button'
              onClick={handleLogout}
              className='flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left hover:bg-gray-50'
            >
              <LogOut className='size-4' />
              Logout
            </button>
          </div>
        </aside>

        <section>
          <h1 className='mb-8 text-3xl font-bold'>Profile</h1>

          <form
            onSubmit={handleSubmit}
            className='max-w-xl rounded-lg border border-gray-100 p-6 shadow-sm'
          >
            {message && (
              <p className='mb-5 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700'>
                {message}
              </p>
            )}

            {error && (
              <p className='mb-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600'>
                {error}
              </p>
            )}

            <div className='mb-6 flex items-center gap-5'>
              <Image
                src={profileImage}
                alt={profile.name}
                width={72}
                height={72}
                className='rounded-full'
              />

              <label className='inline-flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium hover:bg-gray-50'>
                <Camera className='size-4' />
                Change Photo
                <input
                  type='file'
                  name='avatar'
                  accept='image/*'
                  className='hidden'
                />
              </label>
            </div>

            <div className='mb-5'>
              <label className='mb-2 block text-sm font-medium text-black'>
                Name
              </label>
              <Input name='name' defaultValue={profile.name} />
            </div>

            <div className='mb-5'>
              <label className='mb-2 block text-sm font-medium text-black'>
                Email
              </label>
              <Input type='email' name='email' defaultValue={profile.email} />
            </div>

            <div id='delivery-address' className='mb-6'>
              <label className='mb-2 block text-sm font-medium text-black'>
                Phone Number
              </label>
              <Input type='tel' name='phone' defaultValue={profile.phone} />
            </div>

            <Button
              type='submit'
              disabled={updateProfileMutation.isPending}
              className='h-12 w-full bg-red-600 text-white hover:bg-red-700'
            >
              {updateProfileMutation.isPending
                ? 'Updating profile...'
                : 'Update Profile'}
            </Button>
          </form>
        </section>
      </div>
    </main>
  );
}
