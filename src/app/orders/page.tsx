'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { ClipboardList, LogOut, MapPin, Search, Star, X } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { getProfile } from '@/lib/api/auth';
import { getMyOrders } from '@/lib/api/order';
import { createReview } from '@/lib/api/review';
import { useAuthStore } from '@/store/auth';
import type { Order, OrderRestaurant, OrdersData } from '@/types/order';
import type { CreateReviewPayload } from '@/types/review';

const orderStatuses = [
  'preparing',
  'on_the_way',
  'delivered',
  'done',
  'cancelled',
];

// ReviewTarget buat nyimpen informasi order mana yang lagi direview
type ReviewTarget = {
  transactionId: string;
  restaurantId: number;
  restaurantName: string;
  menuIds: number[];
};

// Menampilkan harga dengan format Rupiah.
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(price);
};

export default function OrdersPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const token = useAuthStore((state) => state.token);
  const logout = useAuthStore((state) => state.logout);

  const [status, setStatus] = useState('done');
  const [search, setSearch] = useState('');
  const [reviewTarget, setReviewTarget] = useState<ReviewTarget | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewError, setReviewError] = useState('');

  // My Orders hanya bisa dibuka oleh user yang sudah login
  useEffect(() => {
    if (!token) {
      router.push('/login');
    }
  }, [token, router]);

  // Profile
  const { data: profileResponse } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
    enabled: Boolean(token),
  });

  // Orders
  const { data, isLoading, isError } = useQuery<OrdersData>({
    queryKey: ['orders', status],
    queryFn: () => getMyOrders(status),
    enabled: Boolean(token),
  });

  const profile = profileResponse?.data;
  const profileImage = profile?.avatar || '/images/profile.jpg';
  const profileName = profile?.name || 'John Doe';

  // Search filter transaksi
  const filteredOrders = useMemo(() => {
    const orders = data?.orders || [];
    const keyword = search.toLowerCase();

    if (!keyword) {
      return orders;
    }

    return orders.filter((order) => {
      const restaurantNames = order.restaurants
        .map((group) => group.restaurant.name)
        .join(' ')
        .toLowerCase();

      return (
        order.transactionId.toLowerCase().includes(keyword) ||
        restaurantNames.includes(keyword)
      );
    });
  }, [data?.orders, search]);

  // Mengirim rating dan komentar user ke review
  const reviewMutation = useMutation({
    mutationFn: createReview,
    onSuccess: () => {
      setReviewTarget(null);
      setComment('');
      setRating(5);
      setReviewError('');
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
    onError: (err) => {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.message || 'Failed to submit review.'
        : 'Failed to submit review.';

      setReviewError(message);
    },
  });

  const handleLogout = () => {
    // Logout dari sidebar
    logout();
    router.push('/login');
  };

  // Saat tombol Give Review diklik, simpan data order ke modal
  const openReviewModal = (order: Order, group: OrderRestaurant) => {
    setReviewTarget({
      transactionId: order.transactionId,
      restaurantId: group.restaurant.id,
      restaurantName: group.restaurant.name,
      menuIds: group.items.map((item) => item.menuId),
    });
    setRating(5);
    setComment('');
    setReviewError('');
  };

  // Submit review mengirim rating, komentar, restaurantId, transactionId, dan menuIds
  const handleSubmitReview = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!reviewTarget) {
      return;
    }

    const payload: CreateReviewPayload = {
      transactionId: reviewTarget.transactionId,
      restaurantId: reviewTarget.restaurantId,
      star: rating,
      comment,
      menuIds: reviewTarget.menuIds,
    };

    reviewMutation.mutate(payload);
  };

  if (isLoading) {
    return <main className='p-8'>Loading orders...</main>;
  }

  if (isError) {
    return (
      <main className='p-8'>
        <p className='text-red-600'>Failed to load orders.</p>
      </main>
    );
  }

  return (
    <main className='min-h-screen bg-white px-6 py-8 md:px-10'>
      <div className='mx-auto grid max-w-6xl gap-8 md:grid-cols-[240px_1fr]'>
        <aside className='h-fit rounded-lg border border-gray-100 p-5 shadow-sm'>
          <Link href='/profile' className='mb-5 flex items-center gap-3'>
            <Image
              src={profileImage}
              alt={profileName}
              width={42}
              height={42}
              className='rounded-full'
            />
            <p className='font-semibold'>{profileName}</p>
          </Link>

          <div className='space-y-1 border-t border-gray-100 pt-4 text-sm'>
            <Link
              href='/profile#delivery-address'
              className='flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-gray-50'
            >
              <MapPin className='size-4' />
              Delivery Address
            </Link>

            <Link
              href='/orders'
              className='flex items-center gap-3 rounded-lg px-2 py-2 text-red-600 hover:bg-red-50'
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
          <h1 className='mb-6 text-3xl font-bold'>My Orders</h1>

          <div className='mb-5 rounded-lg border border-gray-100 bg-white p-5 shadow-sm'>
            <div className='relative mb-5'>
              <Search className='absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400' />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder='Search'
                className='pl-10'
              />
            </div>

            <div className='flex flex-wrap items-center gap-2'>
              <span className='mr-1 text-sm font-semibold'>Status</span>
              {orderStatuses.map((item) => (
                <Button
                  key={item}
                  type='button'
                  variant={status === item ? 'default' : 'outline'}
                  className={
                    status === item
                      ? 'h-8 rounded-full bg-red-600 px-4 text-white hover:bg-red-700'
                      : 'h-8 rounded-full bg-white px-4 text-black'
                  }
                  onClick={() => setStatus(item)}
                >
                  {item.replaceAll('_', ' ')}
                </Button>
              ))}
            </div>
          </div>

          {filteredOrders.length === 0 ? (
            <div className='rounded-lg border border-gray-100 p-8 text-center'>
              <p className='text-gray-500'>No orders found.</p>
            </div>
          ) : (
            <div className='space-y-5'>
              {filteredOrders.map((order) =>
                order.restaurants.map((group) => (
                  <section
                    key={`${order.transactionId}-${group.restaurant.id}`}
                    className='rounded-lg border border-gray-100 bg-white p-5 shadow-sm'
                  >
                    <div className='mb-4 flex items-center gap-2'>
                      <div className='relative h-6 w-6 overflow-hidden rounded bg-[#fff3e6]'>
                        <Image
                          src={group.restaurant.logo}
                          alt={group.restaurant.name}
                          fill
                          className='object-contain p-1'
                        />
                      </div>
                      <p className='font-semibold'>{group.restaurant.name}</p>
                    </div>

                    <div className='space-y-3'>
                      {group.items.map((item) => (
                        <div
                          key={`${order.transactionId}-${item.menuId}`}
                          className='flex gap-3'
                        >
                          <div className='relative h-16 w-16 overflow-hidden rounded-lg bg-gray-50'>
                            <Image
                              src={item.image || '/images/hero-banner.png'}
                              alt={item.menuName}
                              fill
                              className='object-cover'
                            />
                          </div>

                          <div>
                            <p className='text-sm font-semibold'>
                              {item.menuName}
                            </p>
                            <p className='text-sm text-gray-700'>
                              {item.quantity} x {formatPrice(item.price)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className='mt-5 flex items-end justify-between border-t border-gray-100 pt-4'>
                      <div>
                        <p className='text-xs text-gray-500'>Total</p>
                        <p className='font-bold'>
                          {formatPrice(group.subtotal)}
                        </p>
                      </div>

                      <Button
                        type='button'
                        onClick={() => openReviewModal(order, group)}
                        className='h-10 min-w-44 rounded-full bg-red-600 text-white hover:bg-red-700'
                      >
                        Give Review
                      </Button>
                    </div>
                  </section>
                ))
              )}
            </div>
          )}
        </section>
      </div>

      {reviewTarget && (
        <div className='fixed inset-0 z-[100] flex items-center justify-center bg-black/55 px-4'>
          <form
            onSubmit={handleSubmitReview}
            className='w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl'
          >
            <div className='mb-5 flex items-center justify-between'>
              <div>
                <h2 className='font-bold'>Give Review</h2>
                <p className='mt-1 text-xs text-gray-500'>
                  {reviewTarget.restaurantName}
                </p>
              </div>

              <button
                type='button'
                onClick={() => setReviewTarget(null)}
                className='rounded-full p-1 hover:bg-gray-50'
              >
                <X className='size-4' />
              </button>
            </div>

            <div className='mb-5 text-center'>
              <p className='mb-3 text-sm font-semibold'>Give Rating</p>
              <div className='flex justify-center gap-1'>
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type='button'
                    onClick={() => setRating(value)}
                    className='p-1'
                  >
                    <Star
                      className={
                        value <= rating
                          ? 'size-7 fill-yellow-400 text-yellow-400'
                          : 'size-7 fill-gray-300 text-gray-300'
                      }
                    />
                  </button>
                ))}
              </div>
            </div>

            <textarea
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              placeholder='Please share your thoughts about our service.'
              className='mb-4 min-h-32 w-full resize-none rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
            />

            {reviewError && (
              <p className='mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600'>
                {reviewError}
              </p>
            )}

            <Button
              type='submit'
              disabled={reviewMutation.isPending}
              className='h-11 w-full rounded-full bg-red-600 text-white hover:bg-red-700'
            >
              {reviewMutation.isPending ? 'Sending...' : 'Send'}
            </Button>
          </form>
        </div>
      )}
    </main>
  );
}
