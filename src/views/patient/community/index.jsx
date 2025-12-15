import React, { useState } from "react";
import {
  MdForum,
  MdSearch,
  MdAdd,
  MdThumbUp,
  MdComment,
  MdShare,
  MdBookmark,
  MdFilterList,
  MdTrendingUp,
  MdNewReleases,
  MdPerson,
} from "react-icons/md";
import { FaUserFriends, FaBaby, FaHeart } from "react-icons/fa";
import Card from "components/card";
import Modal from "components/modal/Modal";
import { useToast } from "hooks/useToast";

const CommunityForum = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPost, setSelectedPost] = useState(null);
  const [modalState, setModalState] = useState({
    create: false,
    view: false,
  });
  const { showToast } = useToast();

  const categories = [
    { id: "all", name: "All Topics", icon: <MdForum />, count: 128 },
    { id: "parenting", name: "Parenting", icon: <FaBaby />, count: 45 },
    { id: "nutrition", name: "Nutrition", icon: <FaHeart />, count: 32 },
    { id: "support", name: "Support", icon: <FaUserFriends />, count: 28 },
    { id: "questions", name: "Q&A", icon: <MdComment />, count: 23 },
  ];

  const posts = [
    {
      id: 1,
      title: "Looking for pediatrician recommendations in Johannesburg",
      author: "Sarah M.",
      category: "parenting",
      content:
        "Hi everyone! We're new to Johannesburg and looking for a good pediatrician who specializes in asthma. Any recommendations would be appreciated!",
      likes: 24,
      comments: 12,
      time: "2 hours ago",
      trending: true,
    },
    {
      id: 2,
      title: "Affordable nutrition tips for toddlers",
      author: "Lerato K.",
      category: "nutrition",
      content:
        "Sharing some budget-friendly meal ideas that have worked for my picky 2-year-old. Would love to hear your ideas too!",
      likes: 42,
      comments: 18,
      time: "5 hours ago",
      trending: true,
    },
    {
      id: 3,
      title: "Dealing with vaccine anxiety",
      author: "Michael P.",
      category: "support",
      content:
        "My child has their 6-month vaccines coming up and I'm feeling anxious about it. Any advice from experienced parents?",
      likes: 15,
      comments: 8,
      time: "1 day ago",
    },
    {
      id: 4,
      title: "Is this normal? 3-month-old sleeping patterns",
      author: "Anonymous",
      category: "questions",
      content:
        "My 3-month-old only sleeps 2-3 hours at a time. Is this normal or should I be concerned?",
      likes: 8,
      comments: 14,
      time: "2 days ago",
    },
  ];

  const handleViewPost = (post) => {
    setSelectedPost(post);
    setModalState({ ...modalState, view: true });
  };

  const handleCreatePost = () => {
    setModalState({ ...modalState, create: true });
  };

  const handleLikePost = (postId) => {
    showToast("Post liked!", "success");
  };

  const PostCard = ({ post }) => (
    <Card extra="p-4 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {post.trending && (
                <MdTrendingUp className="h-4 w-4 text-red-500" />
              )}
              <h5 className="font-bold text-navy-700 dark:text-white">
                {post.title}
              </h5>
            </div>
            <span className="rounded-full bg-gray-100 px-2 py-1 text-xs dark:bg-gray-800">
              {post.category}
            </span>
          </div>

          <div className="mt-3 flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
            <div className="flex items-center">
              <MdPerson className="mr-1 h-4 w-4" />
              {post.author}
            </div>
            <div>{post.time}</div>
          </div>

          <p className="mt-3 line-clamp-2 text-gray-600 dark:text-gray-300">
            {post.content}
          </p>

          <div className="mt-4 flex items-center justify-between">
            <div className="flex gap-4">
              <button
                onClick={() => handleLikePost(post.id)}
                className="flex items-center gap-1 text-gray-500 hover:text-red-500"
              >
                <MdThumbUp className="h-4 w-4" />
                <span>{post.likes}</span>
              </button>
              <button className="flex items-center gap-1 text-gray-500 hover:text-blue-500">
                <MdComment className="h-4 w-4" />
                <span>{post.comments}</span>
              </button>
              <button className="flex items-center gap-1 text-gray-500 hover:text-green-500">
                <MdShare className="h-4 w-4" />
              </button>
            </div>
            <button
              onClick={() => handleViewPost(post)}
              className="text-sm text-brand-500 hover:text-brand-600"
            >
              Read More →
            </button>
          </div>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="h-full">
      {/* Modals */}
      <Modal
        isOpen={modalState.view}
        onClose={() => setModalState({ ...modalState, view: false })}
        title={selectedPost?.title || "Community Post"}
        size="xl"
      >
        {selectedPost && (
          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 text-brand-600 dark:bg-brand-900/30">
                  <MdPerson className="h-6 w-6" />
                </div>
                <div>
                  <div className="font-bold">{selectedPost.author}</div>
                  <div className="text-sm text-gray-500">
                    {selectedPost.time}
                  </div>
                </div>
              </div>
              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs dark:bg-gray-800">
                {selectedPost.category}
              </span>
            </div>

            <div className="prose dark:prose-invert max-w-none">
              <p>{selectedPost.content}</p>
            </div>

            <div className="border-t border-gray-200 pt-4 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex gap-4">
                  <button className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-50 dark:border-gray-600">
                    <MdThumbUp className="h-4 w-4" />
                    Like ({selectedPost.likes})
                  </button>
                  <button className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-50 dark:border-gray-600">
                    <MdComment className="h-4 w-4" />
                    Comment
                  </button>
                </div>
                <button className="rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-50 dark:border-gray-600">
                  <MdBookmark className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Header */}
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-navy-700 dark:text-white">
          Community Forum
        </h3>
        <p className="text-gray-600 dark:text-gray-300">
          Connect with other parents and share experiences
        </p>
      </div>

      {/* Controls */}
      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="relative">
            <MdSearch className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search community discussions..."
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
      <div className="mb-6 flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => {
              setActiveCategory(category.id);
              showToast(`Showing ${category.name} posts`, "info");
            }}
            className={`flex items-center rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              activeCategory === category.id
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
            {[
              "Vaccination Tips",
              "Sleep Training",
              "Pick Eaters",
              "Daycare Options",
            ].map((topic) => (
              <span
                key={topic}
                className="rounded-full bg-red-50 px-3 py-1 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-300"
              >
                #{topic}
              </span>
            ))}
          </div>
        </Card>
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {posts.length === 0 ? (
          <Card extra="p-6 text-center">
            <MdForum className="mx-auto h-12 w-12 text-gray-400" />
            <h4 className="mt-4 text-lg font-bold text-navy-700 dark:text-white">
              No posts found
            </h4>
            <p className="mt-2 text-gray-600">
              Be the first to start a discussion!
            </p>
            <button
              onClick={handleCreatePost}
              className="linear mt-4 rounded-lg bg-brand-500 px-4 py-2 text-white hover:bg-brand-600"
            >
              Create First Post
            </button>
          </Card>
        ) : (
          posts.map((post) => <PostCard key={post.id} post={post} />)
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
                <li>• Be respectful and supportive</li>
                <li>• Share experiences, not medical advice</li>
                <li>• Keep discussions family-friendly</li>
                <li>• Report inappropriate content</li>
                <li>• Protect personal information</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CommunityForum;
