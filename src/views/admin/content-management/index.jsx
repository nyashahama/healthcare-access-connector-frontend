import React, { useState } from "react";
import {
  MdSearch,
  MdFilterList,
  MdEdit,
  MdDelete,
  MdVisibility,
  MdPublic,
  MdLock,
  MdSchedule,
  MdAdd,
  MdBook,
  MdLocalHospital,
  MdRestaurant,
  MdChildCare,
  MdWarning,
  MdCheckCircle,
} from "react-icons/md";
import { FaFileMedical, FaLanguage, FaDownload } from "react-icons/fa";
import Card from "components/card";

const ContentManagement = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const contentStats = [
    {
      title: "Total Articles",
      count: "1,245",
      icon: <MdBook className="h-6 w-6 text-blue-500" />,
      color: "blue",
      trend: "+24 this month",
    },
    {
      title: "Published",
      count: "1,089",
      icon: <MdPublic className="h-6 w-6 text-green-500" />,
      color: "green",
      trend: "92% published",
    },
    {
      title: "Drafts",
      count: "98",
      icon: <MdSchedule className="h-6 w-6 text-yellow-500" />,
      color: "yellow",
      trend: "Awaiting review",
    },
    {
      title: "Translations",
      count: "5",
      icon: <FaLanguage className="h-6 w-6 text-purple-500" />,
      color: "purple",
      trend: "Languages supported",
    },
  ];

  const categories = [
    { id: "all", name: "All Content", count: 1245, icon: <MdBook /> },
    { id: "nutrition", name: "Nutrition", count: 456, icon: <MdRestaurant /> },
    { id: "pediatrics", name: "Pediatrics", count: 321, icon: <MdChildCare /> },
    {
      id: "emergency",
      name: "Emergency Care",
      count: 189,
      icon: <MdLocalHospital />,
    },
    {
      id: "preventive",
      name: "Preventive Care",
      count: 156,
      icon: <MdCheckCircle />,
    },
    {
      id: "chronic",
      name: "Chronic Conditions",
      count: 123,
      icon: <FaFileMedical />,
    },
  ];

  const languages = [
    { code: "en", name: "English", articles: 1245 },
    { code: "zu", name: "isiZulu", articles: 845 },
    { code: "xh", name: "isiXhosa", articles: 756 },
    { code: "af", name: "Afrikaans", articles: 432 },
    { code: "st", name: "Sesotho", articles: 389 },
  ];

  const contentArticles = [
    {
      id: 1,
      title: "Nutrition for Infants (0-6 months)",
      category: "nutrition",
      language: ["en", "zu", "xh"],
      status: "published",
      views: "12,458",
      lastUpdated: "2024-01-15",
      author: "Dr. Sarah Johnson",
      tags: ["infants", "breastfeeding", "nutrition"],
      featured: true,
    },
    {
      id: 2,
      title: "Recognizing Malaria Symptoms in Children",
      category: "pediatrics",
      language: ["en", "zu"],
      status: "published",
      views: "8,742",
      lastUpdated: "2024-01-14",
      author: "Dr. Michael Chen",
      tags: ["malaria", "symptoms", "emergency"],
      featured: true,
    },
    {
      id: 3,
      title: "Managing Diabetes During Pregnancy",
      category: "chronic",
      language: ["en", "af"],
      status: "draft",
      views: "0",
      lastUpdated: "2024-01-13",
      author: "Dr. Amina Hassan",
      tags: ["diabetes", "pregnancy", "management"],
      featured: false,
    },
    {
      id: 4,
      title: "Affordable Protein Sources for Families",
      category: "nutrition",
      language: ["en", "zu", "xh", "st"],
      status: "published",
      views: "15,689",
      lastUpdated: "2024-01-12",
      author: "Nutrition Team",
      tags: ["protein", "affordable", "family"],
      featured: true,
    },
    {
      id: 5,
      title: "TB Prevention and Treatment Guide",
      category: "preventive",
      language: ["en"],
      status: "pending",
      views: "0",
      lastUpdated: "2024-01-11",
      author: "Public Health Dept",
      tags: ["tuberculosis", "prevention", "treatment"],
      featured: false,
    },
    {
      id: 6,
      title: "First Aid for Burns and Scalds",
      category: "emergency",
      language: ["en", "zu", "xh", "af"],
      status: "published",
      views: "9,432",
      lastUpdated: "2024-01-10",
      author: "Emergency Response Team",
      tags: ["first aid", "burns", "emergency"],
      featured: false,
    },
  ];

  const handleEditArticle = (articleId) => {
    console.log(`Editing article ${articleId}`);
  };

  const handleDeleteArticle = (articleId) => {
    console.log(`Deleting article ${articleId}`);
  };

  const handlePublishArticle = (articleId) => {
    console.log(`Publishing article ${articleId}`);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      published: {
        color:
          "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
        icon: <MdPublic className="h-3 w-3" />,
        text: "Published",
      },
      draft: {
        color:
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
        icon: <MdSchedule className="h-3 w-3" />,
        text: "Draft",
      },
      pending: {
        color:
          "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
        icon: <MdWarning className="h-3 w-3" />,
        text: "Pending Review",
      },
    };

    const config = statusConfig[status] || statusConfig.draft;
    return (
      <span
        className={`flex items-center rounded-full px-3 py-1 text-xs font-bold ${config.color}`}
      >
        {config.icon}
        <span className="ml-1">{config.text}</span>
      </span>
    );
  };

  const LanguageBadges = ({ languages }) => {
    const languageNames = {
      en: "English",
      zu: "isiZulu",
      xh: "isiXhosa",
      af: "Afrikaans",
      st: "Sesotho",
    };

    return (
      <div className="flex flex-wrap gap-1">
        {languages.map((lang) => (
          <span
            key={lang}
            className="rounded-full bg-blue-50 px-2 py-1 text-xs text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
          >
            {languageNames[lang] || lang}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="h-full">
      {/* Header */}
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h3 className="text-2xl font-bold text-navy-700 dark:text-white">
            Content Management System
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Manage health education articles, resources, and translations
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="linear flex items-center justify-center rounded-lg bg-lightPrimary px-4 py-2 text-sm font-medium text-brand-500 transition duration-200 hover:bg-gray-100 active:bg-gray-200 dark:bg-navy-700 dark:text-white dark:hover:bg-white/20">
            <MdFilterList className="mr-2 h-4 w-4" />
            Filter
          </button>
          <button className="linear flex items-center justify-center rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700">
            <MdAdd className="mr-2 h-4 w-4" />
            Create New Article
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {contentStats.map((stat, index) => (
          <div
            key={index}
            className={`rounded-xl border border-gray-200 p-4 dark:border-gray-700 ${
              stat.color === "blue"
                ? "bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/10"
                : stat.color === "green"
                ? "bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/10"
                : stat.color === "yellow"
                ? "bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-900/10"
                : "bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-900/10"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  {stat.title}
                </div>
                <div className="mt-1 text-2xl font-bold text-navy-700 dark:text-white">
                  {stat.count}
                </div>
              </div>
              <div className="rounded-full bg-white p-3 dark:bg-navy-700">
                {stat.icon}
              </div>
            </div>
            <div className="mt-3 text-xs font-medium text-gray-600 dark:text-gray-300">
              {stat.trend}
            </div>
          </div>
        ))}
      </div>

      {/* Search and Categories */}
      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Search Bar */}
        <div className="lg:col-span-2">
          <div className="rounded-xl bg-white p-4 dark:bg-navy-800">
            <div className="relative">
              <MdSearch className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search articles by title, content, or tags..."
                className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 dark:border-gray-600 dark:bg-navy-700"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Language Filter */}
        <div className="rounded-xl bg-white p-4 dark:bg-navy-800">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">Language:</span>
            <select className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm dark:border-gray-600 dark:bg-navy-700">
              <option>All Languages</option>
              {languages.map((lang) => (
                <option key={lang.code}>{lang.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Categories Sidebar */}
        <div>
          <Card extra="p-6">
            <h4 className="mb-4 text-lg font-bold text-navy-700 dark:text-white">
              Categories
            </h4>
            <div className="space-y-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex w-full items-center justify-between rounded-lg p-3 text-left ${
                    selectedCategory === category.id
                      ? "bg-brand-50 text-brand-600 dark:bg-brand-500/20 dark:text-brand-300"
                      : "hover:bg-gray-50 dark:hover:bg-navy-700"
                  }`}
                >
                  <div className="flex items-center">
                    <span className="mr-3 text-gray-600 dark:text-gray-300">
                      {category.icon}
                    </span>
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      {category.name}
                    </span>
                  </div>
                  <span className="rounded-full bg-gray-100 px-2 py-1 text-xs dark:bg-navy-700">
                    {category.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Language Distribution */}
            <div className="mt-8">
              <h5 className="mb-3 text-sm font-medium text-gray-600">
                Language Distribution
              </h5>
              <div className="space-y-3">
                {languages.map((lang) => (
                  <div key={lang.code} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-700 dark:text-gray-300">
                        {lang.name}
                      </span>
                      <span className="font-medium">{lang.articles}</span>
                    </div>
                    <div className="h-1 w-full rounded-full bg-gray-200">
                      <div
                        className="h-1 rounded-full bg-blue-500"
                        style={{
                          width: `${(lang.articles / 1245) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Content List */}
        <div className="lg:col-span-3">
          <Card extra="p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h4 className="text-lg font-bold text-navy-700 dark:text-white">
                  Health Education Articles
                </h4>
                <p className="text-sm text-gray-600">
                  {contentArticles.length} articles found
                </p>
              </div>
              <div className="flex items-center gap-3">
                <select className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm dark:border-gray-600 dark:bg-navy-700">
                  <option>Sort by: Most Recent</option>
                  <option>Most Viewed</option>
                  <option>Alphabetical</option>
                </select>
                <button className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium dark:border-gray-600">
                  <FaDownload className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Articles List */}
            <div className="space-y-4">
              {contentArticles.map((article) => (
                <div
                  key={article.id}
                  className="rounded-lg border border-gray-200 p-4 hover:border-brand-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-navy-700"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center">
                            <h5 className="text-lg font-bold text-navy-700 dark:text-white">
                              {article.title}
                            </h5>
                            {article.featured && (
                              <span className="ml-2 rounded-full bg-yellow-100 px-2 py-1 text-xs font-bold text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
                                Featured
                              </span>
                            )}
                          </div>
                          <div className="mt-2 flex items-center text-sm text-gray-600 dark:text-gray-300">
                            <span className="mr-4">
                              Category:{" "}
                              <span className="font-medium">
                                {article.category}
                              </span>
                            </span>
                            <span className="mr-4">
                              Author:{" "}
                              <span className="font-medium">
                                {article.author}
                              </span>
                            </span>
                            <span>Last updated: {article.lastUpdated}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-500">Views</div>
                          <div className="text-lg font-bold text-navy-700 dark:text-white">
                            {article.views}
                          </div>
                        </div>
                      </div>

                      {/* Tags and Languages */}
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex flex-wrap gap-2">
                          {article.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700 dark:bg-navy-700 dark:text-gray-300"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                        <LanguageBadges languages={article.language} />
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4 dark:border-gray-700">
                    <div>{getStatusBadge(article.status)}</div>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleEditArticle(article.id)}
                        className="flex items-center rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300"
                      >
                        <MdEdit className="mr-2 h-4 w-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteArticle(article.id)}
                        className="flex items-center rounded-lg border border-red-300 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100 dark:border-red-700 dark:bg-red-900/20 dark:text-red-300"
                      >
                        <MdDelete className="mr-2 h-4 w-4" />
                        Delete
                      </button>
                      {article.status !== "published" && (
                        <button
                          onClick={() => handlePublishArticle(article.id)}
                          className="flex items-center rounded-lg bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-600"
                        >
                          <MdPublic className="mr-2 h-4 w-4" />
                          Publish
                        </button>
                      )}
                      <button className="flex items-center rounded-lg border border-brand-300 bg-brand-50 px-4 py-2 text-sm font-medium text-brand-700 hover:bg-brand-100 dark:border-brand-700 dark:bg-brand-900/20 dark:text-brand-300">
                        <MdVisibility className="mr-2 h-4 w-4" />
                        Preview
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Showing 1-6 of {contentArticles.length} articles
              </div>
              <div className="flex items-center space-x-2">
                <button className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm dark:border-gray-600">
                  Previous
                </button>
                <button className="rounded-lg bg-brand-500 px-3 py-1.5 text-sm text-white">
                  1
                </button>
                <button className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm dark:border-gray-600">
                  2
                </button>
                <button className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm dark:border-gray-600">
                  Next
                </button>
              </div>
            </div>
          </Card>

          {/* Content Insights */}
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Most Popular Articles */}
            <Card extra="p-6">
              <h4 className="mb-4 text-lg font-bold text-navy-700 dark:text-white">
                📊 Most Popular Articles
              </h4>
              <div className="space-y-4">
                {contentArticles
                  .sort((a, b) => parseInt(b.views) - parseInt(a.views))
                  .slice(0, 3)
                  .map((article) => (
                    <div
                      key={article.id}
                      className="flex items-center justify-between"
                    >
                      <div className="flex-1">
                        <div className="font-medium text-navy-700 dark:text-white">
                          {article.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          {article.category}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{article.views}</div>
                        <div className="text-xs text-gray-500">views</div>
                      </div>
                    </div>
                  ))}
              </div>
            </Card>

            {/* Translation Progress */}
            <Card extra="p-6">
              <h4 className="mb-4 text-lg font-bold text-navy-700 dark:text-white">
                🌍 Translation Progress
              </h4>
              <div className="space-y-3">
                {languages.map((lang) => (
                  <div key={lang.code} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-700 dark:text-gray-300">
                        {lang.name}
                      </span>
                      <span className="font-medium">
                        {Math.round((lang.articles / 1245) * 100)}%
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-gray-200">
                      <div
                        className="h-2 rounded-full bg-purple-500"
                        style={{
                          width: `${(lang.articles / 1245) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="mt-6 rounded-lg bg-green-50 p-4 text-center text-sm text-green-800 dark:bg-green-900/20 dark:text-green-300">
        <p>
          📚 <strong>Note:</strong> All health content is reviewed by certified
          medical professionals and updated quarterly to ensure accuracy and
          relevance.
        </p>
      </div>
    </div>
  );
};

export default ContentManagement;
