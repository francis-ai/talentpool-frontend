import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { FiPlus, FiTrash2, FiLoader, FiArrowLeft } from "react-icons/fi";

export default function CourseSyllabus() {
  const { courseId } = useParams();
  const { axiosInstance } = useContext(AuthContext);
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [syllabus, setSyllabus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newSyllabus, setNewSyllabus] = useState({ title: "", description: "" });
  const [showAddForm, setShowAddForm] = useState(false);

  // ✅ Fetch course info + syllabus
  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const courseRes = await axiosInstance.get(`/courses/${courseId}`);
        setCourse(courseRes.data);

        const syllabusRes = await axiosInstance.get(`/courses/${courseId}/syllabus`);
        setSyllabus(syllabusRes.data);
      } catch (err) {
        console.error("Error fetching syllabus:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [axiosInstance, courseId]);

  // ✅ Add new syllabus topic
  const handleAddSyllabus = async () => {
    if (!newSyllabus.title) return alert("Title required");

    try {
      await axiosInstance.post(`/courses/${courseId}/syllabus`, newSyllabus);
      setNewSyllabus({ title: "", description: "" });
      const res = await axiosInstance.get(`/courses/${courseId}/syllabus`);
      setSyllabus(res.data);
      setShowAddForm(false);
    } catch (err) {
      console.error("Add syllabus error:", err);
      alert("Failed to add syllabus");
    }
  };

  // ✅ Delete syllabus item
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this syllabus item?")) return;
    try {
      await axiosInstance.delete(`/syllabus/${id}`);
      setSyllabus((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete item");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <FiLoader className="animate-spin text-3xl text-blue-600" />
        <p className="ml-3 text-gray-600">Loading syllabus...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-700 hover:text-blue-600"
          >
            <FiArrowLeft className="mr-2" /> Back
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            {course?.title || "Course Syllabus"}
          </h1>
        </div>

        <p className="text-gray-600 mb-8">{course?.description}</p>

        {/* Add new syllabus */}
        <div className="bg-white p-5 rounded-xl shadow mb-6">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <FiPlus className="mr-2" />
            {showAddForm ? "Close Form" : "Add New Syllabus"}
          </button>

          {showAddForm && (
            <div className="mt-4 space-y-3">
              <input
                type="text"
                placeholder="Syllabus Title"
                value={newSyllabus.title}
                onChange={(e) =>
                  setNewSyllabus({ ...newSyllabus, title: e.target.value })
                }
                className="w-full border px-3 py-2 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
              <textarea
                placeholder="Syllabus Description"
                rows="3"
                value={newSyllabus.description}
                onChange={(e) =>
                  setNewSyllabus({ ...newSyllabus, description: e.target.value })
                }
                className="w-full border px-3 py-2 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                onClick={handleAddSyllabus}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Add Syllabus
              </button>
            </div>
          )}
        </div>

        {/* Syllabus List */}
        <div className="grid gap-4">
          {syllabus.length === 0 ? (
            <div className="bg-white p-8 text-center rounded-lg shadow">
              <p className="text-gray-600">No syllabus added yet.</p>
            </div>
          ) : (
            syllabus.map((item, index) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-sm p-5 flex justify-between items-start hover:shadow-md transition"
              >
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">
                    {index + 1}. {item.title}
                  </h3>
                  <p className="text-gray-600 mt-1">{item.description}</p>

                  <div className="mt-3 flex space-x-3">
                    <button
                      onClick={() =>
                        navigate(`/admin/syllabus/${item.id}/materials`)
                      }
                      className="px-3 py-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm"
                    >
                      Manage Materials
                    </button>
                    <button
                      onClick={() =>
                        navigate(`/admin/syllabus/${item.id}/videos`)
                      }
                      className="px-3 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm"
                    >
                      Manage Videos
                    </button>
                    <button
                      onClick={() =>
                        navigate(`/admin/course/${courseId}/test`)
                      }
                      className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                    >
                      Manage Tests
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FiTrash2 />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
