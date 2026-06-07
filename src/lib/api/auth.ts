import api from './axios';

import type {
  AuthResponse,
  LoginPayload,
  ProfileResponse,
  RegisterPayload,
} from '@/types/auth';

// Kirim email dan password ke API
export const loginUser = async (data: LoginPayload): Promise<AuthResponse> => {
  const res = await api.post('/auth/login', data);
  return res.data;
};

// Halaman register, setelah sukses lempar user ke login
export const registerUser = async (
  data: RegisterPayload
): Promise<AuthResponse> => {
  const res = await api.post('/auth/register', data);
  return res.data;
};

// Ambil data user yang sedang login untuk Navbar, sidebar, dan profile
export const getProfile = async (): Promise<ProfileResponse> => {
  const res = await api.get('/auth/profile');

  return res.data;
};

// Untuk mengubah data profile
export const updateProfile = async (
  data: FormData
): Promise<ProfileResponse> => {
  const res = await api.put('/auth/profile', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return res.data;
};
