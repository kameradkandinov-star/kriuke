
import React, { useState } from 'react';
import { CartItem, Product, Page } from '../types';
import { formatRupiah } from './Shared';

interface CheckoutPageProps {
    cart: CartItem[];
    products: Product[];
    onNavigate: (page: Page) => void;
    onOrderComplete: () => void;
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({ cart, products, onNavigate, onOrderComplete }) => {
    const [formData, setFormData] = useState({ name: '', wa: '', address: '', notes: '' });
    const [error, setError] = useState('');

    const total = cart.reduce((sum, item) => {
        const product = products.find(p => p.id === item.id);
        if (!product) return sum;
        const price = product.discountPrice ?? product.originalPrice;
        return sum + (price * item.quantity);
    }, 0);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        const { name, wa, address, notes } = formData;

        if (!name || !wa || !address) {
            setError('Mohon lengkapi Nama, Nomor WhatsApp, dan Alamat Lengkap.');
            return;
        }

        let message = "Halo Kriuké Snack, saya mau pesan:\n\n";
        message += "--- *Data Pengiriman* ---\n";
        message += `Nama: *${name}*\n`;
        message += `No. WhatsApp: *${wa}*\n`;
        message += `Alamat: *${address}*\n`;
        if (notes) message += `Catatan: *${notes}*\n`;
        message += "\n--- *Detail Pesanan* ---\n";

        cart.forEach(item => {
            const product = products.find(p => p.id === item.id);
            if (product) {
                const price = product.discountPrice ?? product.originalPrice;
                message += `*${product.name}*\n`;
                message += `Jumlah: ${item.quantity} pcs\n`;
                message += `Subtotal: Rp${formatRupiah(price * item.quantity)}\n\n`;
            }
        });

        message += `*Total Pesanan: Rp${formatRupiah(total)}*\n\n`;
        message += "Mohon konfirmasi pesanan saya. Terima kasih!";

        const encodedMessage = encodeURIComponent(message);
        const waUrl = `https://wa.me/6282349786916?text=${encodedMessage}`;
        window.open(waUrl, '_blank');

        onOrderComplete();
    };

    return (
        <div>
            <header className="sticky top-0 z-50 bg-white shadow px-4 py-3 flex items-center">
                <button onClick={() => onNavigate('cart')} className="text-xl"><i className="fa-solid fa-arrow-left"></i></button>
                <h2 className="text-lg font-semibold ml-4">Data Pengiriman</h2>
            </header>
            <main className="p-4 pb-40">
                <form id="checkout-form" onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                        <input type="text" id="name" value={formData.name} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors" required />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="wa" className="block text-sm font-medium text-gray-700 mb-1">Nomor WhatsApp</label>
                        <input type="tel" id="wa" value={formData.wa} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors" placeholder="Contoh: 08123456789" required />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Alamat Lengkap</label>
                        <textarea id="address" value={formData.address} onChange={handleChange} rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors" placeholder="Sertakan nama jalan, nomor rumah, RT/RW, kelurahan, kecamatan, kota/kab, dan kode pos." required></textarea>
                    </div>
                    <div className="mb-6">
                        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">Catatan (opsional)</label>
                        <textarea id="notes" value={formData.notes} onChange={handleChange} rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors" placeholder="Contoh: Pagar warna hijau"></textarea>
                    </div>
                    {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
                </form>
            </main>
            <footer className="fixed bottom-16 left-1/2 -translate-x-1/2 max-w-md w-full p-4 bg-white border-t z-40">
                <div className="flex justify-between items-center mb-3">
                    <span className="text-gray-700 font-medium">Total:</span>
                    <span className="text-2xl font-bold text-orange-600">Rp{formatRupiah(total)}</span>
                </div>
                <button type="submit" form="checkout-form" className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold shadow-lg hover:bg-green-600 transition-colors">
                    <i className="fa-brands fa-whatsapp mr-2 text-xl"></i>
                    Kirim Pesanan via WhatsApp
                </button>
            </footer>
        </div>
    );
};

export default CheckoutPage;
