
import React, { useState, useEffect } from 'react';
import { Product, Page, Review } from '../types';
import { formatRupiah } from './Shared';

// --- StarRating Component ---
const StarRating: React.FC<{ rating: number, totalStars?: number }> = ({ rating, totalStars = 5 }) => {
    const stars = [];
    for (let i = 1; i <= totalStars; i++) {
        if (i <= rating) {
            stars.push(<i key={i} className="fa-solid fa-star text-yellow-500"></i>);
        } else if (i - 0.5 <= rating) {
            stars.push(<i key={i} className="fa-solid fa-star-half-stroke text-yellow-500"></i>);
        } else {
            stars.push(<i key={i} className="fa-regular fa-star text-yellow-400"></i>);
        }
    }
    return <div className="flex items-center gap-0.5">{stars}</div>;
};


// --- ProductReviews Component ---
const ProductReviews: React.FC<{ reviews: Review[] }> = ({ reviews }) => {
    const [showAll, setShowAll] = useState(false);

    if (!reviews || reviews.length === 0) {
        return (
            <div className="border-t pt-6 mt-6">
                <h3 className="text-lg font-semibold mb-2">Ulasan Pembeli</h3>
                <p className="text-gray-500 text-sm">Belum ada ulasan untuk produk ini.</p>
            </div>
        );
    }

    const totalReviews = reviews.length;
    const averageRating = reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews;
    const displayedReviews = showAll ? reviews : reviews.slice(0, 3);
    
    const formatDate = (timestamp: string) => {
        return new Date(timestamp).toLocaleDateString('id-ID', {
            year: 'numeric', month: 'long', day: 'numeric'
        });
    }

    return (
        <div className="border-t pt-6 mt-6">
            <h3 className="text-lg font-semibold mb-2">Ulasan Pembeli</h3>
            <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg mb-4">
                <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-gray-800">{averageRating.toFixed(1)}</span>
                    <span className="text-gray-500 font-medium">/ 5</span>
                </div>
                <div className="flex flex-col">
                    <StarRating rating={averageRating} />
                    <p className="text-sm text-gray-600">({totalReviews} ulasan)</p>
                </div>
            </div>

            <div className="space-y-4">
                {displayedReviews.map(review => (
                    <div key={review.id} className="border-b pb-3">
                        <div className="flex justify-between items-center mb-1">
                             <p className="font-semibold text-gray-800">{review.author}</p>
                             <StarRating rating={review.rating} />
                        </div>
                        <p className="text-xs text-gray-500 mb-2">{formatDate(review.timestamp)}</p>
                        <p className="text-gray-700 text-sm">{review.comment}</p>
                    </div>
                ))}
            </div>

            {reviews.length > 3 && (
                <button 
                    onClick={() => setShowAll(!showAll)}
                    className="w-full mt-4 py-2 text-center text-sm font-semibold text-orange-600 bg-orange-100 rounded-lg hover:bg-orange-200 transition-colors"
                >
                    {showAll ? 'Sembunyikan' : `Lihat Semua (${totalReviews}) Ulasan`}
                </button>
            )}
        </div>
    );
};


// --- DetailPage Component ---
interface DetailPageProps {
    product: Product | null;
    onBack: () => void;
    onAddToCart: (id: string) => void;
    showToast: (message: string) => void;
    onShare: (product: Product) => void;
    onShowEcommerce: (product: Product) => void;
}

