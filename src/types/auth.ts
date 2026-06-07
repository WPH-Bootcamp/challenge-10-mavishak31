export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  name: string;
  email: string;
  phone: string;
  password: string;
};

export type User = {
  id: number;
  name: string;
  email: string;
  phone: string;
  avatar?: string | null;
};

export type AuthResponse = {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
};

export type ProfileResponse = {
  success: boolean;
  message: string;
  data: User;
};
