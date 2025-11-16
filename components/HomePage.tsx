import React, { useState, useEffect } from 'react';
import { Product, Page, Promo } from '../types';
import { Header, ProductCard, Footer } from './Shared';
import { PROMOTIONS } from '../data';

interface HomePageProps {
    products: Product[];
    categories: string[];
    likedProducts: string[];
    cart: { id: string; quantity: number }[];
    onNavigate: (page: Page) => void;
    onToggleLike: (id: string) => void;
    onAddToCart: (id: string) => void;
    onShowDetail: (id: string) => void;
    toggleMenu: () => void;
    onShare: (product: Product) => void;
    onBuyViaWa: (product: Product) => void;
    onShowEcommerce: (product: Product) => void;
    liveLinks: { tiktok: string; shopee: string; };
}

const PromoSlider: React.FC<{ promos: Promo[] }> = ({ promos }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (promos.length === 0) return;
        const timer = setTimeout(() => {
            const nextIndex = (currentIndex + 1) % promos.length;
            setCurrentIndex(nextIndex);
        }, 4000); 

        return () => clearTimeout(timer);
    }, [currentIndex, promos.length]);

    const goToSlide = (index: number) => {
        setCurrentIndex(index);
    };
    
    if (promos.length === 0) return null;

    return (
        <div className="relative w-full aspect-[2/1] overflow-hidden p-2 pt-4">
            <div className="relative w-full h-full rounded-lg shadow-lg overflow-hidden">
                {/* Slides */}
                <div 
                    className="flex transition-transform duration-700 ease-in-out h-full"
                    style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                    {promos.map((promo, index) => (
                        <div key={index} className="w-full flex-shrink-0 h-full">
                             <img
                                src={promo.imageUrl}
                                alt={promo.altText}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    ))}
                </div>

                {/* Dots */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                    {promos.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            aria-label={`Go to slide ${index + 1}`}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                index === currentIndex ? 'bg-white w-4 ring-1 ring-black/20' : 'bg-white/60'
                            }`}
                        ></button>
                    ))}
                </div>
            </div>
        </div>
    );
};


const CategoryFilter: React.FC<{
    categories: string[];
    activeCategory: string;
    onSelectCategory: (category: string) => void;
}> = ({ categories, activeCategory, onSelectCategory }) => {
    const allCategories = ['Semua', ...categories];
    return (
        <div className="px-4 py-3 border-b border-gray-200">
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
                {allCategories.map(category => (
                    <button
                        key={category}
                        onClick={() => onSelectCategory(category)}
                        className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors whitespace-nowrap hover:shadow-md hover:border-orange-500 ${
                            activeCategory === category
                                ? 'bg-orange-600 text-white border-orange-600 shadow-md'
                                : 'bg-white text-gray-700 border-gray-300 shadow-sm'
                        }`}
                    >
                        {category}
                    </button>
                ))}
            </div>
        </div>
    );
};

const HomePage: React.FC<HomePageProps> = ({
    products,
    categories,
    likedProducts,
    cart,
    onNavigate,
    onToggleLike,
    onAddToCart,
    onShowDetail,
    toggleMenu,
    onShare,
    onBuyViaWa,
    onShowEcommerce,
    liveLinks,
}) => {
    const [activeCategory, setActiveCategory] = useState('Semua');
    const [searchQuery, setSearchQuery] = useState('');

    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    const filteredProducts = products.filter(product => {
        const matchesCategory = activeCategory === 'Semua' || product.category === activeCategory;
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              product.subtitle.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div>
            <Header
                onNavigate={onNavigate}
                cartCount={cartCount}
                toggleMenu={toggleMenu}
                onSearch={setSearchQuery}
                liveLinks={liveLinks}
            />
            <PromoSlider promos={PROMOTIONS} />
            <CategoryFilter
                categories={categories}
                activeCategory={activeCategory}
                onSelectCategory={setActiveCategory}
            />
            <main className="pb-20">
                <div id="product-grid" className="grid grid-cols-3 gap-2 p-2">
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map(product => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                isLiked={likedProducts.includes(product.id)}
                                onToggleLike={onToggleLike}
                                onAddToCart={onAddToCart}
                                onShowDetail={onShowDetail}
                                onShare={onShare}
                                onBuyViaWa={onBuyViaWa}
                                onShowEcommerce={onShowEcommerce}
                            />
                        ))
                    ) : (
                         <p className="text-gray-500 col-span-3 text-center py-10">
                            Tidak ada produk yang ditemukan.
                        </p>
                    )}
                </div>
                <Footer />
            </main>
        </div>
    );
};

export default HomePage;