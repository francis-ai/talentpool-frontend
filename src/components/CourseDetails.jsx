import React from "react";
import { useParams, Link } from "react-router-dom";
import {
  FaClock,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaArrowLeft,
  FaCheckCircle,
  FaStar,
  FaUsers,
  FaCertificate,
} from "react-icons/fa";
import CoursesData from "../data/CourseData";

const CourseDetail = () => {
  const { id } = useParams();
  const course = CoursesData.find((c) => c.id === id);

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Course Not Found</h2>
          <p className="text-gray-600 mb-6">
            The course you're looking for doesn't exist.
          </p>
          <Link
            to="/courses"
            className="inline-flex items-center bg-blue-900 text-white px-6 py-3 rounded-lg hover:bg-blue-800 transition-all"
          >
            <FaArrowLeft className="mr-2" /> Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  // ✅ No need to process image paths manually — they're imported directly
  const courseImage = course.image;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mt-14">
        <div className="max-w-6xl mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="flex mb-8" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-sm text-gray-600">
              <li>
                <Link to="/" className="hover:text-blue-900 transition-colors">
                  Home
                </Link>
              </li>

              <li className="flex items-center">
                <span className="mx-2">/</span>
                <span className="text-blue-900 font-medium">{course.title}</span>
              </li>
            </ol>
          </nav>

          <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
            {/* ✅ Course Image */}
            {courseImage && (
              <div className="h-80 w-full overflow-hidden relative">
                <img
                  src={courseImage}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-blue-900 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {course.category}
                </div>
              </div>
            )}

            {/* ✅ Course Content */}
            <div className="p-8">
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Left: Main Content */}
                <div className="lg:w-2/3">
                  <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">
                    {course.title}
                  </h1>

                  {/* Rating & Enrollment */}
                  <div className="flex flex-wrap items-center gap-4 mb-6">
                    <div className="flex items-center">
                      <div className="flex text-yellow-400 mr-1">
                        <FaStar />
                        <FaStar />
                        <FaStar />
                        <FaStar />
                        <FaStar className="text-gray-300" />
                      </div>
                      <span className="text-gray-600 ml-1">
                        {course.rating} (124 reviews)
                      </span>
                    </div>

                    <div className="flex items-center text-gray-600">
                      <FaUsers className="mr-2" />
                      <span>256 students enrolled</span>
                    </div>

                    <div className="flex items-center text-gray-600">
                      <FaCertificate className="mr-2 text-blue-900" />
                      <span>Certificate of Completion</span>
                    </div>
                  </div>

                  <p className="text-gray-700 text-lg mb-8 leading-relaxed">
                    {course.description}
                  </p>

                  {/* ✅ Learning Outcomes */}
                  {course.outcomes && (
                    <div className="mb-8">
                      <h3 className="text-2xl font-semibold text-blue-900 mb-4 pb-2 border-b border-gray-200">
                        What You'll Learn
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {course.outcomes.map((outcome, index) => (
                          <div key={index} className="flex items-start">
                            <FaCheckCircle className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                            <span className="text-gray-700">{outcome}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right: Sidebar */}
                <div className="lg:w-1/3">
                  <div className="bg-blue-50 rounded-xl p-6 sticky top-6">
                    <h3 className="text-xl font-bold text-blue-900 mb-4">
                      Course Details
                    </h3>

                    <div className="space-y-4">
                      <div className="flex items-center">
                        <FaClock className="text-blue-900 mr-3" />
                        <div>
                          <p className="text-sm text-gray-600">Duration</p>
                          <p className="font-medium">{course.duration}</p>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <FaMapMarkerAlt className="text-blue-900 mr-3" />
                        <div>
                          <p className="text-sm text-gray-600">Location</p>
                          <p className="font-medium">{course.location}</p>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <FaMoneyBillWave className="text-blue-900 mr-3" />
                        <div>
                          <p className="text-sm text-gray-600">Tuition</p>
                          <p className="font-medium text-lg text-blue-900">
                            {course.tuition}
                          </p>
                        </div>
                      </div>
                    </div>

                    <button className="w-full bg-blue-900 text-white py-3 rounded-lg font-semibold mt-6 hover:bg-blue-800 transition-all">
                      <Link to="/register">Enroll Now</Link>
                    </button>

                    <div className="mt-4 text-center">
                      <p className="text-sm text-gray-600">
                        30-day money-back guarantee
                      </p>
                    </div>
                    

                    <Link
                      to="/"
                      className="inline-flex items-center justify-center w-full mt-4 text-blue-900 hover:text-blue-800 transition-colors"
                    >
                      <FaArrowLeft className="mr-2" /> Back to Home
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>  
    </div>
  );
};

export default CourseDetail;
