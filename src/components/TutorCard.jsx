import React from "react";
import { useNavigate } from "react-router-dom";
import { tutorData } from "../data/TutorData";
import {
  Button,
  Rating,
  Chip,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Work as WorkIcon } from "@mui/icons-material";

export default function TutorList() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleViewMore = (tutorId) => navigate(`/tutors/${tutorId}`);

  return (
    <section className="w-full py-10 px-4 md:px-8">
      {/* Section Header */}
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold bg-blue-900 bg-clip-text text-transparent">
          Expert Tutors
        </h2>
        <p className="text-gray-500 mt-2">
          Learn from industry professionals with real-world experience
        </p>
      </div>

      {/* Tutor Cards Grid */}
      <div
        className={`flex ${isMobile ? "overflow-x-auto space-x-4" : "flex-wrap justify-center gap-6"}`}
      >
        {tutorData.map((tutor) => (
          <div
            key={tutor.id}
            className="bg-white rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col w-[85%] sm:w-[280px] md:w-[300px] flex-shrink-0"
          >
            {/* Tutor Image */}
            <img
              src={tutor.image}
              alt={tutor.name}
              className="w-full h-56 object-cover rounded-t-3xl"
            />

            {/* Card Content */}
            <div className="p-5 flex flex-col flex-grow">
              <h3 className="font-semibold text-lg text-gray-900">
                {tutor.name}
              </h3>
              <p className="text-sm text-gray-500 mb-2">{tutor.course}</p>

              {/* Rating */}
              <div className="flex items-center gap-1 mb-2">
                <Rating value={tutor.rating} precision={0.1} readOnly size="small" />
                <span className="text-xs text-gray-400">({tutor.rating})</span>
              </div>

              {/* Course Tag */}
              <Chip
                label={tutor.course}
                size="small"
                sx={{
                  bgcolor: "#eaf2ff",
                  color: "#1e3a8a",
                  fontWeight: 600,
                  mb: 2,
                  alignSelf: "flex-start",
                }}
              />

              {/* Stats */}
              <div className="flex items-center justify-between text-xs text-gray-500 mb-4"><Button
                  variant="contained"
                  size="small"
                  onClick={() => handleViewMore(tutor.id)}
                  sx={{
                    textTransform: "none",
                    borderRadius: 2,
                    backgroundColor: "#1e3a8a",
                    fontWeight: 600,
                    "&:hover": { backgroundColor: "#1c3575" },
                  }}
                >
                  View More
                </Button>
                <div className="flex items-center gap-1">
                  <WorkIcon fontSize="small" />
                  <span>{tutor.experience}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
