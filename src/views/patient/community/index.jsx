// views/patient/community/index.jsx
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
} from "react-icons/md";
import { FaBaby, FaHeart, FaUserFriends, FaCommentAlt } from "react-icons/fa";
import Card from "components/card";
import { useToast } from "hooks/useToast";

const CommunityForum = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { showToast } = useToast();

  const categories = [
    { id: "all", name: "All Topics", icon: <MdForum />, count: 128 },
    { id: "parenting", name: "Parenting", icon: <FaBaby />, count: 45 },
    { id: "nutrition", name: "Nutrition", icon: <FaHeart />, count: 32 },
    { id: "support", name: "Support", icon: <FaUserFriends />, count: 28 },
    { id: "questions", name: "Q&A", icon: <FaCommentAlt />, count: 23 },
    { id: "health", name: "Health Tips", icon: <MdCategory />, count: 15 },
    { id: "vaccines", name: "Vaccines", icon: <MdTrendingUp />, count: 12 },
  ];

  const posts = [
    {
      id: "1",
      title: "Looking for pediatrician recommendations in Johannesburg",
      author: "Sarah M.",
      category: "parenting",
      content:
        "Hi everyone! We're new to Johannesburg and looking for a good pediatrician who specializes in asthma. Any recommendations would be appreciated!",
      likes: 24,
      comments: 12,
      time: "2 hours ago",
      trending: true,
      authorAvatar: "👩",
    },
    {
      id: "2",
      title: "Affordable nutrition tips for toddlers",
      author: "Lerato K.",
      category: "nutrition",
      content:
        "Sharing some budget-friendly meal ideas that have worked for my picky 2-year-old. Would love to hear your ideas too!",
      likes: 42,
      comments: 18,
      time: "5 hours ago",
      trending: true,
      authorAvatar: "👨‍👧",
    },
    {
      id: "3",
      title: "Dealing with vaccine anxiety",
      author: "Michael P.",
      category: "support",
      content:
        "My child has their 6-month vaccines coming up and I'm feeling anxious about it. Any advice from experienced parents?",
      likes: 15,
      comments: 8,
      time: "1 day ago",
      trending: false,
      authorAvatar: "👨",
    },
    {
      id: "4",
      title: "Is this normal? 3-month-old sleeping patterns",
      author: "Anonymous",
      category: "questions",
      content:
        "My 3-month-old only sleeps 2-3 hours at a time. Is this normal or should I be concerned?",
      likes: 8,
      comments: 14,
      time: "2 days ago",
      trending: false,
      authorAvatar: "👶",
    },
    {
      id: "5",
      title: "Breastfeeding support group meetup this Saturday",
      author: "Nurse Thandi",
      category: "support",
      content:
        "Free breastfeeding support group at Community Health Centre this Saturday at 10 AM. All new mothers welcome!",
      likes: 36,
      comments: 7,
      time: "3 days ago",
      trending: true,
      authorAvatar: "👩‍⚕️",
    },
    {
      id: "6",
      title: "How to make homemade ORS for diarrhea",
      author: "Dr. Chen",
      category: "health",
      content:
        "Simple recipe: 1 liter clean water, 6 teaspoons sugar, 1/2 teaspoon salt. Great for keeping kids hydrated during stomach bugs.",
      likes: 52,
      comments: 9,
      time: "4 days ago",
      trending: true,
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
      !post.content.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const handleViewPost = (postId) => {
    navigate(`/patient/community/post/${postId}`);
  };

  const handleCreatePost = () => {
    navigate("/patient/community/new");
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
        {/* Author Avatar */}
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
              <div className="mt-1 flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                <span className="flex items-center">
                  <MdPerson className="mr-1 h-3 w-3" />
                  {post.author}
                </span>
                <span className="flex items-center">
                  <MdAccessTime className="mr-1 h-3 w-3" />
                  {post.time}
                </span>
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs dark:bg-gray-800">
                  {post.category}
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
              <span>{post.comments} comments</span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleViewPost(post.id);
              }}
              className="ml-auto text-sm font-medium text-brand-500 hover:text-brand-600"
            >
              View Discussion →
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
          Community Forum
        </h3>
        <p className="text-gray-600 dark:text-gray-300">
          Connect with other parents, share experiences, and get support
        </p>
      </div>

      {/* Controls */}
      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="relative">
            <MdSearch className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search discussions..."
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
            New Post
          </button>
        </div>
      </div>

      {/* Categories */}
      <div className="mb-6">
        <div className="mb-3 flex items-center justify-between">
          <h4 className="font-bold text-navy-700 dark:text-white">
            Browse by Category
          </h4>
          <button
            onClick={() => setActiveCategory("all")}
            className="text-sm text-brand-500 hover:text-brand-600"
          >
            Clear Filter
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex items-center rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                activeCategory === category.id
                  ? "bg-brand-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-navy-700 dark:text-gray-300"
              }`}
            >
              <span className="mr-2">{category.icon}</span>
              {category.name}
              <span className="ml-2 rounded-full bg-white/20 px-2 py-0.5 text-xs">
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
              Trending Topics
            </h4>
            <MdNewReleases className="h-5 w-5 text-orange-500" />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {posts
              .filter((p) => p.trending)
              .map((post) => (
                <button
                  key={post.id}
                  onClick={() => handleViewPost(post.id)}
                  className="rounded-full bg-red-50 px-3 py-1 text-sm text-red-700 transition-colors hover:bg-red-100 dark:bg-red-900/30 dark:text-red-300"
                >
                  {post.title.substring(0, 30)}...
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
              ? "Recent Discussions"
              : `Posts in ${
                  categories.find((c) => c.id === activeCategory)?.name
                }`}
          </h4>
          <span className="text-sm text-gray-600 dark:text-gray-300">
            {filteredPosts.length} posts
          </span>
        </div>

        {filteredPosts.length === 0 ? (
          <Card extra="p-6 text-center">
            <MdForum className="mx-auto h-12 w-12 text-gray-400" />
            <h4 className="mt-4 text-lg font-bold text-navy-700 dark:text-white">
              No posts found
            </h4>
            <p className="mt-2 text-gray-600">
              {searchQuery
                ? "No posts match your search. Try different keywords."
                : "Be the first to start a discussion in this category!"}
            </p>
            <button
              onClick={handleCreatePost}
              className="linear mt-4 rounded-lg bg-brand-500 px-4 py-2 text-white hover:bg-brand-600"
            >
              Create First Post
            </button>
          </Card>
        ) : (
          filteredPosts.map((post) => <PostCard key={post.id} post={post} />)
        )}
      </div>

      {/* Community Guidelines */}
      <div className="mt-6">
        <Card extra="p-6">
          <div className="flex items-start">
            <MdForum className="mr-3 h-5 w-5 text-blue-500" />
            <div>
              <h5 className="font-bold text-blue-700 dark:text-blue-300">
                Community Guidelines
              </h5>
              <ul className="mt-2 space-y-1 text-sm text-blue-600 dark:text-blue-400">
                <li>• Be respectful and supportive of others</li>
                <li>• Share experiences, not medical advice</li>
                <li>• Keep discussions family-friendly</li>
                <li>• Report inappropriate content</li>
                <li>• Protect personal and private information</li>
                <li>• Remember: We're all here to help each other</li>
              </ul>
              <p className="mt-3 text-xs text-blue-500">
                This forum is moderated. Posts violating guidelines may be
                removed.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CommunityForum;
