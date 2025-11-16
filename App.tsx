import React, { useState, useEffect } from 'react';
import { Product, CartItem, Page } from './types';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES, PROMOTIONS, INITIAL_LIVE_LINKS } from './data';
import { useLocalStorage } from './hooks/useLocalStorage';
import { BottomNav, Toast, OffCanvasMenu, DeleteModal, ShareModal, EcommerceModal, formatRupiah } from './components/Shared';
import HomePage from './components/HomePage';
import DetailPage from './components/DetailPage';
import CartPage from './components/CartPage';
import CheckoutPage from './components/CheckoutPage';
import LikedPage from './components/LikedPage';
import { LoginPage, AdminPages } from './components/AdminPages';

const App: React.FC = () => {
    // --- STATE MANAGEMENT ---
    const [products, setProducts] = useLocalStorage<Product[]>('kriuke_products', INITIAL_PRODUCTS);
    const [categories, setCategories] = useLocalStorage<string[]>('kriuke_categories', INITIAL_CATEGORIES);
    const [cart, setCart] = useLocalStorage<CartItem[]>('kriuke_cart', []);
    const [likedProducts, setLikedProducts] = useLocalStorage<string[]>('kriuke_liked', []);
    const [isLoggedIn, setIsLoggedIn] = useLocalStorage<boolean>('kriuke_isLoggedIn', false);
    const [liveLinks, setLiveLinks] = useLocalStorage('kriuke_live_links', INITIAL_LIVE_LINKS);

    const [activePage, setActivePage] = useState<Page>('home');
    const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '' });

    const [modal, setModal] = useState<{ type: 'product' | 'category' | null, id: string | null }>({ type: null, id: null });
    const [shareModalProduct, setShareModalProduct] = useState<Product | null>(null);
    const [ecommerceModalProduct, setEcommerceModalProduct] = useState<Product | null>(null);
    
    // --- TOAST HELPER ---
    const showToast = (message: string) => {
        setToast({ show: true, message });
        setTimeout(() => setToast({ show: false, message: '' }), 2000);
    };

    // --- NAVIGATION ---
    const handleNavigate = (page: Page) => {
        if ((page === 'admin' || page === 'login') && isLoggedIn) {
            setActivePage('admin');
        } else {
            setActivePage(page);
        }
        window.scrollTo(0, 0);
    };

    const handleShowDetail = (id: string) => {
        setSelectedProductId(id);
        handleNavigate('detail');
    };

    // --- CART LOGIC ---
    const handleAddToCart = (id: string) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.id === id);
            if (existingItem) {
                return prevCart.map(item => item.id === id ? { ...item, quantity: item.quantity + 1 } : item);
            }
            return [...prevCart, { id, quantity: 1 }];
        });
        showToast('Produk ditambahkan ke keranjang!');
    };

    const handleQuantityChange = (id: string, change: number) => {
        setCart(prevCart => {
            const item = prevCart.find(item => item.id === id);
            if (!item) return prevCart;

            const newQuantity = item.quantity + change;
            if (newQuantity <= 0) {
                return prevCart.filter(item => item.id !== id);
            }
            return prevCart.map(item => item.id === id ? { ...item, quantity: newQuantity } : item);
        });
    };
    
    const handleRemoveFromCart = (id: string) => {
        setCart(cart.filter(item => item.id !== id));
    };

    const handleOrderComplete = () => {
        showToast('Pesanan Anda sedang diproses!');
        setCart([]);
        handleNavigate('home');
    };

    // --- LIKED/FAVORITE LOGIC ---
    const handleToggleLike = (id: string) => {
        if (likedProducts.includes(id)) {
            setLikedProducts(likedProducts.filter(likedId => likedId !== id));
            showToast('Produk dihapus dari favorit.');
        } else {
            setLikedProducts([...likedProducts, id]);
            showToast('Produk ditambahkan ke favorit!');
        }
    };

    // --- PRODUCT CARD ACTIONS ---
    const handleShareProduct = (product: Product) => {
        setShareModalProduct(product);
    };

    const handleShowEcommerceModal = (product: Product) => {
        setEcommerceModalProduct(product);
    };

    const handleBuyViaWa = (product: Product) => {
        const price = product.discountPrice ?? product.originalPrice;
        const message = encodeURIComponent(
            `Halo Kriuké Snack, saya ingin menanyakan tentang produk *${product.name}* (Rp${formatRupiah(price)}).`
        );
        const waUrl = `https://wa.me/6282349786916?text=${message}`;
        window.open(waUrl, '_blank');
    };
    
    // --- ADMIN LOGIC ---
    const handleLogin = () => {
        setIsLoggedIn(true);
        handleNavigate('admin');
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        handleNavigate('login');
    };

    const handleSaveProduct = (productData: Omit<Product, 'id'>, id?: string) => {
        if (id) {
            setProducts(products.map(p => p.id === id ? { ...p, ...productData } : p));
            showToast('Produk berhasil diperbarui!');
        } else {
            const newProduct: Product = { ...productData, id: 'p' + new Date().getTime() };
            setProducts([newProduct, ...products]);
            showToast('Produk baru berhasil ditambahkan!');
        }
    };

    const handleDeleteProduct = () => {
        if (modal.type !== 'product' || !modal.id) return;
        const idToDelete = modal.id;
        setProducts(products.filter(p => p.id !== idToDelete));
        setCart(cart.filter(item => item.id !== idToDelete));
        setLikedProducts(likedProducts.filter(id => id !== idToDelete));
        showToast('Produk berhasil dihapus.');
        setModal({ type: null, id: null });
    };

    const handleDeleteCategory = () => {
        if (modal.type !== 'category' || !modal.id) return;
        const categoryToDelete = modal.id;
        setCategories(categories.filter(c => c !== categoryToDelete));
        setProducts(products.map(p => p.category === categoryToDelete ? { ...p, category: 'Lainnya' } : p));
        showToast(`Kategori "${categoryToDelete}" dihapus.`);
        setModal({ type: null, id: null });
    };

    const handleSaveLiveLinks = (links: { tiktok: string, shopee: string }) => {
        setLiveLinks(links);
        showToast('Tautan live berhasil diperbarui!');
    };

    // --- RENDER LOGIC ---
    const renderPage = () => {
        switch (activePage) {
            case 'detail':
                const selectedProduct = products.find(p => p.id === selectedProductId) || null;
                return <DetailPage product={selectedProduct} onBack={() => handleNavigate('home')} onAddToCart={handleAddToCart} showToast={showToast} onShare={handleShareProduct} onShowEcommerce={handleShowEcommerceModal} />;
            case 'cart':
                return <CartPage cart={cart} products={products} onNavigate={handleNavigate} onQuantityChange={handleQuantityChange} onRemove={handleRemoveFromCart} />;
            case 'checkout':
                return <CheckoutPage cart={cart} products={products} onNavigate={handleNavigate} onOrderComplete={handleOrderComplete} />;
            case 'liked':
                return <LikedPage likedProducts={likedProducts} allProducts={products} onNavigate={handleNavigate} onToggleLike={handleToggleLike} onAddToCart={handleAddToCart} onShowDetail={handleShowDetail} onShare={handleShareProduct} onBuyViaWa={handleBuyViaWa} onShowEcommerce={handleShowEcommerceModal} />;
            case 'login':
                return <LoginPage onLogin={handleLogin} />;
            case 'admin':
                if (!isLoggedIn) return <LoginPage onLogin={handleLogin} />;
                return <AdminPages 
                            products={products} 
                            categories={categories}
                            liveLinks={liveLinks}
                            onSaveLiveLinks={handleSaveLiveLinks}
                            onLogout={handleLogout} 
                            onSaveProduct={handleSaveProduct}
                            onDeleteProduct={() => {}} // Handled by modal
                            onSaveCategories={setCategories}
                            showDeleteModal={(id) => setModal({ type: 'product', id })}
                            showDeleteCategoryModal={(cat) => setModal({ type: 'category', id: cat })}
                        />;
            case 'home':
            default:
                return <HomePage 
                            products={products}
                            categories={categories}
                            likedProducts={likedProducts}
                            cart={cart}
                            liveLinks={liveLinks}
                            onNavigate={handleNavigate}
                            onToggleLike={handleToggleLike}
                            onAddToCart={handleAddToCart}
                            onShowDetail={handleShowDetail}
                            toggleMenu={() => setIsMenuOpen(true)}
                            onShare={handleShareProduct}
                            onBuyViaWa={handleBuyViaWa}
                            onShowEcommerce={handleShowEcommerceModal}
                        />;
        }
    };

    return (
        <div className="pb-16">
            {renderPage()}
            <BottomNav activePage={activePage} onNavigate={handleNavigate} />
            <Toast message={toast.message} show={toast.show} />
            <OffCanvasMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} onNavigate={handleNavigate} />
            <ShareModal
                isOpen={!!shareModalProduct}
                product={shareModalProduct}
                onClose={() => setShareModalProduct(null)}
                showToast={showToast}
            />
             <EcommerceModal
                isOpen={!!ecommerceModalProduct}
                product={ecommerceModalProduct}
                onClose={() => setEcommerceModalProduct(null)}
            />
            <DeleteModal 
                isOpen={modal.type === 'product'}
                onClose={() => setModal({ type: null, id: null })}
                onConfirm={handleDeleteProduct}
                title="Konfirmasi Hapus Produk"
                message="Apakah Anda yakin ingin menghapus produk ini? Tindakan ini tidak dapat dibatalkan."
            />
            <DeleteModal 
                isOpen={modal.type === 'category'}
                onClose={() => setModal({ type: null, id: null })}
                onConfirm={handleDeleteCategory}
                title="Konfirmasi Hapus Kategori"
                message={<>Apakah Anda yakin ingin menghapus kategori: <span className="font-bold">{modal.id}</span>? Produk dalam kategori ini akan dipindahkan ke 'Lainnya'.</>}
            />
        </div>
    );
};

export default App;