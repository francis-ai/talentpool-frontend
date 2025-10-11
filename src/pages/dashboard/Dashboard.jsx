// src/pages/Dashboard.jsx
import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Home, BookOpen, Bell, LogOut, Menu, X, Search, User, Star, Clock, ChevronDown, Camera } from "lucide-react";
import { AuthContext } from "../../context/AuthContext"; 

const MobileNavBar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const menu = [
    { icon: <Home size={22} />, label: "Home", path: "/" },
    { icon: <BookOpen size={22} />, label: "Courses", path: "/course-list" },
    { icon: <User size={22} />, label: "Profile", path: "/user-profile", hasDropdown: true },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center py-2 md:hidden z-50">
      {menu.map((item, i) => (
        <div key={i} className="relative">
          {item.hasDropdown ? (
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex flex-col items-center justify-center p-2 text-gray-500 w-full"
            >
              {item.icon}
              <span className="text-xs mt-1">{item.label}</span>
              {showDropdown && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-40 bg-white rounded-md shadow-lg py-1 z-50">
                  <Link
                    to="/user-profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowDropdown(false)}
                  >
                    View Profile
                  </Link>
                  <Link
                    to="/user-profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowDropdown(false)}
                  >
                    Update Profile
                  </Link>
                </div>
              )}
            </button>
          ) : (
            <Link
              to={item.path}
              className="flex flex-col items-center justify-center p-2 text-gray-500"
            >
              {item.icon}
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          )}
        </div>
      ))}
    </div>
  );
};

