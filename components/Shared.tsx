import React from 'react';
import { Product, Page, CartItem } from '../types';

// Helper function
export const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat('id-ID').format(angka);
};

// --- Header Component ---
interface HeaderProps {
    onNavigate: (page: Page) => void;
    cartCount: number;
    toggleMenu: () => void;
    onSearch: (query: string) => void;
    liveLinks: { tiktok: string; shopee: string; };
}
export const Header: React.FC<HeaderProps> = ({ onNavigate, cartCount, toggleMenu, onSearch, liveLinks }) => {
    return (
        <header className="sticky top-0 z-50 bg-white shadow-md p-4">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <img src="https://i.ibb.co/n86sQs1v/Logo-Toko-Aneka-Cemilan-Snack-Ceria-Oranye-Kuning-20251105_010226_0000.png" alt="Kriuké Snack Logo" className="h-6 w-auto" />
                    <span className="text-lg font-bold text-orange-600">Kriuké</span>
                </div>
                <div className="flex items-center gap-4">
                    <a href={liveLinks.tiktok} target="_blank" rel="noopener noreferrer" className="text-2xl text-gray-700" aria-label="Tonton Live TikTok">
                        <img src="https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExcmx5azBsbHE5OXh5aDE4aWdhNDczMHczejRjbXhmaGZ2NDN1aHB5dyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/mWnDeIKilkwDcrM2VT/giphy.gif" alt="TikTok Live" className="h-8 w-auto" />
                    </a>
                    <a href={liveLinks.shopee} target="_blank" rel="noopener noreferrer" className="text-2xl text-gray-700" aria-label="Kunjungi Toko Shopee">
                        <i className="fa-solid fa-store"></i>
                    </a>
                    <button onClick={() => onNavigate('cart')} className="text-2xl text-gray-700 relative">
                        <i className="fa-solid fa-cart-shopping"></i>
                        {cartCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center transition-opacity">
                                {cartCount}
                            </span>
                        )}
                    </button>
                    <button onClick={toggleMenu} className="text-2xl text-gray-700">
                        <i className="fa-solid fa-bars"></i>
                    </button>
                </div>
            </div>
            <div className="relative">
                <input
                    type="text"
                    onChange={(e) => onSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 bg-gray-50 rounded-lg text-sm focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Cari produk..."
                />
                <i className="fa-solid fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
            </div>
        </header>
    );
};


