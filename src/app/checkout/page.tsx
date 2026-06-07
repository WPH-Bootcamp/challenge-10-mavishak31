'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { clearCart, getCart } from '@/lib/api/cart';
import { checkoutOrder } from '@/lib/api/order';
import { checkoutSchema } from '@/lib/validations/order';
import { useAuthStore } from '@/store/auth';
import type { CartData } from '@/types/cart';
import type { CheckoutPayload } from '@/types/order';

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

// Menampilkan harga dengan format Rupiah
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(price);
};

export default function CheckoutPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const token = useAuthStore((state) => state.token);

  // Checkout hanya boleh diakses user yang sudah login
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

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormValues>({
    // Zod untuk memastikan address, phone, dan payment method valid sebelum submit
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      deliveryAddress: '',
      phone: '',
      paymentMethod: 'BNI Bank Negara Indonesia',
      notes: '',
    },
  });

  const checkoutMutation = useMutation({
    mutationFn: checkoutOrder,
    onSuccess: async () => {
      // Setelah checkout berhasil, cart dikosongkan
      await clearCart().catch(() => null);
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      router.push('/orders');
    },
    onError: (err) => {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.message || 'Checkout failed.'
        : 'Checkout failed.';

      setError('root', { message });
    },
  });

  const groups = cartData?.cart || [];
  const summary = cartData?.summary;

  const onSubmit = (values: CheckoutFormValues) => {
    if (groups.length === 0) {
      setError('root', { message: 'Your cart is empty.' });
      return;
    }

    // Payload untuk checkout.
    const payload: CheckoutPayload = {
      restaurants: groups.map((group) => ({
        restaurantId: group.restaurant.id,
        items: group.items.map((item) => ({
          menuId: item.menu.id,
          quantity: item.quantity,
        })),
      })),
      deliveryAddress: values.deliveryAddress,
      phone: values.phone,
      paymentMethod: values.paymentMethod,
      notes: values.notes,
    };

    checkoutMutation.mutate(payload);
  };

  if (isLoading) {
    return <main className='p-8'>Loading checkout...</main>;
  }

  if (isError) {
    return (
      <main className='p-8'>
        <p className='text-red-600'>Failed to load cart.</p>
      </main>
    );
  }

  return (
    <main className='min-h-screen bg-white px-6 py-8 md:px-10'>
      <div className='mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1fr_380px]'>
        <section>
          <div className='mb-8'>
            <h1 className='text-3xl font-bold'>Checkout</h1>
            <p className='mt-2 text-gray-500'>
              Complete your delivery details before placing the order.
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className='rounded-lg border border-gray-100 p-6 shadow-sm'
          >
            {errors.root?.message && (
              <p className='mb-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600'>
                {errors.root.message}
              </p>
            )}

            <div className='mb-5'>
              <label className='mb-2 block text-sm font-medium text-black'>
                Delivery Address
              </label>
              <Input
                placeholder='Jl. Sudirman No. 25, Jakarta Pusat'
                aria-invalid={Boolean(errors.deliveryAddress)}
                {...register('deliveryAddress')}
              />
              {errors.deliveryAddress?.message && (
                <p className='mt-2 text-sm text-red-600'>
                  {errors.deliveryAddress.message}
                </p>
              )}
            </div>

            <div className='mb-5'>
              <label className='mb-2 block text-sm font-medium text-black'>
                Phone
              </label>
              <Input
                type='tel'
                placeholder='081234567890'
                aria-invalid={Boolean(errors.phone)}
                {...register('phone')}
              />
              {errors.phone?.message && (
                <p className='mt-2 text-sm text-red-600'>
                  {errors.phone.message}
                </p>
              )}
            </div>

            <div className='mb-5'>
              <label className='mb-2 block text-sm font-medium text-black'>
                Payment Method
              </label>
              <select
                className='h-11 w-full rounded-lg border border-gray-300 bg-white px-4 text-sm text-black outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                {...register('paymentMethod')}
              >
                <option value='BNI Bank Negara Indonesia'>
                  BNI Bank Negara Indonesia
                </option>
                <option value='BCA Bank Central Asia'>
                  BCA Bank Central Asia
                </option>
                <option value='Cash on Delivery'>Cash on Delivery</option>
              </select>
              {errors.paymentMethod?.message && (
                <p className='mt-2 text-sm text-red-600'>
                  {errors.paymentMethod.message}
                </p>
              )}
            </div>

            <div className='mb-6'>
              <label className='mb-2 block text-sm font-medium text-black'>
                Notes
              </label>
              <textarea
                placeholder='Please ring the doorbell'
                className='min-h-28 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-black outline-none transition placeholder:text-gray-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                {...register('notes')}
              />
            </div>

            <Button
              type='submit'
              disabled={isSubmitting || checkoutMutation.isPending}
              className='h-12 w-full bg-red-600 text-white hover:bg-red-700'
            >
              {checkoutMutation.isPending ? 'Placing order...' : 'Place Order'}
            </Button>
          </form>
        </section>

        <aside className='h-fit rounded-lg border border-gray-100 p-5 shadow-sm'>
          <div className='mb-5 flex items-center justify-between'>
            <h2 className='text-xl font-bold'>Order Summary</h2>
            <Button asChild variant='link' className='text-red-600'>
              <Link href='/cart'>Edit</Link>
            </Button>
          </div>

          {groups.length === 0 ? (
            <p className='text-gray-500'>Your cart is empty.</p>
          ) : (
            <div className='space-y-5'>
              {groups.map((group) => (
                <section key={group.restaurant.id}>
                  <div className='mb-3 flex items-center gap-3'>
                    <div className='relative h-10 w-10 overflow-hidden rounded-lg bg-[#fff3e6]'>
                      <Image
                        src={group.restaurant.logo}
                        alt={group.restaurant.name}
                        fill
                        className='object-contain p-1'
                      />
                    </div>
                    <p className='font-semibold'>{group.restaurant.name}</p>
                  </div>

                  <div className='space-y-2'>
                    {group.items.map((item) => (
                      <div
                        key={item.id}
                        className='flex justify-between gap-4 text-sm'
                      >
                        <span className='text-gray-600'>
                          {item.quantity}x {item.menu.foodName}
                        </span>
                        <span>{formatPrice(item.itemTotal)}</span>
                      </div>
                    ))}
                  </div>
                </section>
              ))}

              <div className='space-y-3 border-t border-gray-100 pt-4 text-sm'>
                <div className='flex justify-between'>
                  <span className='text-gray-500'>Items</span>
                  <span>{summary?.totalItems || 0}</span>
                </div>
                <div className='flex justify-between text-base font-bold'>
                  <span>Total</span>
                  <span>{formatPrice(summary?.totalPrice || 0)}</span>
                </div>
              </div>
            </div>
          )}
        </aside>
      </div>
    </main>
  );
}
