import { useEffect, useState, useContext } from "react";
import { FiBookOpen, FiClock } from "react-icons/fi";
import { BsCheckCircleFill } from "react-icons/bs";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Dialog } from "@headlessui/react";

export default function CourseList() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { axiosInstance, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isHalfPayment, setIsHalfPayment] = useState(false);

  // 🧩 Fetch courses for logged-in user
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

  // 🧭 Payment button click
  const handleBuyClick = (course, half = false) => {
    setSelectedCourse(course);
    setIsHalfPayment(half);
    setShowModal(true);
  };

  // 🧾 Confirm and redirect to Paystack
  const confirmPayment = async () => {
    if (!selectedCourse) return;
    try {
      const res = await axiosInstance.post(`/payment/pay/${selectedCourse.id}`, {
        half: isHalfPayment,
      });
      window.location.href = res.data.payment_url;
    } catch (err) {
      console.error("❌ Payment failed:", err.response?.data || err.message);
      if (err.response?.status === 401) navigate("/login");
      alert("Unable to start payment. Try again.");
    } finally {
      setShowModal(false);
    }
  };

  // 🕒 Calculate days left until next payment
  const getDaysLeft = (countdownDate) => {
    if (!countdownDate) return 0;
    const now = new Date();
    const dueDate = new Date(countdownDate);
    const diffTime = dueDate - now;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  if (!user || loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10 text-center mt-20">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Professional Development Courses
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Enhance your skills with our expert-led courses designed for professional growth.
          </p>
        </div>

        {/* ==== Course Cards ==== */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => {
            const daysLeft = getDaysLeft(course.countdown);
            const status = course.paymentStatus; // comes directly from backend

            return (
              <div
                key={course.id}
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

                  {/* ===== BADGES ===== */}
                  <div className="absolute top-4 right-4">
                    {status === "fully_paid" && (
                      <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full flex items-center shadow-sm">
                        <BsCheckCircleFill className="mr-1 text-xs" /> Enrolled
                      </span>
                    )}
                    {status === "half_paid" && (
                      <span className="bg-yellow-100 text-yellow-800 text-xs px-3 py-1 rounded-full flex items-center shadow-sm">
                        <BsCheckCircleFill className="mr-1 text-xs" /> Half Paid
                      </span>
                    )}
                  </div>
                </div>

                {/* ===== Course Details ===== */}
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                    {course.title}
                  </h2>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {course.description}
                  </p>

                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center">
                      <span className="font-bold text-gray-900">
                        ₦{course.price?.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <FiClock className="text-gray-500 mr-1" />
                      <span className="text-xs text-gray-500">
                        {course.duration || "Self-paced"}
                      </span>
                    </div>
                  </div>

                  {/* ===== PAYMENT ACTIONS ===== */}
                  {status === "fully_paid" && (
                    <button
                      onClick={() => navigate(`/course-list/${course.id}`)}
                      className="w-full bg-white border border-blue-700 text-blue-700 hover:bg-blue-50 py-3 rounded-md text-sm font-medium"
                    >
                      Continue Learning
                    </button>
                  )}

                  {status === "half_paid" && (
                    <div className="flex flex-col items-center">
                      <button
                        onClick={() => navigate(`/course-list/${course.id}`)}
                        className="w-full bg-white border border-yellow-500 text-yellow-600 hover:bg-yellow-50 py-3 rounded-md text-sm font-medium"
                      >
                        Access Course
                      </button>
                      {daysLeft > 0 ? (
                        <div className="mt-3 px-3 py-1 bg-yellow-50 text-yellow-700 text-xs font-medium rounded-full border border-yellow-200">
                          {daysLeft} day{daysLeft > 1 ? "s" : ""} left to complete payment
                        </div>
                      ) : (
                        <div className="mt-3 text-xs text-red-600">
                          Access expired — complete payment
                        </div>
                      )}
                    </div>
                  )}

                  {status === "not_enrolled" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleBuyClick(course, false)}
                        className="flex-1 bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-md text-sm font-medium"
                      >
                        Pay Full
                      </button>
                      <button
                        onClick={() => handleBuyClick(course, true)}
                        className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded-md text-sm font-medium"
                      >
                        Pay Half
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ✅ Payment Confirmation Modal */}
      <Dialog
        open={showModal}
        onClose={() => setShowModal(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white rounded-md max-w-md w-full p-6 shadow-lg">
            <Dialog.Title className="text-lg font-semibold mb-3 text-gray-900">
              Confirm Payment
            </Dialog.Title>
            <p className="text-gray-700 mb-4">
              Are you sure you want to make a{" "}
              <span className="font-semibold">
                {isHalfPayment ? "Half" : "Full"}
              </span>{" "}
              payment for{" "}
              <span className="font-semibold text-blue-700">
                {selectedCourse?.title}
              </span>
              ?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={confirmPayment}
                className="px-4 py-2 text-sm bg-blue-700 hover:bg-blue-800 text-white rounded-md"
              >
                Confirm & Pay
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
}
