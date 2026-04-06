import React, { useState } from "react";
import { NavLink } from "react-router";
import { type LucideIcon } from "lucide-react";

interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  children: { label: string; path: string }[];
}

import {
  ChevronDown,
  LayoutDashboard,
  Shapes,
  HandHeart,
  CalendarCheck2,
  User,
  BanknoteArrowDown,
  UserCircle,
  UsersRound,
  Settings,
  SquareKanban,
} from "lucide-react";

const SidebarItem = ({ icon: Icon, label, children }: SidebarItemProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-[#C4DAD2] last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-[#16423C] hover:bg-[#E9EFEC] transition-colors"
      >
        <div className="flex items-center gap-3 font-bold text-md">
          <Icon size={22} className="text-[#6A9C89]" />
          <span>{label}</span>
        </div>
        <ChevronDown
          size={18}
          className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="bg-gray-50/50 flex flex-col pb-2">
          {children.map((child, index) => (
            <NavLink
              key={index}
              to={child.path}
              // The className function receives an isActive boolean from React Router
              className={({ isActive }) =>
                `pl-12 pr-4 py-2.5 text-sm font-medium transition-all duration-200 block
                ${
                  isActive
                    ? "bg-[#E9EFEC] text-[#16423C] border-r-4 border-[#16423C]"
                    : "text-[#6A9C89] hover:text-[#16423C] hover:bg-[#E9EFEC]/50"
                }`
              }
            >
              {child.label}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
};

const Sidebar = () => {
  return (
    <aside className="w-full h-full overflow-y-auto bg-white scrollbar-hide">
      <header className="flex flex-col border-b border-gray-200 bg-white">
        {/* Top User Info Bar */}
        <div className="flex items-center gap-3 p-4 bg-[#16423C]">
          <div className="h-12 w-12 rounded-full bg-[#6A9C89] flex items-center justify-center overflow-hidden border border-[#C4DAD2]">
            <User size={28} className="text-[#E9EFEC]" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-white leading-tight">
              admin@admin.com
            </span>
            <span className="text-xs text-[#C4DAD2]">Admin Admin</span>
          </div>
        </div>
      </header>
      <nav className="flex flex-col">
        <SidebarItem
          icon={LayoutDashboard}
          label="Main"
          children={[{ label: "Dashboard", path: "/" }]}
        />

        <SidebarItem
          icon={Shapes}
          label="Category Management"
          children={[
            { label: "Category", path: "category-management/category" },
            { label: "Sub Category", path: "category-management/sub-category" },
          ]}
        />

        <SidebarItem
          icon={HandHeart}
          label="Service Management"
          children={[
            {
              label: "Services List",
              path: "service-management/services-list",
            },
            {
              label: "Add new Service",
              path: "service-management/add-service",
            },
          ]}
        />

        <SidebarItem
          icon={CalendarCheck2}
          label="Booking Management"
          children={[
            { label: "Booking List", path: "booking-management/booking-list" },
          ]}
        />

        <SidebarItem
          icon={User}
          label="Providers Management"
          children={[
            {
              label: "Active Providers",
              path: "/providers-management/active-providers",
            },
            {
              label: "Pending Approvals",
              path: "/providers-management/pending-providers",
            },
            {
              label: "Provider Services",
              path: "/providers-management/provider-services",
            },
            {
              label: "Providers Performance",
              path: "/providers-management/providers-performance",
            },
            {
              label: "Provider Earnings",
              path: "/providers-management/provider-earnings",
            },
          ]}
        />

        <SidebarItem
          icon={BanknoteArrowDown}
          label="Payout"
          children={[
            { label: "Payout History", path: "/payout/payout-history" },
            { label: "New Payout", path: "/payout/new-payout" },
          ]}
        />
        <SidebarItem
          icon={UserCircle}
          label="Customer Management"
          children={[
            {
              label: "Customer List",
              path: "/customer-management/customer-list",
            },
            {
              label: "Customer Ratings",
              path: "/customer-management/customer-ratings",
            },
            {
              label: "Payments List",
              path: "/customer-management/payments-list",
            },
          ]}
        />

        <SidebarItem
          icon={UsersRound}
          label="System Users"
          children={[
            { label: "Users List", path: "/system-users/users-list" },
            { label: "New User", path: "/system-users/new-user" },
          ]}
        />

        <SidebarItem
          icon={SquareKanban}
          label="Points & Cashback Management"
          children={[
            {
              label: "Points Configuration",
              path: "/points-management/points-configuration",
            },
            {
              label: "Points Overview & History",
              path: "/points-management/points-overview",
            },
          ]}
        />
      </nav>
    </aside>
  );
};

export default Sidebar;
