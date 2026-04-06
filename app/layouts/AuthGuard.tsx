// app/layouts/AuthGuard.tsx
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router";

export default function AuthGuard() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      // إذا لم يوجد توكن، توجه لصفحة تسجيل الدخول فوراً
      navigate("/login", { replace: true });
    } else {
      setIsAuthenticated(true);
    }
  }, [navigate]);

  // لا تعرض محتوى الصفحات المحمية إلا بعد التأكد من وجود التوكن
  if (!isAuthenticated) return null; 

  return <Outlet />;
}