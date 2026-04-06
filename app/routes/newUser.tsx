import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom"; 
import { ChevronLeft, Save, Loader2 } from "lucide-react";

export default function NewUser() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  const editingUser = location.state?.userData;
  
  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  const [formData, setFormData] = useState({
    name: editingUser?.user_first_name || "",
    lastName: editingUser?.user_last_name || "",
    userType: editingUser?.user_role || "admin",
    email: editingUser?.user_email || "",
    password: "",
    confirmPassword: "",
    contactNumber: editingUser?.user_phone || "",
    address: editingUser?.user_address || "",
    description: editingUser?.description || "",
    categoryId: editingUser?.category_id || "",
    subCategoryId: editingUser?.subcategory_id || ""
  });

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/categories/all`);
        const json = await res.json();
        if (json.success) setCategories(json.data);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCats();
  }, [API_BASE_URL]);

  useEffect(() => {
    if (formData.categoryId) {
      const fetchSubs = async () => {
        try {
          const res = await fetch(`${API_BASE_URL}/subcategories/category/${formData.categoryId}`);
          const json = await res.json();
          setSubCategories(json.success ? json.data : []);
        } catch (err) {
          setSubCategories([]);
        }
      };
      fetchSubs();
    } else {
      setSubCategories([]);
    }
    if (!editingUser && formData.categoryId) {
        setFormData(prev => ({ ...prev, subCategoryId: "" }));
    }
  }, [formData.categoryId, API_BASE_URL, editingUser]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) return alert("Passwords do not match!");

    setIsLoading(true);
    try {
      const payload = {
        user_first_name: formData.name,
        user_last_name: formData.lastName,
        user_email: formData.email,
        user_pass: formData.password,
        user_phone: formData.contactNumber,
        user_address: formData.address,
        user_role: formData.userType,
        description: formData.description,
        category_id: formData.categoryId,
        subcategory_id: formData.subCategoryId
      };

      const url = editingUser 
        ? `${API_BASE_URL}/admin/update/${editingUser.user_id}` 
        : `${API_BASE_URL}/admin/register/admin`;
      
      const method = editingUser ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      if (result.success) {
        alert(editingUser ? "Updated successfully!" : "Created successfully!");
        navigate("/system-users/users-list");
      } else {
        alert(result.message || "Operation failed");
      }
    } catch (error) {
      alert("Server error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-4">
        <Link to="/system-users/users-list" className="p-2 bg-white rounded-full border border-[#C4DAD2] text-[#16423C] hover:bg-[#E9EFEC] transition-colors">
          <ChevronLeft size={24} />
        </Link>
        <h1 className="text-xl font-bold text-[#16423C]">
          {editingUser ? `Edit Admin: ${editingUser.user_first_name}` : "Add New System Admin"}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-[#C4DAD2] overflow-hidden">
        <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-[#16423C]">Main Category *</label>
            <select required name="categoryId" value={formData.categoryId} onChange={handleChange} className="w-full px-4 py-2.5 border border-[#C4DAD2] rounded-xl focus:ring-2 focus:ring-[#16423C] outline-none transition-all">
              <option value="">-- Select Category --</option>
              {categories.map((cat: any) => (
                <option key={cat.category_id} value={cat.category_id}>{cat.category_name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-[#16423C]">Sub Category *</label>
            <select required name="subCategoryId" disabled={!formData.categoryId || subCategories.length === 0} value={formData.subCategoryId} onChange={handleChange} className="w-full px-4 py-2.5 border border-[#C4DAD2] rounded-xl focus:ring-2 focus:ring-[#16423C] outline-none disabled:bg-gray-50 transition-all">
              <option value="">{!formData.categoryId ? "Select Category First" : "-- Select Sub Category --"}</option>
              {subCategories.map((sub: any) => (
                <option key={sub.subcategory_id} value={sub.subcategory_id}>{sub.subcategory_name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-[#16423C]">Admin Role *</label>
            <select name="userType" value={formData.userType} onChange={handleChange} className="w-full px-4 py-2.5 border border-[#C4DAD2] rounded-xl focus:ring-2 focus:ring-[#16423C] outline-none transition-all">
              <option value="admin">Full Admin Access</option>
              <option value="admin_user">Limited Admin User</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-[#16423C]">First Name *</label>
            <input required name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-2.5 border border-[#C4DAD2] rounded-xl focus:ring-2 focus:ring-[#16423C] outline-none" placeholder="First Name" />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-[#16423C]">Last Name *</label>
            <input required name="lastName" value={formData.lastName} onChange={handleChange} className="w-full px-4 py-2.5 border border-[#C4DAD2] rounded-xl focus:ring-2 focus:ring-[#16423C] outline-none" placeholder="Last Name" />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-[#16423C]">Email *</label>
            <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-2.5 border border-[#C4DAD2] rounded-xl focus:ring-2 focus:ring-[#16423C] outline-none" placeholder="Email Address" />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-[#16423C]">Phone Number *</label>
            <input required type="tel" name="contactNumber" value={formData.contactNumber} onChange={handleChange} className="w-full px-4 py-2.5 border border-[#C4DAD2] rounded-xl focus:ring-2 focus:ring-[#16423C] outline-none" placeholder="01xxxxxxxxx" />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-[#16423C]">Password {editingUser ? "(Leave blank to keep current)" : "*"}</label>
            <input required={!editingUser} type="password" name="password" value={formData.password} onChange={handleChange} className="w-full px-4 py-2.5 border border-[#C4DAD2] rounded-xl focus:ring-2 focus:ring-[#16423C] outline-none" />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-[#16423C]">Confirm Password *</label>
            <input required={!editingUser} type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="w-full px-4 py-2.5 border border-[#C4DAD2] rounded-xl focus:ring-2 focus:ring-[#16423C] outline-none" />
          </div>

          <div className="space-y-2 lg:col-span-3">
            <label className="text-xs font-black uppercase tracking-widest text-[#16423C]">Description / Notes</label>
            <textarea name="description" rows={3} value={formData.description} onChange={handleChange} className="w-full px-4 py-2.5 border border-[#C4DAD2] rounded-xl resize-none focus:ring-2 focus:ring-[#16423C] outline-none" placeholder="Enter any extra details..." />
          </div>
        </div>

        <div className="bg-[#F9FBFA] px-6 py-5 flex justify-end border-t border-[#C4DAD2]">
          <button type="submit" disabled={isLoading} className="flex items-center gap-2 bg-[#16423C] text-white px-12 py-3 rounded-xl font-bold hover:bg-[#0E2A26] transition-all disabled:opacity-50 shadow-lg active:scale-95">
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            <span>{editingUser ? "Update Admin" : "Create Admin"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}