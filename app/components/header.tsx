import React from "react";
import { Menu, LogOut, User } from "lucide-react";
import { useNavigate } from "react-router";

interface HeaderProps {
  onMenuToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
  const navigate = useNavigate();

  // جلب اسم المستخدم المخزن عند تسجيل الدخول
  const userName = localStorage.getItem("userName") || "Admin";

  const handleLogout = () => {
    // 1. مسح التوكن وكافة البيانات المتعلقة بالجلسة
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("role");

    // 2. التوجيه لصفحة تسجيل الدخول مع منع الرجوع للخلف (replace)
    navigate("/login", { replace: true });
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-[#C4DAD2] z-[60] flex items-center justify-between px-4">
      <div className="flex items-center gap-4">
        {/* Mobile Menu Button - يظهر فقط على الشاشات الصغيرة */}
        <button
          onClick={onMenuToggle}
          className="p-2 sm:hidden text-[#16423C] hover:bg-[#E9EFEC] rounded-md transition-colors"
        >
          <Menu size={24} />
        </button>

        {/* الشعار - Logo */}
        <div className="h-10 w-32 bg-[#E9EFEC] border border-dashed border-[#6A9C89] flex items-center justify-center rounded text-sm text-[#16423C] font-bold tracking-wider">
          PETRA ADMIN
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        
        <div className="hidden md:flex items-center gap-2 text-[#16423C]">
          <div className="bg-[#E9EFEC] p-1.5 rounded-full">
            <User size={18} />
          </div>
          <span className="text-sm font-semibold">{userName}</span>
        </div>

        <div className="h-8 w-px bg-[#C4DAD2] mx-1"></div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-2 rounded-md text-[#16423C] hover:bg-red-50 hover:text-red-700 transition-all font-medium text-sm group"
          title="Logout"
        >
          <LogOut size={20} className="group-hover:translate-x-0.5 transition-transform" />
          <span className="hidden md:inline">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Header;