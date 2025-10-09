import React, { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import {
  FiBook,
  FiUsers,
  FiBarChart2,
  FiSearch,
  FiUploadCloud,
  FiBookOpen,
  FiList,
  FiPieChart,
} from "react-icons/fi";
import { FaChalkboardTeacher, FaUserGraduate } from "react-icons/fa";

function AdminDashboard({ email, role }) {
  const { axiosInstance } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState([]);
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get('/admin/dashboard-stats');
        const data = response.data;

        setTotalStudents(data.totalStudents);
        setTotalUsers(data.totalRegisteredUsers);
        setCourses(data.courses);
        setStudents(data.recentStudents);

        setNotifications([
          { id: 1, message: "New student registration", time: "2 minutes ago", read: false },
          { id: 2, message: "Course 'React Fundamentals' needs review", time: "5 hours ago", read: false },
          { id: 3, message: "System update completed", time: "Yesterday", read: true }
        ]);
        setUnreadNotifications(2);

        setStats([
          {
            title: "Total Courses",
            value: data.totalCourses.toString(),
            icon: <FiBook className="text-2xl" />,
            color: "from-blue-500 to-blue-600",
            trend: "+12%",
            description: "From last week"
          },
          {
            title: "Active Students",
            value: data.totalStudents.toString(),
            icon: <FiUsers className="text-2xl" />,
            color: "from-green-500 to-green-600",
            trend: "+5%",
            description: "From last month"
          },
          {
            title: "Total Users",
            value: data.totalRegisteredUsers.toString(),
            icon: <FaUserGraduate className="text-2xl" />,
            color: "from-purple-500 to-purple-600",
            trend: "+8%",
            description: "From last month"
          },
          {
            title: "Completion Rate",
            value: "82%",
            icon: <FiPieChart className="text-2xl" />,
            color: "from-amber-500 to-amber-600",
            trend: "+3%",
            description: "Course completion rate"
          }
        ]);
      } catch (error) {
        console.error("Error fetching data:", error);
        setStats([]);
        setCourses([]);
        setStudents([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (axiosInstance) fetchData();
  }, [axiosInstance]);

  const tabVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  const filteredCourses = courses.filter(course =>
    course.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  console.log(students);
  console.log(notifications);
  console.log(filteredCourses);
  console.log(unreadNotifications);
  console.log(setActiveTab);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800 transition-colors duration-300">
      <header className="bg-white shadow-sm p-4 md:p-6 flex justify-between items-center sticky top-0 z-10">
        <div className="relative w-64">
          <input
            type="text"
            placeholder="Search courses, students..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-6 py-3 rounded-xl border-0 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-600 transition-colors"
          />
          <FiSearch className="absolute left-4 top-3.5 text-gray-400" size={18} />
        </div>

        <div className="flex items-center space-x-3 md:space-x-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center text-white font-medium">
              {email?.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate text-gray-900">{email}</p>
              <p className="text-xs text-gray-500 capitalize">{role}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-auto p-4 md:p-6">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              className="flex justify-center items-center h-96"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-600 mx-auto mb-4"></div>
                <p className="text-gray-500 text-lg">Loading dashboard data...</p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={activeTab}
              initial="hidden"
              animate="visible"
              variants={tabVariants}
              className="space-y-6 md:space-y-8"
            >
              {/* Header Section */}
              <div className="bg-gradient-to-r from-purple-600 to-indigo-700 p-6 md:p-8 rounded-2xl shadow-xl text-white">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                  <div className="flex-1">
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">Welcome back, Admin!</h1>
                    <p className="opacity-90 text-base md:text-lg max-w-3xl">
                      Here's what's happening with your platform today. You have {totalStudents} active students out of {totalUsers} total users.
                    </p>
                  </div>
                  <div className="bg-white/20 p-4 md:p-6 rounded-xl backdrop-blur-sm min-w-[200px] md:min-w-[250px]">
                    <div className="text-sm opacity-90 mb-2">Account Overview</div>
                    <div className="font-bold text-base md:text-lg truncate">{email}</div>
                    <div className="text-sm opacity-80 flex items-center mt-2">
                      <span className="w-2 h-2 md:w-3 md:h-3 bg-green-400 rounded-full mr-2"></span>
                      <span className="capitalize">{role}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ y: -5, scale: 1.02 }}
                    className="bg-white p-4 md:p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all border border-gray-100"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className={`w-12 h-12 md:w-14 md:h-14 bg-gradient-to-r ${stat.color} rounded-2xl flex items-center justify-center text-white`}>
                        {stat.icon}
                      </div>
                      <span className="text-xs md:text-sm text-green-500 font-semibold bg-green-100 px-2 py-1 rounded-full">
                        {stat.trend}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-gray-500 text-xs md:text-sm font-medium mb-1">{stat.title}</h3>
                      <p className="text-xl md:text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                      <p className="text-xs text-gray-400">{stat.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Quick Actions Section */}
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                <div className="p-4 md:p-6 border-b">
                  <h3 className="font-semibold text-lg md:text-xl flex items-center">
                    <FiBarChart2 className="mr-3" size={24} />
                    Quick Actions
                  </h3>
                </div>

                <div className="p-4 md:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-6">
                  {[
                    { icon: <FiUploadCloud size={24} />, title: "Upload Course", path: "/admin/admin-create-course", description: "Create new courses", gradient: "from-purple-600 to-purple-700" },
                    { icon: <FiUsers size={24} />, title: "Post Lessons/Modules", path: "/admin/upload-course", description: "Manage all lessons and modules", gradient: "from-red-500 to-blue-600" },
                    { icon: <FiUsers size={24} />, title: "View Students", path: "/admin/all-user", description: "Manage all students", gradient: "from-emerald-500 to-teal-600" },
                    { icon: <FiUsers size={24} />, title: "Post Blogs", path: "/admin/create-blog", description: "Post Blogs", gradient: "from-emerald-500 to-teal-600" },
                    { icon: <FiBookOpen size={24} />, title: "Course Action", path: "/admin/course-action", description: "Manage courses", gradient: "from-amber-500 to-orange-600" },
                    { icon: <FaChalkboardTeacher size={24} />, title: "Lessons", path: "/admin/lesson-page", description: "Manage lessons", gradient: "from-rose-500 to-pink-600" },
                    { icon: <FiList size={24} />, title: "View Candidates", path: "/admin/all-registered", description: "Weekdays & Weekend", gradient: "from-blue-500 to-cyan-600" },
                    { icon: <FiList size={24} />, title: "View Transaction haistory", path: "/admin/transaction-history", description: "List Of paidusers", gradient: "from-red-900 to-cyan-600" },
                    { icon: <FiList size={24} />, title: "Talent List", path: "/admin/talent-list", description: "List Of Talents", gradient: "from-red-900 to-cyan-600" },
                    { icon: <FiBookOpen size={24} />, title: "Subscription", path: "/admin/subscription", description: "Manage Subscription Plans", gradient: "from-amber-500 to-purple-600" },
          
                  ].map((action, index) => (
                    <motion.div key={index} whileHover={{ scale: 1.03, y: -3 }} whileTap={{ scale: 0.98 }} className="relative group">
                      <Link to={action.path} className={`block bg-gradient-to-r ${action.gradient} rounded-xl md:rounded-2xl p-4 md:p-6 text-white shadow-md hover:shadow-xl transition-all overflow-hidden text-center h-full`}>
                        <div className="relative z-10">
                          <div className="text-2xl md:text-3xl mb-3 md:mb-4 flex justify-center">{action.icon}</div>
                          <h4 className="font-semibold text-sm md:text-base lg:text-lg mb-1 md:mb-2">{action.title}</h4>
                          <p className="text-xs md:text-sm opacity-90">{action.description}</p>
                        </div>
                        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity"></div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default AdminDashboard;
