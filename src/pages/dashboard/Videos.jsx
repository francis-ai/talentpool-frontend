import React, { useEffect, useState, useContext, useCallback } from "react";
import { AuthContext } from "../../context/AuthContext";
import { FiVideo, FiLock } from "react-icons/fi";
import { Box } from "@mui/material";
import { Link } from "react-router-dom";

export default function UserLessonsPage() {
  const { axiosInstance, user } = useContext(AuthContext);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLessons = useCallback(async () => {
    if (!user?.email) return;

    try {
      setLoading(true);
      const res = await axiosInstance.get(`/subscription/user-lessons?email=${user.email}`);
      // ensure lessons is always an array
      setLessons(res.data.lessons || []);
    } catch (err) {
      console.error("Error fetching lessons:", err);
      setLessons([]); // fallback to empty array
    } finally {
      setLoading(false);
    }
  }, [axiosInstance, user]);

  useEffect(() => {
    fetchLessons();
  }, [fetchLessons]);

  if (loading) return <p className="text-center mt-12">Loading lessons...</p>;

  return (
    <Box className="pt-24"> {/* Padding top to avoid navbar overlap */}
      <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">All Videos</h1>

        {lessons.length === 0 ? (
          <p className="text-center text-gray-600">No lessons available at the moment.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {lessons.map((lesson) => (
              <div
                key={lesson.id}
                className={`p-6 rounded-2xl shadow-lg transition transform hover:scale-105 ${
                  lesson.access ? "bg-white" : "bg-gray-200/70"
                }`}
              >
                <h2 className="text-xl font-bold mb-2">{lesson.title}</h2>
                <p className="text-gray-600 mb-4">Module {lesson.module_id}</p>

                {lesson.access ? (
                  <>
                    <video
                      src={lesson.video_url}
                      controls
                      className="w-full rounded-lg mb-4 shadow-md"
                    />
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition cursor-pointer">
                      <FiVideo /> Watch Video
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center text-gray-700">
                    <FiLock className="text-4xl mb-2" />
                    <p className="mb-4">Subscribe to unlock</p>
                    <Link
                      to="/subscription"
                      className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full hover:from-blue-700 hover:to-indigo-700 transition"
                    >
                      Subscribe Now
                    </Link>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Box>
  );
}
