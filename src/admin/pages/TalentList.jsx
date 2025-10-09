import React, { useEffect, useState, useCallback, useContext } from "react";
import { AuthContext } from "../../context/AuthContext"; // Adjust path as needed

export default function AdminTalents() {
  const { axiosInstance, user, loading: authLoading } = useContext(AuthContext);
  const [talents, setTalents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAvailable, setFilterAvailable] = useState("all");
  const [sortField, setSortField] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("desc");

  const fetchTalents = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/talents");
      setTalents(res.data.talents || []);
      setError("");
    } catch (err) {
      console.error("Error fetching talents:", err.response || err);
      setError(err.response?.data?.message || "Failed to fetch talents");
    } finally {
      setLoading(false);
    }
  }, [axiosInstance]);

  useEffect(() => {
    if (!authLoading && user) {
      fetchTalents();
    }
  }, [authLoading, user, fetchTalents]);

  const filteredTalents = talents
    .filter(talent => {
      const matchesSearch = 
        talent.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        talent.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        talent.jobTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        talent.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        talent.skills?.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesAvailability = 
        filterAvailable === "all" || 
        (filterAvailable === "available" && talent.available) ||
        (filterAvailable === "unavailable" && !talent.available);

      return matchesSearch && matchesAvailability;
    })
    .sort((a, b) => {
      const aValue = a[sortField] || "";
      const bValue = b[sortField] || "";

      if (sortOrder === "asc") return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    });

  const handleSort = (field) => {
    if (sortField === field) setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  const SortIcon = ({ field }) => (
    <span className="ml-1 text-xs">{sortField === field ? (sortOrder === "asc" ? "↑" : "↓") : "↕"}</span>
  );

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-lg">Loading talents...</p>
        </div>
      </div>
    );
  }

  if (!user || error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md text-center">
          <div className="text-red-600 text-2xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-red-700 mb-2">
            {error ? "Error" : "Access Restricted"}
          </h2>
          <p className="text-red-600">
            {error || "You must be logged in as an admin to view this page."}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    
    <div className="min-h-screen  bg-gray-50 p-6">
        <div className="mt-28">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Talent Management</h1>
              <p className="text-gray-600 mt-2">Manage and review all registered talents</p>
            </div>
            <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-lg shadow-sm">
              <div className="text-2xl">👥</div>
              <div>
                <div className="text-sm text-gray-500">Total Talents</div>
                <div className="text-xl font-bold text-blue-600">{talents.length}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">✅</div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {talents.filter(t => t.available).length}
                </div>
                <div className="text-gray-600">Available</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">❌</div>
              <div>
                <div className="text-2xl font-bold text-red-600">
                  {talents.filter(t => !t.available).length}
                </div>
                <div className="text-gray-600">Unavailable</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">🌍</div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {new Set(talents.map(t => t.location)).size}
                </div>
                <div className="text-gray-600">Locations</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">💼</div>
              <div>
                <div className="text-2xl font-bold text-orange-600">
                  {new Set(talents.flatMap(t => t.jobTypes || [])).size}
                </div>
                <div className="text-gray-600">Job Types</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm mb-6 p-6 border border-gray-100">
          <div className="flex flex-col lg:flex-row gap-4 justify-between items-center">
            <div className="flex-1 w-full">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by name, email, job title, location, or skills..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  🔍
                </div>
              </div>
            </div>
            <div className="flex gap-4">
              <select
                value={filterAvailable}
                onChange={(e) => setFilterAvailable(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="available">Available</option>
                <option value="unavailable">Unavailable</option>
              </select>
              <div className="text-sm text-gray-600 flex items-center">
                Showing {filteredTalents.length} of {talents.length}
              </div>
            </div>
          </div>
        </div>

        {/* Talents Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          {filteredTalents.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">😔</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No talents found</h3>
              <p className="text-gray-500">
                {searchTerm || filterAvailable !== "all" 
                  ? "Try adjusting your search or filters" 
                  : "No talents have been registered yet"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort("fullName")}
                    >
                      <div className="flex items-center">
                        Talent
                        <SortIcon field="fullName" />
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort("jobTitle")}
                    >
                      <div className="flex items-center">
                        Role
                        <SortIcon field="jobTitle" />
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort("location")}
                    >
                      <div className="flex items-center">
                        Location
                        <SortIcon field="location" />
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort("experience")}
                    >
                      <div className="flex items-center">
                        Experience
                        <SortIcon field="experience" />
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Skills
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Job Types
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort("available")}
                    >
                      <div className="flex items-center">
                        Status
                        <SortIcon field="available" />
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTalents.map((talent) => (
                    <tr key={talent.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                            {talent.fullName?.charAt(0) || "T"}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {talent.fullName || "Unknown"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{talent.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {talent.jobTitle || "-"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {talent.location || "Remote"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {talent.experience ? `${talent.experience} yrs` : "Not specified"}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {(talent.skills || []).slice(0, 3).map((skill, index) => (
                            <span key={index} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                              {skill}
                            </span>
                          ))}
                          {(talent.skills || []).length > 3 && (
                            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-200 text-gray-600">
                              +{(talent.skills || []).length - 3} more
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {(talent.jobTypes || []).map((type, index) => (
                            <span key={index} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                              {type}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          talent.available 
                            ? "bg-green-100 text-green-800" 
                            : "bg-red-100 text-red-800"
                        }`}>
                          {talent.available ? "Available" : "Unavailable"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        </div>
      </div>
    </div>
  );
}