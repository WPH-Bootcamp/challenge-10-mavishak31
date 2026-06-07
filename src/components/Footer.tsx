import Image from 'next/image';
import Link from 'next/link';
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTiktok,
} from 'react-icons/fa';

// Link explore category menu.
const exploreLinks = [
  { href: '/category', label: 'All Food' },
  { href: '/category?rating=4', label: 'Nearby' },
  { href: '/category?priceMax=25000', label: 'Discount' },
  { href: '/category?sort=best-seller', label: 'Best Seller' },
  { href: '/category?category=Fried%20Chicken', label: 'Delivery' },
  { href: '/category?category=Rice%20%26%20Curry', label: 'Lunch' },
];

// Link navigasi cepat ke order
const helpLinks = [
  { href: '/category', label: 'How to Order' },
  { href: '/checkout', label: 'Payment Methods' },
  { href: '/orders', label: 'Track My Order' },
  { href: '/', label: 'FAQ' },
  { href: '/', label: 'Contact Us' },
];

// Social media pakai react-icons
const socialLinks = [
  {
    href: 'https://facebook.com',
    label: 'Facebook',
    icon: FaFacebookF,
  },
  {
    href: 'https://instagram.com',
    label: 'Instagram',
    icon: FaInstagram,
  },
  {
    href: 'https://linkedin.com',
    label: 'LinkedIn',
    icon: FaLinkedinIn,
  },
  {
    href: 'https://tiktok.com',
    label: 'TikTok',
    icon: FaTiktok,
  },
];

export default function Footer() {
  return (
    <footer className='mt-20 bg-[#070b10] px-7 py-12 text-white md:px-20 md:py-16'>
      <div className='mx-auto grid max-w-6xl grid-cols-2 gap-10 md:grid-cols-[1.5fr_1fr_1fr] md:gap-20'>
        {/* brand */}
        <div className='col-span-2 md:col-span-1'>
          <div className='mb-5 flex items-center gap-3'>
            <Image
              src='/images/logo-merah.png'
              alt='Foody logo'
              width={30}
              height={30}
            />
            <span className='text-2xl font-bold'>Foody</span>
          </div>

          <p className='max-w-sm text-sm leading-7 text-gray-300 md:text-[13px]'>
            Enjoy homemade flavors & chef&apos;s signature dishes, freshly
            prepared every day. Order online or visit our nearest branch.
          </p>

          <div className='mt-7'>
            <p className='mb-4 text-sm font-semibold'>Follow on Social Media</p>

            <div className='flex gap-3'>
              {socialLinks.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    aria-label={item.label}
                    target='_blank'
                    className='flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white transition hover:border-red-500 hover:text-red-500'
                  >
                    <Icon className='size-4' />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* explore */}
        <div>
          <h3 className='mb-6 text-sm font-semibold'>Explore</h3>

          <ul className='space-y-4 text-sm text-gray-300 md:text-[13px]'>
            {exploreLinks.map((item) => (
              <li key={item.label}>
                <Link href={item.href} className='hover:text-red-500'>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* help */}
        <div>
          <h3 className='mb-6 text-sm font-semibold'>Help</h3>

          <ul className='space-y-4 text-sm text-gray-300 md:text-[13px]'>
            {helpLinks.map((item) => (
              <li key={item.label}>
                <Link href={item.href} className='hover:text-red-500'>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