// --- ProductCard Component ---
interface ProductCardProps {
    product: Product;
    isLiked: boolean;
    onToggleLike: (id: string) => void;
    onAddToCart: (id: string) => void;
    onShowDetail: (id: string) => void;
    onShare: (product: Product) => void;
    onBuyViaWa: (product: Product) => void;
    onShowEcommerce: (product: Product) => void;
}
export const ProductCard: React.FC<ProductCardProps> = ({ product, isLiked, onToggleLike, onAddToCart, onShowDetail, onShare, onBuyViaWa, onShowEcommerce }) => {
    const hasDiscount = product.discountPrice != null && product.discountPrice < product.originalPrice;
    const currentPrice = hasDiscount ? product.discountPrice! : product.originalPrice;
    const likeIconClass = isLiked ? 'fa-solid text-red-500' : 'fa-regular text-gray-300';
    const hasEcommerceLinks = product.ecommerceLinks && Object.values(product.ecommerceLinks).some(link => !!link);

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full">
            <div className="relative cursor-pointer" onClick={() => onShowDetail(product.id)}>
                <img src={product.images[0]} alt={product.name} className="w-full aspect-square object-cover" onError={(e) => (e.currentTarget.src = 'https://placehold.co/100x100/FFECB3/000000?text=Kriuké')} />
                {hasDiscount && (
                    <div className="absolute top-0 left-0 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-br-lg z-10">
                        {Math.round(((product.originalPrice - product.discountPrice!) / product.originalPrice) * 100)}%
                    </div>
                )}
                <button
                    onClick={(e) => { e.stopPropagation(); onToggleLike(product.id); }}
                    className="like-btn absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:scale-105 transition-transform z-10"
                >
                    <i className={`${likeIconClass} fa-heart text-xl`}></i>
                </button>
            </div>
            <div className="p-3 flex flex-col flex-grow">
                <p className={`text-xs ${product.category === 'Promo Spesial' ? 'text-red-500 font-bold' : 'text-gray-500'} mb-1 capitalize`}>{product.category}</p>
                <h4 className="text-sm font-semibold text-gray-800 capitalize truncate" title={product.name}>{product.name}</h4>
                <p className="text-xs text-gray-600 mb-1 whitespace-nowrap overflow-hidden text-ellipsis">{product.subtitle}</p>
                
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                    <div className="flex items-center gap-1">
                        <i className="fa-solid fa-star text-yellow-500"></i>
                        <span>{product.rating}</span>
                    </div>
                    <span>|</span>
                    <span>{product.sold} terjual</span>
                </div>

                <div className="mt-auto">
                    <div className="mb-2">
                         {hasDiscount ? (
                            <p className="text-xs text-gray-500 line-through">Rp{formatRupiah(product.originalPrice)}</p>
                        ) : (
                            <p className="text-xs invisible" aria-hidden="true">&nbsp;</p> 
                        )}
                        <p className="text-lg font-bold text-red-600">Rp{formatRupiah(currentPrice)}</p>
                    </div>

                    <div className="grid grid-cols-3 gap-1">
                        <button
                            onClick={(e) => { e.stopPropagation(); onAddToCart(product.id); }}
                            className="h-8 bg-orange-600 text-white rounded-lg shadow-md hover:bg-orange-700 transition-colors flex items-center justify-center"
                            aria-label="Tambah ke keranjang"
                        >
                            <i className="fa-solid fa-shopping-cart text-base"></i>
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); onShare(product); }}
                            className="h-8 bg-gray-200 text-gray-700 rounded-lg shadow-md hover:bg-gray-300 transition-colors flex items-center justify-center"
                            aria-label="Bagikan produk"
                        >
                            <i className="fa-solid fa-share-alt text-sm"></i>
                        </button>
                        {hasEcommerceLinks ? (
                             <button
                                onClick={(e) => { e.stopPropagation(); onShowEcommerce(product); }}
                                className="h-8 bg-sky-500 text-white rounded-lg shadow-md hover:bg-sky-600 transition-colors flex items-center justify-center"
                                aria-label="Beli via E-commerce"
                            >
                                <i className="fa-solid fa-store text-base"></i>
                            </button>
                        ) : (
                            <button
                                onClick={(e) => { e.stopPropagation(); onBuyViaWa(product); }}
                                className="h-8 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition-colors flex items-center justify-center"
                                aria-label="Beli via WhatsApp"
                            >
                                <i className="fa-brands fa-whatsapp text-base"></i>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};


// --- BottomNav Component ---
interface BottomNavProps {
    activePage: Page;
    onNavigate: (page: Page) => void;
}
export const BottomNav: React.FC<BottomNavProps> = ({ activePage, onNavigate }) => {
    const navItems: { page: Page; icon: string; activeColor: string }[] = [
        { page: 'home', icon: 'fa-home', activeColor: 'text-orange-600' },
        { page: 'liked', icon: 'fa-heart', activeColor: 'text-red-500' },
        { page: 'cart', icon: 'fa-shopping-basket', activeColor: 'text-orange-600' },
        { page: 'login', icon: 'fa-user-shield', activeColor: 'text-orange-600' },
    ];

    const isPageActive = (page: Page) => {
        if (page === activePage) return true;
        if (page === 'login' && ['admin', 'edit'].includes(activePage)) return true;
        if (page === 'cart' && activePage === 'checkout') return true;
        return false;
    };

    return (
        <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 max-w-md w-full bg-white shadow-[0_-2px_6px_rgba(0,0,0,0.06)] border-t border-gray-200 grid grid-cols-4 z-50">
            {navItems.map(item => (
                <button
                    key={item.page}
                    onClick={() => onNavigate(item.page)}
                    className={`text-center py-3 transition-colors ${isPageActive(item.page) ? item.activeColor : 'text-gray-600'}`}
                >
                    <i className={`fa-solid ${item.icon} text-2xl`}></i>
                </button>
            ))}
        </nav>
    );
};

// --- Toast Component ---
interface ToastProps {
    message: string;
    show: boolean;
}
export const Toast: React.FC<ToastProps> = ({ message, show }) => {
    return (
        <div className={`fixed top-20 left-1/2 -translate-x-1/2 bg-black bg-opacity-70 text-white px-4 py-2 rounded-lg shadow-lg transition-opacity duration-300 z-[100] ${show ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            {message}
        </div>
    );
};

// --- OffCanvasMenu Component ---
interface OffCanvasMenuProps {
    isOpen: boolean;
    onClose: () => void;
    onNavigate: (page: Page) => void;
}
export const OffCanvasMenu: React.FC<OffCanvasMenuProps> = ({ isOpen, onClose, onNavigate }) => {
    const handleNavigate = (page: Page) => {
        onNavigate(page);
        onClose();
    };

    return (
        <div className={`fixed inset-0 z-[100] ${isOpen ? '' : 'hidden'}`}>
            <div
                onClick={onClose}
                className={`absolute inset-0 bg-black bg-opacity-50 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0'}`}
            ></div>
            <div
                className={`absolute right-0 top-0 bottom-0 w-3/4 max-w-[300px] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out p-6 overflow-y-auto ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                <div className="flex justify-between items-center pb-4 border-b border-gray-200 mb-6">
                    <h3 className="text-xl font-bold text-orange-600">Menu Utama</h3>
                    <button onClick={onClose} className="text-2xl text-gray-700 hover:text-red-500">
                        <i className="fa-solid fa-times"></i>
                    </button>
                </div>
                <div className="space-y-3">
                    <a href="#" onClick={(e) => { e.preventDefault(); handleNavigate('home'); }} className="block text-lg font-medium text-gray-700 hover:text-orange-600 transition-colors"><i className="fa-solid fa-home mr-3 w-5"></i> Home</a>
                    <a href="#" onClick={(e) => { e.preventDefault(); handleNavigate('liked'); }} className="block text-lg font-medium text-gray-700 hover:text-red-500 transition-colors"><i className="fa-solid fa-heart mr-3 w-5"></i> Whitelist Favorit</a>
                    <a href="#" onClick={(e) => { e.preventDefault(); handleNavigate('cart'); }} className="block text-lg font-medium text-gray-700 hover:text-orange-600 transition-colors"><i className="fa-solid fa-shopping-basket mr-3 w-5"></i> Keranjang</a>
                    <div className="pt-4 border-t border-gray-100"></div>
                    <a href="#" onClick={(e) => { e.preventDefault(); handleNavigate('login'); }} className="block text-lg font-medium text-gray-700 hover:text-orange-600 transition-colors"><i className="fa-solid fa-user-shield mr-3 w-5"></i> Admin Login</a>
                </div>
            </div>
        </div>
    );
};

// --- DeleteModal Component ---
interface DeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string | React.ReactNode;
}
export const DeleteModal: React.FC<DeleteModalProps> = ({ isOpen, onClose, onConfirm, title, message }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 shadow-xl max-w-sm w-full">
                <h3 className="text-lg font-semibold mb-4">{title}</h3>
                <div className="text-gray-600 mb-6">{message}</div>
                <div className="flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-lg font-medium hover:bg-gray-300">Batal</button>
                    <button onClick={onConfirm} className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700">Hapus</button>
                </div>
            </div>
        </div>
    );
};

// --- ShareModal Component ---
interface ShareModalProps {
    isOpen: boolean;
    product: Product | null;
    onClose: () => void;
    showToast: (message: string) => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, product, onClose, showToast }) => {
    if (!isOpen || !product) return null;

    const productUrl = `${window.location.origin}?product=${product.id}`;
    const shareText = `Lihat snack Kriuké yang enak ini: ${product.name}!`;

    const handleCopyLink = () => {
        navigator.clipboard.writeText(productUrl).then(() => {
            showToast('Link produk berhasil disalin!');
        }).catch(() => {
            showToast('Gagal menyalin link.');
        });
    };

    const shareOptions = [
        {
            name: 'WhatsApp',
            icon: 'fa-brands fa-whatsapp',
            color: 'bg-green-500 hover:bg-green-600',
            url: `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + productUrl)}`
        },
        {
            name: 'Facebook',
            icon: 'fa-brands fa-facebook-f',
            color: 'bg-blue-600 hover:bg-blue-700',
            url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`
        },
        {
            name: 'Twitter',
            icon: 'fa-brands fa-twitter',
            color: 'bg-sky-500 hover:bg-sky-600',
            url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(productUrl)}&text=${encodeURIComponent(shareText)}`
        },
        {
            name: 'Email',
            icon: 'fa-solid fa-envelope',
            color: 'bg-slate-700 hover:bg-slate-800',
            url: `mailto:?subject=${encodeURIComponent(shareText)}&body=${encodeURIComponent('Cek produk ini: ' + productUrl)}`
        },
    ];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl p-6 shadow-xl w-full max-w-sm" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-gray-800">Bagikan Produk</h3>
                    <button onClick={onClose} className="text-2xl text-gray-400 hover:text-gray-600 transition-colors">
                        <i className="fa-solid fa-times"></i>
                    </button>
                </div>
                <p className="text-gray-600 mb-6 text-sm text-center">
                    Bagikan <span className="font-semibold capitalize">"{product.name}"</span> ke teman-temanmu!
                </p>
                
                <div className="grid grid-cols-2 gap-3 mb-6">
                    {shareOptions.map(option => (
                        <a 
                            key={option.name}
                            href={option.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex items-center justify-center gap-2 text-white font-semibold py-3 rounded-lg shadow-md transition-transform hover:scale-105 ${option.color}`}
                        >
                            <i className={option.icon}></i>
                            <span>{option.name}</span>
                        </a>
                    ))}
                </div>

                <div className="relative">
                    <input 
                        type="text" 
                        readOnly 
                        value={productUrl}
                        className="w-full bg-gray-100 border border-gray-300 rounded-lg py-2 pl-3 pr-10 text-sm text-gray-700 focus:outline-none"
                    />
                    <button 
                        onClick={handleCopyLink} 
                        className="absolute right-1 top-1/2 -translate-y-1/2 p-2 text-gray-500 hover:text-orange-600"
                        aria-label="Salin link"
                    >
                        <i className="fa-solid fa-link"></i>
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- EcommerceModal Component ---
interface EcommerceModalProps {
    isOpen: boolean;
    product: Product | null;
    onClose: () => void;
}

