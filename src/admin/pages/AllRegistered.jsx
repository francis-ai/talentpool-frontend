import React, { useEffect, useState, useCallback, useContext } from "react";
import { AuthContext } from "../../context/AuthContext"; // ✅ use AuthContext
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FiSearch, FiDownload, FiRefreshCw, FiEye,
  FiChevronDown, FiChevronUp, FiUser, FiMail,
  FiPhone, FiBook, FiCalendar, FiClock
} from "react-icons/fi";

export default function AdminRegistrations() {
  const { axiosInstance } = useContext(AuthContext); // ✅ get axiosInstance from AuthContext
  const [registrations, setRegistrations] = useState([]);
  const [filteredRegistrations, setFilteredRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [courseFilter, setCourseFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "ascending" });
  const [selectedRegistration, setSelectedRegistration] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const courses = [
    "Web Development",
    "Data Science",
    "UX/UI Design",
    "Digital Marketing",
    "Cloud Computing"
  ];

  // ✅ fetchRegistrations using AuthContext axiosInstance
  const fetchRegistrations = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/all"); // your endpoint
      const registrationsData = res.data.registrations || [];
      setRegistrations(registrationsData);
      setFilteredRegistrations(registrationsData);
    } catch (err) {
      console.error("Error fetching registrations:", err);
      toast.error("Failed to fetch registrations");
    } finally {
      setLoading(false);
    }
  }, [axiosInstance]);

  useEffect(() => {
    fetchRegistrations();
  }, [fetchRegistrations]);

  // Filter and search functionality
  useEffect(() => {
    let result = registrations;

    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      result = result.filter((reg) =>
        reg.full_name.toLowerCase().includes(lowerTerm) ||
        reg.email.toLowerCase().includes(lowerTerm) ||
        reg.phone.includes(searchTerm) ||
        reg.course.toLowerCase().includes(lowerTerm)
      );
    }

    if (courseFilter !== "all") {
      result = result.filter((reg) => reg.course === courseFilter);
    }

    setFilteredRegistrations(result);
  }, [registrations, searchTerm, courseFilter]);

  // Sorting
  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });

    const sortedData = [...filteredRegistrations].sort((a, b) => {
      if (a[key] < b[key]) return direction === "ascending" ? -1 : 1;
      if (a[key] > b[key]) return direction === "ascending" ? 1 : -1;
      return 0;
    });
    setFilteredRegistrations(sortedData);
  };

  // Modal
  const viewRegistrationDetails = (reg) => {
    setSelectedRegistration(reg);
    setShowModal(true);
  };

  // CSV Export
  const exportToCSV = () => {
    const headers = ["Full Name", "Email", "Phone", "Course", "Schedule", "Duration", "Registration Date"];
    const csvData = filteredRegistrations.map((reg) => [
      reg.full_name,
      reg.email,
      reg.phone,
      reg.course,
      reg.schedule,
      reg.duration,
      new Date(reg.createdAt).toLocaleDateString(),
    ]);

    const csvContent = [headers, ...csvData]
      .map((row) => row.map((field) => `"${field}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `registrations_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Registration Modal
  const RegistrationModal = () => {
    if (!selectedRegistration) return null;
    return (
      <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 transition-opacity ${showModal ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
        <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b flex justify-between items-center">
            <h3 className="text-xl font-semibold">Registration Details</h3>
            <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">&times;</button>
          </div>
          <div className="p-6 grid grid-cols-1 gap-4">
            <div className="flex items-center"><FiUser className="text-blue-600 mr-3" /> <div><p className="text-sm text-gray-500">Full Name</p><p className="font-medium">{selectedRegistration.full_name}</p></div></div>
            <div className="flex items-center"><FiMail className="text-blue-600 mr-3" /> <div><p className="text-sm text-gray-500">Email</p><p className="font-medium">{selectedRegistration.email}</p></div></div>
            <div className="flex items-center"><FiPhone className="text-blue-600 mr-3" /> <div><p className="text-sm text-gray-500">Phone</p><p className="font-medium">{selectedRegistration.phone}</p></div></div>
            <div className="flex items-center"><FiBook className="text-blue-600 mr-3" /> <div><p className="text-sm text-gray-500">Course</p><p className="font-medium">{selectedRegistration.course}</p></div></div>
            <div className="flex items-center"><FiCalendar className="text-blue-600 mr-3" /> <div><p className="text-sm text-gray-500">Schedule</p><p className="font-medium">{selectedRegistration.schedule}</p></div></div>
            <div className="flex items-center"><FiClock className="text-blue-600 mr-3" /> <div><p className="text-sm text-gray-500">Duration</p><p className="font-medium">{selectedRegistration.duration}</p></div></div>
            {selectedRegistration.notes && <div><p className="text-sm text-gray-500 mb-2">Additional Notes</p><p className="bg-gray-50 p-3 rounded-md">{selectedRegistration.notes}</p></div>}
            <div className="flex justify-end pt-4 border-t"><button onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Close</button></div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Course Registrations</h1>
          <div className="flex space-x-3">
            <button
              onClick={exportToCSV}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              <FiDownload className="mr-2" /> Export CSV
            </button>
            <button
              onClick={fetchRegistrations}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <FiRefreshCw className="mr-2" /> Refresh
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search registrations..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex space-x-4">
              <div className="relative flex-1">
                <select
                  className="pl-4 pr-10 py-2 border border-gray-300 rounded-md w-full appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={courseFilter}
                  onChange={(e) => setCourseFilter(e.target.value)}
                >
                  <option value="all">All Courses</option>
                  {courses.map(course => (
                    <option key={course} value={course}>{course}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <FiChevronDown className="text-gray-400" />
                </div>
              </div>
            </div>
            
            <div className="text-right text-sm text-gray-500 flex items-center justify-end">
              Showing {filteredRegistrations.length} of {registrations.length} registrations
            </div>
          </div>
        </div>

        {/* Registrations Table */}
        {loading ? (
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading registrations...</p>
          </div>
        ) : filteredRegistrations.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 text-center">
            <FiUser className="mx-auto text-gray-400" size={48} />
            <p className="mt-4 text-gray-600">No registrations found.</p>
            {searchTerm || courseFilter !== "all" ? (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setCourseFilter("all");
                }}
                className="mt-4 px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
              >
                Clear Filters
              </button>
            ) : null}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('full_name')}
                    >
                      <div className="flex items-center">
                        Name
                        {sortConfig.key === 'full_name' && (
                          sortConfig.direction === 'ascending' ? 
                            <FiChevronUp className="ml-1" /> : 
                            <FiChevronDown className="ml-1" />
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Course
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Schedule
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Duration
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredRegistrations.map((reg) => (
                    <tr key={reg._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{reg.full_name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{reg.email}</div>
                        <div className="text-sm text-gray-500">{reg.phone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {reg.course}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {reg.schedule}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {reg.duration}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => viewRegistrationDetails(reg)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <FiEye size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <RegistrationModal />
      <ToastContainer position="top-center" autoClose={3000} theme="colored" />
    </div>
  );
}
