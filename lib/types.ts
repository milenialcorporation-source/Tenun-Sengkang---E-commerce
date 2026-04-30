export type ImageInput = {
  type: 'url' | 'base64';
  data: string;
};

export type HeroSlide = {
  id: string;
  image?: ImageInput;
  title: string;
  subtitle: string;
  ctaText: string;
  hideContent?: boolean;
};

export type Collection = {
  id: string;
  name: string;
  description: string;
  image?: ImageInput;
};

export type Product = {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  image?: ImageInput;
  images?: ImageInput[];
  isManual: boolean;
  shopeeLink?: string;
  tokopediaLink?: string;
};

export type FeaturedSection = {
  id: string;
  title: string;
  type: 'category' | 'products';
  categoryId?: string; // If 'category', choose a category to filter by
  productIds?: string[]; // If 'products', choose specific products
};

export type MegaMenuCard = {
  id: string;
  title: string;
  image?: ImageInput;
  link: string;
};

export type StoreState = {
  logo?: ImageInput;
  heroSlides: HeroSlide[];
  collections: Collection[];
  products: Product[];
  showOlsera: boolean;
  profileSlides: ImageInput[];
  featuredSections: FeaturedSection[];
  megaMenuCards: MegaMenuCard[];
  hamburgerProducts: string[];
  hamburgerCollections: string[];
};
