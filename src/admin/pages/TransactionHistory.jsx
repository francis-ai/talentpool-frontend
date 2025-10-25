import { useEffect, useState, useContext, useCallback} from "react";
import { AuthContext } from "../../context/AuthContext"; // adjust path if needed
// import axios from "axios";

// Icons
const MoneyIcon = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"/>
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd"/>
  </svg>
);

const EmailIcon = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
  </svg>
);

const CourseIcon = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
  </svg>
);

const PaidIcon = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
  </svg>
);

const PartialIcon = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
  </svg>
);

// Loading skeleton
const LoadingSkeleton = () => (
  <div className="space-y-4 mt-[90px]">
    {[1, 2, 3].map((i) => (
      <div key={i} className="bg-white rounded-xl shadow p-4 animate-pulse">
        <div className="flex flex-col gap-2">
          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
          <div className="h-6 bg-gray-200 rounded w-1/2"></div>
          <div className="h-6 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    ))}
  </div>
);

// Alerts
const ErrorAlert = ({ error, onRetry }) => (
  <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded mb-4 flex flex-col sm:flex-row justify-between items-center gap-2 mt-[90px]">
    <p className="text-red-700 font-medium">{error}</p>
    <button onClick={onRetry} className="bg-red-100 hover:bg-red-200 text-red-800 px-4 py-2 rounded transition">
      Retry
    </button>
  </div>
);

const InfoAlert = ({ message }) => (
  <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded mb-4 mt-[50px]">
    <p className="text-blue-800">{message}</p>
  </div>
);

// Payment user item
const PaymentUserItem = ({ user }) => (
  <li className="bg-white shadow rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:shadow-lg transition">
    <div className="flex flex-col sm:flex-row flex-1 gap-2">
      <div className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm truncate">
        <EmailIcon className="w-4 h-4" /> {user.user_email}
      </div>
      <div className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm truncate">
        <MoneyIcon className="w-4 h-4" /> ₦{user.amount_paid.toLocaleString()}
      </div>
      <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm truncate ${user.paid ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
        {user.paid ? <PaidIcon className="w-4 h-4" /> : <PartialIcon className="w-4 h-4" />}
        {user.paid ? "Fully Paid" : "Partially Paid"}
      </div>
    </div>
    <div className="flex items-center gap-1 mt-2 sm:mt-0 text-gray-600 flex-shrink-0">
      <CourseIcon className="w-4 h-4" /> {user.course_title}
    </div>
  </li>
);

// Main Component
export default function PaidList() {
  const { axiosInstance, user } = useContext(AuthContext);
  const [paidUsers, setPaidUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPaidUsers = useCallback(async () => {
    if (!user) {
      setError("You must be logged in to view paid users.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await axiosInstance.get("/payment/paid-list");
      setPaidUsers(res.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to fetch paid users");
    } finally {
      setLoading(false);
    }
  }, [user, axiosInstance]); // <-- dependencies

  useEffect(() => {
    fetchPaidUsers();
  }, [fetchPaidUsers]); // <-- now safe to include

  const handleRetry = () => fetchPaidUsers();

  return (
    <div className="min-h-screen mt-0 bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-2xl shadow p-6 mt-[90px]">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-center mb-6 gap-4 border-b pb-4 mt-[90px]">
            <div className="bg-blue-100 p-3 rounded-full">
              <MoneyIcon className="w-8 h-8 text-blue-600" />
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Paid Users</h1>
              <p className="text-gray-600 mt-1 text-sm sm:text-base">All users who have made payments</p>
            </div>
          </div>

          {/* Alerts */}
          {error && <ErrorAlert error={error} onRetry={handleRetry} />}
          {!loading && paidUsers.length === 0 && <InfoAlert message="No paid users found." />}

          {/* Records header */}
          {!loading && paidUsers.length > 0 && (
            <div className="mb-4 flex justify-between items-center mt-[90px]">
              <h2 className="font-semibold text-gray-700">Payment Records</h2>
              <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                {paidUsers.length} {paidUsers.length === 1 ? "record" : "records"}
              </span>
            </div>
          )}

          {/* List */}
          {loading ? <LoadingSkeleton /> :
            paidUsers.length > 0 && (
              <ul className="space-y-3 mt-[90px]">
                {paidUsers.map(user => <PaymentUserItem key={user.id} user={user} />)}
              </ul>
            )
          }

          {/* Footer */}
          {!loading && paidUsers.length > 0 && (
            <div className="mt-6 pt-4 border-t text-center text-gray-500 text-sm mt-[90px]">
              Showing {paidUsers.length} paid user{paidUsers.length !== 1 ? "s" : ""}
            </div>
          )}
        </div>

        <div className="mt-6 text-center text-gray-500 text-xs mt-[90px]">
          © {new Date().getFullYear()} Payment System. All rights reserved.
        </div>
      </div>
    </div>
  );
}
