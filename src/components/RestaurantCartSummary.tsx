'use client';

import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

import { Button } from '@/components/ui/Button';
import { getCart } from '@/lib/api/cart';
import { useAuthStore } from '@/store/auth';
import type { CartData } from '@/types/cart';

type Props = {
  restaurantId: number;
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(price);
};

export default function RestaurantCartSummary({ restaurantId }: Props) {
  // Cart hanya dibaca ketika user sudah login
  const token = useAuthStore((state) => state.token);

  // Ambil data cart
  const { data: cartData } = useQuery<CartData>({
    queryKey: ['cart'],
    queryFn: getCart,
    enabled: Boolean(token),
  });

  // Cari group cart yang sesuai
  const restaurantCart = cartData?.cart.find(
    (group) => group.restaurant.id === restaurantId
  );

  const totalItems =
    restaurantCart?.items.reduce((total, item) => total + item.quantity, 0) ||
    0;

  // Menampilkan button checkout jika sudah add min 1 item
  if (!token || !restaurantCart || totalItems === 0) {
    return null;
  }

  return (
    <div className='flex w-full items-center justify-between gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm md:w-auto md:min-w-80'>
      <div className='flex items-center gap-3'>
        <div className='flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-red-600'>
          <ShoppingBag className='size-5' />
        </div>

        <div>
          <p className='text-sm font-semibold'>{totalItems} items</p>
          <p className='text-sm font-bold text-red-600'>
            {formatPrice(restaurantCart.subtotal)}
          </p>
        </div>
      </div>

      <Button
        asChild
        className='h-10 rounded-full bg-red-600 px-8 text-white hover:bg-red-700'
      >
        <Link href='/checkout'>Checkout</Link>
      </Button>
    </div>
  );
}
