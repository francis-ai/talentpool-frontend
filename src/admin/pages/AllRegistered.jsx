import React, { useEffect, useState, useCallback, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FiSearch,
  FiDownload,
  FiRefreshCw,
  FiEye,
  FiChevronDown,
  FiChevronUp,
  FiUser,
  FiMail,
  FiBook,
  FiCalendar,
} from "react-icons/fi";

export default function AdminRegistrations() {
  const { axiosInstance } = useContext(AuthContext);
  const [enrollments, setEnrollments] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "ascending" });
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // ✅ Fetch Enrollments
  const fetchEnrollments = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/all"); // your route e.g. /enrollments/all
      const enrollData = res.data.enrollments || [];
      setEnrollments(enrollData);
      setFiltered(enrollData);
    } catch (err) {
      console.error("Error fetching enrollments:", err);
      toast.error("Failed to fetch enrollments");
    } finally {
      setLoading(false);
    }
  }, [axiosInstance]);

  useEffect(() => {
    fetchEnrollments();
  }, [fetchEnrollments]);

  // ✅ Filter
  useEffect(() => {
    if (!searchTerm) return setFiltered(enrollments);
    const lower = searchTerm.toLowerCase();
    setFiltered(
      enrollments.filter(
        (e) =>
          e.user_email.toLowerCase().includes(lower) ||
          e.course_title.toLowerCase().includes(lower)
      )
    );
  }, [searchTerm, enrollments]);

  // ✅ Sort
  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });

    const sorted = [...filtered].sort((a, b) => {
      if (a[key] < b[key]) return direction === "ascending" ? -1 : 1;
      if (a[key] > b[key]) return direction === "ascending" ? 1 : -1;
      return 0;
    });
    setFiltered(sorted);
  };

  // ✅ Modal
  const viewDetails = (enrollment) => {
    setSelectedEnrollment(enrollment);
    setShowModal(true);
  };

  const EnrollmentModal = () => {
    if (!selectedEnrollment) return null;
    return (
      <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50`}>
        <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
          <div className="p-5 border-b flex justify-between items-center">
            <h3 className="text-xl font-semibold">Enrollment Details</h3>
            <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">&times;</button>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center"><FiMail className="text-blue-600 mr-3" /><span>{selectedEnrollment.user_email}</span></div>
            <div className="flex items-center"><FiBook className="text-blue-600 mr-3" /><span>{selectedEnrollment.course_title}</span></div>
            <div className="flex items-center"><FiCalendar className="text-blue-600 mr-3" /><span>{new Date(selectedEnrollment.created_at).toLocaleString()}</span></div>
            <div className="text-right">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">Close</button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ✅ CSV Export
  const exportToCSV = () => {
    const headers = ["User Email", "Course Title", "Registration Date"];
    const csvData = filtered.map((e) => [
      e.user_email,
      e.course_title,
      new Date(e.created_at).toLocaleDateString(),
    ]);
    const csvContent = [headers, ...csvData]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `enrollments_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Course Enrollments</h1>
          <div className="flex space-x-3">
            <button onClick={exportToCSV} className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
              <FiDownload className="mr-2" /> Export CSV
            </button>
            <button onClick={fetchEnrollments} className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              <FiRefreshCw className="mr-2" /> Refresh
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white p-4 rounded-lg shadow-sm border mb-6 flex items-center space-x-3">
          <FiSearch className="text-gray-400" />
          <input
            type="text"
            placeholder="Search by email or course..."
            className="flex-1 border-none focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="text-gray-500 text-sm">({filtered.length})</span>
        </div>

        {/* Table */}
        {loading ? (
          <div className="bg-white p-8 rounded-lg shadow-sm text-center">Loading enrollments...</div>
        ) : filtered.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-sm text-center text-gray-600">
            No enrollments found.
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("user_email")}
                    >
                      <div className="flex items-center">
                        User Email
                        {sortConfig.key === "user_email" &&
                          (sortConfig.direction === "ascending" ? (
                            <FiChevronUp className="ml-1" />
                          ) : (
                            <FiChevronDown className="ml-1" />
                          ))}
                      </div>
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("course_title")}
                    >
                      <div className="flex items-center">
                        Course
                        {sortConfig.key === "course_title" &&
                          (sortConfig.direction === "ascending" ? (
                            <FiChevronUp className="ml-1" />
                          ) : (
                            <FiChevronDown className="ml-1" />
                          ))}
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filtered.map((e) => (
                    <tr key={e.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">{e.user_email}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{e.course_title}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(e.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => viewDetails(e)}
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

      {showModal && <EnrollmentModal />}
      <ToastContainer position="top-center" autoClose={3000} theme="colored" />
    </div>
  );
}
