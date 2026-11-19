/** Sample accessories from the approved design (prices in pounds). Replace with Rahim's real range. */
export type SampleProduct = {
  slug: string;
  category: string;
  name: string;
  brand: string;
  image: string;
  meta: string;
  flagText?: string;
  rating: number;
  reviewCount: number;
  popularity: number;
  price: number;
  wasPrice?: number;
  sizes?: string[];
  stock: number;
};

export const categories = [
  { slug: 'helmets', name: 'Helmets' },
  { slug: 'gloves', name: 'Gloves' },
  { slug: 'boots', name: 'Boots' },
  { slug: 'clothing', name: 'Clothing' },
  { slug: 'luggage', name: 'Luggage' },
  { slug: 'security', name: 'Security' },
];

const adult = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export const sampleProducts: SampleProduct[] = [
  { slug: 'full-face-sports-helmet', category: 'helmets', name: 'Full-face sports helmet, gloss black and red', brand: 'GearUp Select', image: '/assets/images/accessories/helmet-full-face.webp', meta: 'ECE 22.06 · Sizes XS to XXL', flagText: 'Best seller', rating: 4.5, reviewCount: 18, popularity: 1, price: 189.99, sizes: adult, stock: 4 },
  { slug: 'modular-flip-front-helmet', category: 'helmets', name: 'Modular flip-front helmet with sun visor', brand: 'Touring Line', image: '/assets/images/accessories/helmet-modular.webp', meta: 'ECE 22.06 · Pinlock ready', rating: 5, reviewCount: 9, popularity: 2, price: 229.99, sizes: adult, stock: 3 },
  { slug: 'summer-sports-gloves', category: 'gloves', name: 'Short summer sports gloves, leather and mesh', brand: 'GearUp Select', image: '/assets/images/accessories/gloves-summer.webp', meta: 'CE level 1 KP · Touchscreen tips', rating: 4.5, reviewCount: 31, popularity: 3, price: 39.99, sizes: ['S', 'M', 'L', 'XL'], stock: 6 },
  { slug: 'waterproof-winter-gloves', category: 'gloves', name: 'Waterproof winter touring gloves', brand: 'Touring Line', image: '/assets/images/accessories/gloves-winter.webp', meta: 'Waterproof liner · Thermal lining', flagText: 'Winter', rating: 5, reviewCount: 14, popularity: 4, price: 54.99, wasPrice: 64.99, sizes: ['S', 'M', 'L', 'XL'], stock: 5 },
  { slug: 'waterproof-touring-boots', category: 'boots', name: 'Waterproof mid-height touring boots', brand: 'Touring Line', image: '/assets/images/accessories/boots-touring.webp', meta: 'CE rated · Sizes 39 to 47', rating: 4.5, reviewCount: 11, popularity: 5, price: 129.99, sizes: ['39', '40', '41', '42', '43', '44', '45', '46', '47'], stock: 2 },
  { slug: 'textile-jacket-trouser-bundle', category: 'clothing', name: 'Textile jacket and trouser bundle, all-season', brand: 'GearUp Select', image: '/assets/images/accessories/jacket-trouser-bundle.webp', meta: 'CE armour · Removable thermal liner', flagText: 'Bundle', rating: 4.5, reviewCount: 22, popularity: 6, price: 249.99, wasPrice: 299.99, sizes: adult, stock: 2 },
  { slug: 'magnetic-tank-bag', category: 'luggage', name: 'Magnetic tank bag, 15 litre with phone window', brand: 'Road Series', image: '/assets/images/accessories/tank-bag.webp', meta: 'Rain cover included', rating: 4.5, reviewCount: 7, popularity: 7, price: 59.99, stock: 8 },
  { slug: 'heavy-duty-chain-lock', category: 'security', name: 'Heavy-duty chain and padlock, 1.5 metre', brand: 'Road Series', image: '/assets/images/accessories/chain-lock.webp', meta: 'Hardened steel · Fabric sleeve', flagText: 'Security', rating: 5, reviewCount: 16, popularity: 8, price: 89.99, stock: 10 },
];