const Dashboard = () => {
  const { user, logout, axiosInstance } = useContext(AuthContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const [filteredAnnouncements, setFilteredAnnouncements] = useState([]);
  const [loadingAnnouncements, setLoadingAnnouncements] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const email = user?.email || "student@example.com";
  const role = user?.role || "Student";
  const name = user?.name || "Student";
  const emailInitial = email.charAt(0).toUpperCase();

  const navigate = useNavigate();

  console.log(isMobile);
  console.log(role);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) setSidebarOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
      alert("Logout failed. Try again.");
    }
  };

  const fetchAnnouncements = async () => {
    setLoadingAnnouncements(true);
    try {
      const res = await axiosInstance.get("/announcement");
      setAnnouncements(res.data);
      setFilteredAnnouncements(res.data);
    } catch (err) {
      console.error("Error fetching announcements:", err);
    } finally {
      setLoadingAnnouncements(false);
    }
  };

  const toggleNotifications = () => {
    if (!notificationDropdownOpen) fetchAnnouncements();
    setNotificationDropdownOpen(!notificationDropdownOpen);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Dummy courses and features
  const topCourses = [
    { id: 1, title: "Artificial Intelligence", instructor: "Dr. Jane Smith", rating: 4.8, students: "12.5k", duration: "12 hours", image: "https://images.unsplash.com/photo-1533750349088-cd871a92f312?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" },
    { id: 2, title: "Web Development Bootcamp", instructor: "Mark Johnson", rating: 4.7, students: "8.3k", duration: "48 hours", image: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" },
    { id: 3, title: "Data Science Fundamentals", instructor: "Sarah Williams", rating: 4.9, students: "15.2k", duration: "28 hours", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" }
  ];

  const features = [
    { icon: <BookOpen size={20} />, title: "Browse All Course", description: "Your learning journey", path: "/course-list" },
    { icon: <User size={20} />, title: "Update Profile", description: "Account settings", path: "/user-profile" },
    { icon: <BookOpen size={20} />, title: "Active Course", description: "ActiveCourse", path: "/active-course" },
    { icon: <Camera size={20} />, title: "Videos", description: "All Videos", path: "/videos" },
  ];

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setIsSearching(false);
      setSearchResults([]);
      setFilteredAnnouncements(announcements);
      return;
    }

    setIsSearching(true);
    const filteredAnnouncements = announcements.filter(
      a => a.title.toLowerCase().includes(query.toLowerCase()) || a.content.toLowerCase().includes(query.toLowerCase())
    );
    const filteredCourses = topCourses.filter(
      c => c.title.toLowerCase().includes(query.toLowerCase()) || c.instructor.toLowerCase().includes(query.toLowerCase())
    );

    setSearchResults([
      ...filteredAnnouncements.map(item => ({ ...item, type: 'announcement' })),
      ...filteredCourses.map(item => ({ ...item, type: 'course' }))
    ]);
    setFilteredAnnouncements(filteredAnnouncements);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setIsSearching(false);
    setSearchResults([]);
    setFilteredAnnouncements(announcements);
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-16 md:pb-0">
      {/* Header */}
     <header className="bg-white shadow-sm p-4 sticky top-12 z-40 ">
        <div className="flex items-center justify-between lg:mt-2">
          <div className="flex items-center">
            <button 
              className="md:hidden p-3 mr-2 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={toggleSidebar}
            >
              <Menu size={28} />
            </button>
          </div>
          
          <div className="flex items-center gap-3 flex-1 md:flex-initial justify-end md:justify-normal">
            <div className="relative flex-1 md:flex-initial">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search announcements, courses..."
                className="bg-gray-100 pl-10 pr-4 py-2 rounded-full outline-none text-sm border border-gray-300 w-full md:w-64"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
              />
              {searchQuery && (
                <button 
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                >
                  <X size={16} />
                </button>
              )}
            </div>
            
            {/* Notification Bell with Dropdown */}
            <div className="relative">
              <button 
                className="p-2 relative"
                onClick={toggleNotifications}
              >
                <Bell size={20} />
                {announcements.length > 0 && (
                  <span className="absolute top-0 right-0 bg-red-600 w-2 h-2 rounded-full"></span>
                )}
              </button>
              
              {notificationDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-1 z-50 max-h-96 overflow-y-auto">
                  <div className="px-4 py-2 border-b border-gray-100 sticky top-0 bg-white">
                    <h3 className="text-sm font-medium text-gray-900">Announcements</h3>
                  </div>
                  
                  {loadingAnnouncements ? (
                    <div className="px-4 py-4 text-center">
                      <p className="text-sm text-gray-500">Loading announcements...</p>
                    </div>
                  ) : filteredAnnouncements.length === 0 ? (
                    <div className="px-4 py-4 text-center">
                      <p className="text-sm text-gray-500">No announcements found.</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {filteredAnnouncements.map((announcement) => (
                        <div key={announcement.id} className="px-4 py-3 hover:bg-gray-50 cursor-pointer">
                          <h4 className="text-sm font-medium text-gray-900 mb-1">{announcement.title}</h4>
                          <p className="text-xs text-gray-600 mb-2 line-clamp-2">{announcement.content}</p>
                          <p className="text-xs text-gray-400">
                            {formatDate(announcement.created_at || announcement.createdAt)}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="px-4 py-2 border-t border-gray-100 sticky bottom-0 bg-white">
                    <Link 
                      to="/notification" 
                      className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                      onClick={() => setNotificationDropdownOpen(false)}
                    >
                      View all announcements
                    </Link>
                  </div>
                </div>
              )}
            </div>
            
            <div className="hidden md:flex items-center gap-2 p-1 rounded-full bg-gray-100 cursor-pointer relative">
              <div 
                className="flex items-center gap-2"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              >
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-orange-600 text-white font-bold">
                  {emailInitial}
                </div>
                <ChevronDown size={16} className="text-gray-600" />
              </div>
              
              {profileDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900 truncate">{name}</p>
                    <p className="text-xs text-gray-500 truncate">{email}</p>
                  </div>
                  <Link
                    to="/user-profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setProfileDropdownOpen(false)}
                  >
                    View Profile
                  </Link>
                  <Link
                    to="/user-profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setProfileDropdownOpen(false)}
                  >
                    Update Profile
                  </Link>
                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      handleLogout();
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
         <>
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={toggleSidebar}
          ></div>
          <div className="fixed top-0 left-0 h-full w-64 bg-[#111] text-gray-300 z-50 p-4 transform transition-transform duration-300 ease-in-out md:hidden">
            <div className="flex items-center justify-between mb-10">
              <button className="text-gray-400" onClick={toggleSidebar}>
                <X size={20} />
              </button>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg mb-6">
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-orange-600 text-white font-bold text-lg">
                {emailInitial}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm text-white truncate">{name}</p>
                <p className="text-xs text-gray-400 truncate">{email}</p>
              </div>
            </div>
            
            <nav className="space-y-4">
              <Link to="/" className="flex items-center gap-3 px-3 py-2 rounded-lg transition hover:bg-gray-800" onClick={toggleSidebar}>
                <Home size={18} />
                <span>Home</span>
              </Link>
              <Link to="/course-list" className="flex items-center gap-3 px-3 py-2 rounded-lg transition hover:bg-gray-800" onClick={toggleSidebar}>
                <BookOpen size={18} />
                <span>Browse All Courses</span>
              </Link>
              <Link to="/notification" className="flex items-center gap-3 px-3 py-2 rounded-lg transition hover:bg-gray-800" onClick={toggleSidebar}>
                <Bell size={18} />
                <span>Announcements</span>
              </Link>
              <Link to="/user-profile" className="flex items-center gap-3 px-3 py-2 rounded-lg transition hover:bg-gray-800" onClick={toggleSidebar}>
                <User size={18} />
                <span>Update Profile</span>
              </Link>
            </nav>
            
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 w-full px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium mt-6"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </>
      )}

      {/* Main Content */}
      <main className="p-4">
        {/* Welcome Section */}
        <div className="mb-6 mt-10">
          <h2 className="text-2xl font-bold">Hi {name},</h2>
          <p className="text-gray-600 mt-1 mb-3">What will you learn today?</p>
          <Link
            to="/subscription"
            className="inline-flex items-center justify-center gap-3 px-6 py-3 mt-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-lg hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <span>Subscribe Now</span>
          </Link>
        </div>

        {/* Search Results */}
        {isSearching && (
          <div className="mb-6 bg-white rounded-xl shadow-sm p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold">Search Results</h3>
              <button 
                onClick={clearSearch}
                className="text-xs text-gray-500 hover:text-gray-700"
              >
                Clear search
              </button>
            </div>
            
            {searchResults.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No results found for "{searchQuery}"</p>
            ) : (
              <div className="space-y-4">
                {searchResults.map((item, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-3">
                    {item.type === 'announcement' ? (
                      <>
                        <div className="flex items-center mb-1">
                          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded mr-2">
                            Announcement
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatDate(item.created_at || item.createdAt)}
                          </span>
                        </div>
                        <h4 className="font-medium text-sm">{item.title}</h4>
                        <p className="text-xs text-gray-600 mt-1 line-clamp-2">{item.content}</p>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center mb-1">
                          <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded mr-2">
                            Course
                          </span>
                        </div>
                        <div className="flex">
                          <img 
                            src={item.image} 
                            alt={item.title}
                            className="w-16 h-16 object-cover rounded mr-3"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{item.title}</h4>
                            <p className="text-xs text-gray-500 mt-1">{item.instructor}</p>
                            <div className="flex items-center mt-2">
                              <div className="flex items-center">
                                <Star size={12} fill="currentColor" className="text-yellow-400" />
                                <span className="text-xs font-medium ml-1">{item.rating}</span>
                              </div>
                              <span className="text-xs text-gray-500 mx-2">•</span>
                              <span className="text-xs text-gray-500">{item.students} students</span>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Quick Features & Top Courses */}
        {!isSearching && (
          <>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {features.map((feature, index) => (
                <Link 
                  key={index} 
                  to={feature.path}
                  className="bg-white p-4 rounded-xl shadow-sm flex flex-col items-center justify-center text-center"
                >
                  <div className="text-blue-600 mb-2">
                    {feature.icon}
                  </div>
                  <h3 className="font-medium text-sm">{feature.title}</h3>
                  <p className="text-xs text-gray-500 mt-1">{feature.description}</p>
                </Link>
              ))}
            </div>

            {/* Top Courses to Learn */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold">Top Courses to Learn</h3>
                <Link to="/course-list" className="text-xs text-blue-600 font-medium">View all</Link>
              </div>
              
              <div className="space-y-4">
                {topCourses.map(course => (
                  <Link 
                    key={course.id} 
                    to="/course-list"
                    className="block bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
                  >
                    <div className="flex">
                      <img 
                        src={course.image} 
                        alt={course.title}
                        className="w-24 h-24 object-cover"
                      />
                      <div className="p-3 flex-1">
                        <h4 className="font-medium text-sm text-gray-900">{course.title}</h4>
                        <p className="text-xs text-gray-500 mt-1">{course.instructor}</p>
                        
                        <div className="flex items-center mt-2">
                          <div className="flex items-center">
                            <Star size={12} fill="currentColor" className="text-yellow-400" />
                            <span className="text-xs font-medium ml-1">{course.rating}</span>
                          </div>
                          <span className="text-xs text-gray-500 mx-2">•</span>
                          <span className="text-xs text-gray-500">{course.students} students</span>
                        </div>
                        
                        <div className="flex items-center mt-2 text-xs text-gray-500">
                          <Clock size={12} className="mr-1" />
                          <span>{course.duration}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Logout Button - Mobile Only */}
        <div className="md:hidden mt-8">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </main>

      {/* Mobile Navigation Bar */}
      <MobileNavBar />
    </div>
  );
};

export default Dashboard;
