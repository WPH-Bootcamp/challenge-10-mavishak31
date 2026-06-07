'use client';

import { FormEvent, Suspense } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';

import RestaurantCard from '@/components/RestaurantCard';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  getBestSellerRestaurants,
  getRestaurants,
  searchRestaurants,
  type RestaurantFilterParams,
} from '@/lib/api/resto';

import type { Restaurant } from '@/types/restaurant';

//  Filter rating dan priceMax
const toNumber = (value: string | null) => {
  if (!value) {
    return undefined;
  }

  const parsed = Number(value);
  return Number.isNaN(parsed) ? undefined : parsed;
};

function CategoryPageContent() {
  // Router hooks
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const q = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || '';
  const rating = toNumber(searchParams.get('rating'));
  const priceMax = toNumber(searchParams.get('priceMax'));

  const filters: RestaurantFilterParams = {
    category: category || undefined,
    rating,
    priceMax,
    page: 1,
    limit: 20,
  };

  const {
    data: restaurants = [],
    isLoading,
    isError,
  } = useQuery<Restaurant[]>({
    queryKey: ['restaurants', { q, category, sort, rating, priceMax }],
    queryFn: () => {
      if (q) {
        return searchRestaurants(q);
      }

      // Sort best seller
      if (sort === 'best-seller') {
        return getBestSellerRestaurants();
      }

      // Ambil list restaurant
      return getRestaurants(filters);
    },
  });

  // Mengubah URL query tanpa reload page
  const updateParams = (nextValues: Record<string, string | undefined>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(nextValues).forEach(([key, value]) => {
      if (!value) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    router.push(`${pathname}?${params.toString()}`);
  };

  // Submit search dari input
  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const search = String(formData.get('search') || '').trim();

    updateParams({
      q: search || undefined,
      category: undefined,
      sort: undefined,
    });
  };

  // Hapus filter dan kembali ke category
  const handleClearFilters = () => {
    router.push(pathname);
  };

  if (isLoading) {
    return <p style={{ padding: '20px' }}>Loading restaurants...</p>;
  }

  if (isError) {
    return <p style={{ padding: '20px' }}>Failed to fetch restaurants</p>;
  }

  return (
    <main className='min-h-screen bg-white px-6 py-8 md:px-10'>
      <div className='mx-auto max-w-6xl'>
        <div className='mb-6'>
          <h1 className='text-3xl font-bold'>Restaurant List</h1>
          <p className='mt-2 text-gray-500'>
            Search and filter restaurants directly from the API.
          </p>
        </div>

        <form onSubmit={handleSearch} className='mb-5 flex gap-3'>
          <Input
            type='text'
            name='search'
            placeholder='Search restaurant by name...'
            defaultValue={q}
          />
          <Button
            type='submit'
            className='h-11 bg-red-600 px-6 text-white hover:bg-red-700'
          >
            Search
          </Button>
        </form>

        <div className='mb-8 flex flex-wrap gap-2'>
          <Button
            type='button'
            variant={!category && !sort && !q ? 'default' : 'outline'}
            className={!category && !sort && !q ? 'bg-red-600 text-white' : ''}
            onClick={handleClearFilters}
          >
            All
          </Button>

          <Button
            type='button'
            variant={sort === 'best-seller' ? 'default' : 'outline'}
            className={sort === 'best-seller' ? 'bg-red-600 text-white' : ''}
            onClick={() =>
              updateParams({
                sort: 'best-seller',
                q: undefined,
                category: undefined,
              })
            }
          >
            Best Seller
          </Button>

          <Button
            type='button'
            variant={rating === 4 ? 'default' : 'outline'}
            className={rating === 4 ? 'bg-red-600 text-white' : ''}
            onClick={() =>
              updateParams({
                rating: rating === 4 ? undefined : '4',
                q: undefined,
                sort: undefined,
              })
            }
          >
            Rating 4+
          </Button>

          <Button
            type='button'
            variant={priceMax === 25000 ? 'default' : 'outline'}
            className={priceMax === 25000 ? 'bg-red-600 text-white' : ''}
            onClick={() =>
              updateParams({
                priceMax: priceMax === 25000 ? undefined : '25000',
                q: undefined,
                sort: undefined,
              })
            }
          >
            Under 25K
          </Button>
        </div>

        {restaurants.length > 0 ? (
          <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
            {restaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        ) : (
          <p>No restaurant found</p>
        )}
      </div>
    </main>
  );
}

export default function CategoryPage() {
  return (
    <Suspense
      fallback={<p style={{ padding: '20px' }}>Loading restaurants...</p>}
    >
      <CategoryPageContent />
    </Suspense>
  );
}
