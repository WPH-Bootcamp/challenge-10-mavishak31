import api from './axios';

import type {
  CheckoutPayload,
  CheckoutResponse,
  OrdersData,
} from '@/types/order';

// Kirim order ke API berdasarkan isi cart
export const checkoutOrder = async (
  data: CheckoutPayload
): Promise<CheckoutResponse> => {
  const res = await api.post('/order/checkout', data);

  return res.data;
};

// Ambil history order uuntuk halaman My Orders
export const getMyOrders = async (status = 'done'): Promise<OrdersData> => {
  const res = await api.get('/order/my-order', {
    params: {
      status,
      page: 1,
      limit: 10,
    },
  });

  return res.data.data;
};
