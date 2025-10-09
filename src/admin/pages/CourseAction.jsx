import React, { useEffect, useState, useContext, useCallback } from "react";
import { AuthContext } from "../../context/AuthContext"; // Adjust path as needed
import { FiEdit2, FiTrash2, FiPlus, FiLoader, FiAlertCircle, FiCheck } from "react-icons/fi";
import { Link } from "react-router-dom";
export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [modal, setModal] = useState({ 
    isOpen: false, 
    type: '', // 'delete', 'edit', 'success', 'error'
    title: '',
    message: '',
    course: null,
    inputData: { title: '', description: '', price: '' }
  });
  const { axiosInstance } = useContext(AuthContext);

  // Wrap fetchCourses in useCallback
  const fetchCourses = useCallback(async () => {
    try {
        setLoading(true);
        const res = await axiosInstance.get("/courses");
        setCourses(res.data);
    } catch (err) {
        console.error("Error fetching courses:", err);
        setError("Failed to load courses. Please try again later.");
        showModal('error', 'Error', 'Failed to load courses. Please try again later.');
    } finally {
        setLoading(false);
    }
    }, [axiosInstance]); // ✅ axiosInstance is also a dependency

  // useEffect now includes fetchCourses
  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const showModal = (type, title, message, course = null) => {
    setModal({
      isOpen: true,
      type,
      title,
      message,
      course,
      inputData: course ? { 
        title: course.title, 
        description: course.description, 
        price: course.price 
      } : { title: '', description: '', price: '' }
    });
  };

  const closeModal = () => {
    setModal({ 
      isOpen: false, 
      type: '', 
      title: '', 
      message: '', 
      course: null,
      inputData: { title: '', description: '', price: '' }
    });
  };

  const handleDelete = async () => {
    if (!modal.course) return;
    
    try {
      setIsProcessing(true);
      await axiosInstance.delete(`/courses/${modal.course.id}`);
      setCourses(courses.filter((course) => course.id !== modal.course.id));
      closeModal();
      showModal('success', 'Success', 'Course deleted successfully.');
    } catch (err) {
      console.error("Delete failed:", err);
      closeModal();
      showModal('error', 'Error', 'Failed to delete course. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEdit = async () => {
    if (!modal.course) return;
    
    const { title, description, price } = modal.inputData;
    
    if (!title || !description || !price) {
      showModal('error', 'Error', 'All fields are required.');
      return;
    }

    try {
      setIsProcessing(true);
      await axiosInstance.put(`/courses/${modal.course.id}`, {
        title,
        description,
        price
      });
      closeModal();
      fetchCourses();
      showModal('success', 'Success', 'Course updated successfully.');
    } catch (err) {
      console.error("Edit failed:", err);
      closeModal();
      showModal('error', 'Error', 'Failed to update course. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const updateInput = (field, value) => {
    setModal(prev => ({
      ...prev,
      inputData: {
        ...prev.inputData,
        [field]: value
      }
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="relative">
            <FiLoader className="animate-spin text-4xl text-blue-500 mb-4" />
            <div className="absolute inset-0 border-4 border-blue-100 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
          <p className="text-lg text-gray-600 mt-4">Loading courses...</p>
        </div>
      </div>
    );
  }

  if (error && courses.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full p-6 bg- mt-10 white rounded-xl shadow-sm text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiAlertCircle className="text-2xl text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Error Loading Courses</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchCourses}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition shadow-md"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      {/* Modal */}
      {modal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden">
            {/* Modal Header */}
            <div className={`px-6 py-4 border-b ${
              modal.type === 'error' ? 'bg-red-500 text-white' : 
              modal.type === 'success' ? 'bg-green-500 text-white' : 
              'bg-gray-800 text-white'
            }`}>
              <h3 className="text-lg font-semibold">{modal.title}</h3>
            </div>
            
            {/* Modal Body */}
            <div className="p-6">
              {modal.type === 'delete' ? (
                <div className="text-center">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiAlertCircle className="text-2xl text-red-500" />
                  </div>
                  <p className="text-gray-700 mb-6">{modal.message}</p>
                </div>
              ) : modal.type === 'edit' ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Course Title</label>
                    <input
                      type="text"
                      value={modal.inputData.title}
                      onChange={(e) => updateInput('title', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={modal.inputData.description}
                      onChange={(e) => updateInput('description', e.target.value)}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price (₦)</label>
                    <input
                      type="number"
                      value={modal.inputData.price}
                      onChange={(e) => updateInput('price', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                    modal.type === 'error' ? 'bg-red-100' : 'bg-green-100'
                  }`}>
                    {modal.type === 'error' ? (
                      <FiAlertCircle className="text-2xl text-red-500" />
                    ) : (
                      <FiCheck className="text-2xl text-green-500" />
                    )}
                  </div>
                  <p className="text-gray-700">{modal.message}</p>
                </div>
              )}
            </div>
            
            {/* Modal Footer */}
            <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3">
              {modal.type === 'delete' ? (
                <>
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={isProcessing}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 flex items-center"
                  >
                    {isProcessing ? (
                      <FiLoader className="animate-spin mr-2" />
                    ) : null}
                    Delete
                  </button>
                </>
              ) : modal.type === 'edit' ? (
                <>
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleEdit}
                    disabled={isProcessing}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 flex items-center"
                  >
                    {isProcessing ? (
                      <FiLoader className="animate-spin mr-2" />
                    ) : null}
                    Update
                  </button>
                </>
              ) : (
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  OK
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto mt-20">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-3xl font-bold text-gray-900">Course Catalog</h1>
            <p className="mt-2 text-gray-600">
              {courses.length} {courses.length === 1 ? "course" : "courses"} available
            </p>
          </div>
          <Link to="/admin-create-course"
            
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md"
          >
            <FiPlus className="mr-2" />
            Add New Course
          </Link>
        </div>

        {courses.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <img
              src="https://illustrations.popsy.co/amber/student-yawning.svg"
              alt="No courses"
              className="mx-auto h-48 mb-6"
            />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No Courses Found</h3>
            <p className="text-gray-500 mb-6">
              There are currently no courses available. Create your first course to get started.
            </p>
            <a 
              href="/admin/create-course"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md"
            >
              <FiPlus className="mr-2" />
              Create Your First Course
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition border border-gray-100"
              >
                {course.image_url ? (
                  <img
                    src={`${process.env.REACT_APP_API_BASE_URL}${course.image_url}`}
                    alt={course.title}
                    className="h-48 w-full object-cover"
                  />
                ) : (
                  <div className="h-48 bg-gradient-to-r from-blue-50 to-purple-50 flex items-center justify-center">
                    <span className="text-gray-400">No image</span>
                  </div>
                )}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-lg font-semibold text-gray-900 line-clamp-2">
                      {course.title}
                    </h2>
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      ₦{course.price}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {course.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">
                      Updated: {new Date(course.updated_at).toLocaleDateString()}
                    </span>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => showModal('edit', 'Edit Course', 'Update the course details:', course)}
                        disabled={isProcessing}
                        className="p-2 text-blue-600 hover:text-blue-800 rounded-full hover:bg-blue-50 transition"
                        title="Edit course"
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        onClick={() => showModal('delete', 'Confirm Delete', `Are you sure you want to delete "${course.title}"? This action cannot be undone.`, course)}
                        disabled={isProcessing}
                        className="p-2 text-red-600 hover:text-red-800 rounded-full hover:bg-red-50 transition"
                        title="Delete course"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}