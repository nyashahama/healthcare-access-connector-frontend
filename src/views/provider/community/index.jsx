import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdForum,
  MdSearch,
  MdAdd,
  MdThumbUp,
  MdComment,
  MdTrendingUp,
  MdNewReleases,
  MdPerson,
  MdFilterList,
  MdAccessTime,
  MdCategory,
  MdVerifiedUser,
  MdScience,
  MdLocalHospital,
  MdSchool,
} from "react-icons/md";
import {
  FaStethoscope,
  FaUserMd,
  FaUserNurse,
  FaPills,
  FaFlask,
} from "react-icons/fa";
import Card from "components/card";
import { useToast } from "hooks/useToast";

const ProviderCommunityForum = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { showToast } = useToast();

  const categories = [
    { id: "all", name: "All Topics", icon: <MdForum />, count: 156 },
    {
      id: "case-discussions",
      name: "Case Discussions",
      icon: <FaStethoscope />,
      count: 42,
    },
    {
      id: "specialties",
      name: "Specialty Forums",
      icon: <MdLocalHospital />,
      count: 28,
    },
    {
      id: "clinical-guidelines",
      name: "Clinical Guidelines",
      icon: <MdSchool />,
      count: 35,
    },
    { id: "pharmacology", name: "Pharmacology", icon: <FaPills />, count: 24 },
    { id: "diagnostics", name: "Diagnostics", icon: <FaFlask />, count: 18 },
    {
      id: "practice-management",
      name: "Practice Management",
      icon: <FaUserMd />,
      count: 22,
    },
    {
      id: "research",
      name: "Research Updates",
      icon: <MdScience />,
      count: 15,
    },
  ];

  const posts = [
    {
      id: "1",
      title: "Managing resistant hypertension in type 2 diabetes",
      author: "Dr. Sarah Johnson",
      credentials: "Cardiologist",
      verified: true,
      category: "case-discussions",
      content:
        "Patient: 58yo male, BMI 32, HbA1c 8.5%, BP 150/95 despite triple therapy. Seeking opinions on adding spironolactone vs. renal denervation.",
      likes: 42,
      comments: 18,
      time: "3 hours ago",
      trending: true,
      specialty: "Cardiology",
      authorAvatar: "👩‍⚕️",
    },
    {
      id: "2",
      title: "New SAHPRA approval: Novel anticoagulant for stroke prevention",
      author: "Dr. Michael Chen",
      credentials: "Pharmacologist",
      verified: true,
      category: "pharmacology",
      content:
        "SAHPRA approved Rivaroxaban-XR for stroke prevention in AF. Any clinical experience with dosing in elderly patients?",
      likes: 56,
      comments: 24,
      time: "1 day ago",
      trending: true,
      specialty: "Pharmacology",
      authorAvatar: "👨‍⚕️",
    },
    {
      id: "3",
      title: "Clinic billing codes update 2024 - NHI implications",
      author: "Nurse Thandi",
      credentials: "Practice Manager",
      verified: true,
      category: "practice-management",
      content:
        "Important changes to billing codes effective March 2024. How is everyone preparing for NHI transition?",
      likes: 38,
      comments: 31,
      time: "2 days ago",
      trending: true,
      specialty: "Administration",
      authorAvatar: "👩",
    },
    {
      id: "4",
      title: "Interpretation of ambiguous troponin results",
      author: "Dr. James Wilson",
      credentials: "Emergency Medicine",
      verified: true,
      category: "diagnostics",
      content:
        "Troponin 45 ng/L (ref <40) in 65yo with atypical chest pain. Serial trend shows 42, 45, 46. ECG normal. Discharge vs. admit?",
      likes: 29,
      comments: 14,
      time: "3 days ago",
      trending: false,
      specialty: "Emergency Medicine",
      authorAvatar: "👨",
    },
    {
      id: "5",
      title: "Pediatric asthma: Step-up therapy debate",
      author: "Dr. Lerato More",
      credentials: "Pediatric Pulmonologist",
      verified: true,
      category: "clinical-guidelines",
      content:
        "GINA 2024 vs. local SA guidelines for moderate persistent asthma in 6-11yo. LABA vs. increasing ICS dose?",
      likes: 34,
      comments: 22,
      time: "4 days ago",
      trending: false,
      specialty: "Pediatrics",
      authorAvatar: "👩",
    },
    {
      id: "6",
      title: "Managing staff shortages in rural clinics",
      author: "Dr. Samuel Botha",
      credentials: "Rural Health",
      verified: true,
      category: "practice-management",
      content:
        "Seeking strategies for 24/7 coverage with limited staff. Telemedicine integration experiences?",
      likes: 27,
      comments: 19,
      time: "5 days ago",
      trending: false,
      specialty: "Rural Health",
      authorAvatar: "👨‍⚕️",
    },
  ];

  const filteredPosts = posts.filter((post) => {
    if (activeCategory !== "all" && post.category !== activeCategory) {
      return false;
    }
    if (
      searchQuery &&
      !post.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !post.content.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !post.specialty.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const handleViewPost = (postId) => {
    navigate(`/provider/community/post/${postId}`);
  };

  const handleCreatePost = () => {
    navigate("/provider/community/new");
  };

  const handleQuickLike = (postId, e) => {
    e.stopPropagation();
    showToast("Post liked!", "success");
  };

  const PostCard = ({ post }) => (
    <Card
      extra="p-4 hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => handleViewPost(post.id)}
    >
      <div className="flex items-start gap-4">
        {/* Author Info */}
        <div className="flex-shrink-0">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-100 text-2xl dark:bg-brand-900/30">
            {post.authorAvatar}
          </div>
        </div>

        {/* Post Content */}
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h5 className="font-bold text-navy-700 dark:text-white">
                {post.title}
              </h5>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <span className="flex items-center">
                  <MdPerson className="mr-1 h-3 w-3" />
                  {post.author}
                </span>
                <span className="text-xs text-gray-500">
                  {post.credentials}
                </span>
                {post.verified && (
                  <span className="flex items-center text-green-600 dark:text-green-400">
                    <MdVerifiedUser className="mr-1 h-3 w-3" />
                    Verified
                  </span>
                )}
                <span className="flex items-center">
                  <MdAccessTime className="mr-1 h-3 w-3" />
                  {post.time}
                </span>
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs dark:bg-gray-800">
                  {post.category.replace("-", " ")}
                </span>
                <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                  {post.specialty}
                </span>
                {post.trending && (
                  <span className="flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs text-red-800 dark:bg-red-900 dark:text-red-300">
                    <MdTrendingUp className="mr-1 h-3 w-3" />
                    Trending
                  </span>
                )}
              </div>
            </div>
          </div>

          <p className="mt-3 line-clamp-2 text-gray-600 dark:text-gray-300">
            {post.content}
          </p>

          {/* Stats */}
          <div className="mt-4 flex items-center gap-4">
            <button
              onClick={(e) => handleQuickLike(post.id, e)}
              className="flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-sm hover:bg-gray-200 dark:bg-gray-800"
            >
              <MdThumbUp className="h-4 w-4" />
              <span>{post.likes}</span>
            </button>
            <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300">
              <MdComment className="h-4 w-4" />
              <span>{post.comments} professional comments</span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleViewPost(post.id);
              }}
              className="ml-auto text-sm font-medium text-brand-500 hover:text-brand-600"
            >
              Join Discussion →
            </button>
          </div>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="h-full">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-navy-700 dark:text-white">
          Professional Community Forum
        </h3>
        <p className="text-gray-600 dark:text-gray-300">
          Connect with healthcare professionals, discuss cases, and share
          medical knowledge
        </p>
      </div>

      {/* Quick Stats */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card extra="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Active Professionals
              </p>
              <h4 className="text-2xl font-bold text-navy-700 dark:text-white">
                1,248
              </h4>
            </div>
            <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900/30">
              <FaUserMd className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </Card>
        <Card extra="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Case Discussions
              </p>
              <h4 className="text-2xl font-bold text-navy-700 dark:text-white">
                342
              </h4>
            </div>
            <div className="rounded-full bg-green-100 p-3 dark:bg-green-900/30">
              <FaStethoscope className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </Card>
        <Card extra="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Guidelines Shared
              </p>
              <h4 className="text-2xl font-bold text-navy-700 dark:text-white">
                128
              </h4>
            </div>
            <div className="rounded-full bg-purple-100 p-3 dark:bg-purple-900/30">
              <MdSchool className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Controls */}
      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="relative">
            <MdSearch className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search cases, medications, guidelines..."
              className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-4 dark:border-gray-600 dark:bg-navy-800"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center justify-end gap-2">
          <button className="flex items-center rounded-lg bg-gray-100 px-4 py-2 hover:bg-gray-200 dark:bg-navy-700 dark:text-gray-300">
            <MdFilterList className="mr-2 h-4 w-4" />
            Filter
          </button>
          <button
            onClick={handleCreatePost}
            className="linear flex items-center rounded-lg bg-brand-500 px-4 py-2 text-white hover:bg-brand-600"
          >
            <MdAdd className="mr-2 h-4 w-4" />
            New Discussion
          </button>
        </div>
      </div>

      {/* Categories */}
      <div className="mb-6">
        <div className="mb-3 flex items-center justify-between">
          <h4 className="font-bold text-navy-700 dark:text-white">
            Professional Categories
          </h4>
          <button
            onClick={() => setActiveCategory("all")}
            className="text-sm text-brand-500 hover:text-brand-600"
          >
            Clear Filter
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex flex-col items-center rounded-xl border p-4 transition-all ${
                activeCategory === category.id
                  ? "border-brand-500 bg-brand-50 dark:border-brand-500 dark:bg-brand-900/20"
                  : "border-gray-300 hover:border-brand-300 hover:bg-gray-50 dark:border-gray-600"
              }`}
            >
              <div className="mb-2 text-2xl">{category.icon}</div>
              <span className="text-center text-sm font-medium">
                {category.name}
              </span>
              <span className="mt-2 rounded-full bg-gray-100 px-2 py-1 text-xs dark:bg-gray-800">
                {category.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Trending Topics */}
      <div className="mb-6">
        <Card extra="p-6">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-bold text-navy-700 dark:text-white">
              <MdTrendingUp className="mr-2 inline h-5 w-5 text-red-500" />
              Hot Topics This Week
            </h4>
            <MdNewReleases className="h-5 w-5 text-orange-500" />
          </div>
          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
            {posts
              .filter((p) => p.trending)
              .map((post) => (
                <button
                  key={post.id}
                  onClick={() => handleViewPost(post.id)}
                  className="rounded-lg border border-gray-200 p-4 text-left hover:border-brand-300 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                >
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-red-50 px-2 py-1 text-xs text-red-700 dark:bg-red-900/30 dark:text-red-300">
                      Hot
                    </span>
                    <span className="text-xs text-gray-500">
                      {post.specialty}
                    </span>
                  </div>
                  <p className="mt-2 text-sm font-medium">{post.title}</p>
                  <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                    <span>{post.author}</span>
                    <span>•</span>
                    <span>{post.comments} comments</span>
                  </div>
                </button>
              ))}
          </div>
        </Card>
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-bold text-navy-700 dark:text-white">
            {activeCategory === "all"
              ? "Recent Professional Discussions"
              : `${categories.find((c) => c.id === activeCategory)?.name}`}
          </h4>
          <span className="text-sm text-gray-600 dark:text-gray-300">
            {filteredPosts.length} discussions
          </span>
        </div>

        {filteredPosts.length === 0 ? (
          <Card extra="p-6 text-center">
            <MdForum className="mx-auto h-12 w-12 text-gray-400" />
            <h4 className="mt-4 text-lg font-bold text-navy-700 dark:text-white">
              No discussions found
            </h4>
            <p className="mt-2 text-gray-600">
              {searchQuery
                ? "No discussions match your search. Try different keywords."
                : "Be the first to start a discussion in this category!"}
            </p>
            <button
              onClick={handleCreatePost}
              className="linear mt-4 rounded-lg bg-brand-500 px-4 py-2 text-white hover:bg-brand-600"
            >
              Start Discussion
            </button>
          </Card>
        ) : (
          filteredPosts.map((post) => <PostCard key={post.id} post={post} />)
        )}
      </div>

      {/* Professional Guidelines */}
      <div className="mt-6">
        <Card extra="p-6">
          <div className="flex items-start">
            <MdVerifiedUser className="mr-3 h-5 w-5 text-green-500" />
            <div>
              <h5 className="font-bold text-green-700 dark:text-green-300">
                Professional Community Guidelines
              </h5>
              <ul className="mt-2 space-y-1 text-sm text-green-600 dark:text-green-400">
                <li>
                  • Maintain patient confidentiality (de-identify all cases)
                </li>
                <li>• Cite sources for clinical recommendations</li>
                <li>• Respect differing professional opinions</li>
                <li>• Share evidence-based information only</li>
                <li>• Report unprofessional content</li>
                <li>• Adhere to HPCSA ethical guidelines</li>
              </ul>
              <p className="mt-3 text-xs text-green-500">
                This forum is for licensed healthcare professionals only. All
                posts are monitored for compliance.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ProviderCommunityForum;
