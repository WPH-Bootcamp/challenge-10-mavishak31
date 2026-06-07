export type CartMenu = {
  id: number;
  foodName: string;
  price: number;
  type: string;
  image: string;
};

export type CartRestaurant = {
  id: number;
  name: string;
  logo: string;
};

export type CartItem = {
  id: number;
  menu: CartMenu;
  quantity: number;
  itemTotal: number;
};

export type CartGroup = {
  restaurant: CartRestaurant;
  items: CartItem[];
  subtotal: number;
};

export type CartSummary = {
  totalItems: number;
  totalPrice: number;
  restaurantCount: number;
};

export type CartData = {
  cart: CartGroup[];
  summary: CartSummary;
};

export type AddCartPayload = {
  restaurantId: number;
  menuId: number;
  quantity?: number;
};
