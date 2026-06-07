import Link from 'next/link';
import Image from 'next/image';

import type { Restaurant } from '@/types/restaurant';

type Props = {
  restaurant: Restaurant;
};

// Resto card
export default function RestaurantCard({ restaurant }: Props) {
  return (
    <Link
      // Klik card ngelink ke halaman detail restaurant
      href={`/resto/${restaurant.id}`}
      className='
        bg-white
        rounded-2xl
        p-4
        border
        border-gray-100
        shadow-sm
        hover:shadow-md
        transition
      '
    >
      <div className='flex items-center gap-4'>
        <div className='w-14 h-14 rounded-xl overflow-hidden bg-[#fff3e6] flex items-center justify-center'>
          <Image
            src={restaurant.logo}
            alt={restaurant.name}
            width={40}
            height={40}
          />
        </div>

        <div>
          <h3 className='font-semibold text-lg'>{restaurant.name}</h3>
          <p className='text-yellow-500 text-sm'>⭐ {restaurant.star}</p>
          <p className='text-gray-500 text-sm'>{restaurant.place}</p>
          <p className='text-gray-500 text-sm'>{restaurant.category}</p>
        </div>
      </div>
    </Link>
  );
}
