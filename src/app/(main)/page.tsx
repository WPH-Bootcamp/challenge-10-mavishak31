'use client';

import { useQuery } from '@tanstack/react-query';

import { getRestaurants } from '@/lib/api/resto';

import RestaurantCard from '@/components/shared/RestaurantCard';
import type { Restaurant } from '@/types/restaurant';

export default function HomePage() {
  const { data = [] } = useQuery<Restaurant[]>({
    queryKey: ['restaurants'],
    queryFn: () => getRestaurants(),
  });

  return (
    <main className='p-8'>
      <h1 className='text-4xl font-bold mb-8'>Explore Culinary Experiences</h1>

      <div className='grid grid-cols-4 gap-6'>
        {Array.isArray(data) &&
          data.map((item) => (
            <RestaurantCard key={item.id} restaurant={item} />
          ))}
      </div>
    </main>
  );
}
