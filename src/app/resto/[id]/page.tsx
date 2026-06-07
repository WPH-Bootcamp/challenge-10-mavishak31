import Image from 'next/image';
import { notFound } from 'next/navigation';

import AddToCartButton from '@/components/AddToCartButton';
import RestaurantCartSummary from '@/components/RestaurantCartSummary';
import type { RestaurantDetail } from '@/types/restaurant';

type Props = {
  params: Promise<{
    id: string;
  }>;
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(price);
};

const formatReviewDate = (date: string) => {
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date));
};

export default async function RestaurantDetailPage({ params }: Props) {
  const { id } = await params;

  // Detail restaurant dari API
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/resto/${id}`,
    {
      cache: 'no-store',
    }
  );

  if (!res.ok) {
    notFound();
  }

  const json = await res.json();
  const restaurant: RestaurantDetail = json.data;

  // Jika id salah atau data tidak lengkap, tampilkan halaman 404
  if (!restaurant || restaurant.images.length === 0) {
    notFound();
  }

  // Reviews berdasarkan restaurant
  const reviews = restaurant.reviews || [];

  return (
    <main className='min-h-screen bg-white'>
      <div className='relative w-full h-[400px]'>
        <Image
          src={restaurant.images[0]}
          alt={restaurant.name}
          fill
          className='object-cover'
          priority
        />
      </div>

      <section className='max-w-5xl mx-auto px-7 py-10'>
        <div className='flex items-center gap-5'>
          <div className='relative w-20 h-20 rounded-2xl overflow-hidden bg-[#fff3e6]'>
            <Image
              src={restaurant.logo}
              alt={`${restaurant.name} logo`}
              fill
              className='object-contain p-2'
            />
          </div>

          <div>
            <h1 className='text-4xl font-bold'>{restaurant.name}</h1>
            <p className='mt-2 text-gray-500'>{restaurant.category}</p>
          </div>
        </div>

        <div className='flex gap-5 mt-6 text-sm'>
          <p className='text-yellow-500'>⭐ {restaurant.averageRating}</p>
          <p className='text-gray-600'>{restaurant.place}</p>
          <p className='text-gray-600'>{restaurant.totalMenus} menus</p>
          <p className='text-gray-600'>{restaurant.totalReviews} reviews</p>
        </div>

        <section className='mt-10'>
          <div className='mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
            <h2 className='text-2xl font-bold'>Menu</h2>

            {/* Muncul otomatis ketika minimal ada 1 item dari restaurant ini di cart. */}
            <RestaurantCartSummary restaurantId={restaurant.id} />
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            {restaurant.menus.map((menu) => (
              <div
                key={menu.id}
                className='border border-gray-100 rounded-2xl overflow-hidden shadow-sm'
              >
                <div className='relative w-full h-40 bg-gray-50'>
                  <Image
                    src={menu.image}
                    alt={menu.foodName}
                    fill
                    className='object-cover'
                  />
                </div>

                <div className='p-4'>
                  <p className='font-semibold'>{menu.foodName}</p>
                  <p className='text-sm text-gray-500 capitalize'>
                    {menu.type}
                  </p>
                  <p className='mt-2 font-bold text-red-500'>
                    {formatPrice(menu.price)}
                  </p>

                  {/* Tambah menu ke cart */}
                  <AddToCartButton
                    restaurantId={restaurant.id}
                    menuId={menu.id}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className='mt-14'>
          <div className='mb-5 flex items-end justify-between gap-4'>
            <div>
              <h2 className='text-2xl font-bold'>Review</h2>
              <p className='mt-2 text-sm text-gray-500'>
                Review ini diambil dari user yang pernah membeli menu di{' '}
                {restaurant.name}.
              </p>
            </div>

            <div className='text-right text-sm'>
              <p className='font-semibold text-yellow-500'>
                ⭐ {restaurant.averageRating}
              </p>
              <p className='text-gray-500'>{restaurant.totalReviews} reviews</p>
            </div>
          </div>

          {reviews.length === 0 ? (
            <div className='rounded-2xl border border-gray-100 p-8 text-center text-gray-500 shadow-sm'>
              Belum ada review untuk restaurant ini.
            </div>
          ) : (
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              {reviews.map((review) => {
                const userName = review.user?.name || 'Foody User';
                const userAvatar = review.user?.avatar || '/images/profile.jpg';

                return (
                  <article
                    key={review.id}
                    className='rounded-2xl border border-gray-100 bg-white p-5 shadow-sm'
                  >
                    <div className='mb-4 flex items-center gap-3'>
                      <Image
                        src={userAvatar}
                        alt={userName}
                        width={42}
                        height={42}
                        className='rounded-full object-cover'
                      />

                      <div>
                        <p className='font-semibold'>{userName}</p>
                        <p className='text-xs text-gray-500'>
                          {formatReviewDate(review.createdAt)}
                        </p>
                      </div>
                    </div>

                    <div className='mb-3 flex gap-1 text-yellow-400'>
                      {Array.from({ length: 5 }).map((_, index) => (
                        <span key={index}>
                          {index < review.star ? '★' : '☆'}
                        </span>
                      ))}
                    </div>

                    <p className='text-sm leading-6 text-gray-600'>
                      {review.comment || 'User tidak menulis komentar.'}
                    </p>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
