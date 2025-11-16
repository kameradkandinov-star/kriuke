import React, { useState, useEffect } from 'react';
import { Product, Page } from '../types';
import { formatRupiah, Footer } from './Shared';

// --- Types ---
type AdminView = 'dashboard' | 'edit_form';

interface AdminPagesProps {
    products: Product[];
    categories: string[];
    onLogout: () => void;
    onSaveProduct: (product: Omit<Product, 'id'>, id?: string) => void;
    onDeleteProduct: (id: string) => void;
    onSaveCategories: (categories: string[]) => void;
    showDeleteModal: (id: string) => void;
    showDeleteCategoryModal: (category: string) => void;
    liveLinks: { tiktok: string; shopee: string; };
    onSaveLiveLinks: (links: { tiktok: string; shopee: string; }) => void;
}

// --- Login Page ---
interface LoginPageProps {
    onLogin: () => void;
}
export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (username === 'arjune' && password === 'kriuke123') {
            setError('');
            onLogin();
        } else {
            setError('Username atau password salah!');
        }
    };

    return (
        <div>
            <header className="sticky top-0 z-50 bg-white shadow px-4 py-3">
                <h2 className="text-lg font-semibold text-center">Login Admin</h2>
            </header>
            <main className="p-6 pt-10">
                <img src="https://i.ibb.co/n86sQs1v/Logo-Toko-Aneka-Cemilan-Snack-Ceria-Oranye-Kuning-20251105_010226_0000.png" alt="Logo" className="w-32 mx-auto mb-6"/>
                <form onSubmit={handleLogin}>
                    <div className="mb-4">
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors" required />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="password"className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors" required />
                    </div>
                    <button type="submit" className="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors">Login</button>
                    {error && <p className="text-red-500 text-sm text-center mt-4">{error}</p>}
                </form>
            </main>
        </div>
    );
};

