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
  MdCancel,
  MdDescription,
  MdInfo,
  MdTag,
  MdTranslate,
  MdPerson,
  MdCalendarToday,
} from "react-icons/md";
import { FaFileMedical, FaLanguage, FaDownload } from "react-icons/fa";
import { useToast } from "hooks/useToast";

// Component imports
import StatsGrid from "./components/StatsGrid";
import SearchBar from "./components/SearchBar";
import CategorySidebar from "./components/CategorySidebar";
import ArticleList from "./components/ArticleList";
import ContentInsights from "./components/ContentInsights";
import EditArticleModal from "./components/EditArticleModal";
import CreateArticleModal from "./components/CreateArticleModal";
import {
  DeleteModal,
  PublishModal,
  PreviewModal,
} from "./components/ActionModals";

const ContentManagement = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { showToast } = useToast();

  // Modal states
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [publishModalOpen, setPublishModalOpen] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [articleForm, setArticleForm] = useState({
    title: "",
    category: "nutrition",
    status: "draft",
    tags: [],
    language: ["en"],
  });

  // Data
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
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
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
      content: "Malaria is a serious disease caused by parasites...",
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
      content: "Diabetes management during pregnancy requires...",
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
      content: "Protein is essential for growth and repair...",
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
      content: "Tuberculosis (TB) is an infectious disease...",
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
      content: "Immediate first aid for burns can significantly...",
    },
  ];

  // Modal handlers
  const handleEditClick = (article) => {
    setSelectedArticle(article);
    setArticleForm({
      title: article.title,
      category: article.category,
      status: article.status,
      tags: [...article.tags],
      language: [...article.language],
    });
    setEditModalOpen(true);
  };

  const handleDeleteClick = (article) => {
    setSelectedArticle(article);
    setDeleteModalOpen(true);
  };

  const handlePublishClick = (article) => {
    setSelectedArticle(article);
    setPublishModalOpen(true);
  };

  const handlePreviewClick = (article) => {
    setSelectedArticle(article);
    setPreviewModalOpen(true);
  };

  const handleCreateClick = () => {
    setArticleForm({
      title: "",
      category: "nutrition",
      status: "draft",
      tags: [],
      language: ["en"],
    });
    setCreateModalOpen(true);
  };

  // Action confirmations
  const confirmEdit = () => {
    console.log(`Editing article ${selectedArticle.id}`, articleForm);
    setEditModalOpen(false);
    showToast("Article updated successfully!", "success");
  };

  const confirmDelete = () => {
    console.log(`Deleting article ${selectedArticle.id}`);
    setDeleteModalOpen(false);
    showToast("Article deleted successfully!", "error");
  };

  const confirmPublish = () => {
    console.log(`Publishing article ${selectedArticle.id}`);
    setPublishModalOpen(false);
    showToast("Article published successfully!", "success");
  };

  const confirmCreate = () => {
    console.log("Creating new article", articleForm);
    setCreateModalOpen(false);
    showToast("New article created successfully!", "success");
  };

  // Form handlers
  const handleFormChange = (field, value) => {
    setArticleForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleTagAdd = (tag) => {
    if (tag && !articleForm.tags.includes(tag)) {
      setArticleForm((prev) => ({
        ...prev,
        tags: [...prev.tags, tag],
      }));
    }
  };

  const handleTagRemove = (tagToRemove) => {
    setArticleForm((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleLanguageToggle = (langCode) => {
    setArticleForm((prev) => {
      const newLanguages = prev.language.includes(langCode)
        ? prev.language.filter((l) => l !== langCode)
        : [...prev.language, langCode];
      return { ...prev, language: newLanguages };
    });
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
          <button
            onClick={handleCreateClick}
            className="linear flex items-center justify-center rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white transition duration-200 hover:scale-105 hover:bg-brand-600 active:scale-95 active:bg-brand-700"
          >
            <MdAdd className="mr-2 h-4 w-4" />
            Create New Article
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <StatsGrid contentStats={contentStats} />

      {/* Search and Categories */}
      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        languages={languages}
      />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Categories Sidebar */}
        <CategorySidebar
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          languages={languages}
        />

        {/* Content List */}
        <div className="lg:col-span-3">
          <ArticleList
            articles={contentArticles}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
            onPublish={handlePublishClick}
            onPreview={handlePreviewClick}
          />

          {/* Content Insights */}
          <ContentInsights articles={contentArticles} languages={languages} />
        </div>
      </div>

      {/* Footer Note */}
      <div className="mt-6 rounded-lg bg-green-50 p-4 text-center text-sm text-green-800 transition-all duration-300 hover:scale-[1.01] dark:bg-green-900/20 dark:text-green-300">
        <p>
          📚 <strong>Note:</strong> All health content is reviewed by certified
          medical professionals and updated quarterly to ensure accuracy and
          relevance.
        </p>
      </div>

      {/* Modals */}
      <EditArticleModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        article={selectedArticle}
        articleForm={articleForm}
        handleFormChange={handleFormChange}
        handleTagAdd={handleTagAdd}
        handleTagRemove={handleTagRemove}
        handleLanguageToggle={handleLanguageToggle}
        confirmEdit={confirmEdit}
        categories={categories}
        languages={languages}
      />

      <CreateArticleModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        articleForm={articleForm}
        handleFormChange={handleFormChange}
        confirmCreate={confirmCreate}
        categories={categories}
      />

      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        article={selectedArticle}
        confirmDelete={confirmDelete}
      />

      <PublishModal
        isOpen={publishModalOpen}
        onClose={() => setPublishModalOpen(false)}
        article={selectedArticle}
        confirmPublish={confirmPublish}
      />

      <PreviewModal
        isOpen={previewModalOpen}
        onClose={() => setPreviewModalOpen(false)}
        article={selectedArticle}
      />
    </div>
  );
};

export default ContentManagement;
