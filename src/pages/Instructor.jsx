import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaUsers,
  FaBook,
  FaCalendarAlt,
  FaGraduationCap,
} from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { Link } from "react-router-dom";

export default function Instructor() {
  const [CoursesCount ,setCoursesCount]=useState(0);
  const [userCount, setUserCount] = useState(0);

  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/users`);
        setUserCount(res.data.users.length);
      } catch (err) {
        console.error("Error fetching user count:", err);
      }
    };

    fetchUserCount();
  }, []);
useEffect(()=>{
const FetchCourseEnroll =async()=>{
  const coursesRes = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/courses/count`);
        setCoursesCount(coursesRes.data.total);
}
FetchCourseEnroll();
})
  const chartData = [
    { name: "Active Users", value: userCount },
    { name: "Courses Enrolled", value: CoursesCount },
    { name: "Upcoming Events", value: 0 },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-gray-800 text-white p-4">
        <h2 className="text-xl font-bold mb-6 flex items-center">
          <FaGraduationCap className="mr-2" /> Instructor Portal
        </h2>
        <nav>
          <ul className="space-y-3">
            <Link  to="/user-table">
            <li className="flex items-center p-2 hover:bg-gray-700 rounded cursor-pointer">
              <FaUsers className="mr-3" /> Registered Candidates
            </li></Link>
            <Link to="/course-list">
            <li className="flex items-center p-2 hover:bg-gray-700 rounded cursor-pointer">
              <FaBook className="mr-3" /> Class Courses
            </li></Link>
            
            <Link to="/calender">
            <li className="flex items-center p-2 hover:bg-gray-700 rounded cursor-pointer">
              <FaCalendarAlt className="mr-3" /> Calendar
            </li></Link>
          
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-8">Instructor Dashboard</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-orange-400 rounded-xl shadow-lg p-6 text-white">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold mb-2">Active Users</h2>
                <p className="text-3xl font-bold">{userCount.toLocaleString()}</p>
              </div>
              <FaUsers className="text-4xl opacity-70" />
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl shadow-lg p-6 text-white">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold mb-2">Courses Enrolled</h2>
                <p className="text-3xl font-bold">{CoursesCount.toLocaleString()}</p>
              </div>
              <FaBook className="text-4xl opacity-70" />
            </div>
          </div>

          <div className="bg-blue-500 rounded-xl shadow-lg p-6 text-white">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold mb-2">Upcoming Events</h2>
                <p className="text-3xl font-bold">0</p>
              </div>
              <FaCalendarAlt className="text-4xl opacity-70" />
            </div>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="bg-white rounded-xl p-6 shadow-md w-full max-w-4xl">
          <h2 className="text-xl font-bold mb-4">Platform Overview</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
