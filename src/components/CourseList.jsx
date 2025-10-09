// src/pages/UKEducationPage.jsx
import React from "react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { Link } from "react-router-dom";
import CoursesData from "../data/CourseData"; // ✅ adjust path if needed

const UKEducationPage = () => {
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} className="text-yellow-400" />);
    }
    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" className="text-yellow-400" />);
    }
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} className="text-yellow-400" />);
    }
    return stars;
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <section className="py-16 md:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">
            Featured Courses
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-base md:text-lg">
            Check out our most in-demand courses to take your career to the next
            level.
          </p>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.isArray(CoursesData) && CoursesData.length > 0 ? (
            CoursesData.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 group flex flex-col h-full"
              >
                {/* ✅ Use ONLY courseData image */}
                {course.image && (
                  <div className="h-48 md:h-52 overflow-hidden relative">
                    <img
                      src={
                        course.image.startsWith("http")
                          ? course.image // external link
                          : `/${course.image}` // local image in public/images
                      }
                      alt={course.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="inline-block bg-blue-900 text-white text-xs px-3 py-1.5 rounded-full font-medium">
                        {course.category || "Course"}
                      </span>
                    </div>
                  </div>
                )}

                {/* Card Content */}
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg md:text-xl font-bold text-blue-900">
                      {course.title}
                    </h3>
                    <div className="flex items-center">
                      <div className="flex mr-1">
                        {renderStars(course.rating || 5)}
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-4 text-sm md:text-base flex-1 line-clamp-3">
                    {course.description}
                  </p>

                  <Link
                    to={`/courses/${course.id}`}
                    className="mt-auto w-full bg-blue-900 text-white py-2.5 md:py-3 rounded-lg font-semibold hover:bg-blue-800 transition-all duration-300 text-center block"
                  >
                    Learn More
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-full">
              No courses available at the moment.
            </p>
          )}
        </div>
      </section>
    </div>
  );
};

export default UKEducationPage;
