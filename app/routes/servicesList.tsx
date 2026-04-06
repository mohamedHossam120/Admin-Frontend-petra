import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Search, 
  Plus, 
  Trash2, 
  ArrowUpDown, 
  ChevronDown,
  Loader2,
  Edit3
} from 'lucide-react';

interface ServiceItem {
  service_id: number;
  service_name: string;
  category_name: string;
  subcategory_name: string;
  service_price: string;
  admin_commission_rate: string;
  service_status: string;
}

const ServiceManagement: React.FC = () => {
  const navigate = useNavigate();
  
  const API_URL = import.meta.env.VITE_API_URL;
  
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/services/all`);
      if (res.data.success) {
        setServices(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching services:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [API_URL]);

  const confirmDelete = async () => {
    if (selectedServiceId !== null) {
      try {
        const res = await axios.delete(`${API_URL}/services/delete/${selectedServiceId}`);
        if (res.data.success) {
          setServices(prev => prev.filter(s => s.service_id !== selectedServiceId));
          setIsDeleteModalOpen(false);
        }
      } catch (err) {
        alert("خطأ أثناء الحذف. تأكد من اتصال السيرفر.");
      }
    }
  };

  const filteredServices = services.filter(s => 
    (s.service_name || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 bg-[#C4DAD2] min-h-screen font-sans text-gray-800">
      <div className="animate-in fade-in duration-500">
        
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <div className="bg-white px-6 py-2 rounded shadow-sm border border-[#E9EFEC]">
             <h1 className="text-lg font-bold text-[#16423C]">Service Management</h1>
          </div>
          
          <button
            onClick={() => navigate("/service-management/add-service")}
            className="bg-[#16423C] hover:bg-[#6A9C89] text-white px-6 py-2 rounded-lg text-sm font-bold transition-all shadow-lg flex items-center gap-2"
          >
            <Plus size={18} className="border border-white rounded-full p-0.5" />
            Add Service
          </button>
        </div>

        <div className="bg-[#E9EFEC] rounded-xl shadow-sm border border-[#C4DAD2] p-6">
          
          {/* Toolbar */}
          <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
             <div className="flex gap-4">
               <div className="relative border border-gray-300 rounded bg-white">
                 <select className="appearance-none px-4 py-2 pr-10 min-w-[180px] focus:outline-none text-sm font-medium bg-transparent">
                   <option>No Action</option>
                   <option>Bulk Delete</option>
                 </select>
                 <ChevronDown className="absolute right-3 top-2.5 text-gray-500 pointer-events-none" size={16} />
               </div>
               <button className="bg-[#16423C] text-white px-8 py-2 rounded font-bold hover:opacity-90 uppercase text-[10px] tracking-widest transition-all">
                 Apply
               </button>
             </div>
             
             <div className="flex items-center">
                <input 
                  type="text" 
                  placeholder="Search by service name...." 
                  className="border border-[#C4DAD2] rounded-l-lg px-4 py-2 w-64 focus:outline-none bg-white text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="bg-[#16423C] p-2 rounded-r-lg text-white px-4 hover:bg-[#6A9C89] transition-colors">
                  <Search size={20} />
                </button>
             </div>
          </div>

          <div className="overflow-x-auto rounded-lg border border-[#C4DAD2] bg-white shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#16423C] text-white">
                  <HeaderCell label="Service Name" />
                  <HeaderCell label="Category" />
                  <HeaderCell label="Sub Category" />
                  <HeaderCell label="Price" />
                  <HeaderCell label="Commission" />
                  <HeaderCell label="Status" />
                  <HeaderCell label="Action" />
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="p-10 text-center">
                      <div className="flex justify-center items-center gap-2 text-[#16423C]">
                        <Loader2 className="animate-spin" /> Loading Services...
                      </div>
                    </td>
                  </tr>
                ) : filteredServices.length > 0 ? (
                  filteredServices.map((service) => (
                    <tr key={service.service_id} className="border-b border-[#C4DAD2] hover:bg-gray-50 transition-colors">
                      <DataCell value={service.service_name} bold />
                      <DataCell value={service.category_name} />
                      <DataCell value={service.subcategory_name} />
                      <DataCell value={`${service.service_price} EGP`} />
                      <DataCell value={`${service.admin_commission_rate}%`} />
                      
                      <td className="p-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                          service.service_status === 'active' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-red-100 text-red-700'
                        }`}>
                            {service.service_status}
                        </span>
                      </td>

                      <td className="p-4">
                        <div className="flex items-center justify-center gap-4">
                          <button 
                            onClick={() => navigate(`/service-management/edit-service/${service.service_id}`)}
                            className="flex items-center gap-1 text-[#16423C] font-bold hover:text-[#6A9C89] transition-all uppercase text-[10px]"
                            title="Edit Service"
                          >
                            <Edit3 size={14} />
                            Edit
                          </button>
                          <button 
                            onClick={() => {
                              setSelectedServiceId(service.service_id);
                              setIsDeleteModalOpen(true);
                            }}
                            className="text-red-500 hover:text-red-700 transition-all hover:scale-110"
                            title="Delete Service"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={7} className="p-10 text-center text-gray-500">No services found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsDeleteModalOpen(false)}></div>
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-sm p-8 text-center border-t-4 border-red-500 animate-in zoom-in-95 duration-200">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Delete Service?</h2>
            <p className="text-gray-500 mb-8 text-sm">Are you sure? This action cannot be undone.</p>
            <div className="flex justify-center gap-4">
              <button onClick={confirmDelete} className="bg-red-600 text-white px-8 py-2 rounded-lg font-bold hover:bg-red-700 transition-shadow shadow-md">Delete</button>
              <button onClick={() => setIsDeleteModalOpen(false)} className="bg-gray-100 text-black px-8 py-2 rounded-lg font-bold hover:bg-gray-200 transition-all">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Helper Components ---
const HeaderCell = ({ label }: { label: string }) => (
  <th className="p-4 font-bold text-[10px] uppercase tracking-widest border-r border-white/10 last:border-r-0 text-center">
    <div className="flex items-center gap-2 justify-center">
      <ArrowUpDown size={12} className="opacity-50" />
      {label}
    </div>
  </th>
);

const DataCell = ({ value, bold }: { value: any; bold?: boolean }) => (
  <td className={`p-4 text-sm border-r border-gray-50 last:border-r-0 text-center ${bold ? 'font-bold text-gray-800' : 'text-gray-600'}`}>
    {value || "—"}
  </td>
);

export default ServiceManagement;