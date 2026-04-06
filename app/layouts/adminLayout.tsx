import React from "react";
import { useState } from "react";
import { Outlet } from "react-router";
import Sidebar from "../components/sideBar";
import Header from "../components/header";

const AdminLayout: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  return (
    <div className="flex min-h-screen bg-[#E9EFEC]">
      <Header onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />

      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 transform bg-white transition-transform duration-300 ease-in-out sm:translate-x-0 sm:static sm:block pt-16 border-r border-[#C4DAD2]
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <Sidebar />
      </div>

      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 sm:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      <main className="flex-1 min-h-screen pt-16 overflow-x-hidden">
        <div className="p-4 md:p-10 max-w-[1600px] mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
