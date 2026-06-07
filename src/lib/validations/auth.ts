import { z } from 'zod';

// Login
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

// Register
export const registerSchema = z
  .object({
    name: z.string().min(2),
    email: z.string().email(),
    phone: z.string(),
    password: z.string().min(6),
    confirmPassword: z.string().min(6),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Password confirmation does not match.',
    path: ['confirmPassword'],
  });
