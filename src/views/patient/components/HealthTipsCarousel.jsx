import React, { useState, useEffect } from "react";
import {
  MdChevronLeft,
  MdChevronRight,
  MdLocalHospital,
  MdRestaurant,
  MdChildCare,
} from "react-icons/md";

const HealthTipsCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const tips = [
    {
      id: 1,
      title: "Vaccination Reminder",
      description:
        "Ensure your child's vaccinations are up to date. Next due: 6-month shots",
      icon: <MdLocalHospital className="h-8 w-8" />,
      color: "bg-blue-100 text-blue-600",
      action: "View Schedule",
    },
    {
      id: 2,
      title: "Nutrition Tip",
      description:
        "Include iron-rich foods like beans and spinach in daily meals",
      icon: <MdRestaurant className="h-8 w-8" />,
      color: "bg-green-100 text-green-600",
      action: "Learn More",
    },
    {
      id: 3,
      title: "Child Development",
      description:
        "Track your child's milestones with our interactive checklist",
      icon: <MdChildCare className="h-8 w-8" />,
      color: "bg-purple-100 text-purple-600",
      action: "Check Milestones",
    },
    {
      id: 4,
      title: "Hydration Reminder",
      description:
        "Children need 5-8 glasses of water daily. More in hot weather",
      icon: "💧",
      color: "bg-cyan-100 text-cyan-600",
      action: "Set Reminder",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % tips.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [tips.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % tips.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + tips.length) % tips.length);
  };

  return (
    <div className="relative rounded-xl bg-white p-6 dark:bg-navy-800">
      <h4 className="mb-4 text-lg font-bold text-navy-700 dark:text-white">
        Health Tips for You
      </h4>

      <div className="relative overflow-hidden">
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {tips.map((tip) => (
            <div key={tip.id} className="w-full flex-shrink-0">
              <div className="flex items-center p-2">
                <div
                  className={`mr-4 flex h-16 w-16 items-center justify-center rounded-full ${tip.color}`}
                >
                  {tip.icon}
                </div>
                <div className="flex-1">
                  <h5 className="font-bold text-navy-700 dark:text-white">
                    {tip.title}
                  </h5>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {tip.description}
                  </p>
                  <button className="mt-2 text-sm font-medium text-brand-500 hover:text-brand-600">
                    {tip.action} →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white p-2 shadow-lg dark:bg-navy-700"
      >
        <MdChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white p-2 shadow-lg dark:bg-navy-700"
      >
        <MdChevronRight className="h-5 w-5" />
      </button>

      {/* Dots Indicator */}
      <div className="mt-4 flex justify-center space-x-2">
        {tips.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2 w-2 rounded-full transition-colors ${
              index === currentSlide
                ? "bg-brand-500"
                : "bg-gray-300 dark:bg-gray-600"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HealthTipsCarousel;
