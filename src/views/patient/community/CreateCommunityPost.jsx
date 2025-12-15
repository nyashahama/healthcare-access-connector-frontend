import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdArrowBack,
  MdTitle,
  MdDescription,
  MdCategory,
  MdVisibility,
  MdTag,
  MdHelp,
  MdWarning,
  MdSend,
  MdCancel,
} from "react-icons/md";
import { FaBaby, FaHeart, FaUserFriends, FaCommentAlt } from "react-icons/fa";
import Card from "components/card";
import Modal from "components/modal/Modal";
import { useToast } from "hooks/useToast";

const CreateCommunityPost = () => {
  const navigate = useNavigate();
  const [postData, setPostData] = useState({
    title: "",
    content: "",
    category: "",
    tags: [],
    privacy: "public",
    anonymous: false,
  });
  const [tagInput, setTagInput] = useState("");
  const [modalState, setModalState] = useState({
    cancel: false,
    preview: false,
    guidelines: false,
  });
  const { showToast } = useToast();

  const categories = [
    { id: "parenting", name: "Parenting", icon: <FaBaby /> },
    { id: "nutrition", name: "Nutrition", icon: <FaHeart /> },
    { id: "support", name: "Support", icon: <FaUserFriends /> },
    { id: "questions", name: "Questions", icon: <FaCommentAlt /> },
    { id: "health", name: "Health Tips", icon: <MdHelp /> },
    { id: "vaccines", name: "Vaccines", icon: <MdCategory /> },
  ];

  const handleBack = () => {
    if (
      postData.title ||
      postData.content ||
      postData.category ||
      postData.tags.length > 0
    ) {
      setModalState({ ...modalState, cancel: true });
    } else {
      navigate("/patient/community");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!postData.title.trim()) {
      showToast("Please enter a title", "warning");
      return;
    }

    if (!postData.content.trim()) {
      showToast("Please enter post content", "warning");
      return;
    }

    if (!postData.category) {
      showToast("Please select a category", "warning");
      return;
    }

    // Here you would make an API call to create the post
    console.log("Creating post:", postData);

    showToast("Post created successfully!", "success");
    setTimeout(() => {
      navigate("/patient/community");
    }, 1500);
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !postData.tags.includes(tagInput.trim())) {
      setPostData({
        ...postData,
        tags: [...postData.tags, tagInput.trim()],
      });
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setPostData({
      ...postData,
      tags: postData.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const confirmCancel = () => {
    setModalState({ ...modalState, cancel: false });
    navigate("/patient/community");
    showToast("Post discarded", "info");
  };

  const PreviewModal = () => (
    <Modal
      isOpen={modalState.preview}
      onClose={() => setModalState({ ...modalState, preview: false })}
      title="Post Preview"
      size="xl"
    >
      <div className="space-y-6">
        <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
          <h3 className="text-xl font-bold text-navy-700 dark:text-white">
            {postData.title || "(No title)"}
          </h3>
          {postData.category && (
            <div className="mt-2">
              <span className="rounded-full bg-gray-100 px-3 py-1 text-sm dark:bg-gray-800">
                {categories.find((c) => c.id === postData.category)?.name}
              </span>
            </div>
          )}
          <div className="mt-4">
            <p className="text-gray-700 dark:text-gray-300">
              {postData.content || "(No content)"}
            </p>
          </div>
          {postData.tags.length > 0 && (
            <div className="mt-4">
              <div className="flex flex-wrap gap-2">
                {postData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-blue-50 px-2 py-1 text-xs text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
          {postData.anonymous && (
            <div className="mt-4 rounded-lg bg-yellow-50 p-3 dark:bg-yellow-900/20">
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                This post will be published anonymously
              </p>
            </div>
          )}
        </div>
        <div className="flex justify-end">
          <button
            onClick={() => setModalState({ ...modalState, preview: false })}
            className="rounded-lg border border-gray-300 px-6 py-2 hover:bg-gray-50 dark:border-gray-600"
          >
            Close Preview
          </button>
        </div>
      </div>
    </Modal>
  );

  return (
    <div className="h-full">
      {/* Modals */}
      <Modal
        isOpen={modalState.cancel}
        onClose={() => setModalState({ ...modalState, cancel: false })}
        title="Discard Post?"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300">
            You have unsaved changes. Are you sure you want to discard this
            post?
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setModalState({ ...modalState, cancel: false })}
              className="rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-50 dark:border-gray-600"
            >
              Continue Editing
            </button>
            <button
              onClick={confirmCancel}
              className="rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600"
            >
              Discard Post
            </button>
          </div>
        </div>
      </Modal>

      <PreviewModal />

      <Modal
        isOpen={modalState.guidelines}
        onClose={() => setModalState({ ...modalState, guidelines: false })}
        title="Community Guidelines"
        size="lg"
      >
        <div className="space-y-4">
          <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
            <h4 className="font-bold text-blue-800 dark:text-blue-300">
              Before You Post
            </h4>
            <ul className="mt-2 space-y-2 text-sm text-blue-700 dark:text-blue-300">
              <li>
                • <strong>Be supportive:</strong> This is a community for help
                and encouragement
              </li>
              <li>
                • <strong>Share experiences, not medical advice:</strong> Only
                healthcare professionals can give medical advice
              </li>
              <li>
                • <strong>Protect privacy:</strong> Don't share personal
                information about yourself or others
              </li>
              <li>
                • <strong>Be specific:</strong> Clear questions get better
                answers
              </li>
              <li>
                • <strong>Use appropriate categories:</strong> Helps others find
                and respond to your post
              </li>
            </ul>
          </div>
          <div className="rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
            <h4 className="font-bold text-red-800 dark:text-red-300">
              What Not to Post
            </h4>
            <ul className="mt-2 space-y-2 text-sm text-red-700 dark:text-red-300">
              <li>• Personal attacks or harassment</li>
              <li>• Medical advice (unless you're a verified professional)</li>
              <li>• Commercial promotions or spam</li>
              <li>• False or misleading information</li>
              <li>• Inappropriate content</li>
            </ul>
          </div>
          <div className="flex justify-end">
            <button
              onClick={() =>
                setModalState({ ...modalState, guidelines: false })
              }
              className="rounded-lg border border-gray-300 px-6 py-2 hover:bg-gray-50 dark:border-gray-600"
            >
              I Understand
            </button>
          </div>
        </div>
      </Modal>

      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={handleBack}
          className="flex items-center text-brand-500 hover:text-brand-600"
        >
          <MdArrowBack className="mr-2 h-5 w-5" />
          Back to Forum
        </button>
        <button
          onClick={() => setModalState({ ...modalState, guidelines: true })}
          className="text-sm text-blue-500 hover:text-blue-600"
        >
          Review Community Guidelines
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column - Form */}
        <div className="lg:col-span-2">
          <Card extra="p-6">
            <h3 className="mb-6 text-2xl font-bold text-navy-700 dark:text-white">
              Create New Post
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <label className="mb-2 flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                  <MdTitle className="mr-2 h-4 w-4" />
                  Post Title *
                </label>
                <input
                  type="text"
                  value={postData.title}
                  onChange={(e) =>
                    setPostData({ ...postData, title: e.target.value })
                  }
                  placeholder="What's your question or topic?"
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 dark:border-gray-600 dark:bg-navy-800"
                  maxLength="150"
                  required
                />
                <div className="mt-1 text-right text-xs text-gray-500">
                  {postData.title.length}/150 characters
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="mb-2 flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                  <MdCategory className="mr-2 h-4 w-4" />
                  Category *
                </label>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() =>
                        setPostData({ ...postData, category: category.id })
                      }
                      className={`flex flex-col items-center rounded-lg border p-4 transition-all ${
                        postData.category === category.id
                          ? "border-brand-500 bg-brand-50 dark:border-brand-500 dark:bg-brand-900/20"
                          : "border-gray-300 hover:border-brand-300 hover:bg-gray-50 dark:border-gray-600"
                      }`}
                    >
                      <div className="mb-2 text-2xl">{category.icon}</div>
                      <span className="text-sm font-medium">
                        {category.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Content */}
              <div>
                <label className="mb-2 flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                  <MdDescription className="mr-2 h-4 w-4" />
                  Post Content *
                </label>
                <textarea
                  value={postData.content}
                  onChange={(e) =>
                    setPostData({ ...postData, content: e.target.value })
                  }
                  placeholder="Share your thoughts, ask your question, or describe your experience..."
                  className="h-64 w-full rounded-lg border border-gray-300 bg-white p-4 dark:border-gray-600 dark:bg-navy-800"
                  rows="10"
                  required
                />
                <div className="mt-1 text-sm text-gray-500">
                  Be as detailed as possible. The more information you provide,
                  the better others can help.
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="mb-2 flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                  <MdTag className="mr-2 h-4 w-4" />
                  Tags (Optional)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Add tags to help others find your post"
                    className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 dark:border-gray-600 dark:bg-navy-800"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-50 dark:border-gray-600"
                  >
                    Add
                  </button>
                </div>
                {postData.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {postData.tags.map((tag) => (
                      <span
                        key={tag}
                        className="flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                      >
                        #{tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-1 text-blue-500 hover:text-blue-700"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Privacy Options */}
              <div>
                <label className="mb-2 flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                  <MdVisibility className="mr-2 h-4 w-4" />
                  Privacy Options
                </label>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="privacy"
                      checked={postData.privacy === "public"}
                      onChange={() =>
                        setPostData({ ...postData, privacy: "public" })
                      }
                      className="mr-3 h-4 w-4"
                    />
                    <div>
                      <div className="font-medium">Public Post</div>
                      <div className="text-sm text-gray-500">
                        Visible to all community members
                      </div>
                    </div>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="privacy"
                      checked={postData.privacy === "anonymous"}
                      onChange={() =>
                        setPostData({ ...postData, privacy: "anonymous" })
                      }
                      className="mr-3 h-4 w-4"
                    />
                    <div>
                      <div className="font-medium">Post Anonymously</div>
                      <div className="text-sm text-gray-500">
                        Your name will not be shown with the post
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-between pt-6">
                <button
                  type="button"
                  onClick={() =>
                    setModalState({ ...modalState, preview: true })
                  }
                  className="rounded-lg border border-gray-300 px-6 py-2 hover:bg-gray-50 dark:border-gray-600"
                  disabled={!postData.title || !postData.content}
                >
                  Preview Post
                </button>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="rounded-lg border border-gray-300 px-6 py-2 hover:bg-gray-50 dark:border-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="linear rounded-lg bg-brand-500 px-6 py-2 text-white hover:bg-brand-600"
                    disabled={
                      !postData.title || !postData.content || !postData.category
                    }
                  >
                    <MdSend className="mr-2 inline h-4 w-4" />
                    Post to Community
                  </button>
                </div>
              </div>
            </form>
          </Card>
        </div>

        {/* Right Column - Tips */}
        <div className="space-y-6">
          <Card extra="p-6">
            <h4 className="mb-4 text-lg font-bold text-navy-700 dark:text-white">
              💡 Tips for Great Posts
            </h4>
            <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
              <li className="flex items-start">
                <div className="mr-3 flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-green-600">
                  1
                </div>
                <span>Be specific about what you need help with</span>
              </li>
              <li className="flex items-start">
                <div className="mr-3 flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  2
                </div>
                <span>Include relevant details (age, location, etc.)</span>
              </li>
              <li className="flex items-start">
                <div className="mr-3 flex h-6 w-6 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                  3
                </div>
                <span>Use clear, simple language</span>
              </li>
              <li className="flex items-start">
                <div className="mr-3 flex h-6 w-6 items-center justify-center rounded-full bg-yellow-100 text-yellow-600">
                  4
                </div>
                <span>Choose the right category for your topic</span>
              </li>
              <li className="flex items-start">
                <div className="mr-3 flex h-6 w-6 items-center justify-center rounded-full bg-red-100 text-red-600">
                  5
                </div>
                <span>Be respectful and considerate of others</span>
              </li>
            </ul>
          </Card>

          <Card extra="p-6">
            <h4 className="mb-4 text-lg font-bold text-navy-700 dark:text-white">
              ⚠️ Remember
            </h4>
            <div className="space-y-3 text-sm">
              <div className="rounded-lg bg-yellow-50 p-3 dark:bg-yellow-900/20">
                <p className="text-yellow-700 dark:text-yellow-300">
                  <strong>This is not a medical emergency service.</strong> For
                  emergencies, call 10177 or visit the nearest clinic.
                </p>
              </div>
              <div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
                <p className="text-blue-700 dark:text-blue-300">
                  <strong>Respect privacy.</strong> Don't share personal
                  identifying information about yourself or others.
                </p>
              </div>
              <div className="rounded-lg bg-green-50 p-3 dark:bg-green-900/20">
                <p className="text-green-700 dark:text-green-300">
                  <strong>Be patient.</strong> It may take time for community
                  members to respond.
                </p>
              </div>
            </div>
          </Card>

          <Card extra="p-6">
            <h4 className="mb-4 text-lg font-bold text-navy-700 dark:text-white">
              📋 Popular Topics
            </h4>
            <div className="flex flex-wrap gap-2">
              {[
                "Vaccination",
                "Sleep",
                "Nutrition",
                "Development",
                "Allergies",
                "School",
                "Behavior",
                "Teething",
              ].map((topic) => (
                <button
                  key={topic}
                  onClick={() => setTagInput(topic)}
                  className="rounded-full bg-gray-100 px-3 py-1 text-sm hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
                >
                  #{topic}
                </button>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreateCommunityPost;
