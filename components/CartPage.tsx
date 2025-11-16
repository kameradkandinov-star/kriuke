
import React from 'react';
import { CartItem, Product, Page } from '../types';
import { formatRupiah } from './Shared';

interface CartPageProps {
    cart: CartItem[];
    products: Product[];
    onNavigate: (page: Page) => void;
    onQuantityChange: (id: string, change: number) => void;
    onRemove: (id: string) => void;
}

const CartPage: React.FC<CartPageProps> = ({ cart, products, onNavigate, onQuantityChange, onRemove }) => {
    
    const cartDetails = cart.map(item => {
        const product = products.find(p => p.id === item.id);
        return { ...item, product };
    }).filter(item => item.product); // Filter out items where product might have been deleted

    const total = cartDetails.reduce((sum, item) => {
        const price = item.product!.discountPrice ?? item.product!.originalPrice;
        return sum + (price * item.quantity);
    }, 0);

    return (
        <div>
            <header className="sticky top-0 z-50 bg-white shadow px-4 py-3 flex items-center">
                <button onClick={() => onNavigate('home')} className="text-xl"><i className="fa-solid fa-arrow-left"></i></button>
                <h2 className="text-lg font-semibold ml-4">Keranjang Saya</h2>
            </header>
            <main className="p-4 pb-40">
                {cartDetails.length === 0 ? (
                    <div className="flex flex-col items-center justify-center text-center mt-10 p-4">
                        <i className="fa-solid fa-cart-arrow-down text-6xl text-gray-300 mb-4"></i>
                        <h3 className="text-lg font-semibold text-gray-700">Keranjang Anda Kosong</h3>
                        <p className="text-gray-500 mb-6">Ayo, cari kripik favoritmu!</p>
                        <button onClick={() => onNavigate('home')} className="bg-orange-600 text-white px-6 py-2 rounded-full font-semibold shadow hover:bg-orange-700">
                            Mulai Belanja
                        </button>
                    </div>
                ) : (
                    cartDetails.map(({ id, quantity, product }) => {
                        if (!product) return null;
                        const price = product.discountPrice ?? product.originalPrice;
                        const itemTotal = price * quantity;
                        return (
                            <div key={id} className="flex items-center gap-3 bg-white p-3 rounded-lg shadow-sm border mb-3">
                                <img src={product.images[0]} alt={product.name} className="w-16 h-16 object-cover rounded" onError={(e) => e.currentTarget.src = 'https://placehold.co/64/FFECB3/000000?text=Error'}/>
                                <div className="flex-grow">
                                    <h4 className="font-medium capitalize">{product.name}</h4>
                                    <p className="text-sm text-gray-600">Rp{formatRupiah(price)}</p>
                                    <p className="text-sm font-semibold text-orange-600">Subtotal: Rp{formatRupiah(itemTotal)}</p>
                                </div>
                                <div className="flex flex-col items-center gap-1">
                                    <div className="flex items-center border rounded-lg">
                                        <button onClick={() => onQuantityChange(id, -1)} className="cart-quantity-btn px-2 py-1 bg-gray-100 hover:bg-gray-200">-</button>
                                        <span className="px-2 text-sm">{quantity}</span>
                                        <button onClick={() => onQuantityChange(id, 1)} className="cart-quantity-btn px-2 py-1 bg-gray-100 hover:bg-gray-200">+</button>
                                    </div>
                                    <button onClick={() => onRemove(id)} className="text-xs font-medium text-red-500 hover:underline mt-1">Hapus</button>
                                </div>
                            </div>
                        );
                    })
                )}
            </main>
            <footer className="fixed bottom-16 left-1/2 -translate-x-1/2 max-w-md w-full p-4 bg-white border-t z-40">
                <div className="flex justify-between items-center mb-3">
                    <span className="text-gray-700 font-medium">Total:</span>
                    <span id="cart-total" className="text-2xl font-bold text-orange-600">Rp{formatRupiah(total)}</span>
                </div>
                <button
                    onClick={() => onNavigate('checkout')}
                    disabled={cart.length === 0}
                    className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold shadow-lg hover:bg-green-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    <i className="fa-solid fa-file-invoice mr-2"></i>
                    Lanjut ke Pengiriman
                </button>
            </footer>
        </div>
    );
};

export default CartPage;
