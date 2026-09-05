import type { Product } from './marketplace';
// Demo catalog, independent of presentation. Replace this repository with a backend adapter.
export const products: Product[] = [
  {
    id: 'iphone-17',
    name: 'iPhone 17',
    brand: 'Apple',
    image: '/images/iphone.webp',
    description:
      'A beautifully simple everyday upgrade. Choose your storage, then find a monthly payment that works for you.',
    specs: {
      Display: '6.3-inch OLED',
      Camera: 'Dual rear camera',
      Connectivity: '5G · USB-C',
      Warranty: '1-year manufacturer warranty',
    },
    variants: [
      {
        id: 'ip256',
        label: '256 GB',
        color: 'Black',
        price: 8290000,
        mrp: 8290000,
        available: true,
      },
      {
        id: 'ip512',
        label: '512 GB',
        color: 'Black',
        price: 10290000,
        mrp: 10290000,
        available: true,
      },
    ],
    tenures: [3, 6, 12, 24],
  },
  {
    id: 'pixel-10',
    name: 'Google Pixel 10',
    brand: 'Google',
    image: '/images/pixel.webp',
    description:
      'Helpful by design, with a sharp display and a versatile camera. Select your storage and explore no-cost installments.',
    specs: {
      Display: '6.3-inch OLED',
      Camera: 'Triple rear camera',
      Connectivity: '5G · USB-C',
      Warranty: '1-year manufacturer warranty',
    },
    variants: [
      {
        id: 'px256',
        label: '256 GB',
        color: 'Indigo',
        price: 7499900,
        mrp: 7999900,
        available: true,
      },
      {
        id: 'px512',
        label: '512 GB',
        color: 'Indigo',
        price: 8999900,
        mrp: 9499900,
        available: false,
      },
    ],
    tenures: [3, 6, 12],
  },
  {
    id: 'galaxy-s25',
    name: 'Galaxy S25 Ultra',
    brand: 'Samsung',
    image: '/images/samsung.webp',
    description:
      'A premium Galaxy experience for work, photos and everything in between. Pick a variant and spread your payments.',
    specs: {
      Display: '6.9-inch AMOLED',
      Camera: '200 MP main camera',
      Connectivity: '5G · USB-C',
      Warranty: '1-year manufacturer warranty',
    },
    variants: [
      {
        id: 'sg256',
        label: '256 GB',
        color: 'Titanium Silverblue',
        price: 11999900,
        mrp: 12999900,
        available: true,
      },
      {
        id: 'sg512',
        label: '512 GB',
        color: 'Titanium Silverblue',
        price: 13199900,
        mrp: 14199900,
        available: true,
      },
    ],
    tenures: [3, 6, 12, 24],
  },
  {
    id: 'macbook-pro',
    name: 'MacBook Pro',
    brand: 'Apple',
    image: '/images/macbook.webp',
    description:
      'Power for your next big idea. Explore the configuration and choose a comfortable monthly payment.',
    specs: {
      Display: '14-inch Liquid Retina XDR',
      Memory: '16 GB unified memory',
      Connectivity: 'Wi-Fi · USB-C',
      Warranty: '1-year manufacturer warranty',
    },
    variants: [
      {
        id: 'mb512',
        label: '512 GB',
        color: 'Space Black',
        price: 16990000,
        mrp: 16990000,
        available: true,
      },
      {
        id: 'mb1tb',
        label: '1 TB',
        color: 'Space Black',
        price: 18990000,
        mrp: 18990000,
        available: true,
      },
    ],
    tenures: [6, 12, 24],
  },
];
