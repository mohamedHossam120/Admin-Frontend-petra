import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Lock, Mail, Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({ email: "", password: "" });

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    setIsClient(true);
    // حماية الصفحة: لو فيه توكن فعلاً يرجعه للهوم
    if (localStorage.getItem("token")) {
      navigate("/");
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/admin/login/admin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // تخزين البيانات الأساسية
        localStorage.setItem("token", data.token);
        
        const adminData = data.data || {};
        localStorage.setItem("role", adminData.role || "admin");
        localStorage.setItem("userName", data.name || adminData.name || "Petra Admin");
        
        // لو الباك إند باعت صورة للأدمن خزنها برضو
        if (adminData.profile_image) {
          localStorage.setItem("userImage", adminData.profile_image);
        }

        navigate("/");
      } else {
        setError(data.message || "Invalid email or password");
      }
    } catch (err) {
      console.error("Login Error:", err);
      setError("Server connection failed. Please check your API settings.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isClient) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#C4DAD2] p-4 font-sans selection:bg-[#16423C] selection:text-white">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-2xl border border-[#E9EFEC] animate-in fade-in zoom-in duration-500">
        
        {/* Logo & Header */}
        <div className="text-center">
          <div className="mx-auto h-20 w-20 bg-[#16423C] flex items-center justify-center rounded-2xl shadow-lg rotate-3 mb-6">
            <span className="text-white text-3xl font-black tracking-tighter">P.</span>
          </div>
          <h2 className="text-3xl font-black text-[#16423C] tracking-tight">Welcome Back</h2>
          <p className="mt-2 text-sm text-[#6A9C89] font-medium">Log in to Petra Administration Panel</p>
        </div>

        {/* Error Message Section */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg flex items-center gap-3 animate-shake">
            <AlertCircle className="text-red-500 shrink-0" size={20} />
            <p className="text-red-700 text-xs font-bold">{error}</p>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-5">
            {/* Email Field */}
            <div className="space-y-1">
              <label className="text-xs font-black uppercase text-[#16423C] ml-1 tracking-widest">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-[#16423C]">
                  <Mail className="h-5 w-5 text-[#6A9C89]" />
                </div>
                <input
                  type="email"
                  required
                  disabled={isLoading}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="block w-full pl-12 pr-4 py-3 bg-[#F9FBFA] border-2 border-[#E9EFEC] rounded-xl focus:border-[#16423C] focus:bg-white outline-none text-sm transition-all disabled:opacity-50"
                  placeholder="admin@petra.com"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-black uppercase text-[#16423C] tracking-widest">Password</label>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-[#16423C]">
                  <Lock className="h-5 w-5 text-[#6A9C89]" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  disabled={isLoading}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="block w-full pl-12 pr-12 py-3 bg-[#F9FBFA] border-2 border-[#E9EFEC] rounded-xl focus:border-[#16423C] focus:bg-white outline-none text-sm transition-all disabled:opacity-50"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#6A9C89] hover:text-[#16423C] transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="group relative w-full flex justify-center py-4 px-4 border-none text-sm font-black uppercase tracking-[0.2em] rounded-xl text-white bg-[#16423C] hover:bg-[#0E2A26] hover:shadow-xl active:scale-[0.98] transition-all disabled:opacity-70 disabled:pointer-events-none shadow-lg shadow-[#16423C]/20"
          >
            {isLoading ? (
              <Loader2 className="animate-spin h-5 w-5" />
            ) : (
              "Authorize Access"
            )}
          </button>
        </form>

        {/* Footer Info */}
        <p className="text-center text-[10px] text-[#6A9C89] uppercase font-bold tracking-widest mt-8">
          Secure Encrypted Connection • Petra CMS v1.0
        </p>
      </div>
    </div>
  );
}