'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { Button } from '@/components/ui/Button';
import { getCart, removeCartItem, updateCartItem } from '@/lib/api/cart';
import { useAuthStore } from '@/store/auth';
import type { CartData } from '@/types/cart';

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(price);
};

export default function CartPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const token = useAuthStore((state) => state.token);

  // User yang belum login diarahkan ke halaman login
  useEffect(() => {
    if (!token) {
      router.push('/login');
    }
  }, [token, router]);

  const {
    data: cartData,
    isLoading,
    isError,
  } = useQuery<CartData>({
    queryKey: ['cart'],
    queryFn: getCart,
    enabled: Boolean(token),
  });

  const updateCartMutation = useMutation({
    mutationFn: ({ id, quantity }: { id: number; quantity: number }) =>
      updateCartItem(id, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  // Mutation untuk menghapus satu item dari cart
  const removeCartMutation = useMutation({
    mutationFn: removeCartItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  const isUpdating =
    updateCartMutation.isPending || removeCartMutation.isPending;

  // Mengubah quantity item, quantity di bawah 1 tidak dikirim ke API
  const handleUpdateQuantity = (id: number, quantity: number) => {
    if (quantity < 1) {
      return;
    }

    updateCartMutation.mutate({ id, quantity });
  };

  // Menghapus item dari cart
  const handleRemoveItem = (id: number) => {
    removeCartMutation.mutate(id);
  };

  if (isLoading) {
    return <main className='p-8'>Loading cart...</main>;
  }

  if (isError) {
    return (
      <main className='p-8'>
        <p className='text-red-600'>Failed to load cart.</p>
      </main>
    );
  }

  const groups = cartData?.cart || [];
  const summary = cartData?.summary;

  return (
    <main className='min-h-screen bg-white px-6 py-8 md:px-10'>
      <div className='mx-auto max-w-5xl'>
        <div className='mb-8 flex items-center justify-between'>
          <div>
            <h1 className='text-3xl font-bold'>Your Cart</h1>
            <p className='mt-2 text-gray-500'>
              {summary?.totalItems || 0} items from{' '}
              {summary?.restaurantCount || 0} restaurants
            </p>
          </div>

          <Button asChild variant='link' className='text-red-600'>
            <Link href='/category'>Add More</Link>
          </Button>
        </div>

        {groups.length === 0 ? (
          <div className='rounded-lg border border-gray-100 p-8 text-center'>
            <p className='text-gray-500'>Your cart is empty.</p>
            <Button asChild className='mt-4 bg-red-600 text-white'>
              <Link href='/category'>Browse Restaurants</Link>
            </Button>
          </div>
        ) : (
          <div className='grid gap-8 lg:grid-cols-[1fr_320px]'>
            <div className='space-y-6'>
              {/* cart berdasarkan restaurant */}
              {groups.map((group) => (
                <section
                  key={group.restaurant.id}
                  className='rounded-lg border border-gray-100 p-5 shadow-sm'
                >
                  <div className='mb-5 flex items-center gap-3'>
                    <div className='relative h-12 w-12 overflow-hidden rounded-lg bg-[#fff3e6]'>
                      <Image
                        src={group.restaurant.logo}
                        alt={group.restaurant.name}
                        fill
                        className='object-contain p-1'
                      />
                    </div>

                    <div>
                      <h2 className='font-bold'>{group.restaurant.name}</h2>
                      <p className='text-sm text-gray-500'>
                        Subtotal {formatPrice(group.subtotal)}
                      </p>
                    </div>
                  </div>

                  <div className='space-y-4'>
                    {/* Di dalam setiap restaurant ada daftar menu */}
                    {group.items.map((item) => (
                      <div
                        key={item.id}
                        className='grid gap-4 border-t border-gray-100 pt-4 md:grid-cols-[80px_1fr_auto]'
                      >
                        <div className='relative h-20 w-20 overflow-hidden rounded-lg bg-gray-50'>
                          <Image
                            src={item.menu.image}
                            alt={item.menu.foodName}
                            fill
                            className='object-cover'
                          />
                        </div>

                        <div>
                          <p className='font-semibold'>{item.menu.foodName}</p>
                          <p className='text-sm capitalize text-gray-500'>
                            {item.menu.type}
                          </p>
                          <p className='mt-1 font-bold text-red-600'>
                            {formatPrice(item.menu.price)}
                          </p>
                        </div>

                        <div className='flex items-center gap-3 md:justify-end'>
                          <Button
                            type='button'
                            variant='outline'
                            size='icon'
                            disabled={isUpdating}
                            onClick={() =>
                              handleUpdateQuantity(item.id, item.quantity - 1)
                            }
                          >
                            <Minus />
                          </Button>

                          <span className='w-6 text-center font-semibold'>
                            {item.quantity}
                          </span>

                          <Button
                            type='button'
                            variant='outline'
                            size='icon'
                            disabled={isUpdating}
                            onClick={() =>
                              handleUpdateQuantity(item.id, item.quantity + 1)
                            }
                          >
                            <Plus />
                          </Button>

                          <Button
                            type='button'
                            variant='destructive'
                            size='icon'
                            disabled={isUpdating}
                            onClick={() => handleRemoveItem(item.id)}
                          >
                            <Trash2 />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </div>

            <aside className='h-fit rounded-lg border border-gray-100 p-5 shadow-sm'>
              <h2 className='text-xl font-bold'>Summary</h2>

              <div className='mt-5 space-y-3 text-sm'>
                <div className='flex justify-between'>
                  <span className='text-gray-500'>Items</span>
                  <span>{summary?.totalItems || 0}</span>
                </div>

                <div className='flex justify-between'>
                  <span className='text-gray-500'>Restaurants</span>
                  <span>{summary?.restaurantCount || 0}</span>
                </div>

                <div className='flex justify-between border-t border-gray-100 pt-3 text-base font-bold'>
                  <span>Total</span>
                  <span>{formatPrice(summary?.totalPrice || 0)}</span>
                </div>
              </div>

              <Button
                asChild
                className='mt-6 h-12 w-full bg-red-600 text-white hover:bg-red-700'
              >
                <Link href='/checkout'>Checkout</Link>
              </Button>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
