'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';

import RestaurantCard from '@/components/RestaurantCard';
import { getRestaurants } from '@/lib/api/resto';

import type { Restaurant } from '@/types/restaurant';

export default function RecommendedSection() {
  // Menampilkan rating tertinggi restaurant di Homepage
  const {
    data: restaurants = [],
    isLoading,
    isError,
  } = useQuery<Restaurant[]>({
    queryKey: ['restaurants'],
    queryFn: () => getRestaurants(),
    select: (data) => [...data].sort((a, b) => b.star - a.star).slice(0, 9),
  });

  return (
    <section className='px-7 mt-14'>
      <div className='flex items-center justify-between mb-8'>
        <h2 className='text-4xl font-bold'>Recommended</h2>

        <Link
          href='/category'
          className='text-red-500 font-medium hover:underline'
        >
          See All
        </Link>
      </div>

      {isLoading ? (
        <p className='text-gray-500'>Loading recommended restaurants...</p>
      ) : isError ? (
        <p className='text-red-600'>Failed to load recommended restaurants.</p>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          {restaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>
      )}
    </section>
  );
}
