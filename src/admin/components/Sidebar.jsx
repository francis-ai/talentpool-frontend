import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  FiHome, 
  FiUploadCloud, 
  FiUsers, 
  FiBookOpen, 
  FiList, 
  FiDollarSign, 
  FiCreditCard, 
  FiLogOut 
} from "react-icons/fi";
import { FaChalkboardTeacher, FaUserGraduate, FaBlogger } from "react-icons/fa";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext"; // adjust path if needed

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext); // get logout function

  const links = [
    { icon: <FiHome size={20} />, name: "Dashboard", path: "/admin/dashboard" },
    { icon: <FiUploadCloud size={20} />, name: "Upload Course", path: "/admin/admin-create-course" },
    { icon: <FaChalkboardTeacher size={20} />, name: "Post Lessons", path: "/admin/upload-course" },
    { icon: <FaUserGraduate size={20} />, name: "Registered Users", path: "/admin/all-user" },
    { icon: <FaBlogger size={20} />, name: "Post Blogs", path: "/admin/create-blog" },
    { icon: <FiBookOpen size={20} />, name: "Course Action", path: "/admin/course-action" },
    { icon: <FiBookOpen size={20} />, name: "Lessons", path: "/admin/lesson-page" },
    { icon: <FiList size={20} />, name: "View Candidates", path: "/admin/all-registered" },
    { icon: <FiCreditCard size={20} />, name: "Transaction History", path: "/admin/transaction-history" },
    { icon: <FiUsers size={20} />, name: "Talent List", path: "/admin/talent-list" },
    { icon: <FiDollarSign size={20} />, name: "Subscription", path: "/admin/subscription" },
  ];

  const handleLogout = () => {
    logout(); // clears user session/token
    navigate("/login"); // redirect to login page
  };

  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className={`fixed z-50 top-0 left-0 h-full w-64 bg-white border-r shadow-lg transform transition-transform duration-300 
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        lg:translate-x-0 lg:static lg:block`}
      >
        {/* Header */}
        <div className="h-16 flex items-center justify-center border-b font-bold text-purple-700 text-lg">
          Admin Panel
        </div>

        {/* Nav Links */}
        <nav className="flex flex-col p-4 space-y-2 flex-grow">
          {links.map((link, idx) => (
            <Link
              key={idx}
              to={link.path}
              onClick={onClose}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-purple-100 hover:text-purple-700 transition
                ${
                  location.pathname === link.path
                    ? "bg-purple-100 text-purple-700 font-semibold"
                    : ""
                }`}
            >
              {link.icon}
              <span>{link.name}</span>
            </Link>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-red-100 hover:text-red-600 rounded-lg transition"
          >
            <FiLogOut size={20} />
            Logout
          </button>
        </div>
      </div>
    </>
  );
}