export const EcommerceModal: React.FC<EcommerceModalProps> = ({ isOpen, product, onClose }) => {
    if (!isOpen || !product || !product.ecommerceLinks) return null;

    const platformDetails = {
        tiktok: { name: 'TikTok Shop', icon: 'fa-brands fa-tiktok', color: 'bg-black text-white hover:bg-gray-800' },
        shopee: { name: 'Shopee', icon: 'fa-solid fa-bag-shopping', color: 'bg-orange-500 text-white hover:bg-orange-600' },
        tokopedia: { name: 'Tokopedia', icon: 'fa-solid fa-basket-shopping', color: 'bg-green-600 text-white hover:bg-green-700' },
    };

    const availablePlatforms = (Object.keys(product.ecommerceLinks) as Array<keyof typeof platformDetails>)
        .filter(key => product.ecommerceLinks && product.ecommerceLinks[key]);

    if (availablePlatforms.length === 0) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl p-6 shadow-xl w-full max-w-sm" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-gray-800">Beli di E-commerce</h3>
                    <button onClick={onClose} className="text-2xl text-gray-400 hover:text-gray-600 transition-colors">
                        <i className="fa-solid fa-times"></i>
                    </button>
                </div>
                <p className="text-gray-600 mb-6 text-sm text-center">
                    Pilih platform untuk membeli <span className="font-semibold capitalize">"{product.name}"</span>.
                </p>
                <div className="space-y-3">
                    {availablePlatforms.map(key => {
                        const details = platformDetails[key];
                        const link = product.ecommerceLinks![key];
                        return (
                            <a
                                key={key}
                                href={link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`flex items-center justify-center gap-3 w-full font-semibold py-3 rounded-lg shadow-md transition-transform hover:scale-105 ${details.color}`}
                            >
                                <i className={details.icon}></i>
                                <span>{details.name}</span>
                            </a>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

// --- Footer Component ---
export const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-50 border-t mt-8 py-8 px-4 text-center">
            <div className="max-w-md mx-auto">
                <img src="https://i.ibb.co/n86sQs1v/Logo-Toko-Aneka-Cemilan-Snack-Ceria-Oranye-Kuning-20251105_010226_0000.png" alt="Kriuké Snack Logo" className="h-12 w-auto mx-auto mb-3" />
                <h3 className="text-xl font-bold text-orange-600 mb-1">Kriuké Snack</h3>
                <p className="text-sm text-gray-500 mb-4">Kriuknya Beda, Rasanya Istimewa</p>
                <div className="flex justify-center gap-5 mb-6">
                    <a href="https://wa.me/6282349786916" target="_blank" rel="noopener noreferrer" className="text-2xl text-gray-500 hover:text-green-500 transition-colors" aria-label="WhatsApp">
                        <i className="fa-brands fa-whatsapp"></i>
                    </a>
                    <a href="#" target="_blank" rel="noopener noreferrer" className="text-2xl text-gray-500 hover:text-pink-500 transition-colors" aria-label="Instagram">
                        <i className="fa-brands fa-instagram"></i>
                    </a>
                    <a href="#" target="_blank" rel="noopener noreferrer" className="text-2xl text-gray-500 hover:text-blue-600 transition-colors" aria-label="Facebook">
                        <i className="fa-brands fa-facebook"></i>
                    </a>
                </div>
                <p className="text-xs text-gray-400">&copy; {new Date().getFullYear()} Kriuké Snack. Semua Hak Cipta Dilindungi.</p>
            </div>
        </footer>
    );
};