'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ClipboardList, LogOut, MapPin, ShoppingCart } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

import { Button } from '@/components/ui/Button';
import { getProfile } from '@/lib/api/auth';
import { useAuthStore } from '@/store/auth';

export default function Navbar() {
  const router = useRouter();
  // Zustand, menentukan tampilan navbar guest atau user login
  const token = useAuthStore((state) => state.token);
  const logout = useAuthStore((state) => state.logout);
  const isLoggedIn = Boolean(token);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Saat user scroll, navbar berubah dari blur gelap ke putih seperti design.
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Profile hanya diambil kalau user sudah login
  const { data: profileResponse } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
    enabled: isLoggedIn,
  });

  const profile = profileResponse?.data;
  const profileImage = profile?.avatar || '/images/profile.jpg';
  const profileName = profile?.name || 'John Doe';
  const logoSrc = isScrolled
    ? '/images/logo-merah.png'
    : '/images/logo-putih.png';

  // Logout hapus token, menutup dropdown, lalu kirim balik ke login
  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
    router.push('/login');
  };

  return (
    <nav
      className={`fixed left-0 top-0 z-50 flex w-full items-center justify-between px-8 py-5 transition-all duration-300 md:px-28 ${
        isScrolled
          ? 'bg-white text-black shadow-md'
          : 'bg-transparent text-white'
      }`}
    >
      {/* Logo selalu ngelink ke Homepage */}
      <Link href='/' className='flex items-center gap-3'>
        <Image src={logoSrc} alt='Foody Logo' width={32} height={32} />

        <span className='text-2xl font-bold'>Foody</span>
      </Link>

      {/* Jika belum login, tampilkan sign in dan sign up */}
      {!isLoggedIn ? (
        <div className='flex gap-3'>
          <Button
            asChild
            variant='outline'
            className={`rounded-full px-8 ${
              isScrolled
                ? 'border-gray-200 bg-white text-black hover:bg-gray-50'
                : 'border-white bg-transparent text-white hover:bg-white/10 hover:text-white'
            }`}
          >
            <Link href='/login'>Sign In</Link>
          </Button>

          <Button
            asChild
            className={`rounded-full px-8 ${
              isScrolled
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-white text-black hover:bg-white/90'
            }`}
          >
            <Link href='/register'>Sign Up</Link>
          </Button>
        </div>
      ) : (
        /* Jika sudah login, show shortcut orders, cart, dan profile menu */
        <div className='flex items-center gap-5'>
          <Button
            asChild
            size='icon'
            className={`rounded-full ${
              isScrolled
                ? 'bg-gray-100 text-black hover:bg-gray-200'
                : 'bg-white text-black hover:bg-white/90'
            }`}
          >
            <Link href='/orders' aria-label='Open orders'>
              <ClipboardList />
            </Link>
          </Button>

          <Button
            asChild
            size='icon'
            className={`rounded-full ${
              isScrolled
                ? 'bg-gray-100 text-black hover:bg-gray-200'
                : 'bg-white text-black hover:bg-white/90'
            }`}
          >
            <Link href='/cart' aria-label='Open cart'>
              <ShoppingCart />
            </Link>
          </Button>

          {/* Dropdown profile */}
          <div className='relative'>
            <button
              type='button'
              onClick={() => setIsProfileOpen((value) => !value)}
              className='flex items-center gap-2'
            >
              <Image
                src={profileImage}
                alt='Profile'
                width={40}
                height={40}
                className='rounded-full'
              />

              <span className='font-medium'>{profileName}</span>
            </button>

            {isProfileOpen && (
              <div className='absolute right-0 top-14 w-64 rounded-2xl bg-white p-4 text-black shadow-xl'>
                <Link
                  href='/profile'
                  onClick={() => setIsProfileOpen(false)}
                  className='mb-4 flex items-center gap-3 border-b border-gray-100 pb-4'
                >
                  <Image
                    src={profileImage}
                    alt='Profile'
                    width={38}
                    height={38}
                    className='rounded-full'
                  />
                  <div>
                    <p className='text-sm font-semibold'>{profileName}</p>
                    <p className='text-xs text-gray-500'>View profile</p>
                  </div>
                </Link>

                <div className='space-y-1 text-sm'>
                  <Link
                    href='/profile#delivery-address'
                    onClick={() => setIsProfileOpen(false)}
                    className='flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-gray-50'
                  >
                    <MapPin className='size-4' />
                    Delivery Address
                  </Link>

                  <Link
                    href='/orders'
                    onClick={() => setIsProfileOpen(false)}
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
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
