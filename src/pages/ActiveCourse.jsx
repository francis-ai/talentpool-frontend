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
        console.log("📦 My Courses Response:", res.data);

        const enrolled = Array.isArray(res.data)
          ? res.data.filter((course) => Number(course.amount_paid) > 0)
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

  // 🕒 Calculate days left for half payment
  const getDaysLeft = (countdownDate) => {
    if (!countdownDate) return 0;
    const now = new Date();
    const dueDate = new Date(countdownDate);
    const diffTime = dueDate - now;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // 🌀 Loading spinner
  if (!user || loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // ❌ No active courses
  if (!courses.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">No Active Courses</h2>
        <p className="text-gray-500 max-w-md">
          You haven’t enrolled in any courses yet. Once you do, they’ll appear here.
        </p>
      </div>
    );
  }

  // ✅ Display enrolled courses
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10 text-center mt-16">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Courses</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Here are the courses you’ve enrolled in
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.map((course) => {
          const daysLeft = getDaysLeft(course.countdown || course.next_payment_due);
          const isHalfPaid = course.paymentStatus === "half_paid";
          const isFullyPaid = course.paymentStatus === "fully_paid";

          return (
            <div
              key={course.course_id}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 relative"
            >
              {/* ===== Course Image ===== */}
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

                {/* ===== BADGE ===== */}
                <div className="absolute top-4 right-4">
                  {isHalfPaid ? (
                    <span className="bg-yellow-100 text-yellow-800 text-xs px-3 py-1 rounded-full flex items-center shadow-sm">
                      <BsCheckCircleFill className="mr-1 text-xs" /> Half Paid
                    </span>
                  ) : isFullyPaid ? (
                    <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full flex items-center shadow-sm">
                      <BsCheckCircleFill className="mr-1 text-xs" /> Fully Paid
                    </span>
                  ) : (
                    <span className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full shadow-sm">
                      Pending
                    </span>
                  )}
                </div>
              </div>

              {/* ===== Course Details ===== */}
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                  {course.title || "Untitled Course"}
                </h2>

                <div className="flex justify-between items-center mb-4">
                  <span className="font-bold text-gray-900">
                    ₦{Number(course.amount_paid).toLocaleString()} paid
                  </span>
                  <span className="text-sm text-gray-500">
                    of ₦{Number(course.price).toLocaleString()}
                  </span>
                </div>

                {/* ===== Countdown / Expiry ===== */}
                {isHalfPaid &&
                  (daysLeft > 0 ? (
                    <div className="mb-3 px-3 py-1 bg-yellow-50 text-yellow-700 text-xs font-medium rounded-full border border-yellow-200 text-center">
                      {daysLeft} day{daysLeft > 1 ? "s" : ""} left to complete payment
                    </div>
                  ) : (
                    <div className="mb-3 text-xs text-red-600 text-center font-medium">
                      Access expired — complete payment
                    </div>
                  ))}

                {/* ===== Continue Learning Button ===== */}
                <button
                  onClick={() => navigate(`/course-list/${course.course_id}`)}
                  className={`w-full py-3 rounded-md text-sm font-medium transition-all ${
                    isHalfPaid
                      ? "bg-white border border-yellow-500 text-yellow-600 hover:bg-yellow-50"
                      : "bg-white border border-blue-700 text-blue-700 hover:bg-blue-50"
                  }`}
                >
                  Continue Learning
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
