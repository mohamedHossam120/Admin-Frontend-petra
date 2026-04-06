import React, { useState, useEffect, useCallback } from 'react';
import { Search, Plus, ChevronLeft, Trash2, Loader2, Image as ImageIcon } from 'lucide-react';
import axios from 'axios';

interface SubCategoryData {
  subcategory_id: number;
  subcategory_name: string;
  category_id: number;
  subcategory_description: string;
  subcategory_status: 'active' | 'inactive';
}

// واجهة بسيطة للأقسام الأب
interface Category {
  category_id: number;
  category_name: string;
}

const API_URL = import.meta.env.VITE_API_URL;

const SubCategoryPage: React.FC = () => {
  const [view, setView] = useState<'list' | 'add'>('list');
  const [idToDelete, setIdToDelete] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<SubCategoryData[]>([]);
  const [categories, setCategories] = useState<Category[]>([]); // لتخزين الأقسام الأساسية
  const [searchTerm, setSearchTerm] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    subcategory_name: '',
    category_id: '', 
    subcategory_description: '',
    image: null as File | null
  });

  // جلب الأقسام الفرعية والأقسام الأساسية
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [subRes, catRes] = await Promise.all([
        axios.get(`${API_URL}/subcategories/getall`),
        axios.get(`${API_URL}/categories/getall`) // نفترض وجود هذا المسار
      ]);
      
      if (subRes.data.success) setData(subRes.data.data);
      if (catRes.data.success) setCategories(catRes.data.data);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // تعامل مع تغيير الصورة للمعاينة
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setFormData({ ...formData, image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // ... (toggleStatus و confirmDelete تظل كما هي مع تحديث الـ URL)

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const submitData = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) submitData.append(key, value);
    });

    try {
      const response = await axios.post(`${API_URL}/subcategories/add`, submitData);
      if (response.data.success) {
        await fetchData();
        setView('list');
        setFormData({ subcategory_name: '', category_id: '', subcategory_description: '', image: null });
        setImagePreview(null);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to save");
    } finally {
      setLoading(false);
    }
  };

  const filteredData = data.filter(item => 
    item.subcategory_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#C4DAD2] p-6 text-[#16423C] font-sans relative">
      {/* ... (مودال الحذف والجزء العلوي من القائمة) ... */}

      {view === 'add' && (
        <div className="max-w-3xl mx-auto bg-[#E9EFEC] p-10 rounded-2xl shadow-xl animate-in slide-in-from-right">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Create Subcategory</h2>
            <button onClick={() => setView('list')} className="bg-[#16423C] text-white px-5 py-2 rounded-lg flex items-center gap-2">
              <ChevronLeft size={18} /> Back
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-bold block mb-1">Subcategory Name *</label>
                <input 
                  type="text" 
                  className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-[#16423C]"
                  value={formData.subcategory_name}
                  onChange={(e) => setFormData({...formData, subcategory_name: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-bold block mb-1">Main Category *</label>
                <select 
                  className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-[#16423C] bg-white"
                  value={formData.category_id}
                  onChange={(e) => setFormData({...formData, category_id: e.target.value})}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat.category_id} value={cat.category_id}>{cat.category_name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Icon / Image Upload with Preview */}
            <div>
              <label className="text-sm font-bold block mb-1">Icon / Image</label>
              <div className="relative border-2 border-dashed border-[#6A9C89] p-6 rounded-2xl text-center cursor-pointer hover:bg-white/50">
                <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleImageChange} />
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="h-20 mx-auto rounded-lg object-cover" />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-gray-500">
                    <ImageIcon size={32} />
                    <span className="text-sm">Click to upload image</span>
                  </div>
                )}
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-[#16423C] text-white py-4 rounded-xl font-bold hover:bg-[#0E2A26] transition-all">
              {loading ? <Loader2 className="animate-spin mx-auto" /> : 'Save Subcategory'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default SubCategoryPage;