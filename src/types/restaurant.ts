export type PriceRange = {
  min: number;
  max: number;
};

export type Restaurant = {
  id: number;
  name: string;
  star: number;
  place: string;
  logo: string;
  images: string[];
  category: string;
  reviewCount: number;
  menuCount: number;
  priceRange: PriceRange;
};

export type Menu = {
  id: number;
  foodName: string;
  price: number;
  type: string;
  image: string;
};

export type RestaurantReview = {
  id: number;
  star: number;
  comment: string;
  createdAt: string;
  user?: {
    id?: number;
    name?: string;
    avatar?: string;
  };
};

export type RestaurantDetail = {
  id: number;
  name: string;
  star: number;
  averageRating: number;
  place: string;
  logo: string;
  images: string[];
  category: string;
  totalMenus: number;
  totalReviews: number;
  menus: Menu[];
  reviews: RestaurantReview[];
};
