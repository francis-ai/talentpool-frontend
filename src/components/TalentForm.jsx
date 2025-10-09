import React, { useState } from "react";
import axios from "axios";

const TalentForm = () => {
  const [educations, setEducations] = useState([
    { degree: "", institution: "", field: "", year: "" },
  ]);
  const [projects, setProjects] = useState([
    { name: "", year: "", projectUrl: "", githubUrl: "", description: "", tech: "" },
  ]);
  const [formData, setFormData] = useState({
    fullName: "",
    jobTitle: "",
    location: "",
    experience: "",
    profileUrl: "",
    bio: "",
    email: "",
    phone: "",
    linkedin: "",
    portfolio: "",
    github: "",
    website: "",
    skills: [],
    expectedSalary: "",
    jobTypes: [],
    available: false,
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentSkill, setCurrentSkill] = useState("");

  // API base URL from environment variable with fallback
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:3000";
  const API_URL = `${API_BASE_URL}/api/talent`;

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === "checkbox") {
      if (name === "available") {
        setFormData({ ...formData, [name]: checked });
      } else {
        if (checked) {
          setFormData({ ...formData, jobTypes: [...formData.jobTypes, value] });
        } else {
          setFormData({
            ...formData,
            jobTypes: formData.jobTypes.filter((job) => job !== value),
          });
        }
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  // Education handlers
  const handleEducationChange = (index, e) => {
    const { name, value } = e.target;
    const newEducations = [...educations];
    newEducations[index][name] = value;
    setEducations(newEducations);
  };
  
  const addEducation = () => setEducations([...educations, { degree: "", institution: "", field: "", year: "" }]);
  
  const removeEducation = (index) => {
    if (educations.length > 1) {
      setEducations(educations.filter((_, i) => i !== index));
    }
  };

  // Project handlers
  const handleProjectChange = (index, e) => {
    const { name, value } = e.target;
    const newProjects = [...projects];
    newProjects[index][name] = value;
    setProjects(newProjects);
  };
  
  const addProject = () => setProjects([...projects, { name: "", year: "", projectUrl: "", githubUrl: "", description: "", tech: "" }]);
  
  const removeProject = (index) => {
    if (projects.length > 1) {
      setProjects(projects.filter((_, i) => i !== index));
    }
  };

  // Skills handlers
  const handleSkillInput = (e) => {
    setCurrentSkill(e.target.value);
  };

  const addSkill = (e) => {
    if (e.key === "Enter" || e.type === "click") {
      e.preventDefault();
      if (currentSkill.trim() && !formData.skills.includes(currentSkill.trim())) {
        setFormData({
          ...formData,
          skills: [...formData.skills, currentSkill.trim()],
        });
        setCurrentSkill("");
      }
    }
  };

  const removeSkill = (index) => {
    const newSkills = [...formData.skills];
    newSkills.splice(index, 1);
    setFormData({ ...formData, skills: newSkills });
  };

  // Validation function
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.jobTitle.trim()) newErrors.jobTitle = "Job title is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.bio.trim()) {
      newErrors.bio = "Bio is required";
    } else if (formData.bio.length < 50) {
      newErrors.bio = "Bio should be at least 50 characters";
    }
    
    // Education validation
    educations.forEach((edu, index) => {
      if (!edu.degree.trim()) newErrors[`educationDegree${index}`] = "Degree is required";
      if (!edu.institution.trim()) newErrors[`educationInstitution${index}`] = "Institution is required";
      if (!edu.year.trim()) newErrors[`educationYear${index}`] = "Year is required";
    });
    
    // Project validation
    projects.forEach((proj, index) => {
      if (!proj.name.trim()) newErrors[`projectName${index}`] = "Project name is required";
      if (!proj.year.trim()) newErrors[`projectYear${index}`] = "Year is required";
      if (!proj.description.trim()) newErrors[`projectDescription${index}`] = "Description is required";
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Prepare the data to send to the backend
      const submissionData = {
        ...formData,
        educations,
        projects
      };
      
      // Send data to the backend API using axios
      const response = await axios.post(API_URL, submissionData);
      
      console.log('Success:', response.data);
      setIsSubmitted(true);
      
      // Reset form after successful submission
      setFormData({
        fullName: "",
        jobTitle: "",
        location: "",
        experience: "",
        profileUrl: "",
        bio: "",
        email: "",
        phone: "",
        linkedin: "",
        portfolio: "",
        github: "",
        website: "",
        skills: [],
        expectedSalary: "",
        jobTypes: [],
        available: false,
      });
      setEducations([{ degree: "", institution: "", field: "", year: "" }]);
      setProjects([{ name: "", year: "", projectUrl: "", githubUrl: "", description: "", tech: "" }]);
      
    } catch (error) {
      console.error('Error:', error);
      setErrors({ submit: error.response?.data?.message || 'Failed to submit form. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // 3D Success Message Component
  const Success3DMessage = () => {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative bg-white p-8 rounded-2xl shadow-2xl transform transition-all duration-500 scale-100 animate-pulse" 
             style={{
               transformStyle: 'preserve-3d',
               perspective: '1000px',
               boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1) inset',
               background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
             }}>
          <div className="text-center text-white" style={{transform: 'translateZ(50px)'}}>
            <div className="text-5xl font-bold mb-4">🎉</div>
            <h3 className="text-3xl font-bold mb-2">Success!</h3>
            <p className="text-xl mb-6">Your information has been received</p>
            <button 
              onClick={() => setIsSubmitted(false)}
              className="bg-white text-indigo-700 px-6 py-3 rounded-full font-bold hover:bg-gray-100 transition-colors shadow-lg"
              style={{transform: 'translateZ(30px)'}}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-xl rounded-xl border border-gray-100">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 rounded-t-xl -m-6 mb-6">
        <h1 className="text-3xl font-bold flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          Talent Submission Form
        </h1>
        <p className="mt-2 opacity-90">Complete your profile to connect with opportunities</p>
      </div>
      
      {errors.submit && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md">
          <p className="font-medium">{errors.submit}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Personal Info */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
            Personal Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <input
                type="text"
                name="fullName"
                placeholder="Full Name *"
                className={`border p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.fullName ? 'border-red-500' : 'border-gray-300'}`}
                value={formData.fullName}
                onChange={handleChange}
              />
              {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
            </div>
            <div>
              <input
                type="text"
                name="jobTitle"
                placeholder="Job Title *"
                className={`border p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.jobTitle ? 'border-red-500' : 'border-gray-300'}`}
                value={formData.jobTitle}
                onChange={handleChange}
              />
              {errors.jobTitle && <p className="text-red-500 text-sm mt-1">{errors.jobTitle}</p>}
            </div>
            <div>
              <input
                type="text"
                name="location"
                placeholder="Location *"
                className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.location}
                onChange={handleChange}
              />
            </div>
            <div>
              <input
                type="number"
                name="experience"
                placeholder="Years of Experience"
                min="0"
                className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.experience}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* Profile & Bio */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
            Profile & Bio
          </h2>
          <div className="space-y-4">
            <input
              type="url"
              name="profileUrl"
              placeholder="Profile URL (LinkedIn, etc.)"
              className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={formData.profileUrl}
              onChange={handleChange}
            />
            <div>
              <textarea
                name="bio"
                placeholder="Professional Bio *"
                maxLength={500}
                rows={3}
                className={`border p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.bio ? 'border-red-500' : 'border-gray-300'}`}
                value={formData.bio}
                onChange={handleChange}
              />
              <div className="flex justify-between mt-1">
                {errors.bio ? (
                  <p className="text-red-500 text-sm">{errors.bio}</p>
                ) : (
                  <div></div>
                )}
                <p className="text-gray-500 text-sm">{formData.bio.length}/500</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
            Contact Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email Address *"
                className={`border p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>
            <div>
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            <input
              type="url"
              name="linkedin"
              placeholder="LinkedIn URL"
              className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={formData.linkedin}
              onChange={handleChange}
            />
            <input
              type="url"
              name="portfolio"
              placeholder="Portfolio URL"
              className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={formData.portfolio}
              onChange={handleChange}
            />
            <input
              type="url"
              name="github"
              placeholder="GitHub URL"
              className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={formData.github}
              onChange={handleChange}
            />
            <input
              type="url"
              name="website"
              placeholder="Website URL"
              className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={formData.website}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Skills & Preferences */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
            Skills & Preferences
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2">Skills</label>
              <div className="flex">
                <input
                  type="text"
                  placeholder="Add skills (press Enter to add)"
                  className="border border-gray-300 p-3 rounded-l-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={currentSkill}
                  onChange={handleSkillInput}
                  onKeyPress={addSkill}
                />
                <button
                  type="button"
                  onClick={addSkill}
                  className="bg-blue-500 text-white px-4 rounded-r-lg hover:bg-blue-600 transition-colors"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap mt-2">
                {formData.skills.map((skill, index) => (
                  <div key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center m-1">
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(index)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <input
                type="text"
                name="expectedSalary"
                placeholder="Expected Salary Range (e.g., $80,000 - $100,000)"
                className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.expectedSalary}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">Job Types</label>
              <div className="flex flex-wrap gap-4">
                {["Full-time", "Part-time", "Contract", "Freelance", "Remote"].map((type) => (
                  <label key={type} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="jobTypes"
                      value={type}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span>{type}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="available"
                checked={formData.available}
                onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="ml-2 text-gray-700">Currently available for new opportunities</span>
            </div>
          </div>
        </div>

        {/* Education Section */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
            Education
          </h2>
          {educations.map((edu, index) => (
            <div key={index} className="mb-6 p-4 border border-gray-200 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <input
                    type="text"
                    name="degree"
                    placeholder="Degree/Qualification *"
                    value={edu.degree}
                    onChange={(e) => handleEducationChange(index, e)}
                    className={`border p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors[`educationDegree${index}`] ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors[`educationDegree${index}`] && <p className="text-red-500 text-sm mt-1">{errors[`educationDegree${index}`]}</p>}
                </div>
                <div>
                  <input
                    type="text"
                    name="institution"
                    placeholder="Institution *"
                    value={edu.institution}
                    onChange={(e) => handleEducationChange(index, e)}
                    className={`border p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors[`educationInstitution${index}`] ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors[`educationInstitution${index}`] && <p className="text-red-500 text-sm mt-1">{errors[`educationInstitution${index}`]}</p>}
                </div>
                <div>
                  <input
                    type="text"
                    name="field"
                    placeholder="Field of Study"
                    value={edu.field}
                    onChange={(e) => handleEducationChange(index, e)}
                    className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    name="year"
                    placeholder="Year *"
                    value={edu.year}
                    onChange={(e) => handleEducationChange(index, e)}
                    className={`border p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors[`educationYear${index}`] ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors[`educationYear${index}`] && <p className="text-red-500 text-sm mt-1">{errors[`educationYear${index}`]}</p>}
                </div>
              </div>
              {educations.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeEducation(index)}
                  className="text-red-500 font-medium flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Remove Education
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addEducation}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-600 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Add Education
          </button>
        </div>

        {/* Projects Section */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
            Projects
          </h2>
          {projects.map((proj, index) => (
            <div key={index} className="mb-6 p-4 border border-gray-200 rounded-lg">
              <div className="grid grid-cols-1 gap-4 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      name="name"
                      placeholder="Project Name *"
                      value={proj.name}
                      onChange={(e) => handleProjectChange(index, e)}
                      className={`border p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors[`projectName${index}`] ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors[`projectName${index}`] && <p className="text-red-500 text-sm mt-1">{errors[`projectName${index}`]}</p>}
                  </div>
                  <div>
                    <input
                      type="text"
                      name="year"
                      placeholder="Year *"
                      value={proj.year}
                      onChange={(e) => handleProjectChange(index, e)}
                      className={`border p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors[`projectYear${index}`] ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors[`projectYear${index}`] && <p className="text-red-500 text-sm mt-1">{errors[`projectYear${index}`]}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="url"
                    name="projectUrl"
                    placeholder="Project URL"
                    value={proj.projectUrl}
                    onChange={(e) => handleProjectChange(index, e)}
                    className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="url"
                    name="githubUrl"
                    placeholder="GitHub URL"
                    value={proj.githubUrl}
                    onChange={(e) => handleProjectChange(index, e)}
                    className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    name="tech"
                    placeholder="Technologies Used (comma separated)"
                    value={proj.tech}
                    onChange={(e) => handleProjectChange(index, e)}
                    className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <textarea
                    name="description"
                    placeholder="Description *"
                    rows={3}
                    value={proj.description}
                    onChange={(e) => handleProjectChange(index, e)}
                    className={`border p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors[`projectDescription${index}`] ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors[`projectDescription${index}`] && <p className="text-red-500 text-sm mt-1">{errors[`projectDescription${index}`]}</p>}
                </div>
              </div>
              {projects.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeProject(index)}
                  className="text-red-500 font-medium flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Remove Project
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addProject}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-600 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Add Project
          </button>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-800 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Talent Profile'}
          </button>
        </div>
      </form>

      {/* 3D Success Message */}
      {isSubmitted && <Success3DMessage />}
    </div>
  );
};
export default TalentForm;