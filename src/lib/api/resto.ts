import api from './axios';

import type { Restaurant, RestaurantDetail } from '@/types/restaurant';

export type RestaurantFilterParams = {
  location?: string;
  range?: number;
  priceMin?: number;
  priceMax?: number;
  rating?: number;
  category?: string;
  page?: number;
  limit?: number;
};

// Menampilkan list restaurant
export const getRestaurants = async (
  params?: RestaurantFilterParams
): Promise<Restaurant[]> => {
  const res = await api.get('/resto', { params });

  return res.data.data.restaurants;
};

// Search nama restaurant
export const searchRestaurants = async (q: string): Promise<Restaurant[]> => {
  const res = await api.get('/resto/search', {
    params: {
      q,
      page: 1,
      limit: 20,
    },
  });

  return res.data.data.restaurants;
};

// Mengambil best seller restaurant
export const getBestSellerRestaurants = async (): Promise<Restaurant[]> => {
  const res = await api.get('/resto/best-seller', {
    params: {
      page: 1,
      limit: 20,
    },
  });

  return res.data.data.restaurants;
};

// Mengambil menu dan review restaurant
export const getRestaurantById = async (
  id: string
): Promise<RestaurantDetail> => {
  const res = await api.get(`/resto/${id}`);

  return res.data.data;
};