const DetailPage: React.FC<DetailPageProps> = ({ product, onBack, onAddToCart, showToast, onShare, onShowEcommerce }) => {
    const [mainImage, setMainImage] = useState('');

    useEffect(() => {
        if (product) {
            setMainImage(product.images[0]);
            window.scrollTo(0, 0);
        }
    }, [product]);
    
    if (!product) {
        return (
            <div>
                <header className="sticky top-0 z-50 bg-white shadow px-4 py-3 flex items-center">
                    <button onClick={onBack} className="text-xl"><i className="fa-solid fa-arrow-left"></i></button>
                    <h2 className="text-lg font-semibold ml-4">Detail Produk</h2>
                </header>
                <main className="p-4 text-center">Produk tidak ditemukan.</main>
            </div>
        );
    }
    
    const hasDiscount = product.discountPrice != null && product.discountPrice < product.originalPrice;
    const currentPrice = hasDiscount ? product.discountPrice! : product.originalPrice;
    const hasEcommerceLinks = product.ecommerceLinks && Object.values(product.ecommerceLinks).some(link => !!link);
    
    const handleBuyViaWa = () => {
        const message = encodeURIComponent(
            `Halo Kriuké Snack, saya ingin memesan 1x *${product.name}* (Rp${formatRupiah(currentPrice)}). Mohon konfirmasi pesanan saya. Terima kasih!`
        );
        const waUrl = `https://wa.me/6282349786916?text=${message}`;
        window.open(waUrl, '_blank');
    };

    return (
        <div>
            <header className="sticky top-0 z-50 bg-white shadow px-4 py-3 flex items-center">
                <button onClick={onBack} className="text-xl"><i className="fa-solid fa-arrow-left"></i></button>
                <h2 className="text-lg font-semibold ml-4">Detail Produk</h2>
            </header>
            <main className="pb-20">
                <img src={mainImage} alt={product.name} className="w-full h-80 object-cover" onError={(e) => e.currentTarget.src = 'https://placehold.co/400/FFECB3/000000?text=Error'}/>
                <div className="flex gap-2 p-4 overflow-x-auto">
                    {product.images.map((img, index) => (
                        <img
                            key={index}
                            src={img}
                            alt={`thumbnail ${index + 1}`}
                            onClick={() => setMainImage(img)}
                            className={`w-16 h-16 object-cover rounded-md cursor-pointer border-2 ${mainImage === img ? 'border-orange-500' : 'border-gray-200'}`}
                            onError={(e) => e.currentTarget.src = 'https://placehold.co/64/FFECB3/000000?text=Error'}
                        />
                    ))}
                </div>
                <div className="p-4 pt-0">
                    <h2 className="text-2xl font-bold text-gray-900 capitalize mb-2">{product.name}</h2>
                    <div className="flex items-center gap-3 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                            <i className="fa-solid fa-star text-yellow-500"></i>
                            <span className="font-semibold">{product.rating}</span>
                        </div>
                        <span className="text-gray-300">|</span>
                        <span><span className="font-semibold">{product.sold}</span> Terjual</span>
                    </div>
                    
                    <div className="my-2">
                        {hasDiscount ? (
                             <div className="flex flex-col items-start gap-0">
                                <p className="text-lg text-gray-500 line-through">Rp{formatRupiah(product.originalPrice)}</p>
                                <p className="text-3xl font-bold text-red-600">Rp{formatRupiah(currentPrice)}</p>
                            </div>
                        ) : (
                             <p className="text-3xl font-bold text-red-600">Rp{formatRupiah(currentPrice)}</p>
                        )}
                    </div>
                    
                    <h3 className="text-lg font-semibold mt-6 mb-2">Deskripsi Produk</h3>
                    <p className="text-gray-700 whitespace-pre-wrap">{product.description}</p>
                    
                    <ProductReviews reviews={product.reviews || []} />

                     <div className="flex items-center gap-2 mt-6 p-4 border-t border-gray-200 -mx-4 -mb-4">
                        <button onClick={() => onAddToCart(product.id)} className="bg-orange-100 text-orange-600 w-14 h-12 rounded-lg flex items-center justify-center text-xl shadow-sm hover:bg-orange-200 transition-colors border border-orange-600" aria-label="Tambah ke keranjang">
                            <i className="fa-solid fa-shopping-cart"></i>
                        </button>
                         <button onClick={() => onShare(product)} className="bg-gray-100 text-gray-700 w-14 h-12 rounded-lg flex items-center justify-center text-xl shadow-sm hover:bg-gray-200 transition-colors border border-gray-300" aria-label="Bagikan produk">
                            <i className="fa-solid fa-share-alt"></i>
                        </button>
                        {hasEcommerceLinks && (
                           <button onClick={() => onShowEcommerce(product)} className="flex-grow bg-sky-500 text-white h-12 px-4 rounded-lg flex items-center justify-center font-semibold shadow-lg hover:bg-sky-600 transition-colors text-sm">
                                <i className="fa-solid fa-store mr-2"></i>
                                E-commerce
                            </button>
                        )}
                        <button onClick={handleBuyViaWa} className="flex-grow bg-green-500 text-white h-12 px-4 rounded-lg flex items-center justify-center font-semibold shadow-lg hover:bg-green-600 transition-colors text-sm">
                            <i className="fa-brands fa-whatsapp mr-2"></i>
                            WhatsApp
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default DetailPage;