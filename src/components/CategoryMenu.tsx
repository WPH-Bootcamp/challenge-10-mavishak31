'use client';

import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/auth';

// List Category Menu
const guestCategories = [
  {
    href: '/category',
    image: '/images/all-resto-icon.png',
    title: 'All Restaurant',
  },
  {
    href: '/category?rating=4',
    image: '/images/nearby-icon.png',
    title: 'Nearby',
  },
  {
    href: '/category?priceMax=25000',
    image: '/images/discount-icon.png',
    title: 'Discount',
  },
  {
    href: '/category?sort=best-seller',
    image: '/images/best-sell-icon.png',
    title: 'Best Seller',
  },
  {
    href: '/category?category=Fried%20Chicken',
    image: '/images/delivery-icon.png',
    title: 'Delivery',
  },
  {
    href: '/category?category=Rice%20%26%20Curry',
    image: '/images/lunch-icon.png',
    title: 'Lunch',
  },
];

// List category menu setelah login
const userCategories = [
  {
    href: '/category',
    image: '/images/all-resto-icon.png',
    title: 'All Restaurant',
  },
  {
    href: '/category?rating=4',
    image: '/images/nearby-icon.png',
    title: 'Nearby',
  },
  {
    href: '/category?sort=best-seller',
    image: '/images/best-sell-icon.png',
    title: 'Best Seller',
  },
  {
    href: '/category?category=Rice%20%26%20Curry',
    image: '/images/lunch-icon.png',
    title: 'Lunch',
  },
];

export default function CategoryMenu() {
  // Setting menu guest atau login
  const token = useAuthStore((state) => state.token);
  const categories = token ? userCategories : guestCategories;

  return (
    <section className='px-8 -mt-10 relative z-20'>
      {/* Setiap item ngelink filter ke halaman category */}
      <div
        className='
          bg-white
          rounded-2xl
          shadow-md
          p-6
          grid
          grid-cols-2
          gap-5
          md:flex
          md:justify-around
        '
      >
        {categories.map((item) => (
          <Button
            key={item.title}
            asChild
            variant='outline'
            className='h-24 w-full flex-col gap-3 rounded-xl border-gray-100 bg-white text-black hover:shadow-sm md:max-w-28'
          >
            <Link href={item.href}>
              {/* Image icon mengikuti asset dari public/images */}
              <Image
                src={item.image}
                alt={`${item.title} icon`}
                width={38}
                height={38}
                className='object-contain'
              />

              {/* label */}
              <span className='text-sm'>{item.title}</span>
            </Link>
          </Button>
        ))}
      </div>
    </section>
  );
}
