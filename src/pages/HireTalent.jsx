import React, { useState, useEffect, useMemo } from "react";
import Registration from "../components/HireTalent";

// ✅ Enhanced Animated Counter Component
const AnimatedCounter = ({ target, duration = 2000 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let current = 0;
    const increment = target / (duration / 16);
    const easeOutQuad = (t) => t * (2 - t);

    const timer = setInterval(() => {
      current += increment;
      const progress = Math.min(current / target, 1);
      setCount(Math.ceil(target * easeOutQuad(progress)));

      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [target, duration]);

  return <span className="font-medium">{count.toLocaleString()}+</span>;
};

export default function RegistrationForm() {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("All Categories");

  // ✅ useMemo so this array isn't recreated on each render
  const categories = useMemo(
    () => [
      "All Categories",
      "Development",
      "Design",
      "Data Science",
      "Marketing",
      "Business",
      "Writing",
    ],
    []
  );

  const handleSearch = (e) => {
    e.preventDefault();
    console.log(`Searching for "${searchTerm}" in "${category}"`);
  };

  return (
    <>
      {/* 🌟 Enhanced Hero Section */}
      <section
        style={{
          backgroundImage: "url('/Worknnn.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        className="relative flex flex-col items-center px-6 py-16 md:py-20"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-white/95 to-white/90 backdrop-blur-xs"></div>

        <div className="relative w-full max-w-3xl text-center space-y-5">
          <h1 className="font-bold text-4xl md:text-5xl text-gray-900 leading-tight">
            Hire Top <span className="text-blue-600">Talent</span> from Nigeria
          </h1>
          <p className="text-gray-700 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Discover and connect with highly skilled professionals across various industries.
          </p>

          {/* ✅ Trust Metrics */}
          <div className="mt-10 flex flex-col md:flex-row gap-4 justify-center text-base">
            <Metric iconColor="text-green-500">
              <AnimatedCounter target={5000} /> Companies Trust Us
            </Metric>
            <Metric iconColor="text-green-500">
              <AnimatedCounter target={15000} duration={2500} /> Successful Hires
            </Metric>
          </div>
        </div>

        {/* 🔍 Search Form */}
        <div className="relative w-full max-w-xl mt-12">
          <form
            onSubmit={handleSearch}
            className="bg-white rounded-xl shadow-xl p-6 flex flex-col gap-4 border border-gray-100"
          >
            {/* Search Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search skills, job titles..."
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Category Dropdown */}
            <div className="relative">
              <select
                className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>

            {/* Search Button */}
            <button
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-3 px-6 rounded-lg shadow-md transition-colors"
            >
              Find Talent
            </button>
          </form>
        </div>
      </section>

      {/* 📌 Registration Component */}
      <Registration />
    </>
  );
}

// ✅ Metric Component
const Metric = ({ children, iconColor }) => (
  <div className="flex items-center bg-white/80 backdrop-blur-sm px-4 py-2 rounded-lg shadow-sm border border-gray-100">
    <svg
      className={`w-5 h-5 ${iconColor} mr-2`}
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
        clipRule="evenodd"
      />
    </svg>
    <span className="text-gray-700 font-medium">{children}</span>
  </div>
);
