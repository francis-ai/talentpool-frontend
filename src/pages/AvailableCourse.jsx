import { useEffect, useState, useContext } from "react";
import { FiBookOpen, FiClock, FiDollarSign } from "react-icons/fi";
import { BsCheckCircleFill } from "react-icons/bs";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function CourseList() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { axiosInstance, user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    const fetchCourses = async () => {
      try {
        const res = await axiosInstance.get("/courses-with-status");
        setCourses(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("❌ Failed to fetch courses:", err.response?.data || err.message);
        if (err.response?.status === 401) navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [axiosInstance, user, navigate]);

  const handleBuy = async (courseId, half = false) => {
    try {
      const res = await axiosInstance.post(`/payment/pay/${courseId}`, { half });
      window.location.href = res.data.payment_url;
    } catch (err) {
      console.error("❌ Payment failed:", err.response?.data || err.message);
      if (err.response?.status === 401) navigate("/login");
      alert("Unable to start payment. Try again.");
    }
  };

  if (!user || loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10 text-center mt-20">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Professional Development Courses</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Enhance your skills with our expert-led courses designed for professional growth
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.map((course) => {
          const now = new Date();
          let canPayRemaining = false;
          let daysLeft = 0;

          if (course.amount_paid > 0 && course.amount_paid < course.price && course.half_payment_date) {
            const twoMonthsLater = new Date(course.half_payment_date);
            twoMonthsLater.setMonth(twoMonthsLater.getMonth() + 2);
            if (now >= twoMonthsLater) {
              canPayRemaining = true;
            } else {
              daysLeft = Math.ceil((twoMonthsLater - now) / (1000 * 60 * 60 * 24));
            }
          }

          return (
            <div
              key={course.id}
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
                  {course.purchased && (
                    <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full flex items-center shadow-sm">
                      <BsCheckCircleFill className="mr-1 text-xs" /> Enrolled
                    </span>
                  )}
                </div>
              </div>

              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">{course.title}</h2>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{course.description}</p>

                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center">
                    <FiDollarSign className="text-gray-500 mr-1" />
                    <span className="font-bold text-gray-900">₦{course.price.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center">
                    <FiClock className="text-gray-500 mr-1" />
                    <span className="text-xs text-gray-500">{course.duration || "Self-paced"}</span>
                  </div>
                </div>

                {!course.purchased ? (
                  course.amount_paid > 0 && course.amount_paid < course.price ? (
                    canPayRemaining ? (
                      <button
                        onClick={() => handleBuy(course.id, false)}
                        className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-md text-sm font-medium"
                      >
                        Pay Remaining Balance
                      </button>
                    ) : (
                      <button
                        disabled
                        className="w-full bg-gray-300 text-gray-600 py-3 rounded-md text-sm font-medium cursor-not-allowed"
                      >
                        Pay Remaining Balance (Available in {daysLeft} days)
                      </button>
                    )
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleBuy(course.id, false)}
                        className="flex-1 bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-md text-sm font-medium"
                      >
                        Pay Full
                      </button>
                      <button
                        onClick={() => handleBuy(course.id, true)}
                        className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded-md text-sm font-medium"
                      >
                        Pay Half
                      </button>
                    </div>
                  )
                ) : (
                  <button
                    onClick={() => navigate(`/CourseList/${course.id}`)}
                    className="w-full bg-white border border-blue-700 text-blue-700 hover:bg-blue-50 py-3 rounded-md text-sm font-medium"
                  >
                    Continue Learning
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
