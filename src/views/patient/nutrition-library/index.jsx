import React, { useState } from "react";
import {
  MdSearch,
  MdFilterList,
  MdBookmark,
  MdBookmarkBorder,
  MdDownload,
  MdShare,
  MdAccessTime,
  MdLocalDining,
  MdChildCare,
  MdPregnantWoman,
  MdInfo,
  MdWarning,
} from "react-icons/md";
import { FaBaby, FaAppleAlt, FaUtensils } from "react-icons/fa";
import Card from "components/card";
import Modal from "components/modal/Modal";
import { useToast } from "hooks/useToast";

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
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [filterModalOpen, setFilterModalOpen] = useState(false);

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

  const toggleBookmark = (articleId) => {
    setBookmarkedArticles((prev) =>
      prev.includes(articleId)
        ? prev.filter((id) => id !== articleId)
        : [...prev, articleId]
    );
    const article = articles.find((a) => a.id === articleId);
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
    // Create a simple text file with article content
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

  const confirmSMSSubscription = () => {
    setSmsSubscribeModalOpen(false);
    showToast("Subscribed to daily nutrition tips via SMS", "success");
  };

  return (
    <div className="h-full">
      {/* Modals */}
      {/* View Article Modal */}
      <Modal
        isOpen={viewArticleModalOpen}
        onClose={() => setViewArticleModalOpen(false)}
        title={selectedArticle?.title}
        size="xl"
      >
        {selectedArticle && (
          <div className="space-y-6">
            <div className="rounded-lg bg-gray-50 p-4 dark:bg-navy-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="rounded-full bg-brand-100 px-3 py-1 text-sm font-medium text-brand-600 dark:bg-brand-900/30">
                    {selectedArticle.category}
                  </span>
                  <span className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <MdAccessTime className="mr-1 h-4 w-4" />
                    {selectedArticle.readTime} read
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toggleBookmark(selectedArticle.id)}
                    className="text-gray-500 hover:text-yellow-500"
                  >
                    {bookmarkedArticles.includes(selectedArticle.id) ? (
                      <MdBookmark className="h-5 w-5 text-yellow-500" />
                    ) : (
                      <MdBookmarkBorder className="h-5 w-5" />
                    )}
                  </button>
                  <button
                    onClick={() => handleShareArticle(selectedArticle)}
                    className="text-gray-500 hover:text-brand-500"
                  >
                    <MdShare className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            <div className="prose dark:prose-invert max-w-none">
              <p className="text-lg">{selectedArticle.content}</p>

              <h3 className="mt-6 text-xl font-bold">Key Tips:</h3>
              <ul className="mt-3 space-y-3">
                {selectedArticle.tips.map((tip, index) => (
                  <li key={index} className="flex items-start">
                    <div className="mr-3 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
                      {index + 1}
                    </div>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>

              {selectedArticle.category === "infants" && (
                <div className="mt-6 rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                  <h4 className="font-bold text-blue-800 dark:text-blue-300">
                    🍼 Infant Feeding Guidelines
                  </h4>
                  <p className="mt-2 text-blue-700 dark:text-blue-400">
                    Always consult with a healthcare provider for personalized
                    infant feeding advice. WHO recommends exclusive
                    breastfeeding for the first 6 months.
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => handleSaveOffline(selectedArticle)}
                className="rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-50 dark:border-gray-600"
              >
                Save Offline
              </button>
              <button
                onClick={() => {
                  handleDownloadArticle(selectedArticle);
                  setViewArticleModalOpen(false);
                }}
                className="rounded-lg bg-brand-500 px-4 py-2 text-white hover:bg-brand-600"
              >
                Download PDF
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Save Offline Modal */}
      <Modal
        isOpen={saveOfflineModalOpen}
        onClose={() => setSaveOfflineModalOpen(false)}
        title="Save for Offline Reading"
        size="md"
      >
        {selectedArticle && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                <MdDownload className="h-8 w-8 text-green-600 dark:text-green-300" />
              </div>
              <h4 className="mb-2 text-xl font-bold text-navy-700 dark:text-white">
                Save "{selectedArticle.title}"?
              </h4>
              <p className="text-gray-600 dark:text-gray-300">
                This article will be available offline without internet
                connection.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center rounded-lg border border-gray-200 p-3 dark:border-gray-700">
                <MdInfo className="mr-3 h-5 w-5 text-blue-600" />
                <div>
                  <div className="font-medium">Storage: ~2.3 MB</div>
                  <div className="text-sm text-gray-500">
                    Will use device storage
                  </div>
                </div>
              </div>
              <div className="flex items-center rounded-lg border border-gray-200 p-3 dark:border-gray-700">
                <MdAccessTime className="mr-3 h-5 w-5 text-green-600" />
                <div>
                  <div className="font-medium">Available Offline</div>
                  <div className="text-sm text-gray-500">
                    Access anytime, anywhere
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setSaveOfflineModalOpen(false)}
                className="rounded-lg border border-gray-300 px-6 py-2 font-medium hover:bg-gray-50 dark:border-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={confirmSaveOffline}
                className="rounded-lg bg-brand-500 px-6 py-2 font-medium text-white hover:bg-brand-600"
              >
                Save Article
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Share Article Modal */}
      <Modal
        isOpen={shareArticleModalOpen}
        onClose={() => setShareArticleModalOpen(false)}
        title="Share Nutrition Article"
        size="md"
      >
        {selectedArticle && (
          <div className="space-y-6">
            <div className="text-center">
              <h4 className="text-xl font-bold text-navy-700 dark:text-white">
                Share "{selectedArticle.title}"
              </h4>
              <p className="text-gray-600 dark:text-gray-300">
                Send to family, friends, or healthcare provider
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => confirmShareArticle("WhatsApp")}
                className="flex flex-col items-center rounded-lg border border-gray-200 p-3 hover:border-green-500 hover:bg-green-50 dark:border-gray-700"
              >
                <div className="mb-1 text-2xl">💬</div>
                <span className="text-xs">WhatsApp</span>
              </button>
              <button
                onClick={() => confirmShareArticle("SMS")}
                className="flex flex-col items-center rounded-lg border border-gray-200 p-3 hover:border-blue-500 hover:bg-blue-50 dark:border-gray-700"
              >
                <div className="mb-1 text-2xl">📱</div>
                <span className="text-xs">SMS</span>
              </button>
              <button
                onClick={() => confirmShareArticle("Email")}
                className="flex flex-col items-center rounded-lg border border-gray-200 p-3 hover:border-red-500 hover:bg-red-50 dark:border-gray-700"
              >
                <div className="mb-1 text-2xl">📧</div>
                <span className="text-xs">Email</span>
              </button>
            </div>

            <div className="rounded-lg bg-yellow-50 p-4 dark:bg-yellow-900/20">
              <div className="flex items-start">
                <MdInfo className="mr-2 mt-0.5 h-5 w-5 text-yellow-600" />
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  This article contains general health information. Always
                  consult a healthcare provider for personalized advice.
                </p>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* SMS Subscription Modal */}
      <Modal
        isOpen={smsSubscribeModalOpen}
        onClose={() => setSmsSubscribeModalOpen(false)}
        title="📱 SMS Nutrition Tips"
        size="md"
      >
        <div className="space-y-6">
          <div className="text-center">
            <FaAppleAlt className="mx-auto mb-4 h-12 w-12 text-green-600" />
            <h4 className="mb-2 text-xl font-bold text-navy-700 dark:text-white">
              Get Daily Nutrition Tips
            </h4>
            <p className="text-gray-600 dark:text-gray-300">
              Receive age-appropriate nutrition advice via SMS
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Child's Age
              </label>
              <select className="w-full rounded-lg border border-gray-300 p-2 dark:border-gray-600 dark:bg-navy-700">
                <option value="">Select age group</option>
                <option value="0-6">0-6 months</option>
                <option value="6-12">6-12 months</option>
                <option value="1-3">1-3 years</option>
                <option value="4-12">4-12 years</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Phone Number
              </label>
              <input
                type="tel"
                placeholder="+27 72 123 4567"
                className="w-full rounded-lg border border-gray-300 p-2 dark:border-gray-600 dark:bg-navy-700"
              />
            </div>

            <div className="flex items-start">
              <input type="checkbox" className="mr-3 mt-1 h-4 w-4 rounded" />
              <label className="text-sm text-gray-600 dark:text-gray-300">
                I agree to receive daily nutrition tips via SMS. Standard SMS
                rates apply.
              </label>
            </div>
          </div>

          <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
            <div className="flex items-start">
              <MdInfo className="mr-2 mt-0.5 h-5 w-5 text-blue-600" />
              <p className="text-sm text-blue-700 dark:text-blue-300">
                You'll receive 1 SMS per day with practical nutrition tips.
                Reply STOP to unsubscribe anytime.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setSmsSubscribeModalOpen(false)}
              className="rounded-lg border border-gray-300 px-6 py-2 font-medium hover:bg-gray-50 dark:border-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={confirmSMSSubscription}
              className="rounded-lg bg-green-500 px-6 py-2 font-medium text-white hover:bg-green-600"
            >
              Subscribe Now
            </button>
          </div>
        </div>
      </Modal>
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-navy-700 dark:text-white">
          Nutrition Library
        </h3>
        <p className="text-gray-600 dark:text-gray-300">
          Evidence-based nutrition guidance for you and your family
        </p>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="relative">
            <MdSearch className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search nutrition articles..."
              className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-4 dark:border-gray-600 dark:bg-navy-800"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => setFilterModalOpen(true)}
            className="linear flex items-center rounded-lg bg-lightPrimary px-4 py-2 text-sm font-medium text-brand-500 transition duration-200 hover:bg-gray-100 dark:bg-navy-700 dark:text-white"
          >
            <MdFilterList className="mr-2 h-4 w-4" />
            Filter
          </button>
        </div>
      </div>

      {/* Category Chips */}
      <div className="mb-6 flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => {
              setSelectedCategory(category.id);
              showToast(`Showing ${category.name} articles`, "info");
            }}
            className={`flex items-center rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              selectedCategory === category.id
                ? "bg-brand-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-navy-700 dark:text-gray-300"
            }`}
          >
            <span className="mr-2">{category.icon}</span>
            {category.name}
            <span className="ml-2 rounded-full bg-white/20 px-2 py-1 text-xs">
              {category.count}
            </span>
          </button>
        ))}
      </div>

      {/* Featured Articles */}
      {selectedCategory === "all" && (
        <div className="mb-6">
          <h4 className="mb-4 text-lg font-bold text-navy-700 dark:text-white">
            🔥 Featured Articles
          </h4>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {articles
              .filter((article) => article.featured)
              .map((article) => (
                <Card
                  key={article.id}
                  extra="p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-bold text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                        Featured
                      </span>
                      <h5 className="mt-2 text-lg font-bold text-navy-700 dark:text-white">
                        {article.title}
                      </h5>
                      <div className="mt-2 flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <MdAccessTime className="mr-1 h-4 w-4" />
                        {article.readTime} read • {article.difficulty}
                      </div>
                    </div>
                    <button
                      onClick={() => toggleBookmark(article.id)}
                      className="text-gray-400 hover:text-yellow-500"
                    >
                      {bookmarkedArticles.includes(article.id) ? (
                        <MdBookmark className="h-6 w-6 text-yellow-500" />
                      ) : (
                        <MdBookmarkBorder className="h-6 w-6" />
                      )}
                    </button>
                  </div>
                  <p className="mt-3 text-gray-600 dark:text-gray-300">
                    {article.content.substring(0, 120)}...
                  </p>
                  <div className="mt-4 flex gap-3">
                    <button
                      onClick={() => handleViewArticle(article)}
                      className="linear flex-1 rounded-lg bg-brand-500 py-2 text-sm font-medium text-white hover:bg-brand-600"
                    >
                      Read Full Article
                    </button>
                    <button
                      onClick={() => handleSaveOffline(article)}
                      className="rounded-lg border border-gray-300 px-3 py-2 hover:bg-gray-50 dark:border-gray-600"
                    >
                      <MdDownload className="h-4 w-4" />
                    </button>
                  </div>
                </Card>
              ))}
          </div>
        </div>
      )}

      {/* All Articles */}
      <div>
        <h4 className="mb-4 text-lg font-bold text-navy-700 dark:text-white">
          {selectedCategory === "all"
            ? "All Nutrition Articles"
            : categories.find((c) => c.id === selectedCategory)?.name}
        </h4>
        <div className="grid grid-cols-1 gap-6">
          {filteredArticles.map((article) => (
            <Card
              key={article.id}
              extra="p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="text-lg font-bold text-navy-700 dark:text-white">
                        {article.title}
                      </h5>
                      <div className="mt-1 flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <span className="flex items-center">
                          <MdAccessTime className="mr-1 h-4 w-4" />
                          {article.readTime} read
                        </span>
                        <span className="mx-2">•</span>
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-medium ${
                            article.difficulty === "Beginner"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                              : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                          }`}
                        >
                          {article.difficulty}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleDownloadArticle(article)}
                        className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-300"
                        title="Download"
                      >
                        <MdDownload className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleShareArticle(article)}
                        className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-300"
                        title="Share"
                      >
                        <MdShare className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => toggleBookmark(article.id)}
                        className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-300"
                        title="Bookmark"
                      >
                        {bookmarkedArticles.includes(article.id) ? (
                          <MdBookmark className="h-5 w-5 text-yellow-500" />
                        ) : (
                          <MdBookmarkBorder className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <p className="mt-3 text-gray-600 dark:text-gray-300">
                    {article.content}
                  </p>

                  {/* Key Tips */}
                  <div className="mt-4">
                    <h6 className="mb-2 text-sm font-bold text-navy-700 dark:text-white">
                      Key Tips:
                    </h6>
                    <ul className="space-y-2">
                      {article.tips.map((tip, index) => (
                        <li
                          key={index}
                          className="flex items-start rounded-lg bg-gray-50 p-3 dark:bg-navy-700"
                        >
                          <div className="mr-3 flex h-6 w-6 items-center justify-center rounded-full bg-brand-100 text-brand-600 dark:bg-brand-900/30">
                            {index + 1}
                          </div>
                          <span className="flex-1 text-sm text-gray-700 dark:text-gray-300">
                            {tip}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-6 flex gap-3">
                    <button
                      onClick={() => handleViewArticle(article)}
                      className="linear flex-1 rounded-lg bg-brand-500 py-2 font-medium text-white hover:bg-brand-600"
                    >
                      Read Full Guide
                    </button>
                    <button
                      onClick={() => handleSaveOffline(article)}
                      className="rounded-lg border border-gray-300 px-4 py-2 font-medium hover:bg-gray-50 dark:border-gray-600"
                    >
                      Save for Offline
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* SMS Nutrition Tips */}
      <div className="mt-6 rounded-lg bg-green-50 p-6 dark:bg-green-900/20">
        <div className="flex flex-col items-center text-center md:flex-row md:text-left">
          <div className="mb-4 md:mb-0 md:mr-6">
            <FaAppleAlt className="h-12 w-12 text-green-600 dark:text-green-400" />
          </div>
          <div className="flex-1">
            <h4 className="text-lg font-bold text-green-800 dark:text-green-300">
              Get Daily Nutrition Tips via SMS
            </h4>
            <p className="mt-2 text-green-600 dark:text-green-400">
              Text "NUTRITION" to 12345 to receive daily nutrition tips for your
              child's age group. Free service, standard SMS rates apply.
            </p>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <input
                type="text"
                placeholder="Enter your child's age"
                className="rounded-lg border border-green-300 bg-white px-4 py-2 dark:border-green-700 dark:bg-navy-800"
              />
              <button
                onClick={handleSubscribeSMS}
                className="linear rounded-lg bg-green-600 px-6 py-2 font-medium text-white hover:bg-green-700"
              >
                Subscribe to SMS Tips
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Meal Planner */}
      <div className="mt-6">
        <Card extra="p-6">
          <h4 className="mb-4 text-lg font-bold text-navy-700 dark:text-white">
            🍽️ Quick Meal Idea Generator
          </h4>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Available Ingredients
              </label>
              <div className="flex flex-wrap gap-2">
                {["Rice", "Beans", "Eggs", "Tomatoes", "Onions", "Spinach"].map(
                  (ingredient) => (
                    <span
                      key={ingredient}
                      className="rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                    >
                      {ingredient}
                    </span>
                  )
                )}
              </div>
              <button className="linear mt-4 w-full rounded-lg bg-brand-50 py-2 text-sm font-medium text-brand-600 hover:bg-brand-100 dark:bg-brand-900/30">
                + Add Ingredients
              </button>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Suggested Meal
              </label>
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-navy-700">
                <h5 className="font-bold text-navy-700 dark:text-white">
                  Bean & Spinach Rice Bowl
                </h5>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Cook rice. Sauté onions and tomatoes, add beans and spinach.
                  Season and serve over rice.
                </p>
                <p className="mt-2 text-xs text-gray-500">
                  Prep time: 20 mins • Serves: 4
                </p>
              </div>
              <button
                onClick={() => showToast("New meal idea generated!", "success")}
                className="linear mt-4 w-full rounded-lg bg-green-500 py-2 text-sm font-medium text-white hover:bg-green-600"
              >
                Generate Another Idea
              </button>
            </div>
          </div>
        </Card>
      </div>

      {/* Disclaimer */}
      <div className="mt-6 rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
        <div className="flex items-start">
          <MdWarning className="mr-3 mt-1 h-5 w-5 text-blue-600 dark:text-blue-400" />
          <div>
            <p className="text-sm text-blue-800 dark:text-blue-300">
              <strong>Important:</strong> This information is for educational
              purposes only. Always consult with a healthcare provider or
              nutritionist for personalized dietary advice, especially for
              infants, pregnant women, or individuals with medical conditions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NutritionLibrary;
