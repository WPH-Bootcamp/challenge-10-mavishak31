import { z } from 'zod';

export const checkoutSchema = z.object({
  deliveryAddress: z.string().min(10, 'Delivery address is too short.'),
  phone: z.string().min(8, 'Phone number is too short.'),
  paymentMethod: z.string().min(1, 'Please choose a payment method.'),
  notes: z.string().optional(),
});
