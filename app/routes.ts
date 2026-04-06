import {
  type RouteConfig,
  index,
  route,
  layout,
  prefix,
} from "@react-router/dev/routes";

export default [
  // صفحة تسجيل الدخول خارج الـ Guard
  route("login", "routes/login.tsx"),

  // حماية المسارات (AuthGuard) وتنسيق الإدمن (adminLayout)
  layout("./layouts/AuthGuard.tsx", [
    layout("./layouts/adminLayout.tsx", [
      index("routes/dashboard.tsx"),
      
      // إدارة الأقسام
      ...prefix("category-management", [
        route("category", "routes/category.tsx"),
        route("sub-category", "routes/subCategory.tsx"),
      ]),

      // --- إدارة الخدمات (Service Management) ---
      ...prefix("service-management", [
        route("services-list", "routes/servicesList.tsx"), // جدول الخدمات
        route("add-service", "routes/addService.tsx"),    // إضافة خدمة جديدة
        // المسار الحاسم للتعديل - تأكد أن الملف editService.tsx موجود في فولدر routes
        route("edit-service/:id", "routes/editService.tsx"), 
      ]),

      // إدارة الحجوزات
      ...prefix("booking-management", [
        route("booking-list", "routes/bookingList.tsx"),
      ]),

      // إدارة مقدمي الخدمة
      ...prefix("providers-management", [
        route("active-providers", "routes/activeProviders.tsx"),
        route("pending-providers", "routes/pendingProviders.tsx"),
        route("provider-services", "routes/providerServices.tsx"),
        route("provider-earnings", "routes/providerEarnings.tsx"),
        route("providers-performance", "routes/providersPerformance.tsx"),
      ]),

      // الحسابات والمدفوعات
      ...prefix("payout", [
        route("payout-history", "routes/payoutHistory.tsx"),
        route("new-payout", "routes/newPayout.tsx"),
      ]),

      // إدارة العملاء
      ...prefix("customer-management", [
        route("customer-list", "routes/customerList.tsx"),
        route("customer-ratings", "routes/customerRatings.tsx"),
        route("payments-list", "routes/paymentsList.tsx"),
      ]),

      // مستخدمي النظام (المديرين)
      ...prefix("system-users", [
        route("users-list", "routes/usersList.tsx"),
        route("new-user", "routes/newUser.tsx"),
      ]),

      // نظام النقاط
      ...prefix("points-management", [
        route("points-configuration", "routes/pointsConfiguration.tsx"),
        route("points-overview", "routes/pointsOverview.tsx"),
      ]),
    ]),
  ]),
] satisfies RouteConfig;