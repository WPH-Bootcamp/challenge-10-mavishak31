export type CreateReviewPayload = {
  transactionId: string;
  restaurantId: number;
  star: number;
  comment?: string;
  menuIds?: number[];
};

export type ReviewResponse = {
  success: boolean;
  message: string;
  data: {
    review: {
      id: number;
      star: number;
      comment: string;
      transactionId: string;
      createdAt: string;
    };
  };
};
