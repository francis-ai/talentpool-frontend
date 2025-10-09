import React, { useState } from 'react';
import { Mail, Phone, Send, CheckCircle } from 'lucide-react';

const App = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    industry: '',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form data submitted:', formData);
    
    // Show success animation
    setShowAnimation(true);
    
    // After animation completes, show success message
    setTimeout(() => {
      setIsSubmitted(true);
      setShowAnimation(false);
    }, 2500);
  };

  const resetForm = () => {
    setIsSubmitted(false);
    setFormData({
      name: '',
      email: '',
      industry: '',
      message: '',
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4 md:p-6">
      <div className="mt-20 md:mt-28 w-full max-w-6xl">
        {isSubmitted ? (
          // Success Message
          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 text-center">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <CheckCircle className="w-16 h-16 text-green-500" />
                <div className="absolute -top-2 -right-2">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                    <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
              Message Sent Successfully!
            </h2>
            <p className="text-gray-600 mb-8">
              Thank you for contacting us. We'll get back to you as soon as possible.
            </p>
            <button
              onClick={resetForm}
              className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors duration-200"
            >
              Send Another Message
            </button>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row bg-white rounded-3xl shadow-xl overflow-hidden">
            {/* Left Section */}
            <div className="w-full lg:w-1/2 p-8 md:p-12 lg:p-16 xl:p-20 flex flex-col justify-center">
              <p className="text-gray-500 text-sm font-semibold mb-2 uppercase tracking-wide">
                We're here to help you
              </p>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 leading-tight mb-6">
                Get in Touch <br />
                with Talent Pool
              </h1>
              <p className="text-gray-600 text-base mb-8 md:mb-10">
                Have questions or want to collaborate? Reach out to us, and we'll get back to you as soon as possible.
              </p>

              <div className="flex items-center mb-6">
                <div className="p-3 bg-blue-100 rounded-full mr-4 flex-shrink-0">
                  <Mail className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500 font-semibold">E-mail</span>
                  <a href="mailto:talentpool09.com@gmail.com" className="text-gray-800 text-base font-medium break-words">
                    talentpool09.com@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-full mr-4 flex-shrink-0">
                  <Phone className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500 font-semibold">Phone number</span>
                  <a href="tel:+1234567890" className="text-gray-800 text-base font-medium">
                    +1 (234) 567-8900
                  </a>
                </div>
              </div>
            </div>

            {/* Right Section - Form */}
            <div className="w-full lg:w-1/2 p-6 md:p-8 lg:p-10 xl:p-12 bg-gray-50 rounded-3xl">
              <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="block w-full px-4 py-3 bg-white border border-gray-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    placeholder="Jane Smith"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full px-4 py-3 bg-white border border-gray-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    placeholder="sam@tech.com"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-1">Enquiry</label>
                  <select
                    name="industry"
                    id="industry"
                    value={formData.industry}
                    onChange={handleChange}
                    className="block w-full px-4 py-3 bg-white border border-gray-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    required
                  >
                    <option value="" disabled>Select...</option>
                    <option value="hire">Hire a talent</option>
                    <option value="physical">Physical class</option>
                    <option value="online">Online class</option>
                    <option value="courses">Courses</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea
                    name="message"
                    id="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="4"
                    className="block w-full px-4 py-3 bg-white border border-gray-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    placeholder="Type your message"
                    required
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-full shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                >
                  <Send className="h-5 w-5 mr-2" />
                  Get a Solution
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Animation Component */}
        {showAnimation && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="relative">
              {/* Envelope */}
              <div className="animate-bounce w-24 h-24 bg-yellow-400 rounded-lg flex items-center justify-center transform rotate-6">
                <div className="w-16 h-12 bg-yellow-300 rounded-sm"></div>
              </div>
              
              {/* Balloons */}
              <div className="absolute -top-20 left-0 right-0 flex justify-around">
                <div className="w-8 h-10 bg-red-500 rounded-full rounded-bl-none animate-pulse"></div>
                <div className="w-8 h-10 bg-blue-500 rounded-full rounded-bl-none animate-pulse delay-150"></div>
                <div className="w-8 h-10 bg-green-500 rounded-full rounded-bl-none animate-pulse delay-300"></div>
              </div>
              
              {/* Pop effect */}
              <div className="absolute top-0 left-0 right-0 flex justify-center">
                <div className="w-4 h-4 bg-white rounded-full opacity-0 animate-pop"></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;