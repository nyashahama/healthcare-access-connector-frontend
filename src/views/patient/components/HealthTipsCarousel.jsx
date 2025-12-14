import React, { useState, useEffect } from "react";
import {
  MdChevronLeft,
  MdChevronRight,
  MdLocalHospital,
  MdRestaurant,
  MdChildCare,
  MdInfo,
  MdShare,
  MdBookmark,
} from "react-icons/md";
import Modal from "components/modal/Modal";
import { useToast } from "hooks/useToast";

const HealthTipsCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedTip, setSelectedTip] = useState(null);
  const [tipModalOpen, setTipModalOpen] = useState(false);
  const { showToast } = useToast();

  const tips = [
    {
      id: 1,
      title: "Vaccination Reminder",
      description:
        "Ensure your child's vaccinations are up to date. Next due: 6-month shots",
      detailedDescription:
        "The 6-month vaccination schedule includes DTaP, Hib, PCV13, and IPV vaccines. These protect against diphtheria, tetanus, whooping cough, hepatitis B, polio, and pneumococcal disease. Side effects may include mild fever or soreness at injection site.",
      icon: <MdLocalHospital className="h-8 w-8" />,
      color: "bg-blue-100 text-blue-600",
      action: "View Schedule",
      category: "Preventive Care",
      importance: "High",
      nextDue: "Next due in 2 weeks",
    },
    {
      id: 2,
      title: "Nutrition Tip",
      description:
        "Include iron-rich foods like beans and spinach in daily meals",
      detailedDescription:
        "Iron is crucial for brain development and preventing anemia. Good sources include: lentils, beans, spinach, fortified cereals, and lean meats. Pair with vitamin C-rich foods (oranges, tomatoes) to enhance absorption.",
      icon: <MdRestaurant className="h-8 w-8" />,
      color: "bg-green-100 text-green-600",
      action: "Learn More",
      category: "Nutrition",
      importance: "Medium",
      dailyRequirement: "7-10mg daily for toddlers",
    },
    {
      id: 3,
      title: "Child Development",
      description:
        "Track your child's milestones with our interactive checklist",
      detailedDescription:
        "At 6 months, your child should be able to roll over, sit with support, babble, and show interest in faces. Regular developmental screening helps identify any delays early for timely intervention.",
      icon: <MdChildCare className="h-8 w-8" />,
      color: "bg-purple-100 text-purple-600",
      action: "Check Milestones",
      category: "Development",
      importance: "High",
      nextCheck: "Next check at 9 months",
    },
    {
      id: 4,
      title: "Hydration Reminder",
      description:
        "Children need 5-8 glasses of water daily. More in hot weather",
      detailedDescription:
        "Proper hydration supports digestion, temperature regulation, and cognitive function. Signs of dehydration include dry mouth, fewer wet diapers, and lethargy. Offer water regularly, especially during play and meals.",
      icon: "💧",
      color: "bg-cyan-100 text-cyan-600",
      action: "Set Reminder",
      category: "Health Basics",
      importance: "Medium",
      waterRequirement: "Approx. 1-1.5 liters daily",
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

  const handleTipClick = (tip) => {
    setSelectedTip(tip);
    setTipModalOpen(true);
  };

  const handleActionClick = (tip) => {
    switch (tip.action) {
      case "View Schedule":
        showToast("Opening vaccination schedule...", "info");
        setTimeout(() => {
          window.location.href = "/patient/vaccinations";
        }, 1000);
        break;
      case "Learn More":
        showToast("Opening nutrition guide...", "info");
        setTimeout(() => {
          window.location.href = "/patient/nutrition";
        }, 1000);
        break;
      case "Check Milestones":
        showToast("Opening developmental checklist...", "info");
        setTimeout(() => {
          window.location.href = "/patient/development";
        }, 1000);
        break;
      case "Set Reminder":
        showToast("Reminder set for daily hydration!", "success");
        break;
    }
  };

  const handleShareTip = (tip) => {
    if (navigator.share) {
      navigator.share({
        title: tip.title,
        text: tip.description,
      });
    } else {
      navigator.clipboard.writeText(`${tip.title}: ${tip.description}`);
      showToast("Tip copied to clipboard!", "success");
    }
  };

  const handleBookmarkTip = (tip) => {
    showToast(`"${tip.title}" bookmarked!`, "success");
    // Here you would typically save to user's bookmarks
  };

  return (
    <>
      {/* Tip Details Modal */}
      <Modal
        isOpen={tipModalOpen}
        onClose={() => setTipModalOpen(false)}
        title={selectedTip?.title || "Health Tip Details"}
        size="lg"
      >
        {selectedTip && (
          <div className="space-y-6">
            {/* Tip Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center">
                <div
                  className={`mr-4 flex h-16 w-16 items-center justify-center rounded-full ${selectedTip.color}`}
                >
                  {selectedTip.icon}
                </div>
                <div>
                  <h4 className="text-xl font-bold text-navy-700 dark:text-white">
                    {selectedTip.title}
                  </h4>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="rounded-full bg-gray-100 px-2 py-1 text-xs dark:bg-gray-800">
                      {selectedTip.category}
                    </span>
                    <span
                      className={`rounded-full px-2 py-1 text-xs ${
                        selectedTip.importance === "High"
                          ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                      }`}
                    >
                      {selectedTip.importance} Priority
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleBookmarkTip(selectedTip)}
                  className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                  title="Bookmark"
                >
                  <MdBookmark className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleShareTip(selectedTip)}
                  className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                  title="Share"
                >
                  <MdShare className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Detailed Content */}
            <div>
              <h5 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Detailed Information
              </h5>
              <p className="text-gray-600 dark:text-gray-300">
                {selectedTip.detailedDescription}
              </p>
            </div>

            {/* Key Information */}
            <div className="grid grid-cols-2 gap-4">
              {selectedTip.nextDue && (
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
                  <div className="text-sm text-blue-600 dark:text-blue-400">
                    Next Due
                  </div>
                  <div className="font-medium">{selectedTip.nextDue}</div>
                </div>
              )}
              {selectedTip.dailyRequirement && (
                <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
                  <div className="text-sm text-green-600 dark:text-green-400">
                    Daily Requirement
                  </div>
                  <div className="font-medium">
                    {selectedTip.dailyRequirement}
                  </div>
                </div>
              )}
              {selectedTip.nextCheck && (
                <div className="rounded-lg border border-purple-200 bg-purple-50 p-4 dark:border-purple-800 dark:bg-purple-900/20">
                  <div className="text-sm text-purple-600 dark:text-purple-400">
                    Next Check
                  </div>
                  <div className="font-medium">{selectedTip.nextCheck}</div>
                </div>
              )}
              {selectedTip.waterRequirement && (
                <div className="rounded-lg border border-cyan-200 bg-cyan-50 p-4 dark:border-cyan-800 dark:bg-cyan-900/20">
                  <div className="text-sm text-cyan-600 dark:text-cyan-400">
                    Water Need
                  </div>
                  <div className="font-medium">
                    {selectedTip.waterRequirement}
                  </div>
                </div>
              )}
            </div>

            {/* Additional Resources */}
            <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
              <div className="flex items-start">
                <MdInfo className="mr-2 mt-0.5 h-5 w-5 text-gray-500" />
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  This information is provided by certified pediatricians.
                  Always consult with your healthcare provider for personalized
                  advice.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setTipModalOpen(false)}
                className="rounded-lg border border-gray-300 px-6 py-2 font-medium hover:bg-gray-50 dark:border-gray-600"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setTipModalOpen(false);
                  handleActionClick(selectedTip);
                }}
                className="rounded-lg bg-brand-500 px-6 py-2 font-medium text-white hover:bg-brand-600"
              >
                {selectedTip.action}
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Main Carousel Component */}
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
                <div
                  className="flex cursor-pointer items-center rounded-lg p-2 transition-colors hover:bg-gray-50 dark:hover:bg-navy-700"
                  onClick={() => handleTipClick(tip)}
                >
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
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleActionClick(tip);
                      }}
                      className="mt-2 text-sm font-medium text-brand-500 hover:text-brand-600"
                    >
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
          className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white p-2 shadow-lg transition-all duration-200 hover:scale-110 dark:bg-navy-700"
        >
          <MdChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white p-2 shadow-lg transition-all duration-200 hover:scale-110 dark:bg-navy-700"
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
    </>
  );
};

export default HealthTipsCarousel;
