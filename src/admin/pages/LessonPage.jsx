import React, { useEffect, useState, useContext, useCallback } from "react";
import { FiEdit2, FiTrash2, FiSave, FiX, FiLoader, FiAlertCircle } from "react-icons/fi";
import { AuthContext } from "../../context/AuthContext"; // Adjust the import path as needed

export default function LessonsPage() {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingLessonId, setEditingLessonId] = useState(null);
  const [editData, setEditData] = useState({ title: "", video_url: "" });
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { axiosInstance } = useContext(AuthContext);

  
  const fetchLessons = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/lessons");
      setLessons(res.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching lessons:", err);
      setError("Failed to load lessons. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [axiosInstance]); // ✅ include axiosInstance because it comes from context

  useEffect(() => {
    fetchLessons();
  }, [fetchLessons]); // ✅ use fetchLessons as dependency

  const deleteLesson = async (lessonId) => {
    if (!window.confirm("Are you sure you want to delete this lesson?")) return;

    try {
      setIsProcessing(true);
      await axiosInstance.delete(`/lessons/${lessonId}`);
      setLessons(lessons.filter((lesson) => lesson.id !== lessonId));
    } catch (err) {
      console.error("Delete lesson error:", err);
      alert("Failed to delete lesson. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const startEditing = (lesson) => {
    setEditingLessonId(lesson.id);
    setEditData({ title: lesson.title, video_url: lesson.video_url });
  };

  const cancelEditing = () => {
    setEditingLessonId(null);
    setEditData({ title: "", video_url: "" });
  };

  const saveEdit = async (lessonId) => {
    if (!editData.title || !editData.video_url) {
      alert("Both title and video URL are required");
      return;
    }

    try {
      setIsProcessing(true);
      await axiosInstance.put(`/lessons/${lessonId}`, editData);
      setLessons(
        lessons.map((lesson) =>
          lesson.id === lessonId ? { ...lesson, ...editData } : lesson
        )
      );
      setEditingLessonId(null);
    } catch (err) {
      console.error("Edit lesson error:", err);
      alert("Failed to update lesson. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <FiLoader className="animate-spin text-4xl text-blue-500 mb-4" />
          <p className="text-lg text-gray-600">Loading lessons...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md p-6 bg-red-50 rounded-lg text-center">
          <FiAlertCircle className="text-4xl text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-red-700 mb-2">Error Loading Lessons</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchLessons}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    

    <div className="p-6 max-w-7xl mx-auto ">
      <div className="mt-28">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Lesson Management</h1>
            <p className="mt-2 text-gray-600">
              {lessons.length} {lessons.length === 1 ? "lesson" : "lessons"} available
            </p>
          </div>
        </div>

        {lessons.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <img
              src="https://illustrations.popsy.co/amber/student-yawning.svg"
              alt="No lessons"
              className="mx-auto h-48 mb-6"
            />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No Lessons Found</h3>
            <p className="text-gray-500 mb-6">
              There are currently no lessons available. Create your first lesson to get started.
            </p>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              Create Lesson
            </button>
          </div>
        ) : (
           <div className="bg-white rounded-xl shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Module
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Video URL
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {lessons.map((lesson) => (
                    <tr key={lesson.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editingLessonId === lesson.id ? (
                          <input
                            type="text"
                            value={editData.title}
                            onChange={(e) =>
                              setEditData({ ...editData, title: e.target.value })
                            }
                            className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={isProcessing}
                          />
                        ) : (
                          <div className="text-sm font-medium text-gray-900">
                            {lesson.title}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">Module {lesson.module_id}</div>
                      </td>
                      <td className="px-6 py-4">
                        {editingLessonId === lesson.id ? (
                          <input
                            type="text"
                            value={editData.video_url}
                            onChange={(e) =>
                              setEditData({ ...editData, video_url: e.target.value })
                            }
                            className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={isProcessing}
                          />
                        ) : (
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            <a
                              href={lesson.video_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              {lesson.video_url}
                            </a>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {editingLessonId === lesson.id ? (
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => saveEdit(lesson.id)}
                              disabled={isProcessing}
                              className="flex items-center px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 transition disabled:opacity-50"
                            >
                              {isProcessing ? (
                                <FiLoader className="animate-spin mr-1" />
                              ) : (
                                <FiSave className="mr-1" />
                              )}
                              Save
                            </button>
                            <button
                              onClick={cancelEditing}
                              disabled={isProcessing}
                              className="flex items-center px-3 py-1.5 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition disabled:opacity-50"
                            >
                              <FiX className="mr-1" />
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => startEditing(lesson)}
                              className="flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                            >
                              <FiEdit2 className="mr-1" />
                              Edit
                            </button>
                            <button
                              onClick={() => deleteLesson(lesson.id)}
                              className="flex items-center px-3 py-1.5 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                            >
                              <FiTrash2 className="mr-1" />
                              Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}