// --- Edit Product Page ---
interface EditProductPageProps {
    productToEdit: Product | null;
    categories: string[];
    onSave: (product: Omit<Product, 'id'>, id?: string) => void;
    onCancel: () => void;
}
const EditProductPage: React.FC<EditProductPageProps> = ({ productToEdit, categories, onSave, onCancel }) => {
    const initialFormState = {
        name: '', category: categories[0] || 'Lainnya', subtitle: '', originalPrice: '', discountPrice: '', rating: '', images: '', description: '', sold: '',
        tiktokLink: '', shopeeLink: '', tokopediaLink: ''
    };
    const [formState, setFormState] = useState(initialFormState);
    const [hasDiscount, setHasDiscount] = useState(false);

    useEffect(() => {
        if (productToEdit) {
            const hasExistingDiscount = !!productToEdit.discountPrice && productToEdit.discountPrice < productToEdit.originalPrice;
            setHasDiscount(hasExistingDiscount);
            setFormState({
                name: productToEdit.name,
                category: productToEdit.category,
                subtitle: productToEdit.subtitle,
                originalPrice: String(productToEdit.originalPrice),
                discountPrice: hasExistingDiscount ? String(productToEdit.discountPrice) : '',
                rating: String(productToEdit.rating),
                images: productToEdit.images.join(', '),
                description: productToEdit.description,
                sold: String(productToEdit.sold || 0),
                tiktokLink: productToEdit.ecommerceLinks?.tiktok || '',
                shopeeLink: productToEdit.ecommerceLinks?.shopee || '',
                tokopediaLink: productToEdit.ecommerceLinks?.tokopedia || '',
            });
        } else {
            setHasDiscount(false);
            setFormState({ ...initialFormState, sold: '0', category: categories[0] || 'Lainnya' });
        }
    }, [productToEdit, categories]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormState({ ...formState, [e.target.id]: e.target.value });
    };
    
    const handleDiscountToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
        const isChecked = e.target.checked;
        setHasDiscount(isChecked);
        if (!isChecked) {
            setFormState(prev => ({ ...prev, discountPrice: '' }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const originalPriceNum = parseInt(formState.originalPrice);
        const discountPriceNum = formState.discountPrice ? parseInt(formState.discountPrice) : undefined;
        
        if (hasDiscount && (!discountPriceNum || discountPriceNum >= originalPriceNum)) {
            alert('Harga diskon harus diisi dan lebih rendah dari harga asli.');
            return;
        }

        const productData = {
            name: formState.name,
            category: formState.category,
            subtitle: formState.subtitle,
            originalPrice: originalPriceNum,
            discountPrice: hasDiscount ? discountPriceNum : undefined,
            rating: parseFloat(formState.rating),
            sold: parseInt(formState.sold, 10) || 0,
            images: formState.images.split(',').map(url => url.trim()).filter(Boolean),
            description: formState.description,
            ecommerceLinks: {
                tiktok: formState.tiktokLink || undefined,
                shopee: formState.shopeeLink || undefined,
                tokopedia: formState.tokopediaLink || undefined,
            }
        };
        onSave(productData, productToEdit?.id);
    };

    return (
        <div>
            <header className="sticky top-0 z-50 bg-white shadow px-4 py-3 flex items-center">
                <button onClick={onCancel} className="text-xl"><i className="fa-solid fa-arrow-left"></i></button>
                <h2 className="text-lg font-semibold ml-4">{productToEdit ? 'Edit Produk' : 'Tambah Produk'}</h2>
            </header>
            <main className="p-4 pb-20">
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nama Produk</label>
                        <input type="text" id="name" value={formState.name} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50" required />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                        <select id="category" value={formState.category} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50" required>
                             {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                             {!categories.includes('Lainnya') && <option value="Lainnya">Lainnya</option>}
                        </select>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="subtitle" className="block text-sm font-medium text-gray-700 mb-1">Sub Judul</label>
                        <input type="text" id="subtitle" value={formState.subtitle} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50" />
                    </div>
                    
                    <div className="mb-4">
                        <label htmlFor="originalPrice" className="block text-sm font-medium text-gray-700 mb-1">Harga Asli (Rp)</label>
                        <input type="number" id="originalPrice" value={formState.originalPrice} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50" required />
                    </div>
                    <div className="mb-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input 
                                type="checkbox" 
                                checked={hasDiscount} 
                                onChange={handleDiscountToggle} 
                                className="h-4 w-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                            />
                            <span className="text-sm font-medium text-gray-700 select-none">Ada diskon?</span>
                        </label>
                    </div>
                    <div className={`transition-all duration-300 ease-in-out overflow-hidden ${hasDiscount ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                        <div className="mb-4 pt-1">
                            <label htmlFor="discountPrice" className="block text-sm font-medium text-gray-700 mb-1">Harga Diskon (Rp)</label>
                            <input type="number" id="discountPrice" value={formState.discountPrice} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50" placeholder="Masukkan harga setelah diskon" required={hasDiscount} />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-1">Rating (0.0 - 5.0)</label>
                        <input type="number" id="rating" value={formState.rating} onChange={handleChange} step="0.1" min="0" max="5" className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50" required />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="sold" className="block text-sm font-medium text-gray-700 mb-1">Jumlah Terjual</label>
                        <input type="number" id="sold" value={formState.sold} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50" required />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="images" className="block text-sm font-medium text-gray-700 mb-1">URL Gambar (Pisahkan koma)</label>
                        <textarea id="images" value={formState.images} onChange={handleChange} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50" required />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                        <textarea id="description" value={formState.description} onChange={handleChange} rows={5} className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50" required />
                    </div>
                    
                    <div className="border-t pt-4 mt-6">
                        <h3 className="font-semibold text-gray-800 mb-3">Tautan E-commerce (Opsional)</h3>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="tiktokLink" className="block text-sm font-medium text-gray-700 mb-1">URL TikTok Shop</label>
                                <input type="url" id="tiktokLink" value={formState.tiktokLink} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50" placeholder="https://www.tiktok.com/..." />
                            </div>
                            <div>
                                <label htmlFor="shopeeLink" className="block text-sm font-medium text-gray-700 mb-1">URL Shopee</label>
                                <input type="url" id="shopeeLink" value={formState.shopeeLink} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50" placeholder="https://shopee.co.id/..." />
                            </div>
                             <div>
                                <label htmlFor="tokopediaLink" className="block text-sm font-medium text-gray-700 mb-1">URL Tokopedia</label>
                                <input type="url" id="tokopediaLink" value={formState.tokopediaLink} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50" placeholder="https://www.tokopedia.com/..." />
                            </div>
                        </div>
                    </div>

                    <button type="submit" className="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors mt-6">Simpan Produk</button>
                </form>
            </main>
        </div>
    );
};

// --- Dashboard Page ---
const AdminDashboard: React.FC<AdminPagesProps & { setView: (view: AdminView) => void; setProductToEdit: (p: Product | null) => void }> = 
({ products, categories, onLogout, showDeleteModal, showDeleteCategoryModal, setView, setProductToEdit, onSaveCategories, liveLinks, onSaveLiveLinks }) => {
    
    const [newCategory, setNewCategory] = useState('');
    const [liveLinksForm, setLiveLinksForm] = useState(liveLinks);

    useEffect(() => {
        setLiveLinksForm(liveLinks);
    }, [liveLinks]);

    const handleLiveLinksChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLiveLinksForm({ ...liveLinksForm, [e.target.name]: e.target.value });
    };

    const handleLiveLinksSave = (e: React.FormEvent) => {
        e.preventDefault();
        onSaveLiveLinks(liveLinksForm);
    };

    const handleAddCategory = (e: React.FormEvent) => {
        e.preventDefault();
        if (newCategory && !categories.includes(newCategory)) {
            onSaveCategories([...categories, newCategory]);
            setNewCategory('');
        }
    };

    return (
        <div>
            <header className="sticky top-0 z-50 bg-white shadow px-4 py-3 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Admin Dashboard</h2>
                <button onClick={onLogout} className="text-sm text-red-500 font-medium">Logout</button>
            </header>
            <main className="pb-20">
                <div className="p-4">
                    <button onClick={() => { setProductToEdit(null); setView('edit_form'); }} className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold mb-6 hover:bg-green-600 transition-colors">
                        <i className="fa-solid fa-plus mr-2"></i> Tambah Produk Baru
                    </button>

                    <h3 className="font-semibold text-gray-800 mb-3 border-t pt-4 mt-6">Kelola Tautan Live</h3>
                    <form onSubmit={handleLiveLinksSave} className="bg-gray-50 p-3 rounded-lg mb-6">
                        <div className="space-y-3">
                             <div>
                                <label htmlFor="tiktokLiveLink" className="block text-sm font-medium text-gray-700 mb-1">URL Live TikTok</label>
                                <input type="url" id="tiktokLiveLink" name="tiktok" value={liveLinksForm.tiktok} onChange={handleLiveLinksChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white" placeholder="https://www.tiktok.com/@..." required />
                            </div>
                            <div>
                                <label htmlFor="shopeeLiveLink" className="block text-sm font-medium text-gray-700 mb-1">URL Toko Shopee</label>
                                <input type="url" id="shopeeLiveLink" name="shopee" value={liveLinksForm.shopee} onChange={handleLiveLinksChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white" placeholder="https://shopee.co.id/..." required />
                            </div>
                        </div>
                        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600 transition-colors mt-4 text-sm">
                            Simpan Tautan
                        </button>
                    </form>

                    <h3 className="font-semibold text-gray-800 mb-3 border-t pt-4">Kelola Kategori Produk</h3>
                    <div className="bg-gray-50 p-3 rounded-lg mb-6">
                        <div className="flex flex-wrap gap-2 mb-3">
                            {categories.map(cat => (
                                <div key={cat} className="flex items-center bg-white border rounded-full pl-3 pr-2 py-1 shadow-sm">
                                    <span className="text-sm font-medium text-gray-700">{cat}</span>
                                    <button onClick={() => showDeleteCategoryModal(cat)} className="ml-2 p-1 text-red-500 hover:text-red-700"><i className="fa-solid fa-times text-xs"></i></button>
                                </div>
                            ))}
                        </div>
                        <form onSubmit={handleAddCategory} className="flex gap-2">
                            <input type="text" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} placeholder="Nama Kategori Baru" className="flex-grow px-3 py-2 border border-gray-300 rounded-lg text-sm" required />
                            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600">Tambah</button>
                        </form>
                    </div>

                    <h3 className="font-semibold text-gray-800 mb-3">Daftar Produk</h3>
                    <div className="space-y-3">
                        {[...products].reverse().map(product => (
                             <div key={product.id} className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm border">
                                <div className="flex items-center gap-3">
                                    <img src={product.images[0]} alt={product.name} className="w-12 h-12 object-cover rounded" />
                                    <div className="flex-grow">
                                        <h4 className="font-medium capitalize">{product.name}</h4>
                                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                                            <p className="text-sm text-red-600 font-semibold">Rp{formatRupiah(product.discountPrice ?? product.originalPrice)}</p>
                                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{product.category}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => { setProductToEdit(product); setView('edit_form'); }} className="p-2 text-blue-500 hover:text-blue-700"><i className="fa-solid fa-pen-to-square"></i></button>
                                    <button onClick={() => showDeleteModal(product.id)} className="p-2 text-red-500 hover:text-red-700"><i className="fa-solid fa-trash"></i></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <Footer />
            </main>
        </div>
    );
};


// --- Main AdminPages Component ---
export const AdminPages: React.FC<AdminPagesProps> = (props) => {
    const [view, setView] = useState<AdminView>('dashboard');
    const [productToEdit, setProductToEdit] = useState<Product | null>(null);

    const handleSaveProduct = (product: Omit<Product, 'id'>, id?: string) => {
        props.onSaveProduct(product, id);
        setView('dashboard');
    };

    if (view === 'edit_form') {
        return <EditProductPage productToEdit={productToEdit} categories={props.categories} onSave={handleSaveProduct} onCancel={() => setView('dashboard')} />;
    }

    return <AdminDashboard {...props} setView={setView} setProductToEdit={setProductToEdit} />;
};