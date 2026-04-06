import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Search, Trash2, ArrowUpDown, ChevronLeft, ChevronDown, Loader2, Image as ImageIcon } from 'lucide-react';
import axios from 'axios';

interface Category {
  category_id: number;
  category_name: string;
  category_description: string;
  category_status: string;
  category_image?: string;
}

const CategoryPage: React.FC = () => {
  const [view, setView] = useState<'list' | 'add'>('list');
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true); 
  const [isSaving, setIsSaving] = useState(false); 
  const [idToDelete, setIdToDelete] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'active',
    file: null as File | null
  });

  const API_URL = import.meta.env.VITE_API_URL;

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/categories/all`);
      if (res.data.success) {
        setCategories(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setFormData({ ...formData, file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleEditClick = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.category_name || '',
      description: category.category_description || '',
      status: category.category_status || 'active',
      file: null
    });
    setImagePreview(category.category_image ? `${API_URL}/uploads/${category.category_image}` : null);
    setView('add');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.description) {
      alert("الرجاء ملء الحقول الأساسية");
      return;
    }

    setIsSaving(true);
    const data = new FormData();
    data.append('category_name', formData.name);
    data.append('category_description', formData.description);
    data.append('category_status', formData.status);
    if (formData.file) data.append('image', formData.file);

    try {
      if (editingCategory) {
        await axios.patch(`${API_URL}/categories/update/${editingCategory.category_id}`, data);
      } else {
        await axios.post(`${API_URL}/categories/add`, data);
      }
      setView('list');
      fetchCategories();
    } catch (err) {
      alert("حدث خطأ أثناء حفظ البيانات");
    } finally {
      setIsSaving(false);
    }
  };

  const filteredCategories = categories.filter(cat => 
    cat.category_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#C4DAD2] p-6 text-[#16423C] font-sans">
      
      {/* Modal Delete */}
      {idToDelete !== null && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-sm bg-black/30">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl border-t-4 border-red-500 animate-in zoom-in-95">
            <h2 className="text-xl font-bold mb-4">Delete Category?</h2>
            <p className="text-gray-500 mb-8">This action cannot be undone. Are you sure?</p>
            <div className="flex gap-4">
              <button 
                onClick={async () => {
                  await axios.delete(`${API_URL}/categories/delete/${idToDelete}`);
                  setCategories(prev => prev.filter(c => c.category_id !== idToDelete));
                  setIdToDelete(null);
                }}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg font-bold hover:bg-red-700 transition-all"
              >
                Delete
              </button>
              <button onClick={() => setIdToDelete(null)} className="flex-1 bg-gray-100 py-2 rounded-lg font-bold">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {view === 'list' && (
        <div className="max-w-6xl mx-auto animate-in fade-in duration-500">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-black bg-white px-6 py-2 rounded-lg shadow-sm border border-[#E9EFEC]">Categories</h1>
            <button 
              onClick={() => { setEditingCategory(null); setFormData({name:'', description:'', status:'active', file:null}); setImagePreview(null); setView('add'); }}
              className="bg-[#16423C] text-white px-6 py-2 rounded-xl flex items-center gap-2 hover:bg-[#6A9C89] transition-all shadow-lg"
            >
              <Plus size={18} /> Add New Category
            </button>
          </div>

          <div className="bg-[#E9EFEC] p-6 rounded-2xl shadow-sm border border-[#C4DAD2]">
            <div className="flex justify-between mb-6">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search categories..." 
                  className="pl-10 pr-4 py-2 rounded-xl border border-[#C4DAD2] w-80 outline-none focus:ring-2 focus:ring-[#16423C]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
              </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-[#C4DAD2] bg-white">
              <table className="w-full text-center">
                <thead className="bg-[#16423C] text-white">
                  <tr className="text-xs uppercase tracking-wider">
                    <th className="py-4">Name</th>
                    <th>Description</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    <tr><td colSpan={4} className="py-10"><Loader2 className="animate-spin mx-auto" /></td></tr>
                  ) : filteredCategories.map(cat => (
                    <tr key={cat.category_id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 font-bold">{cat.category_name}</td>
                      <td className="text-gray-500 text-sm italic">{cat.category_description || '---'}</td>
                      <td>
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black ${cat.category_status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {cat.category_status.toUpperCase()}
                        </span>
                      </td>
                      <td className="flex justify-center gap-4 py-4">
                        <button onClick={() => handleEditClick(cat)} className="text-[#16423C] font-bold text-xs hover:underline">EDIT</button>
                        <Trash2 size={18} className="text-red-500 cursor-pointer hover:scale-110 transition-transform" onClick={() => setIdToDelete(cat.category_id)} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {view === 'add' && (
        <div className="max-w-3xl mx-auto bg-white p-10 rounded-3xl shadow-xl animate-in slide-in-from-right duration-500">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-2xl font-black">{editingCategory ? 'Update Category' : 'Create Category'}</h2>
            <button onClick={() => setView('list')} className="flex items-center gap-2 text-gray-500 hover:text-black transition-colors">
              <ChevronLeft size={20} /> Back
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold">Category Name *</label>
                <input 
                  className="w-full border p-3 rounded-xl outline-none focus:border-[#16423C]"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold">Status</label>
                <select 
                  className="w-full border p-3 rounded-xl bg-gray-50 outline-none"
                  value={formData.status}
                  onChange={e => setFormData({...formData, status: e.target.value})}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold">Description *</label>
              <textarea 
                rows={4}
                className="w-full border p-3 rounded-xl outline-none focus:border-[#16423C]"
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold">Category Image</label>
              <div className="relative border-2 border-dashed border-[#C4DAD2] p-8 rounded-2xl text-center group hover:bg-gray-50 cursor-pointer transition-all">
                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageChange} />
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="h-32 mx-auto rounded-lg object-cover shadow-md" />
                ) : (
                  <div className="flex flex-col items-center text-gray-400 group-hover:text-[#16423C]">
                    <ImageIcon size={40} />
                    <span className="text-sm mt-2">Click to upload or drag image</span>
                  </div>
                )}
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isSaving}
              className="w-full bg-[#16423C] text-white py-4 rounded-2xl font-bold text-lg hover:bg-[#0E2A26] transition-all shadow-xl disabled:opacity-50"
            >
              {isSaving ? <Loader2 className="animate-spin mx-auto" /> : (editingCategory ? 'Update Category' : 'Save Category')}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;