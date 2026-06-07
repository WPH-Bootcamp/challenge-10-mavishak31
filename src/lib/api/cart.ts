import api from './axios';

import type { AddCartPayload, CartData } from '@/types/cart';

// Menampilkan isi cart user yang sedang login
export const getCart = async (): Promise<CartData> => {
  const res = await api.get('/cart');

  return res.data.data;
};

// Menambahkan menu ke cart
export const addToCart = async (data: AddCartPayload) => {
  const res = await api.post('/cart', data);

  return res.data;
};

// Mengubah jumlah item di cart
export const updateCartItem = async (id: number, quantity: number) => {
  const res = await api.put(`/cart/${id}`, { quantity });

  return res.data;
};

// Menghapus item dari cart
export const removeCartItem = async (id: number) => {
  const res = await api.delete(`/cart/${id}`);

  return res.data;
};

// Mengosongkan seluruh cart setelah checkout berhasil
export const clearCart = async () => {
  const res = await api.delete('/cart');

  return res.data;
};
