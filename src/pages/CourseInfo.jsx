import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiBookOpen, FiPlay } from "react-icons/fi";
import { BsCheckCircleFill } from "react-icons/bs";
import { RiVideoLine } from "react-icons/ri";
import { AuthContext } from "../context/AuthContext";

export default function CourseDetail() {
  const { id } = useParams();
  const { axiosInstance, user } = useContext(AuthContext);
  const [course, setCourse] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);
  const [progress, setProgress] = useState({});
  const [expandedModules, setExpandedModules] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    const fetchCourse = async () => {
      try {
        const res = await axiosInstance.get(`/course/${id}/content`);
        setCourse(res.data);
        setActiveLesson(res.data.modules[0]?.lessons[0] || null);
      } catch (err) {
        console.error("❌ Failed to fetch course:", err.response?.data || err.message);
        if (err.response?.status === 401) navigate("/login");
      }
    };
    fetchCourse();
  }, [id, axiosInstance, user, navigate]);

  const markAsComplete = (lessonId) => {
    setProgress((prev) => ({ ...prev, [lessonId]: !prev[lessonId] }));
  };

  const toggleModule = (moduleId) => {
    setExpandedModules((prev) => ({ ...prev, [moduleId]: !prev[moduleId] }));
  };

  const renderVideoPlayer = (lesson) => {
    if (!lesson?.video_url) {
      return (
        <div className="w-full aspect-video bg-gray-800 flex items-center justify-center">
          <FiPlay className="text-white text-4xl" />
        </div>
      );
    }
    const videoUrl = lesson.video_url.trim();
    const BASE_URL = process.env.REACT_APP_API_BASE_URL;
    if (videoUrl.endsWith(".mp4")) return <video controls className="w-full aspect-video" src={`${BASE_URL}${videoUrl}`} />;
    if (videoUrl.includes("youtu.be/")) {
      const videoId = videoUrl.split("youtu.be/")[1].split("?")[0];
      return <iframe title={lesson.title} src={`https://www.youtube.com/embed/${videoId}`} className="w-full aspect-video" allowFullScreen />;
    }
    if (videoUrl.includes("youtube.com/watch?v=")) {
      const videoId = new URL(videoUrl).searchParams.get("v");
      return <iframe title={lesson.title} src={`https://www.youtube.com/embed/${videoId}`} className="w-full aspect-video" allowFullScreen />;
    }
    return <iframe title={lesson.title} src={videoUrl} className="w-full aspect-video" allowFullScreen />;
  };

  if (!user || !course) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button onClick={() => navigate("/courses")} className="flex items-center text-gray-600 hover:text-gray-800 mb-8">
        <FiArrowLeft className="mr-2" /> Back to Courses
      </button>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3">
          <h1 className="text-2xl font-bold mb-4">{course.title}</h1>
          <p className="text-gray-600 mb-6">{course.description}</p>
          <div className="bg-gray-900 rounded-md overflow-hidden shadow mb-8">{renderVideoPlayer(activeLesson)}</div>
          {activeLesson && (
            <div className="bg-white border border-gray-200 rounded-md p-6 mb-8">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <RiVideoLine className="mr-2 text-blue-700" />
                {activeLesson.title}
              </h2>
              <button
                onClick={() => markAsComplete(activeLesson.id)}
                className={`flex items-center px-4 py-2 rounded-md text-sm ${
                  progress[activeLesson.id]
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100"
                }`}
              >
                <BsCheckCircleFill className={`mr-2 ${progress[activeLesson.id] ? "text-green-500" : "text-gray-400"}`} />
                {progress[activeLesson.id] ? "Completed" : "Mark Complete"}
              </button>
            </div>
          )}
        </div>

        <div className="lg:w-1/3">
          <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
            <div className="p-4 bg-gray-50 border-b border-gray-200">
              <h3 className="font-medium flex items-center">
                <FiBookOpen className="mr-2 text-blue-700" /> Course Content
              </h3>
            </div>
            {course.modules.map((module, index) => (
              <div key={module.id} className="border-b border-gray-200">
                <div className="p-4 flex justify-between">
                  <span>{module.title}</span>
                  <button
                    onClick={() => toggleModule(module.id)}
                    className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded"
                  >
                    {expandedModules[module.id] ? "Hide" : "Show"}
                  </button>
                </div>
                {expandedModules[module.id] && (
                  <ul className="pl-4">
                    {module.lessons.map((lesson, i) => (
                      <li key={lesson.id}>
                        <button
                          onClick={() => setActiveLesson(lesson)}
                          className={`w-full text-left px-4 py-2 ${
                            activeLesson?.id === lesson.id ? "bg-blue-50 text-blue-700" : "hover:bg-gray-50"
                          }`}
                        >
                          {progress[lesson.id] ? (
                            <BsCheckCircleFill className="text-green-500 mr-2 inline" />
                          ) : (
                            <span className="text-gray-400 mr-2">{i + 1}</span>
                          )}
                          {lesson.title}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
