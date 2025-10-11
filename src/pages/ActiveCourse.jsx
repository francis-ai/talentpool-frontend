import { useEffect, useState, useContext } from "react";
import { FiBookOpen } from "react-icons/fi";
import { BsCheckCircleFill } from "react-icons/bs";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function MyCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { axiosInstance, user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    const fetchMyCourses = async () => {
      try {
        const res = await axiosInstance.get("/payment/my-courses");
        // Only show courses with amount_paid > 0
        const enrolled = Array.isArray(res.data)
          ? res.data.filter(course => course.amount_paid > 0)
          : [];
        setCourses(enrolled);
      } catch (err) {
        console.error("❌ Failed to fetch courses:", err.response?.data || err.message);
        if (err.response?.status === 401) navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchMyCourses();
  }, [axiosInstance, user, navigate]);

  if (!user || loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!courses.length) {
    return (
      <div className="text-center mt-20">
        <p className="text-gray-600">You have not enrolled in any courses yet.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10 text-center mt-16">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Courses</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Here are the courses you have enrolled in
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.map((course) => (
          <div
            key={course.course_id}
            className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300"
          >
            <div className="h-48 bg-gray-100 flex items-center justify-center relative">
              {course.image_url ? (
                <img
                  src={`${process.env.REACT_APP_API_BASE_URL}${course.image_url}`}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <FiBookOpen className="text-gray-300 text-5xl" />
              )}
              <div className="absolute top-4 right-4">
                <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full flex items-center shadow-sm">
                  <BsCheckCircleFill className="mr-1 text-xs" /> Enrolled
                </span>
              </div>
            </div>

            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">{course.title}</h2>
              <div className="flex items-center mb-4">
                <span className="font-bold text-gray-900">₦{course.amount_paid.toLocaleString()} paid</span>
              </div>
              <button
                onClick={() => navigate(`/course-list/${course.course_id}`)}
                className="w-full bg-white border border-blue-700 text-blue-700 hover:bg-blue-50 py-3 rounded-md text-sm font-medium"
              >
                Continue Learning
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
