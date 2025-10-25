import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { tutorData } from "../data/TutorData";
import {
  Work as WorkIcon,
  School as SchoolIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";

export default function TutorDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const tutor = tutorData.find((t) => t.id === parseInt(id));

  if (!tutor) {
    return (
      <div className="py-16 text-center">
        <h2 className="text-3xl font-semibold">Tutor not found</h2>
        <button
          onClick={() => navigate("/tutors")}
          className="mt-4 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Back to Tutors
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-5 py-10">
      {/* Back Button */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
        {/* LEFT: Tutor Profile */}
        <div className="bg-white shadow-md rounded-2xl overflow-hidden h-auto">
          <img
            src={tutor.image}
            alt={tutor.name}
            className="w-full h-80 object-cover"
          />

          <div className="p-5">
            <h2 className="text-2xl font-semibold mb-1">{tutor.name}</h2>
            <p className="text-gray-600 mb-1">{tutor.title}</p>
            <p className="text-blue-600 text-lg font-medium mb-3">
              {tutor.course}
            </p>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-3">
              <div className="flex text-yellow-400">
                {Array.from({ length: Math.round(tutor.rating) }).map((_, i) => (
                  <span key={i}>★</span>
                ))}
              </div>
              <p className="text-sm text-gray-500">{tutor.rating}</p>
            </div>

            {/* Experience */}
            <div className="flex items-center gap-2 mb-3 text-gray-600">
              <WorkIcon className="text-blue-600" fontSize="small" />
              <span>{tutor.experience} experience</span>
            </div>

            {/* Course Info */}
            <div className="bg-blue-50 p-3 rounded-xl mb-4">
              <h3 className="text-lg font-semibold text-gray-700">
                {tutor.course}
              </h3>
            </div>
          </div>
        </div>

        {/* RIGHT: Details Section */}
        <div className="md:col-span-2 flex flex-col gap-6">
          {/* About Section */}
          <div className="bg-white shadow-md p-6 rounded-2xl">
            <h3 className="text-xl font-semibold mb-2 text-gray-800">
              About Me
            </h3>
            <p className="text-gray-600 leading-relaxed">{tutor.about}</p>
          </div>

          {/* Expertise Section */}
          {tutor.expertise && (
            <div className="bg-white shadow-md p-6 rounded-2xl">
              <h3 className="text-xl font-semibold mb-3 text-gray-800">
                Areas of Expertise
              </h3>
              <div className="flex flex-wrap gap-2">
                {tutor.expertise.map((item, index) => (
                  <span
                    key={index}
                    className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Tools & Technologies */}
          {tutor.tools && (
            <div className="bg-white shadow-md p-6 rounded-2xl">
              <h3 className="text-xl font-semibold mb-3 text-gray-800">
                Tools & Technologies
              </h3>
              <div className="flex flex-wrap gap-2">
                {tutor.tools.map((tool, index) => (
                  <span
                    key={index}
                    className="flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                  >
                    <CheckCircleIcon className="text-blue-600" fontSize="small" />
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {tutor.education && (
            <div className="bg-white shadow-md p-6 rounded-2xl">
              <h3 className="text-xl font-semibold mb-3 text-gray-800">
                Education
              </h3>
              <div className="flex flex-col gap-3">
                {tutor.education.map((edu, index) => (
                  <div key={index}>
                    <p className="text-lg font-medium text-gray-700">
                      {edu.degree}
                    </p>
                    <p className="text-gray-600 text-sm">
                      {edu.institution} • {edu.year}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Achievements */}
          {tutor.achievements && (
            <div className="bg-white shadow-md p-6 rounded-2xl">
              <h3 className="text-xl font-semibold mb-3 text-gray-800">
                Achievements
              </h3>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                {tutor.achievements.map((achievement, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircleIcon
                      className="text-blue-600 mt-[2px]"
                      fontSize="small"
                    />
                    <span>{achievement}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Course */}
          <div className="bg-white shadow-md p-6 rounded-2xl">
            <h3 className="text-xl font-semibold mb-3 text-gray-800">Course</h3>
            <div className="flex items-center gap-2 text-gray-600">
              <SchoolIcon className="text-blue-600" fontSize="small" />
              <span>{tutor.course}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
