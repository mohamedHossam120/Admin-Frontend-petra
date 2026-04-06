import React, { useState, useMemo } from "react";
import {
  CirclePlus,
  Search,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Pencil,
  AlertTriangle,
  X,
} from "lucide-react";
import { Link } from "react-router";

const initialUsers = [
  { name: "test1", contact: "221", status: 0 },
  { name: "test2", contact: "111", status: 0 },
  { name: "test3", contact: "111", status: 0 },
  { name: "test4", contact: "551", status: 0 },
  { name: "test5", contact: "111", status: 1 },
  { name: "test6", contact: "111", status: 1 },
  { name: "test7", contact: "111", status: 1 },
  { name: "test8", contact: "111", status: 0 },
  { name: "test9", contact: "111", status: 0 },
  { name: "test10", contact: "111", status: 1 },
  { name: "test11", contact: "111", status: 1 },
  { name: "test12", contact: "111", status: 1 },
  { name: "test13", contact: "111", status: 1 },
  { name: "test14", contact: "111", status: 0 },
  { name: "test15", contact: "111", status: 1 },
  { name: "test16", contact: "111", status: 1 },
  { name: "test17", contact: "111", status: 1 },
  { name: "test18", contact: "111", status: 0 },
  { name: "test19", contact: "111", status: 0 },
  { name: "test20", contact: "111", status: 0 },
];

export default function UserList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(5);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<any>(null);

  // Filter and Search
  const filteredUsers = useMemo(() => {
    return initialUsers.filter((user) => {
      const matchesSearch = user.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "ALL" ||
        (statusFilter === "Active" && user.status === 1) ||
        (statusFilter === "Inactive" && user.status === 0);
      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / entriesPerPage);
  const paginatedUsers = useMemo(() => {
    const lastIndex = currentPage * entriesPerPage;
    const firstIndex = lastIndex - entriesPerPage;
    return filteredUsers.slice(firstIndex, lastIndex);
  }, [filteredUsers, currentPage, entriesPerPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const openDeleteModal = (user: any) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    console.log("Deleted user:", userToDelete?.name);
    // call API
    setIsDeleteModalOpen(false);
    setUserToDelete(null);
  };
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-xl font-semibold text-gray-800 px-4 py-2 ">
          System Users Management
        </h1>
        <Link
          to="/system-users/new-user"
          className="flex items-center gap-2 bg-[#16423C] text-white px-4 py-2 rounded-md hover:bg-[#6A9C89] transition-colors w-fit"
        >
          <CirclePlus size={18} />
          <span className="text-sm font-medium">Add new system user</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex flex-wrap items-center justify-between gap-4">
        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-500">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="border border-gray-200 rounded-md px-3 py-2 text-sm text-gray-600 outline-none focus:border-gray-400 bg-gray-50"
          >
            <option value="ALL">ALL</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-xs w-full">
          <input
            type="text"
            placeholder="Search...."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-3 pr-10 py-2 border border-gray-200 rounded-md text-sm outline-none focus:border-gray-400"
          />
          <div className="absolute right-0 top-0 h-full w-10 bg-gray-200 flex items-center justify-center rounded-r-md">
            <Search size={18} className="text-gray-600" />
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#16423C] text-white">
                <th className="p-4 text-sm font-medium border-r border-[#6A9C89]">
                  Name
                </th>
                <th className="p-4 text-sm font-medium border-r border-[#6A9C89]">
                  Contact Number
                </th>
                <th className="p-4 text-sm font-medium border-r border-[#6A9C89] text-center">
                  Status
                </th>
                <th className="p-4 text-sm font-medium text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.length > 0 ? (
                paginatedUsers.map((user, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-100 even:bg-gray-50/50"
                  >
                    <td className="p-4 text-sm text-gray-700 font-medium">
                      {user.name}
                    </td>
                    <td className="p-4 text-sm text-gray-500">
                      {user.contact}
                    </td>
                    <td className="p-4 text-center">
                      <div className="relative inline-flex items-center cursor-default opacity-80">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={user.status === 1}
                          readOnly
                        />
                        <div className="w-11 h-6 bg-[#C4DAD2] rounded-full peer peer-checked:bg-[#16423C] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-4">
                        <Link
                          to="/system-users/new-user"
                          state={{ userData: user }}
                          className="text-[#16423C] hover:text-[#6A9C89] transition-colors"
                        >
                          <Pencil size={18} />
                        </Link>
                        <button
                          onClick={() => openDeleteModal(user)}
                          className="text-red-800 hover:text-red-600 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-10 text-center text-gray-500">
                    No users found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setIsDeleteModalOpen(false)}
            />

            <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-[#C4DAD2] animate-in fade-in zoom-in duration-200">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-red-50 rounded-full text-red-600">
                    <AlertTriangle size={24} />
                  </div>
                  <button
                    onClick={() => setIsDeleteModalOpen(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={20} />
                  </button>
                </div>

                <h3 className="text-xl font-bold text-[#16423C] mb-2">
                  Confirm Deletion
                </h3>
                <p className="text-gray-600">
                  Are you sure you want to delete{" "}
                  <span className="font-bold text-[#16423C]">
                    {userToDelete?.name}
                  </span>
                  ? This action cannot be undone and will remove all associated
                  data.
                </p>
              </div>

              <div className="bg-[#E9EFEC] px-6 py-4 flex justify-end gap-3 border-t border-[#C4DAD2]">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-4 py-2 text-sm font-semibold text-[#16423C] hover:bg-[#C4DAD2] rounded-md transition-colors"
                >
                  No, Keep User
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-6 py-2 text-sm font-bold text-white bg-red-700 hover:bg-red-800 rounded-md shadow-sm transition-colors flex items-center gap-2"
                >
                  <Trash2 size={16} />
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Pagination Footer */}
        <div className="p-4 flex items-center justify-between border-t border-gray-100 text-sm text-gray-600">
          <div className="flex items-center gap-2 font-medium">
            Show
            <select
              value={entriesPerPage}
              onChange={(e) => {
                setEntriesPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="border border-gray-200 rounded px-2 py-1 outline-none focus:border-gray-400"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
            </select>
            Entries
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-1 hover:bg-gray-100 rounded disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="bg-[#16423C] text-white px-3 py-1 rounded font-bold">
              {currentPage}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || totalPages === 0}
              className="p-1 hover:bg-gray-100 rounded disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
