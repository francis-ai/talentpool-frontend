// src/components/Navbar.jsx
import React, { useState, useEffect, useRef, useContext } from "react";
import { FaBars, FaTimes, FaUserCircle, FaSignOutAlt, FaChevronDown, FaTachometerAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext"; 
import LogoImg from "../assets/images/logo.jpg";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // ✅ Use AuthContext
  const { user, logout, loading } = useContext(AuthContext);

  // Play click sound
  const playClickSound = () => {
    const audio = new Audio("/ui-pop-up-1-197886.mp3");
    audio.currentTime = 0;
    audio.play().catch(() => {});
  };

  // Scroll handler
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Dashboard path by role
  const getDashboardPath = () => {
    if (!user) return "/";
    return user.role === "admin" ? "/admin/dashboard" : "/student-dashboard";
  };

  // Navigation helpers
  const handleProfileClick = () => {
    playClickSound();
    navigate(getDashboardPath());
    setProfileDropdownOpen(false);
    setIsOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    setProfileDropdownOpen(false);
    setIsOpen(false);
    navigate("/login", { replace: true });
  };

  const menuLinks = [
    { name: "Home", path: "/" },
    { name: "Contact", path: "/contactus" },
    { name: "Blog", path: "/blog" },
    { name: "Hire Talent", path: "/hire-talent" },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? "bg-blue-900 text-white shadow-lg" : "bg-white text-gray-800 border-b border-gray-200"}`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3 md:px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center p-1 shadow-sm">
            <img src={LogoImg} alt="Logo" className="w-9 h-9 object-contain" />
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-8 font-medium">
          {menuLinks.map((link, i) => (
            <Link key={i} to={link.path} className={`transition-colors ${scrolled ? "text-white hover:text-blue-200" : "text-gray-700 hover:text-blue-700"}`}>
              {link.name}
            </Link>
          ))}
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {!loading && user ? (
            <div className="hidden md:flex items-center space-x-4 relative" ref={dropdownRef}>
              {/* Profile Button */}
              <div
                className={`flex items-center space-x-2 rounded-full px-4 py-2 cursor-pointer ${scrolled ? "bg-blue-800 hover:bg-blue-700" : "bg-gray-100 hover:bg-gray-200"} transition-colors group`}
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              >
                <FaUserCircle className={scrolled ? "text-blue-200" : "text-gray-600"} />
                <span className={`font-medium text-sm truncate max-w-xs ${scrolled ? "text-white" : "text-gray-700"}`}>
                  {user.name || user.email?.split("@")[0]}
                </span>
                <FaChevronDown className={`transition-transform ${profileDropdownOpen ? "rotate-180" : ""} ${scrolled ? "text-blue-200" : "text-gray-600"} group-hover:scale-110`} size={14} />
              </div>

              {/* Dropdown */}
              {profileDropdownOpen && (
                <div className="absolute right-0 top-14 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50">
                  <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-gray-50">
                    <h3 className="font-semibold text-gray-800 text-lg">Hello, {user.name || "User"} 👋</h3>
                    <p className="text-sm text-gray-600">{user.role}</p>
                  </div>

                  <div className="px-4 py-3 hover:bg-blue-50 cursor-pointer flex items-center space-x-2" onClick={handleProfileClick}>
                    <FaTachometerAlt className="text-blue-600" />
                    <span style={{color: '#000'}}>Dashboard</span>
                  </div>

                  <div className="p-3 bg-gray-50 border-t border-gray-100">
                    <button
                      onClick={handleLogout}
                      className="w-full bg-red-600 hover:bg-red-700 text-white rounded-lg py-2 text-sm font-medium transition-colors flex items-center justify-center space-x-2"
                    >
                      <FaSignOutAlt size={14} />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : !loading ? (
            <div className="hidden md:flex items-center space-x-3">
              <Link to="/login">
                <button className={`rounded-lg px-4 py-2 font-medium transition-all ${scrolled ? "text-white border border-white/50 hover:bg-white/10" : "text-blue-700 border border-blue-200 hover:bg-blue-50"}`}>
                  Log in
                </button>
              </Link>
              <Link to="/register">
                <button className={`rounded-lg px-4 py-2 font-medium transition-all shadow-sm ${scrolled ? "bg-white text-blue-900 hover:bg-blue-100" : "bg-blue-600 text-white hover:bg-blue-700"}`}>
                  Sign up
                </button>
              </Link>
            </div>
          ) : (
            <div className="hidden md:flex animate-pulse rounded-full px-4 py-2 bg-gray-200 w-24"></div>
          )}

          {/* Mobile Menu Button */}
          <button onClick={() => setIsOpen(!isOpen)} className={`md:hidden rounded-full p-2 transition-colors ${scrolled ? "hover:bg-blue-800" : "hover:bg-gray-100"}`}>
            {isOpen ? <FaTimes className={scrolled ? "text-white text-2xl" : "text-gray-700 text-2xl"} /> : <FaBars className={scrolled ? "text-white text-2xl" : "text-gray-700 text-2xl"} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className={`md:hidden border-t shadow-lg ${scrolled ? "bg-blue-900 border-blue-800" : "bg-white border-gray-200"}`}>
          <div className="px-6 py-5 space-y-5">
            {menuLinks.map((link, i) => (
              <Link key={i} to={link.path} onClick={() => setIsOpen(false)} className={`block text-lg font-medium ${scrolled ? "text-white hover:text-blue-200" : "text-gray-700 hover:text-blue-700"}`}>
                {link.name}
              </Link>
            ))}

            {!loading && user ? (
              <>
                <div className="border-t pt-4">
                  <h3 className={`font-semibold mb-2 ${scrolled ? "text-white" : "text-gray-800"}`}>Profile</h3>
                  <div onClick={handleProfileClick} className="flex items-center space-x-3 cursor-pointer">
                    <FaUserCircle className="text-blue-600 text-2xl" />
                    <div>
                      <p className="font-medium">{user.name || user.email?.split("@")[0]}</p>
                      <p className="text-sm text-gray-500">{user.role}</p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full mt-3 bg-red-600 hover:bg-red-700 text-white rounded-lg py-3 font-medium flex items-center justify-center space-x-2"
                >
                  <FaSignOutAlt />
                  <span>Logout</span>
                </button>
              </>
            ) : !loading ? (
              <>
                <Link to="/login" onClick={() => setIsOpen(false)} className="block w-full text-center border px-4 py-3 rounded-lg">
                  Log in
                </Link>
                <Link to="/register" onClick={() => setIsOpen(false)} className="block w-full text-center bg-blue-600 text-white px-4 py-3 rounded-lg">
                  Sign up
                </Link>
              </>
            ) : (
              <div className="animate-pulse space-y-3">
                <div className="h-12 bg-gray-200 rounded-lg"></div>
                <div className="h-12 bg-gray-200 rounded-lg"></div>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
