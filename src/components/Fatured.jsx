import React, { useState, useEffect } from "react";
import {
  FaUserGraduate,
  FaChalkboardTeacher,
  FaBriefcase,
  FaCogs,
  FaCertificate,
  FaChartLine,
  FaGlobe,
  FaArrowRight,
  FaArrowLeft
} from "react-icons/fa";
import { Link } from "react-router-dom";

export default function ProgramSteps() {
  const [activeStep, setActiveStep] = useState(0);
  const [direction, setDirection] = useState('right');

  console.log(direction);
  
  const steps = [
    {
      icon: <FaUserGraduate className="text-white text-2xl" />,
      title: "Register",
      desc: "Students register for the program and get access to the the community, mentors, physical classes, and online platform.",
      color: "from-blue-600 to-blue-800",
      details: "Complete our simple registration process with basic information and educational background."
    },
    {
      icon: <FaChalkboardTeacher className="text-white text-2xl" />,
      title: "Get Trained",
      desc: "Receive world-class training from experienced instructors.",
      color: "from-purple-600 to-purple-800",
      details: "Engage in interactive sessions, hands-on projects, and personalized feedback from industry experts."
    },
    {
      icon: <FaBriefcase className="text-white text-2xl" />,
      title: "Internship",
      desc: "Gain real-world experience through internships with top companies.",
      color: "from-emerald-600 to-emerald-800",
      details: "Apply your skills in real work environments with our partner companies across various industries."
    },
    {
      icon: <FaCogs className="text-white text-2xl" />,
      title: "Develop Products",
      desc: "Work on real projects and develop products to showcase your skills.",
      color: "from-amber-600 to-amber-800",
      details: "Collaborate with peers to build portfolio projects that solve real-world problems."
    },
    {
      icon: <FaCertificate className="text-white text-2xl" />,
      title: "Get Certified",
      desc: "Receive a certificate upon successful completion of the program.",
      color: "from-red-600 to-red-800",
      details: "Earn a recognized credential that validates your skills and knowledge to employers."
    },
    {
      icon: <FaChartLine className="text-white text-2xl" />,
      title: "Track Progress",
      desc: "Monitor your progress through the online platform.",
      color: "from-indigo-600 to-indigo-800",
      details: "Use our dashboard to track milestones, skill development, and receive personalized recommendations."
    },
    {
      icon: <FaGlobe className="text-white text-2xl" />,
      title: "International Certificate",
      desc: "International certificate in view, recognized globally.",
      color: "from-cyan-600 to-cyan-800",
      details: "Graduate with a globally recognized certification that opens doors to international opportunities."
    },
  ];

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setDirection('right');
      setActiveStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (activeStep > 0) {
      setDirection('left');
      setActiveStep(prev => prev - 1);
    }
  };

  // Auto-advance steps (optional)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (activeStep < steps.length - 1) {
        setDirection('right');
        setActiveStep(prev => prev + 1);
      }
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [activeStep, steps.length]);

  return (
    <section className="relative bg-gradient-to-b from-gray-50 to-white py-20 px-6 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-100 rounded-full -translate-x-1/2 -translate-y-1/2 opacity-50"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-100 rounded-full translate-x-1/3 translate-y-1/3 opacity-50"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Program <span className="text-blue-700">Overview</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A comprehensive journey from beginner to job-ready professional with global recognition
          </p>
        </div>

        {/* Progress indicator for mobile */}
        <div className="lg:hidden flex justify-center mb-8">
          <div className="bg-white rounded-full shadow-md px-6 py-2 flex items-center">
            <button 
              onClick={handlePrev}
              disabled={activeStep === 0}
              className="text-gray-500 disabled:opacity-30 transition-opacity"
              aria-label="Previous step"
            >
              <FaArrowLeft />
            </button>
            <span className="mx-4 text-sm font-medium">
              {activeStep + 1} / {steps.length}
            </span>
            <button 
              onClick={handleNext}
              disabled={activeStep === steps.length - 1}
              className="text-gray-500 disabled:opacity-30 transition-opacity"
              aria-label="Next step"
            >
              <FaArrowRight />
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row items-start gap-10">
          {/* Steps navigation for desktop */}
          <div className="hidden lg:flex flex-col space-y-4 w-full max-w-xs">
            {steps.map((step, index) => (
              <button
                key={index}
                onClick={() => {
                  setDirection(index > activeStep ? 'right' : 'left');
                  setActiveStep(index);
                }}
                className={`text-left p-5 rounded-xl transition-all duration-300 ${
                  activeStep === index 
                    ? "bg-white shadow-lg transform -translate-y-1 border-l-4 border-blue-600" 
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
                aria-current={activeStep === index ? "step" : "false"}
              >
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-r ${step.color} mr-4`}>
                    <span className="font-bold text-white">{index + 1}</span>
                  </div>
                  <h3 className="font-semibold text-gray-800">{step.title}</h3>
                </div>
              </button>
            ))}
          </div>

          {/* Active step content */}
          <div className="w-full bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-2 bg-gradient-to-r from-gray-50 to-gray-100">
              <div className={`h-1 w-full bg-gradient-to-r ${steps[activeStep].color} transition-all duration-500`}></div>
            </div>
            
            <div className="p-8">
              <div className="flex flex-col md:flex-row items-start gap-8">
                <div className={`w-20 h-20 rounded-2xl flex items-center justify-center bg-gradient-to-r ${steps[activeStep].color} shadow-md transition-all duration-500`}>
                  {steps[activeStep].icon}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <span className="text-sm font-medium text-gray-500">Step {activeStep + 1}/{steps.length}</span>
                    <div className="w-1 h-1 bg-gray-400 rounded-full mx-3"></div>
                    <span className="text-sm font-medium text-blue-600">{steps[activeStep].title}</span>
                  </div>
                  
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                    {steps[activeStep].title}
                  </h3>
                  
                  <p className="text-lg text-gray-700 mb-6">
                    {steps[activeStep].desc}
                  </p>
                  
                  <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500 transition-all duration-500">
                    <p className="text-blue-800">
                      {steps[activeStep].details}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Step navigation for mobile */}
              <div className="mt-10 flex justify-between lg:hidden">
                <button 
                  onClick={handlePrev}
                  disabled={activeStep === 0}
                  className="flex items-center px-5 py-3 rounded-lg bg-gray-100 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <FaArrowLeft className="mr-2" /> Previous
                </button>
                
                <button 
                  onClick={handleNext}
                  disabled={activeStep === steps.length - 1}
                  className="flex items-center px-5 py-3 rounded-lg bg-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Next <FaArrowRight className="ml-2" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Step indicators for desktop */}
        <div className="hidden lg:flex justify-center mt-16">
          <div className="flex space-x-4">
            {steps.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setDirection(index > activeStep ? 'right' : 'left');
                  setActiveStep(index);
                }}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  activeStep === index 
                    ? `bg-gradient-to-r ${steps[index].color} scale-125` 
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Go to step ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* Call to action section */}
      <div className="mt-20 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 text-center max-w-4xl mx-auto shadow-md">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
          Ready to Find Your Perfect Talent Match?
        </h2>
        <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
          Tell us about your project requirements and we'll connect you with the most suitable professionals 
          from our extensive talent network.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/hire-talent">
          <button className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-lg shadow-md transition-all duration-300 transform hover:-translate-y-1">
            Register for Our course→
          </button>
          </Link>
          <Link to="/contactus">
          <button className="border border-blue-700 text-blue-700 hover:bg-blue-50 px-6 py-3 rounded-lg transition-all duration-300">
          Contact Us
          </button>
          </Link>
        </div>
      </div>
    </section>
  );
}