
export interface Review {
  id: string;
  author: string;
  rating: number; // 1-5
  comment: string;
  timestamp: string;
}

export interface Product {
  id: string;
  name: string;
  subtitle: string;
  originalPrice: number;
  discountPrice?: number;
  rating: number;
  sold: number;
  category: string;
  images: string[];
  description: string;
  reviews?: Review[];
  ecommerceLinks?: {
    tiktok?: string;
    shopee?: string;
    tokopedia?: string;
  };
}

export interface CartItem {
  id: string;
  quantity: number;
}

export interface Promo {
  imageUrl: string;
  altText: string;
}

export type Page = 
  | 'home' 
  | 'detail' 
  | 'cart' 
  | 'checkout' 
  | 'liked' 
  | 'login' 
  | 'admin' 
  | 'edit';