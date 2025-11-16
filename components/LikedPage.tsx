
import React from 'react';
import { Product, Page } from '../types';
import { ProductCard, Footer } from './Shared';

interface LikedPageProps {
    likedProducts: string[];
    allProducts: Product[];
    onNavigate: (page: Page) => void;
    onToggleLike: (id: string) => void;
    onAddToCart: (id: string) => void;
    onShowDetail: (id: string) => void;
    onShare: (product: Product) => void;
    onBuyViaWa: (product: Product) => void;
    onShowEcommerce: (product: Product) => void;
}

const LikedPage: React.FC<LikedPageProps> = ({ likedProducts, allProducts, onNavigate, onToggleLike, onAddToCart, onShowDetail, onShare, onBuyViaWa, onShowEcommerce }) => {
    
    const favoriteProducts = allProducts.filter(p => likedProducts.includes(p.id));

    return (
        <div>
            <header className="sticky top-0 z-50 bg-white shadow px-4 py-3 flex items-center">
                <button onClick={() => onNavigate('home')} className="text-xl"><i className="fa-solid fa-arrow-left"></i></button>
                <h2 className="text-lg font-semibold ml-4">Whitelist Produk Favorit</h2>
            </header>
            <main className="pb-20">
                {favoriteProducts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center text-center mt-10 p-4">
                        <i className="fa-solid fa-heart-crack text-6xl text-gray-300 mb-4"></i>
                        <h3 className="text-lg font-semibold text-gray-700">Daftar Favorit Anda Kosong</h3>
                        <p className="text-gray-500 mb-6">Ayo, temukan kripik yang Anda suka!</p>
                        <button onClick={() => onNavigate('home')} className="bg-orange-600 text-white px-6 py-2 rounded-full font-semibold shadow hover:bg-orange-700">
                            Kembali ke Home
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-3 gap-2 p-2">
                        {favoriteProducts.map(product => (
                             <ProductCard
                                key={product.id}
                                product={product}
                                isLiked={true}
                                onToggleLike={onToggleLike}
                                onAddToCart={onAddToCart}
                                onShowDetail={onShowDetail}
                                onShare={onShare}
                                onBuyViaWa={onBuyViaWa}
                                onShowEcommerce={onShowEcommerce}
                            />
                        ))}
                    </div>
                )}
                <Footer />
            </main>
        </div>
    );
};

export default LikedPage;