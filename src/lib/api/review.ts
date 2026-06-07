import api from './axios';

import type { CreateReviewPayload, ReviewResponse } from '@/types/review';

// Membuat review untuk restaurant tertentu dari transaksi yang sudah selesai.
export const createReview = async (
  data: CreateReviewPayload
): Promise<ReviewResponse> => {
  const res = await api.post('/review', data);

  return res.data;
};
