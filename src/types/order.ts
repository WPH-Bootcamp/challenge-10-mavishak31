export type CheckoutRestaurantPayload = {
  restaurantId: number;
  items: {
    menuId: number;
    quantity: number;
  }[];
};

export type CheckoutPayload = {
  restaurants: CheckoutRestaurantPayload[];
  deliveryAddress: string;
  phone?: string;
  paymentMethod?: string;
  notes?: string;
};

export type OrderPricing = {
  subtotal: number;
  serviceFee: number;
  deliveryFee: number;
  totalPrice: number;
};

export type OrderRestaurant = {
  restaurant: {
    id: number;
    name: string;
    logo: string;
  };
  items: {
    menuId: number;
    menuName: string;
    price: number;
    image?: string | null;
    quantity: number;
    itemTotal: number;
  }[];
  subtotal: number;
};

export type Order = {
  id: number;
  transactionId: string;
  status: string;
  paymentMethod: string;
  deliveryAddress?: string;
  phone?: string;
  pricing: OrderPricing;
  restaurants: OrderRestaurant[];
  createdAt: string;
  updatedAt?: string;
};

export type OrdersData = {
  orders: Order[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  filter?: {
    status?: string;
  };
};

export type CheckoutResponse = {
  success: boolean;
  message: string;
  data: {
    transaction: Order;
  };
};
