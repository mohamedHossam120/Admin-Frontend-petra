import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Loader2, Save, ArrowLeft, Upload, ImageIcon } from 'lucide-react';

const EditService: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    max_price: '',
    admin_commission_rate: '',
    description: '',
    status: 'active'
  });

  useEffect(() => {
    const fetchServiceData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_URL}/services/get/${id}`);
        
        if (res.data.success) {
          const s = res.data.data;
          setFormData({
            name: s.name || '',
            price: s.price || '',
            max_price: s.max_price || '',
            admin_commission_rate: s.admin_commission_rate || '',
            description: s.description || '',
            status: s.status || 'active'
          });

          if (s.image) {
            const imageUrl = s.image.startsWith('http') 
              ? s.image 
              : `${API_URL.replace('/api', '')}/uploads/${s.image}`;
            setImagePreview(imageUrl);
          }
        }
      } catch (err) {
        console.error("Fetch Error:", err);
        alert("فشل في تحميل بيانات الخدمة.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchServiceData();
  }, [id, API_URL]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      if (imagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
      }
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const data = new FormData();
    // استخدام loop لإضافة البيانات بدل التكرار
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });
    
    if (imageFile) data.append('image', imageFile);

    try {
      const res = await axios.put(`${API_URL}/services/update/${id}`, data);
      if (res.data.success) {
        alert("تم تحديث الخدمة بنجاح!");
        navigate('/service-management/services-list');
      }
    } catch (err: any) {
      alert(err.response?.data?.error || "حدث خطأ أثناء التحديث.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-[#C4DAD2]">
      <Loader2 className="animate-spin text-[#16423C]" size={48} />
    </div>
  );

  return (
    <div className="p-8 bg-[#C4DAD2] min-h-screen font-sans text-[#16423C]">
      <button 
        onClick={() => navigate(-1)} 
        className="mb-6 flex items-center gap-2 font-bold hover:translate-x-[-5px] transition-transform"
      >
        <ArrowLeft size={20} /> Back to List
      </button>

      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl mx-auto overflow-hidden border border-[#E9EFEC]">
        <div className="bg-[#16423C] p-8 text-white text-center">
          <h1 className="text-2xl font-black uppercase tracking-widest">Edit Service</h1>
          <p className="text-[#6A9C89] text-sm mt-1">Update information for Service ID: #{id}</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-black uppercase text-gray-500">Service Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="border-b-2 border-[#E9EFEC] p-3 focus:border-[#16423C] outline-none transition-colors font-medium text-gray-800"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-black uppercase text-gray-500">Base Price (EGP)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="border-b-2 border-[#E9EFEC] p-3 focus:border-[#16423C] outline-none transition-colors font-medium text-gray-800"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-black uppercase text-gray-500">Max Price (Optional)</label>
            <input
              type="number"
              name="max_price"
              value={formData.max_price}
              onChange={handleChange}
              className="border-b-2 border-[#E9EFEC] p-3 focus:border-[#16423C] outline-none transition-colors font-medium text-gray-800"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-black uppercase text-gray-500">Commission Rate (e.g. 0.15)</label>
            <input
              type="number"
              step="0.01"
              name="admin_commission_rate"
              value={formData.admin_commission_rate}
              onChange={handleChange}
              className="border-b-2 border-[#E9EFEC] p-3 focus:border-[#16423C] outline-none transition-colors font-medium text-gray-800"
            />
          </div>

          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="text-xs font-black uppercase text-gray-500">Visibility Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="bg-[#E9EFEC] p-4 rounded-xl focus:ring-2 focus:ring-[#16423C] outline-none font-bold"
            >
              <option value="active">Active (Visible to users)</option>
              <option value="inactive">Inactive (Hidden)</option>
            </select>
          </div>

          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="text-xs font-black uppercase text-gray-500">Service Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="border-2 border-[#E9EFEC] p-4 rounded-2xl focus:border-[#16423C] outline-none transition-colors text-gray-700"
            />
          </div>

          {/* Image Upload Area */}
          <div className="md:col-span-2 group">
            <label className="text-xs font-black uppercase text-gray-500 mb-2 block">Service Image</label>
            <div className="relative border-2 border-dashed border-[#C4DAD2] p-8 rounded-3xl flex flex-col items-center gap-4 group-hover:border-[#16423C] transition-all bg-[#F9FBFA]">
              {imagePreview ? (
                <div className="relative">
                   <img src={imagePreview} alt="Preview" className="w-64 h-40 object-cover rounded-2xl shadow-lg border-4 border-white" />
                   <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center">
                      <ImageIcon className="text-white" size={32} />
                   </div>
                </div>
              ) : (
                <div className="w-20 h-20 bg-[#E9EFEC] rounded-full flex items-center justify-center text-[#6A9C89]">
                  <Upload size={32} />
                </div>
              )}
              
              <label className="cursor-pointer bg-[#16423C] text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-[#6A9C89] transition-all shadow-md active:scale-95">
                {imagePreview ? 'Change Photo' : 'Upload Photo'}
                <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
              </label>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">JPG, PNG OR WEBP (MAX. 2MB)</p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="md:col-span-2 mt-4">
            <button
              type="submit"
              disabled={saving}
              className="w-full bg-[#16423C] text-white py-5 rounded-2xl font-black text-lg uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:shadow-[0_10px_20px_rgba(22,66,60,0.3)] disabled:bg-gray-300 transition-all active:scale-[0.98]"
            >
              {saving ? <Loader2 className="animate-spin" /> : <Save size={24} />}
              {saving ? 'Processing...' : 'Update Service'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditService;