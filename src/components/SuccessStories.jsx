import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  FaGraduationCap,
  FaBuilding,
  FaChartLine,
  FaQuoteLeft,
  FaStar,
} from "react-icons/fa";
import { motion, useAnimation } from "framer-motion";

const SuccessStories = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);
  const controls = useAnimation();

  // ✅ useMemo to avoid re-creation every render
  const stats = useMemo(() => [
    {
      number: 40000,
      label: "Graduates",
      icon: <FaGraduationCap className="text-2xl sm:text-3xl" />,
    },
    {
      number: 100000,
      label: "2026 Milestone",
      icon: <FaChartLine className="text-2xl sm:text-3xl" />,
    },
    {
      number: 50,
      label: "Partner Companies",
      icon: <FaBuilding className="text-2xl sm:text-3xl" />,
    },
  ], []);

  const [animatedNumbers, setAnimatedNumbers] = useState([0, 0, 0]);

  const successStories = [
    {
      id: 1,
      name: "Tolu Johnson",
      role: "Data Scientist at TechCorp",
      image: "360_F_124848388_cjx0VIF3BdR6yveB7ZguDSlEpM91tbrM.jpg",
      story:
        "The Data Science program completely transformed my career. Within 3 months of completing the course, I landed my dream job with a 60% salary increase.",
      course: "Data Science",
      rating: 5,
    },
    {
      id: 2,
      name: "Adeniran Wilfred",
      role: "Full Stack Developer at ThofinApp",
      image: "badguy.jpg",
      story:
        "As a career switcher, I was nervous about breaking into tech. The Full Stack Development course gave me the practical skills and portfolio I needed to get hired.",
      course: "Full Stack Development",
      rating: 5,
    },
    {
      id: 3,
      name: "Mary  Obodo",
      role: "UX Lead at DesignStudio",
      image: "360_F_1142100802_6S1ANg4385vjRFKQ6q41DxOBwayLITXB.jpg",
      story:
        "The UI/UX Design course exceeded my expectations. The mentorship program connected me with industry professionals who helped me build an outstanding portfolio.",
      course: "UI/UX Design",
      rating: 5,
    },
    {
      id: 4,
      name: "James Wilson",
      role: "Cloud Architect at Edmoss global ventures",
      image: "images (9).jpeg",
      story:
        "The Cloud Computing certification opened doors I didn't know existed. I now lead a team of engineers and manage infrastructure for Fortune 500 companies.",
      course: "Cloud Computing",
      rating: 5,
    },
    {
      id: 5,
      name: "Ogunwale Sharma",
      role: "Mobile Development Lead at ApparchInnovate",
      image: "olawalepeters.jpg",
      story:
        "The Mobile Application Development course provided hands-on experience with real projects. I published my first app within weeks of completing the program.",
      course: "Mobile Application Development",
      rating: 5,
    },
  ];

  // Intersection Observer
  useEffect(() => {
    const currentSection = sectionRef.current; // ✅ copy ref to local variable
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          controls.start("visible");
        }
      },
      { threshold: 0.2 }
    );

    if (currentSection) observer.observe(currentSection);

    return () => {
      if (currentSection) observer.unobserve(currentSection); // ✅ cleanup safely
    };
  }, [controls]);

  // Animate numbers
  useEffect(() => {
    if (isVisible) {
      const duration = 2000;
      const interval = 20;
      const steps = duration / interval;

      const animations = stats.map((stat, index) => {
        const stepValue = stat.number / steps;
        let currentStep = 0;
        let currentValue = 0;

        const timer = setInterval(() => {
          currentStep++;
          currentValue += stepValue;

          if (currentStep >= steps) {
            currentValue = stat.number;
            clearInterval(timer);
          }

          setAnimatedNumbers((prev) => {
            const newNumbers = [...prev];
            newNumbers[index] = Math.floor(currentValue);
            return newNumbers;
          });
        }, interval);

        return timer;
      });

      return () => animations.forEach((timer) => clearInterval(timer));
    }
  }, [isVisible, stats]); // ✅ include stats in dependency

  const formatNumber = (num) =>
    num >= 1000 ? num.toLocaleString() + "+" : num + "+";

  const renderStars = (rating) =>
    Array.from({ length: rating }, (_, i) => (
      <FaStar key={i} className="text-yellow-400 text-sm" />
    ));

  const fadeUpVariant = {
    hidden: { opacity: 0, y: 30 },
    visible: (i = 0) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.2, duration: 0.6, ease: "easeOut" },
    }),
  };

  return (
    <section
      ref={sectionRef}
      className="py-16 bg-gradient-to-b from-blue-50 to-gray-50"
    >
      <div className="max-w-6xl mx-auto px-4">
        {/* Stats Section */}
        <motion.div
          className="text-center mb-16"
          initial="hidden"
          animate={controls}
          variants={fadeUpVariant}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">
            Our Impact
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg mb-12">
            Join thousands of students who have transformed their careers
            through our programs
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                custom={index}
                initial="hidden"
                animate={controls}
                variants={fadeUpVariant}
                className="bg-white p-8 rounded-xl shadow-lg text-center transition-all hover:shadow-xl"
              >
                <div className="text-blue-900 flex justify-center mb-4">
                  {stat.icon}
                </div>
                <h3 className="text-4xl font-bold text-blue-900 mb-2">
                  {isVisible ? formatNumber(animatedNumbers[index]) : "0+"}
                </h3>
                <p className="text-gray-600 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Success Stories */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <motion.h2
              className="text-3xl md:text-4xl font-bold text-blue-900 mb-4"
              initial="hidden"
              animate={controls}
              variants={fadeUpVariant}
            >
              Success Stories
            </motion.h2>
            <motion.p
              className="text-gray-600 max-w-2xl mx-auto text-lg"
              initial="hidden"
              animate={controls}
              variants={fadeUpVariant}
            >
              Hear from our graduates who have achieved remarkable career
              transformations
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {successStories.map((story, i) => (
              <motion.div
                key={story.id}
                custom={i}
                initial="hidden"
                animate={controls}
                variants={fadeUpVariant}
                className="bg-white rounded-xl shadow-lg overflow-hidden transition-all hover:shadow-xl"
              >
                <div className="p-6 flex flex-col h-full">
                  <div className="flex mb-4">{renderStars(story.rating)}</div>
                  <FaQuoteLeft className="text-blue-900 text-2xl mb-4 opacity-20" />
                  <p className="text-gray-700 mb-6 text-base italic flex-grow">
                    "{story.story}"
                  </p>

                  <div className="flex items-center mt-auto">
                    <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                      <img
                        src={story.image}
                        alt={story.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold text-blue-900">
                        {story.name}
                      </h4>
                      <p className="text-sm text-gray-600">{story.role}</p>
                      <p className="text-sm text-blue-900 font-medium mt-1">
                        Graduate: {story.course}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <motion.div
          className="bg-blue-900 rounded-2xl p-10 text-center text-white"
          initial="hidden"
          animate={controls}
          variants={fadeUpVariant}
        >
          <h2 className="text-3xl font-bold mb-4">
            Start Your Success Story Today
          </h2>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto mb-6">
            Join our community of learners and transform your career with
            industry-relevant skills
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="bg-white text-blue-900 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-all">
              Join Our community
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SuccessStories;
