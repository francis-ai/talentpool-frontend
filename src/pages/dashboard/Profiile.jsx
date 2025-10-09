import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, User, Mail, Shield, Edit3, Calendar, Clock } from "lucide-react";
import { AuthContext } from "../../context/AuthContext";

const Profile = () => {
  const { user, loading: authLoading, } = useContext(AuthContext);
  const [lastLogin, setLastLogin] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  console.log(setError);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchLastLogin = () => {
      const loginTime = localStorage.getItem("lastLogin");
      if (loginTime) setLastLogin(new Date(parseInt(loginTime)).toLocaleString());
    };

    if (!authLoading) {
      if (!user) {
        // If user is not logged in, redirect
        navigate("/login");
      } else {
        fetchLastLogin();
      }
      setLoading(false);
    }
  }, [authLoading, user, navigate]);

  const getRoleBadgeColor = (role) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return "bg-red-100 text-red-800";
      case "instructor":
        return "bg-blue-100 text-blue-800";
      case "student":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-gray-500">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto text-center text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Link to="/" className="flex items-center text-blue-600 hover:text-blue-800">
            <ArrowLeft size={20} className="mr-2" />
            Back to Dashboard
          </Link>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow overflow-hidden mt-14">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white">
            <div className="flex items-center">
              <div className="w-20 h-20 flex items-center justify-center rounded-full bg-white text-blue-600 text-3xl font-bold mr-4">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <div>
                <h2 className="text-2xl font-bold">{user?.name || "User"}</h2>
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mt-2 ${getRoleBadgeColor(user?.role)}`}>
                  <Shield size={14} className="mr-1" />
                  {user?.role || "Unknown Role"}
                </div>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Personal Information</h3>
                <div className="flex items-center">
                  <User size={18} className="text-gray-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="font-medium">{user?.name || "Not provided"}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Mail size={18} className="text-gray-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Email Address</p>
                    <p className="font-medium">{user?.email || "Not provided"}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Shield size={18} className="text-gray-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Account Type</p>
                    <p className="font-medium capitalize">{user?.role || "Not specified"}</p>
                  </div>
                </div>
              </div>

              {/* Account Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Account Information</h3>
                <div className="flex items-center">
                  <Calendar size={18} className="text-gray-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Member Since</p>
                    <p className="font-medium">
                      {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                    </p>
                  </div>
                </div>
                {lastLogin && (
                  <div className="flex items-center">
                    <Clock size={18} className="text-gray-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Last Login</p>
                      <p className="font-medium">{lastLogin}</p>
                    </div>
                  </div>
                )}
                <div className="pt-4">
                  <Link
                    to="/update-password"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <Edit3 size={16} className="mr-2" />
                    Update Password
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
