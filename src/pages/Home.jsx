import React from "react";
import { FaFire, FaArrowRight } from "react-icons/fa";
import { motion } from "framer-motion";
import Homeafeatured from "../components/Fatured";
import UKEducationPage from "../components/CourseList";
import SuccessStories from "../components/SuccessStories";
import Footer from "../components/Footer";
import { Link, useNavigate } from "react-router-dom";

// ====== Images ======
import cooperateOne from "../assets/images/cooperateOne.jpg";
import cooperateThree from "../assets/images/cooperateThree.jpeg";
import cyberSecurityTwo from "../assets/images/cyberxecuritytwo.webp";
import imageOfPeople from "../assets/images/ImageOfpeople.jpg";
import fullstackdev from "../assets/images/fullstackdev.jpg";
import mobileEngineer from "../assets/images/mobileEnginere.jpeg";
import databaseAdmin from "../assets/images/DatabaseAdmin.jpeg";
import dataAnalysis from "../assets/images/Data-analysis-career-in-abuja-nigeria.jpg";

export default function HomePage() {
  const navigate = useNavigate();
  const avatars = [cooperateOne, cooperateThree, cyberSecurityTwo];

  return (
    <>
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-15"
          style={{ backgroundImage: `url(${imageOfPeople})` }}
        ></div>

        {/* Pattern Overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB...')]"></div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center py-16 px-6 max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold max-w-4xl leading-tight md:leading-snug mb-6">
            <span className="text-gray-900">Talent</span>{" "}
            <span className="text-blue-800 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Pool Africa
            </span>
            <div className="mt-2 text-2xl md:text-4xl font-semibold text-gray-800">
              Join the Future of Tech: Build, Innovate & Become.
            </div>
          </h1>

          <p className="mt-4 text-xl text-gray-700 max-w-3xl leading-relaxed mb-8">
            Dive into a world of opportunities where you can enhance your skills,
            collaborate with innovators, and take your career to new heights.{" "}
            <span className="text-blue-700 font-semibold">
              Become a Global Star!
            </span>
          </p>

          {/* Avatars Section */}
          <div className="flex flex-col sm:flex-row items-center justify-center mt-6 space-y-4 sm:space-y-0 sm:space-x-4 bg-white/80 backdrop-blur-sm py-4 px-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="flex -space-x-3">
                {avatars.map((avatar, index) => (
                  <img
                    key={index}
                    className="w-12 h-12 rounded-full border-2 border-white shadow-sm"
                    src={avatar}
                    alt={`Talent ${index + 1}`}
                    onError={(e) => {
                      e.target.src = `https://i.pravatar.cc/150?img=${index + 5}`;
                    }}
                  />
                ))}
              </div>
              <div className="ml-4 flex items-center text-sm text-gray-800 font-medium bg-orange-50 py-1 px-3 rounded-full">
                <FaFire className="text-orange-500 mr-1" />
                <span className="hidden sm:inline ml-1">Hot talents </span>
                ready to work
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-5">
            <Link to="/talents">
              <button className="group bg-blue-800 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center">
                <span>Join as Talent</span>
                <FaArrowRight className="ml-2 transform group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <Link to="/internship">
              <button className="group border-2 border-blue-800 text-blue-800 hover:bg-blue-800 hover:text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300">
                Hire Talent
              </button>
            </Link>
          </div>
        </div>
      </div>

       {/* Circular Skills Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.6 }}
        className="relative w-full h-[600px] md:h-[700px] flex items-center justify-center bg-white overflow-hidden"
      >
        <svg
          viewBox="0 0 400 400"
          className="absolute w-[80%] h-[80%] md:w-[400px] md:h-[400px] z-0 max-w-[400px] max-h-[400px]"
        >
          <defs>
            <marker
              id="arrow"
              markerWidth="10"
              markerHeight="10"
              refX="5"
              refY="5"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#a9dce3" />
            </marker>
          </defs>
          <circle
            cx="200"
            cy="200"
            r="190"
            stroke="#a9dce3"
            strokeWidth="3"
            fill="none"
            className="moving-dash"
            markerEnd="url(#arrow)"
          />
          <circle cx="200" cy="10" r="8" fill="blue" />
          <circle cx="200" cy="390" r="8" fill="pink" />
          <circle cx="10" cy="200" r="8" fill="pink" />
        </svg>

        <div className="relative w-[80%] h-[80%] md:w-[480px] md:h-[480px] max-w-[480px] max-h-[480px]">
          {/* Top - Fullstack */}
          <div
            onClick={() => navigate("/course-list")}
            className="absolute top-0 left-1/2 transform -translate-x-1/2 text-center flex flex-col items-center cursor-pointer group"
          >
            <p className="font-semibold text-sm md:text-base mb-2 group-hover:text-blue-600 transition-colors">
              Full Stack Development
            </p>
            <img
              src={fullstackdev}
              alt="Software Dev"
              className="w-16 h-16 md:w-24 md:h-24 rounded-full border-4 border-blue-400 mx-auto transition-transform group-hover:scale-110"
            />
            <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs md:text-sm mt-2">
              NodeJS
            </span>
          </div>

          {/* Right - Mobile */}
          <div
            onClick={() => navigate("/course-list")}
            className="absolute top-1/2 right-0 transform translate-x-[calc(50%-0.8rem)] -translate-y-1/2 text-center flex flex-col items-center cursor-pointer group"
          >
            <p className="font-semibold text-sm md:text-base mb-2 mr-8 group-hover:text-yellow-600 transition-colors">
              Mobile Engineer
            </p>
            <img
              src={mobileEngineer}
              alt="Mobile Engineer"
              className="w-16 h-16 md:w-24 md:h-24 rounded-full border-4 border-yellow-400 mx-auto transition-transform group-hover:scale-110"
            />
            <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full text-xs md:text-sm mt-2">
              Flutter
            </span>
          </div>

          {/* Bottom - SQL */}
          <div
            onClick={() => navigate("/course-list")}
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-center flex flex-col items-center cursor-pointer group"
          >
            <p className="font-semibold text-sm md:text-base mb-2 group-hover:text-pink-600 transition-colors">
              SQL
            </p>
            <img
              src={databaseAdmin}
              alt="Database SQL"
              className="w-16 h-16 md:w-24 md:h-24 rounded-full border-4 border-pink-500 mx-auto transition-transform group-hover:scale-110"
            />
            <span className="bg-pink-100 text-pink-700 px-2 py-0.5 rounded-full text-xs md:text-sm mt-2">
              Database SQL
            </span>
          </div>

          {/* Left - Data Analysis */}
          <div
            onClick={() => navigate("/course-list")}
            className="absolute top-1/2 left-0 transform -translate-x-[calc(50%-0.8rem)] -translate-y-1/2 text-center flex flex-col items-center cursor-pointer group"
          >
            <p className="font-semibold text-sm md:text-base mb-2 group-hover:text-green-600 transition-colors">
              Data Analysis
            </p>
            <img
              src={dataAnalysis}
              alt="Data Analysis"
              className="w-16 h-16 md:w-24 md:h-24 rounded-full border-4 border-green-500 mx-auto transition-transform group-hover:scale-110"
            />
            <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs md:text-sm mt-2">
              Python
            </span>
          </div>
        </div>
      </motion.div>

      <Homeafeatured />
      <div className="mt-12 px-4 md:px-12">
        <UKEducationPage />
      </div>
      <SuccessStories />
      <Footer />
    </>
  );
}
