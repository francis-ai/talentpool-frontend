import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext"; // Adjust path as needed

export default function AdminCourseUpload() {
  const [selectedCourse, setSelectedCourse] = useState("");
  const [modules, setModules] = useState([
    { title: "", lessons: [{ title: "", video_url: "" }], open: true }
  ]);
  const [courseOptions, setCourseOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const { axiosInstance } = useContext(AuthContext);

  // Fetch courses from backend
  useEffect(() => {
    const fetchCourses = async () => {
        try {
        const res = await axiosInstance.get("/courses");
        setCourseOptions(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
        console.error("Failed to fetch courses:", err);
        setCourseOptions([]);
        }
    };
    fetchCourses();
  }, [axiosInstance]); // ✅ include axiosInstance as dependency


  const handleCourseChange = (e) => setSelectedCourse(e.target.value);

  const handleModuleChange = (index, value) => {
    const newModules = [...modules];
    newModules[index].title = value;
    setModules(newModules);
  };

  const handleLessonChange = (modIndex, lessonIndex, field, value) => {
    const newModules = [...modules];
    newModules[modIndex].lessons[lessonIndex][field] = value;
    setModules(newModules);
  };

  const addModule = () =>
    setModules([...modules, { title: "", lessons: [{ title: "", video_url: "" }], open: true }]);

  const toggleModule = (index) => {
    const newModules = [...modules];
    newModules[index].open = !newModules[index].open;
    setModules(newModules);
  };

  const addLesson = (index) => {
    const newModules = [...modules];
    newModules[index].lessons.push({ title: "", video_url: "" });
    setModules(newModules);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCourse) return alert("Please select a course.");

    setLoading(true);
    try {
      // Find course ID from title
      const course = courseOptions.find((c) => c.title === selectedCourse);
      if (!course) throw new Error("Selected course not found.");

      const createdModules = [];

      // Create modules and lessons sequentially
      for (let mod of modules) {
        const modRes = await axiosInstance.post("/modules", {
          course_id: course.id,
          title: mod.title,
        });
        const moduleId = modRes.data.moduleId;
        createdModules.push({ ...mod, id: moduleId });

        // Create lessons for this module
        for (let lesson of mod.lessons) {
          await axiosInstance.post("/lessons", {
            module_id: moduleId,
            title: lesson.title,
            video_url: lesson.video_url,
          });
        }
      }

      alert(`✅ Modules and lessons uploaded successfully for "${course.title}"!`);

      // Reset form
      setSelectedCourse("");
      setModules([{ title: "", lessons: [{ title: "", video_url: "" }], open: true }]);
    } catch (err) {
      console.error("Upload Error:", err.response || err);
      alert("❌ Failed to upload modules/lessons. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 bg-white shadow-lg rounded-lg mt-4 md:mt-8">
      <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-gray-800">Upload Modules & Lessons</h2>
      <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
        {/* Select Course */}
        <div className="space-y-2 md:space-y-3">
          <select
            value={selectedCourse}
            onChange={handleCourseChange}
            required
            className="w-full border px-3 md:px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <option value="">Select Course</option>
            {courseOptions.map((c) => (
              <option key={c.id || c._id} value={c.title}>
                {c.title}
              </option>
            ))}
          </select>
        </div>

        <hr className="my-4 md:my-6" />

        {/* Modules & Lessons */}
        {modules.map((mod, modIndex) => (
          <div key={modIndex} className="border rounded-md p-3 md:p-4 mb-3 md:mb-4 bg-gray-50">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2 gap-2">
              <input
                type="text"
                placeholder={`Module ${modIndex + 1} Title`}
                value={mod.title}
                onChange={(e) => handleModuleChange(modIndex, e.target.value)}
                required
                className="flex-1 border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <button
                type="button"
                onClick={() => toggleModule(modIndex)}
                className="px-3 py-1 bg-indigo-500 text-white rounded hover:bg-indigo-600 text-sm md:text-base"
              >
                {mod.open ? "Collapse" : "Expand"}
              </button>
            </div>

            {mod.open && (
              <div className="pl-2 md:pl-4 space-y-2 md:space-y-3 mt-2">
                {mod.lessons.map((lesson, lessonIndex) => (
                  <div
                    key={lessonIndex}
                    className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-2"
                  >
                    <input
                      type="text"
                      placeholder={`Lesson ${lessonIndex + 1} Title`}
                      value={lesson.title}
                      onChange={(e) =>
                        handleLessonChange(modIndex, lessonIndex, "title", e.target.value)
                      }
                      required
                      className="flex-1 border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                    <input
                      type="url"
                      placeholder="Video URL"
                      value={lesson.video_url}
                      onChange={(e) =>
                        handleLessonChange(modIndex, lessonIndex, "video_url", e.target.value)
                      }
                      required
                      className="flex-1 border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 mt-2 md:mt-0"
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addLesson(modIndex)}
                  className="mt-2 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm md:text-base"
                >
                  Add Lesson
                </button>
              </div>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={addModule}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm md:text-base"
        >
          Add Module
        </button>

        <div className="mt-4 md:mt-6">
          <button
            type="submit"
            disabled={loading}
            className={`w-full px-4 py-2 md:py-3 rounded-md font-semibold text-sm md:text-base ${
              loading
                ? "bg-gray-400 cursor-not-allowed text-white"
                : "bg-indigo-600 hover:bg-indigo-700 text-white"
            }`}
          >
            {loading ? "Uploading..." : "Upload Modules & Lessons"}
          </button>
        </div>
      </form>
    </div>
  );
}