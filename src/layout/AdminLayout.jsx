import { useState } from "react";
import Sidebar from "../admin/components/Sidebar";
import { FiMenu } from "react-icons/fi";

export default function AdminLayout({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar isOpen={isOpen} onClose={closeSidebar} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="h-16 bg-white shadow-md flex items-center px-4">
          {/* Hamburger button only on mobile */}
          <button
            className="lg:hidden text-2xl text-gray-700"
            onClick={toggleSidebar}
          >
            <FiMenu />
          </button>
          <h1 className="ml-4 font-semibold text-purple-700 text-lg">
            Admin Dashboard
          </h1>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4">
          {children}
        </main>
      </div>
    </div>
  );
}
