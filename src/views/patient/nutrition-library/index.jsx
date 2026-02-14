import React, { useState } from "react";
import { MdLocalDining, MdChildCare, MdPregnantWoman } from "react-icons/md";
import { FaBaby, FaAppleAlt, FaUtensils } from "react-icons/fa";
import { useToast } from "hooks/useToast";

// Component imports
import SearchBar from "./components/SearchBar";
import CategoryGrid from "./components/CategoryGrid";
import ArticleCard from "./components/ArticleCard";
import SMSSubscriptionBanner from "./components/SMSSubscriptionBanner";
import MealPlannerCard from "./components/MealPlannerCard";
import DisclaimerBanner from "./components/DisclaimerBanner";
import ViewArticleModal from "./components/ViewArticleModal";
import {
  SaveOfflineModal,
  ShareArticleModal,
  FilterModal,
  SMSSubscribeModal,
} from "./components/ActionModals";

const NutritionLibrary = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [bookmarkedArticles, setBookmarkedArticles] = useState([1, 3]);
  const { showToast } = useToast();

  // Modal states
  const [viewArticleModalOpen, setViewArticleModalOpen] = useState(false);
  const [saveOfflineModalOpen, setSaveOfflineModalOpen] = useState(false);
  const [shareArticleModalOpen, setShareArticleModalOpen] = useState(false);
  const [smsSubscribeModalOpen, setSmsSubscribeModalOpen] = useState(false);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);

  // Data
  const categories = [
    { id: "all", name: "All Topics", icon: <MdLocalDining />, count: 24 },
    { id: "infants", name: "Infants (0-1)", icon: <FaBaby />, count: 8 },
    { id: "toddlers", name: "Toddlers (1-3)", icon: <MdChildCare />, count: 6 },
    { id: "children", name: "Children (4-12)", icon: <FaAppleAlt />, count: 5 },
    { id: "pregnancy", name: "Pregnancy", icon: <MdPregnantWoman />, count: 3 },
    { id: "recipes", name: "Recipes", icon: <FaUtensils />, count: 2 },
  ];

  const articles = [
    {
      id: 1,
      title: "Breastfeeding Basics: Nutrition for Mother and Baby",
      category: "infants",
      readTime: "5 min",
      difficulty: "Beginner",
      featured: true,
      content:
        "Learn about proper breastfeeding techniques, nutritional needs for lactating mothers, and signs your baby is getting enough milk.",
      tips: [
        "Feed on demand - 8-12 times per day",
        "Stay hydrated - drink plenty of water",
        "Eat balanced meals with protein and calcium",
      ],
    },
    {
      id: 2,
      title: "Introducing Solid Foods: 6-12 Months Guide",
      category: "infants",
      readTime: "7 min",
      difficulty: "Beginner",
      featured: true,
      content:
        "Step-by-step guide to introducing solid foods, including safe first foods, portion sizes, and allergy introduction.",
      tips: [
        "Start with iron-rich foods like pureed meat",
        "Introduce one new food every 3-5 days",
        "Watch for allergic reactions",
      ],
    },
    {
      id: 3,
      title: "Affordable Protein Sources for Growing Families",
      category: "all",
      readTime: "6 min",
      difficulty: "Intermediate",
      featured: false,
      content:
        "Budget-friendly protein options including beans, lentils, eggs, and affordable meat cuts that provide essential nutrients.",
      tips: [
        "Combine beans with rice for complete protein",
        "Eggs are one of the most affordable proteins",
        "Buy chicken in bulk and freeze portions",
      ],
    },
    {
      id: 4,
      title: "Recognizing Malnutrition in Children",
      category: "children",
      readTime: "8 min",
      difficulty: "Intermediate",
      featured: true,
      content:
        "Learn to identify signs of malnutrition, including stunted growth, weight loss, and developmental delays.",
      tips: [
        "Monitor growth on WHO growth charts",
        "Look for changes in energy levels",
        "Check for brittle hair and nails",
      ],
    },
    {
      id: 5,
      title: "Quick & Healthy Meals for Busy Parents",
      category: "recipes",
      readTime: "4 min",
      difficulty: "Beginner",
      featured: false,
      content:
        "Simple 15-minute meal ideas using locally available ingredients that provide balanced nutrition.",
      tips: [
        "Prep ingredients on weekends",
        "Use one-pot cooking methods",
        "Involve children in meal preparation",
      ],
    },
    {
      id: 6,
      title: "Nutrition During Pregnancy: Essential Guide",
      category: "pregnancy",
      readTime: "10 min",
      difficulty: "Intermediate",
      featured: true,
      content:
        "Comprehensive guide to nutritional needs during pregnancy, including folic acid, iron, and calcium requirements.",
      tips: [
        "Increase iron-rich foods",
        "Stay hydrated with 8-10 glasses of water",
        "Small, frequent meals help with nausea",
      ],
    },
  ];

  // Filter articles
  const filteredArticles = articles.filter((article) => {
    if (selectedCategory !== "all" && article.category !== selectedCategory) {
      return false;
    }
    if (
      searchQuery &&
      !article.title.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  // Handlers
  const toggleBookmark = (articleId) => {
    setBookmarkedArticles((prev) =>
      prev.includes(articleId)
        ? prev.filter((id) => id !== articleId)
        : [...prev, articleId]
    );
    showToast(
      bookmarkedArticles.includes(articleId)
        ? "Removed from bookmarks"
        : "Saved to bookmarks",
      bookmarkedArticles.includes(articleId) ? "info" : "success"
    );
  };

  const handleViewArticle = (article) => {
    setSelectedArticle(article);
    setViewArticleModalOpen(true);
  };

  const handleSaveOffline = (article) => {
    setSelectedArticle(article);
    setSaveOfflineModalOpen(true);
  };

  const confirmSaveOffline = () => {
    setSaveOfflineModalOpen(false);
    showToast(`${selectedArticle.title} saved for offline reading`, "success");
  };

  const handleShareArticle = (article) => {
    setSelectedArticle(article);
    setShareArticleModalOpen(true);
  };

  const confirmShareArticle = (method) => {
    setShareArticleModalOpen(false);
    showToast(`Article shared via ${method}`, "success");
  };

  const handleDownloadArticle = (article) => {
    const content = `
${article.title}
${"=".repeat(article.title.length)}

${article.content}

Key Tips:
${article.tips.map((tip, i) => `${i + 1}. ${tip}`).join("\n")}

Downloaded from HealthConnect Nutrition Library
    `;

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${article.title.toLowerCase().replace(/\s+/g, "-")}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast("Article downloaded successfully", "success");
  };

  const handleSubscribeSMS = () => {
    setSmsSubscribeModalOpen(true);
  };

  const confirmSubscribeSMS = () => {
    setSmsSubscribeModalOpen(false);
    showToast("Successfully subscribed to SMS nutrition tips!", "success");
  };

  return (
    <div className="h-full">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-navy-700 dark:text-white">
          Nutrition Library
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Evidence-based nutrition guides for every stage of childhood
        </p>
      </div>

      {/* Search Bar */}
      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onFilterClick={() => setFilterModalOpen(true)}
      />

      {/* Category Grid */}
      <CategoryGrid
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      {/* Featured Badge */}
      <div className="mb-4 flex items-center">
        <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
          ⭐ Featured Guides
        </span>
        <span className="ml-3 text-sm text-gray-600 dark:text-gray-400">
          {filteredArticles.length} article
          {filteredArticles.length !== 1 ? "s" : ""} found
        </span>
      </div>

      {/* Articles Grid */}
      <div className="space-y-6">
        {filteredArticles.map((article) => (
          <ArticleCard
            key={article.id}
            article={article}
            isBookmarked={bookmarkedArticles.includes(article.id)}
            onToggleBookmark={toggleBookmark}
            onViewArticle={handleViewArticle}
            onSaveOffline={handleSaveOffline}
            onDownload={handleDownloadArticle}
            onShare={handleShareArticle}
          />
        ))}
      </div>

      {/* SMS Subscription Banner */}
      <SMSSubscriptionBanner onSubscribe={handleSubscribeSMS} />

      {/* Meal Planner */}
      <div className="mt-6">
        <MealPlannerCard
          onGenerateMeal={() =>
            showToast("New meal idea generated!", "success")
          }
        />
      </div>

      {/* Disclaimer */}
      <DisclaimerBanner />

      {/* Modals */}
      <ViewArticleModal
        isOpen={viewArticleModalOpen}
        onClose={() => setViewArticleModalOpen(false)}
        article={selectedArticle}
      />

      <SaveOfflineModal
        isOpen={saveOfflineModalOpen}
        onClose={() => setSaveOfflineModalOpen(false)}
        article={selectedArticle}
        onConfirm={confirmSaveOffline}
      />

      <ShareArticleModal
        isOpen={shareArticleModalOpen}
        onClose={() => setShareArticleModalOpen(false)}
        article={selectedArticle}
        onShare={confirmShareArticle}
      />

      <FilterModal
        isOpen={filterModalOpen}
        onClose={() => setFilterModalOpen(false)}
      />

      <SMSSubscribeModal
        isOpen={smsSubscribeModalOpen}
        onClose={() => setSmsSubscribeModalOpen(false)}
        onConfirm={confirmSubscribeSMS}
      />
    </div>
  );
};

export default NutritionLibrary;
