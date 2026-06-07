'use client';

import { FormEvent } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

import { Input } from '@/components/ui/Input';

export default function Hero() {
  const router = useRouter();

  // Search di hero
  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const query = String(formData.get('q') || '').trim();

    if (!query) {
      router.push('/category');
      return;
    }

    router.push(`/category?q=${encodeURIComponent(query)}`);
  };

  return (
    <section className='relative h-[520px]'>
      {/* Hero Banner Image */}
      <Image
        src='/images/hero-banner.png'
        alt='Hero Banner'
        fill
        priority
        className='object-cover'
      />

      {/* Overlay text diatas gambar */}
      <div className='absolute inset-0 bg-black/45' />

      {/* Content hero judul, subtitle, dan search */}
      <div
        className='
          relative
          z-10
          h-full
          flex
          flex-col
          items-center
          justify-center
          text-center
          px-6
        '
      >
        {/* title */}
        <h1
          className='
            text-white
            text-5xl
            font-bold
            mb-4
          '
        >
          Explore Culinary Experiences
        </h1>

        {/* subtitle */}
        <p
          className='
            text-white
            mb-8
            text-lg
          '
        >
          Search and refine your choice to discover the perfect restaurant.
        </p>

        {/* Form user ke halaman category */}
        <form onSubmit={handleSearch} className='relative w-full max-w-xl'>
          <Search className='absolute left-5 top-1/2 size-4 -translate-y-1/2 text-gray-400' />
          <Input
            name='q'
            type='text'
            placeholder='Search restaurants, food and drink'
            className='h-14 rounded-full bg-white pl-12 pr-6'
          />
        </form>
      </div>
    </section>
  );
}
