import { Product, Promo } from './types';

export const INITIAL_PRODUCTS: Product[] = [
    {
        id: 'p1',
        name: 'kripik pisang rasa original',
        subtitle: 'Kripik Pisang Rasa Original Kripik pisang...',
        originalPrice: 25000,
        rating: 4.8,
        sold: 178,
        category: 'Keripik Pisang',
        images: [
            'https://picsum.photos/seed/p1-1/400/400',
            'https://picsum.photos/seed/p1-2/400/400'
        ],
        description: 'Kripik pisang renyah dengan rasa asli pisang yang gurih alami. Cocok untuk semua kalangan dan camilan harian Anda. Kriuknya beda, rasanya istimewa!',
        ecommerceLinks: {
            shopee: 'https://shopee.co.id',
            tokopedia: 'https://www.tokopedia.com'
        },
        reviews: [
            { id: 'r1', author: 'Siti', rating: 5, comment: 'Renyahnya pas, rasa pisangnya berasa banget! Anak saya suka.', timestamp: '2024-05-20T10:00:00Z' },
            { id: 'r2', author: 'Budi', rating: 4, comment: 'Enak, tapi mungkin bisa sedikit lebih tebal potongannya.', timestamp: '2024-05-18T14:30:00Z' }
        ]
    },
    {
        id: 'p2',
        name: 'kriuke rasa coklat',
        subtitle: 'Kripik Pisang Rasa Coklat Kripik pisang...',
        originalPrice: 25000,
        discountPrice: 20000,
        rating: 4.7,
        sold: 241,
        category: 'Promo Spesial',
        images: [
            'https://picsum.photos/seed/p2-1/400/400',
            'https://picsum.photos/seed/p2-2/400/400'
        ],
        description: 'Promo Spesial! Kripik pisang renyah dibalut dengan coklat premium yang lumer di mulut. Kriuknya beda, rasanya istimewa!',
        ecommerceLinks: {
            tiktok: 'https://www.tiktok.com',
            shopee: 'https://shopee.co.id',
        },
        reviews: [
            { id: 'r3', author: 'Dewi', rating: 5, comment: 'Coklatnya lumer banget, gak bikin eneg. Fix order lagi!', timestamp: '2024-05-21T09:00:00Z' },
            { id: 'r4', author: 'Agus', rating: 5, comment: 'Kombinasi pisang sama coklatnya juara!', timestamp: '2024-05-20T11:20:00Z' },
            { id: 'r5', author: 'Rina', rating: 4, comment: 'Enak, coklatnya tebel. Mungkin lain kali packingnya bisa lebih aman.', timestamp: '2024-05-19T18:05:00Z' },
            { id: 'r6', author: 'Joko', rating: 5, comment: 'The best kripik coklat ever!', timestamp: '2024-05-17T08:45:00Z' }
        ]
    },
    {
        id: 'p3',
        name: 'kripik pisang rasa balado',
        subtitle: 'Kripik Pisang Rasa Balado Kripik pisang...',
        originalPrice: 18000,
        rating: 4.5,
        sold: 92,
        category: 'Pedas',
        images: [
            'https://picsum.photos/seed/p3-1/400/400'
        ],
        description: 'Sensasi pedas manis bumbu balado khas yang bikin ketagihan. Dibuat dari cabai pilihan dan bumbu rempah Indonesia. Berani coba?',
    },
    {
        id: 'p4',
        name: 'rasa manis pedas manis',
        subtitle: 'Kripik Pisang Rasa Pedas Manis Kripik pisang...',
        originalPrice: 19000,
        rating: 4.9,
        sold: 312,
        category: 'Manis',
        images: [
            'https://picsum.photos/seed/p4-1/400/400'
        ],
        description: 'Perpaduan sempurna antara rasa manis gula aren dan sensasi pedas yang hangat. Rasa yang pasti disukai semua orang!',
        reviews: [
            { id: 'r7', author: 'Lina', rating: 5, comment: 'Ini rasa favoritku! Pedes manisnya pas banget.', timestamp: '2024-05-22T15:00:00Z' }
        ]
    },
    {
        id: 'p5',
        name: 'kripik pisang rasa matcha',
        subtitle: 'Kriuké dengan bubuk matcha asli Jepang...',
        originalPrice: 22000,
        rating: 4.6,
        sold: 155,
        category: 'Manis',
        images: [
            'https://picsum.photos/seed/p5-1/400/400',
            'https://picsum.photos/seed/p5-2/400/400'
        ],
        description: 'Bagi pecinta teh hijau! Kriuké dengan bubuk matcha asli Jepang, memberikan rasa manis pahit yang unik dan menenangkan.',
        ecommerceLinks: {
            shopee: 'https://shopee.co.id',
        }
    },
    {
        id: 'p6',
        name: 'kriuke rasa sapi panggang',
        subtitle: 'Kripik Pisang Rasa Sapi Panggang gurih...',
        originalPrice: 21000,
        rating: 4.3,
        sold: 88,
        category: 'Gurih',
        images: [
            'https://picsum.photos/seed/p6-1/400/400',
            'https://picsum.photos/seed/p6-2/400/400'
        ],
        description: 'Nikmati sensasi gurihnya bumbu sapi panggang premium dalam setiap gigitan kriuk. Cocok untuk Anda yang suka rasa asin dan gurih.',
    }
];

export const INITIAL_CATEGORIES: string[] = ['Keripik Pisang', 'Promo Spesial', 'Manis', 'Gurih', 'Pedas'];

export const PROMOTIONS: Promo[] = [
    {
        imageUrl: 'https://picsum.photos/seed/promo1/800/400',
        altText: 'Promo Spesial Kriuké',
    },
    {
        imageUrl: 'https://picsum.photos/seed/promo2/800/400',
        altText: 'Gratis Ongkir',
    },
    {
        imageUrl: 'https://picsum.photos/seed/promo3/800/400',
        altText: 'Beli 2 Gratis 1',
    },
];

export const INITIAL_LIVE_LINKS = {
    tiktok: 'https://www.tiktok.com/@kriuke.snack.official',
    shopee: 'https://shopee.co.id/kriukesnack'
};