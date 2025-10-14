import React, { useState } from 'react';
import { FaSearch, FaStar, FaCheck, FaLaptopCode, FaPalette, FaChartBar, FaBullhorn, FaUser } from 'react-icons/fa';
import Formeronetalentpool from '../components/TalentForm';
import Footer from '../components/Footer';
import Image from '../assets/images/Gemini_Generated_Image_5kqw6q5kqw6q5kqw.png'
const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Web Development');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 text-gray-900 relative overflow-hidden font-inter">
      <div className="mt-10">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 py-12 lg:py-20 flex flex-col lg:flex-row lg:items-center justify-between gap-12 relative z-10">
          
          {/* Left Content */} 

          <div className="w-full lg:w-1/2 flex flex-col gap-6 text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight">
              Welcome to Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-700">Talent Hub!</span>
            </h1>
            <p className="text-gray-600 text-lg max-w-md mx-auto lg:mx-0">
             This is your gateway to exciting career opportunities and professional connections
                         </p>

            {/* Search Bar */}
            <div className="bg-white rounded-xl shadow-lg p-3 flex flex-col sm:flex-row sm:items-center gap-3 w-full max-w-md mx-auto lg:mx-0">
              <div className="relative flex-1 flex items-center w-full">
                <FaSearch className="absolute left-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search job titles, skills, or companies"
                  className="w-full py-3 pl-10 pr-4 rounded-lg focus:outline-none text-gray-900 placeholder-gray-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select
                className="w-full sm:w-auto py-3 px-4 rounded-lg bg-gray-50 text-gray-700 focus:outline-none"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="Web Development">Web Development</option>
                <option value="Design">Design</option>
                <option value="Marketing">Marketing</option>
                <option value="Data Science">Data Science</option>
              </select>
              <button className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-4 py-3 rounded-lg hover:from-blue-700 hover:to-indigo-800 transition flex items-center justify-center gap-2">
                <FaSearch size={14} />
                Search
              </button>
            </div>

            {/* Popular Tags */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-2 text-sm text-gray-600 mt-2">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center gap-1">
                <FaPalette size={12} /> Designer
              </span>
              <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full flex items-center gap-1">
                <FaLaptopCode size={12} /> Web Developer
              </span>
              <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full flex items-center gap-1">
                <FaChartBar size={12} /> Software Engineer
              </span>
            </div>
          </div>

          {/* Right Image & Floating Cards */}
          <div className="w-full  lg:w-1/2 flex justify-center relative mt-9 lg:mt-0">
            {/* Main Cartoon Image */}
            <img 
              src={Image} 
              alt="Hero Cartoon" 
              className="w-96 lg:w-full max-w-md relative z-10 mt-10 rounded-xl"
            />

            {/* Floating Card Top Left */}
            <div className="absolute -top-6 -left-6 bg-white shadow-lg rounded-xl px-4 py-3 text-sm font-medium text-gray-800 flex items-center gap-2">
              <FaStar className="text-yellow-500" /> Top Rated
            </div>

            {/* Floating Card Bottom Left */}
            <div className="absolute bottom-6 -left-10 bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg rounded-xl px-5 py-3 text-sm font-semibold">
              50k+ Jobs
            </div>

            {/* Floating Card Top Right */}
            <div className="absolute -top-8 right-0 bg-white shadow-lg rounded-xl px-4 py-3 text-sm font-medium text-gray-800 flex items-center gap-2">
              <FaCheck className="text-green-500" /> Verified
            </div>
          </div>
        </section>

        {/* Categories & Reviews Section */}
        <section className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Categories */}
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Top Categories</h2>
            <ul className="space-y-4 text-gray-600">
              <li className="flex items-center gap-3 p-2 hover:bg-blue-50 rounded-lg transition">
                <div className="bg-blue-100 p-2 rounded-full">
                  <FaLaptopCode className="text-blue-600" />
                </div>
                Web Development
              </li>
              <li className="flex items-center gap-3 p-2 hover:bg-blue-50 rounded-lg transition">
                <div className="bg-indigo-100 p-2 rounded-full">
                  <FaPalette className="text-indigo-600" />
                </div>
                Design
              </li>
              <li className="flex items-center gap-3 p-2 hover:bg-blue-50 rounded-lg transition">
                <div className="bg-purple-100 p-2 rounded-full">
                  <FaBullhorn className="text-purple-600" />
                </div>
                Marketing
              </li>
              <li className="flex items-center gap-3 p-2 hover:bg-blue-50 rounded-lg transition">
                <div className="bg-green-100 p-2 rounded-full">
                  <FaChartBar className="text-green-600" />
                </div>
                Data Science
              </li>
            </ul>
          </div>

          {/* Reviews */}
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Customer Reviews</h2>
            <div className="flex items-center mb-4">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} className="text-yellow-400" />
              ))}
            </div>
            <p className="text-gray-600 italic">"This platform helped me land my dream job in just 2 weeks!"</p>
            <div className="flex items-center gap-3 mt-4">
              <div className="bg-indigo-100 p-2 rounded-full">
                <FaUser className="text-indigo-700" />
              </div>
              <span className="font-semibold text-indigo-700">– Happy User</span>
            </div>
          </div>
        </section>
      </div>
      <Formeronetalentpool />
      <Footer/>
    </div>
  );
};

export default App;
