'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

import { Button } from '@/components/ui/Button';
import {
  addToCart,
  getCart,
  removeCartItem,
  updateCartItem,
} from '@/lib/api/cart';
import { useAuthStore } from '@/store/auth';
import type { CartData } from '@/types/cart';

type Props = {
  restaurantId: number;
  menuId: number;
};

export default function AddToCartButton({ restaurantId, menuId }: Props) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const token = useAuthStore((state) => state.token);

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Baca cart, apakah menu ini sudah ada di cart
  const { data: cartData } = useQuery<CartData>({
    queryKey: ['cart'],
    queryFn: getCart,
    enabled: Boolean(token),
  });

  const cartItem = cartData?.cart
    .find((group) => group.restaurant.id === restaurantId)
    ?.items.find((item) => item.menu.id === menuId);

  // Handle error di cart
  const handleMutationError = (err: unknown) => {
    if (axios.isAxiosError(err)) {
      setError(err.response?.data?.message || 'Cart action failed.');
    } else {
      setError('Cart action failed.');
    }
  };

  const addCartMutation = useMutation({
    mutationFn: addToCart,
    onSuccess: () => {
      // Ambil ulang data cart setelah add
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      setMessage('Added to cart');
    },
    onError: handleMutationError,
  });

  const updateCartMutation = useMutation({
    mutationFn: ({ id, quantity }: { id: number; quantity: number }) =>
      updateCartItem(id, quantity),
    onSuccess: () => {
      // Setelah quantity berubah, cache cart diperbarui
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      setMessage('Cart updated');
    },
    onError: handleMutationError,
  });

  const removeCartMutation = useMutation({
    mutationFn: removeCartItem,
    onSuccess: () => {
      // Refresh cart setelah item di hapus
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      setMessage('Item removed');
    },
    onError: handleMutationError,
  });

  const isPending =
    addCartMutation.isPending ||
    updateCartMutation.isPending ||
    removeCartMutation.isPending;

  // User harus login dulu sebelum menambahkan item ke cart
  const requireLogin = () => {
    if (!token) {
      router.push('/login');
      return false;
    }

    return true;
  };

  // reset feedback
  const resetFeedback = () => {
    setMessage('');
    setError('');
  };

  // Add menu
  const handleAddToCart = () => {
    resetFeedback();

    if (!requireLogin()) {
      return;
    }

    addCartMutation.mutate({
      restaurantId,
      menuId,
      quantity: 1,
    });
  };

  // Increment quantity item
  const handleIncrement = () => {
    resetFeedback();

    if (!cartItem || !requireLogin()) {
      return;
    }

    updateCartMutation.mutate({
      id: cartItem.id,
      quantity: cartItem.quantity + 1,
    });
  };

  // Decrement quantity item
  const handleDecrement = () => {
    resetFeedback();

    if (!cartItem || !requireLogin()) {
      return;
    }

    if (cartItem.quantity <= 1) {
      removeCartMutation.mutate(cartItem.id);
      return;
    }

    updateCartMutation.mutate({
      id: cartItem.id,
      quantity: cartItem.quantity - 1,
    });
  };

  // Hapus item dari cart
  const handleRemove = () => {
    resetFeedback();

    if (!cartItem || !requireLogin()) {
      return;
    }

    removeCartMutation.mutate(cartItem.id);
  };

  return (
    <div className='mt-4'>
      {cartItem ? (
        <div className='flex items-center gap-2'>
          <Button
            type='button'
            variant='outline'
            size='icon'
            disabled={isPending}
            onClick={handleDecrement}
          >
            <Minus />
          </Button>

          <span className='flex h-10 min-w-12 items-center justify-center rounded-lg border border-gray-200 px-3 text-sm font-bold'>
            {cartItem.quantity}
          </span>

          <Button
            type='button'
            variant='outline'
            size='icon'
            disabled={isPending}
            onClick={handleIncrement}
          >
            <Plus />
          </Button>

          <Button
            type='button'
            variant='destructive'
            size='icon'
            disabled={isPending}
            onClick={handleRemove}
          >
            <Trash2 />
          </Button>
        </div>
      ) : (
        <Button
          type='button'
          onClick={handleAddToCart}
          disabled={isPending}
          className='h-10 w-full bg-red-600 text-white hover:bg-red-700'
        >
          {isPending ? 'Adding...' : 'Add to Cart'}
        </Button>
      )}

      {message && <p className='mt-2 text-sm text-green-600'>{message}</p>}
      {error && <p className='mt-2 text-sm text-red-600'>{error}</p>}
    </div>
  );
}
