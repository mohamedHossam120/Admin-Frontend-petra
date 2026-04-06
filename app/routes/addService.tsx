import { useState, useEffect } from "react";
import axios from "axios";
import { Loader2, ChevronLeft, Save } from "lucide-react";

interface Category {
  category_id: number;
  category_name: string;
}

interface SubCategory {
  subcategory_id: number;
  subcategory_name: string;
}

export default function AddService() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [loadingCats, setLoadingCats] = useState(false);
  const [loadingSubs, setLoadingSubs] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  const [form, setForm] = useState({
    serviceName: "",
    category: "",
    subCategory: "",
    price: "",
    commissionValue: "",
    discount: "0",
    status: "active",
    description: "",
  });

  useEffect(() => {
    const fetchCats = async () => {
      try {
        setLoadingCats(true);
        const res = await axios.get(`${API_URL}/categories/all`);
        if (res.data.success) setCategories(res.data.data);
      } catch (err) {
        console.error("Error fetching categories:", err);
      } finally {
        setLoadingCats(false);
      }
    };
    fetchCats();
  }, [API_URL]);

  useEffect(() => {
    const fetchSubs = async () => {
      if (!form.category) {
        setSubCategories([]);
        return;
      }
      try {
        setLoadingSubs(true);
        const res = await axios.get(`${API_URL}/subcategories/category/${form.category}`);
        if (res.data.success) setSubCategories(res.data.data);
      } catch (err) {
        console.error("Error fetching subcategories:", err);
        setSubCategories([]);
      } finally {
        setLoadingSubs(false);
      }
    };
    fetchSubs();
  }, [form.category, API_URL]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.serviceName || !form.category || !form.subCategory || !form.price) {
      alert("الرجاء إكمال البيانات المطلوبة (*)");
      return;
    }

    try {
      setIsSaving(true);
      const dataToSend = {
        name: form.serviceName,
        category: form.category,
        sub_category: form.subCategory, 
        description: form.description,
        price: form.price,
        max_price: form.price,
        admin_commission_rate: form.commissionValue,
        status: form.status,
        image: "default_service.png" 
      };

      const res = await axios.post(`${API_URL}/services/add`, dataToSend);
      if (res.data.success) {
        alert("تمت إضافة الخدمة بنجاح!");
        window.history.back();
      }
    } catch (err: any) {
      alert(err.response?.data?.error || "حدث خطأ أثناء الحفظ");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#6A9C89] p-6 text-black font-sans">
      <div className="flex justify-between items-center mb-8 max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-white tracking-tight">Add New Service</h1>
        <button 
          onClick={() => window.history.back()}
          className="flex items-center gap-2 bg-[#16423C] text-white px-5 py-2 rounded-lg hover:bg-black transition-all shadow-md text-sm font-bold"
        >
          <ChevronLeft size={18} /> BACK
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-[#E9EFEC] p-8 rounded-2xl shadow-2xl max-w-5xl mx-auto border border-white/20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="space-y-2">
            <label className="text-sm font-bold text-[#16423C]">Service Name *</label>
            <input required name="serviceName" value={form.serviceName} onChange={handleChange} className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-[#6A9C89] outline-none transition-all" placeholder="Enter service name" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-[#16423C]">Main Category *</label>
            <select required name="category" value={form.category} onChange={handleChange} className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[#6A9C89] bg-white">
              <option value="">{loadingCats ? "Loading..." : "Select Category"}</option>
              {categories.map(cat => (
                <option key={cat.category_id} value={cat.category_id}>{cat.category_name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-[#16423C]">Sub-Category *</label>
            <select required name="subCategory" value={form.subCategory} onChange={handleChange} disabled={!form.category || loadingSubs} className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[#6A9C89] bg-white disabled:bg-gray-100 transition-all">
              <option value="">{loadingSubs ? "Fetching..." : "Select Sub-Category"}</option>
              {subCategories.map(sub => (
                <option key={sub.subcategory_id} value={sub.subcategory_id}>{sub.subcategory_name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-[#16423C]">Base Price *</label>
            <input required type="number" name="price" value={form.price} onChange={handleChange} className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[#6A9C89]" placeholder="0.00" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-[#16423C]">Admin Commission *</label>
            <input required type="number" name="commissionValue" value={form.commissionValue} onChange={handleChange} className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[#6A9C89]" placeholder="Commission" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-[#16423C]">Status *</label>
            <select name="status" value={form.status} onChange={handleChange} className={`w-full border-2 border-gray-200 rounded-xl px-4 py-3 outline-none font-bold ${form.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="mt-8 space-y-2">
          <label className="text-sm font-bold text-[#16423C]">Service Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} rows={4} className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[#6A9C89] resize-none" placeholder="Provide details about the service..." />
        </div>

        <div className="flex justify-end gap-4 mt-10 border-t border-gray-200 pt-8">
          <button 
            type="button" 
            onClick={() => window.history.back()}
            className="px-8 py-3 text-sm font-bold text-gray-500 hover:text-gray-800 transition-all"
          >
            CANCEL
          </button>
          <button 
            disabled={isSaving} 
            type="submit" 
            className="bg-[#16423C] text-white px-12 py-3 rounded-xl hover:bg-[#1f5a52] transition-all font-bold shadow-xl flex items-center gap-3 active:scale-95 disabled:opacity-70"
          >
            {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            {isSaving ? "SAVING..." : "SAVE SERVICE"}
          </button>
        </div>
      </form>
    </div>
  );
}