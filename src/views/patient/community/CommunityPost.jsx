import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MdArrowBack,
  MdThumbUp,
  MdComment,
  MdShare,
  MdBookmark,
  MdPerson,
  MdAccessTime,
  MdSend,
  MdWarning,
  MdFlag,
  MdMoreVert,
  MdEdit,
  MdDelete,
} from "react-icons/md";
import { FaReply, FaUserCircle } from "react-icons/fa";
import Card from "components/card";
import Modal from "components/modal/Modal";
import { useToast } from "hooks/useToast";

const CommunityPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([
    {
      id: 1,
      author: "Dr. Sarah Johnson",
      avatar: "👩‍⚕️",
      time: "1 hour ago",
      content:
        "Welcome to Johannesburg! I recommend Dr. Michael Chen at Parktown Pediatrics. He specializes in pediatric asthma and has great reviews.",
      likes: 8,
      isAuthor: true,
      replies: [],
    },
    {
      id: 2,
      author: "Parent123",
      avatar: "👨‍👧",
      time: "45 minutes ago",
      content:
        "We've been seeing Dr. Lerato at Soweto Community Health Centre for 3 years. She's wonderful with kids and very knowledgeable about asthma management.",
      likes: 5,
      isAuthor: false,
      replies: [],
    },
    {
      id: 3,
      author: "HealthHelper",
      avatar: "💚",
      time: "30 minutes ago",
      content:
        "Make sure to check if the pediatrician accepts your medical aid. Some great doctors in the area: Dr. Chen, Dr. Patel, and Dr. Botha.",
      likes: 3,
      isAuthor: false,
      replies: [],
    },
  ]);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [modalState, setModalState] = useState({
    report: false,
    delete: false,
    share: false,
  });
  const { showToast } = useToast();

  // Mock post data - in real app, fetch by ID
  const post = {
    id: id,
    title: "Looking for pediatrician recommendations in Johannesburg",
    author: "Sarah M.",
    authorAvatar: "👩",
    category: "parenting",
    content:
      "Hi everyone! We're new to Johannesburg and looking for a good pediatrician who specializes in asthma. My 5-year-old has mild asthma and we need a doctor who can provide ongoing care and management. Any recommendations in the Sandton/Parktown area would be greatly appreciated!",
    likes: 24,
    commentsCount: 12,
    time: "2 hours ago",
    views: 156,
  };

  const handleBack = () => {
    navigate("/patient/community");
  };

  const handleLike = () => {
    setLiked(!liked);
    showToast(liked ? "Post unliked" : "Post liked!", "success");
  };

  const handleBookmark = () => {
    setBookmarked(!bookmarked);
    showToast(
      bookmarked ? "Removed from bookmarks" : "Post bookmarked!",
      "success"
    );
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      showToast("Please enter a comment", "warning");
      return;
    }

    const newComment = {
      id: comments.length + 1,
      author: "You",
      avatar: "👤",
      time: "Just now",
      content: comment,
      likes: 0,
      isAuthor: true,
      replies: [],
    };

    setComments([newComment, ...comments]);
    setComment("");
    showToast("Comment posted!", "success");
  };

  const handleLikeComment = (commentId) => {
    setComments(
      comments.map((c) =>
        c.id === commentId ? { ...c, likes: c.likes + 1 } : c
      )
    );
    showToast("Comment liked!", "info");
  };

  const handleReportPost = () => {
    setModalState({ ...modalState, report: true });
  };

  const confirmReport = () => {
    setModalState({ ...modalState, report: false });
    showToast("Post reported to moderators", "warning");
  };

  const handleSharePost = () => {
    setModalState({ ...modalState, share: true });
  };

  const confirmShare = (method) => {
    setModalState({ ...modalState, share: false });
    showToast(`Post shared via ${method}`, "success");
  };

  const CommentItem = ({ comment }) => (
    <div className="border-l-2 border-gray-200 pl-4 dark:border-gray-700">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-xl dark:bg-gray-800">
            {comment.avatar}
          </div>
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-medium text-navy-700 dark:text-white">
                {comment.author}
              </span>
              {comment.isAuthor && (
                <span className="ml-2 rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                  OP
                </span>
              )}
              <span className="ml-2 text-sm text-gray-500">{comment.time}</span>
            </div>
            <button
              onClick={() => handleLikeComment(comment.id)}
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-500"
            >
              <MdThumbUp className="h-4 w-4" />
              <span>{comment.likes}</span>
            </button>
          </div>
          <p className="mt-2 text-gray-700 dark:text-gray-300">
            {comment.content}
          </p>
          <div className="mt-2 flex gap-4">
            <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-500">
              <FaReply className="h-3 w-3" />
              Reply
            </button>
            <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-500">
              <MdFlag className="h-3 w-3" />
              Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-full">
      {/* Modals */}
      <Modal
        isOpen={modalState.report}
        onClose={() => setModalState({ ...modalState, report: false })}
        title="Report Post"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300">
            Why are you reporting this post?
          </p>
          <div className="space-y-2">
            {[
              "Inappropriate content",
              "Harassment or bullying",
              "Spam or advertising",
              "False information",
              "Other",
            ].map((reason) => (
              <label key={reason} className="flex items-center">
                <input
                  type="radio"
                  name="report-reason"
                  className="mr-3 h-4 w-4"
                />
                <span>{reason}</span>
              </label>
            ))}
          </div>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setModalState({ ...modalState, report: false })}
              className="rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-50 dark:border-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={confirmReport}
              className="rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600"
            >
              Report Post
            </button>
          </div>
        </div>
      </Modal>

      {/* Header with Back Button */}
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={handleBack}
          className="flex items-center text-brand-500 hover:text-brand-600"
        >
          <MdArrowBack className="mr-2 h-5 w-5" />
          Back to Forum
        </button>
        <div className="flex gap-2">
          <button
            onClick={handleBookmark}
            className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <MdBookmark
              className={`h-5 w-5 ${
                bookmarked ? "text-yellow-500" : "text-gray-500"
              }`}
            />
          </button>
          <button
            onClick={handleSharePost}
            className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <MdShare className="h-5 w-5 text-gray-500" />
          </button>
          <button
            onClick={handleReportPost}
            className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <MdFlag className="h-5 w-5 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Main Post */}
      <Card extra="p-6 mb-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-100 text-2xl dark:bg-brand-900/30">
            {post.authorAvatar}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-navy-700 dark:text-white">
                  {post.author}
                </h4>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <MdAccessTime className="h-3 w-3" />
                  {post.time}
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs dark:bg-gray-800">
                    {post.category}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <h1 className="mb-4 text-2xl font-bold text-navy-700 dark:text-white">
          {post.title}
        </h1>

        <div className="prose dark:prose-invert mb-6 max-w-none">
          <p className="text-gray-700 dark:text-gray-300">{post.content}</p>
        </div>

        {/* Post Stats */}
        <div className="flex items-center justify-between border-t border-gray-200 pt-4 dark:border-gray-700">
          <div className="flex gap-6">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 rounded-full px-4 py-2 ${
                liked
                  ? "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
              }`}
            >
              <MdThumbUp className="h-4 w-4" />
              <span>{post.likes + (liked ? 1 : 0)}</span>
            </button>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
              <MdComment className="h-4 w-4" />
              <span>{comments.length} comments</span>
            </div>
            <div className="text-gray-600 dark:text-gray-300">
              <span>{post.views} views</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Comment Form */}
      <Card extra="p-6 mb-6">
        <h3 className="mb-4 text-lg font-bold text-navy-700 dark:text-white">
          Add a Comment
        </h3>
        <form onSubmit={handleCommentSubmit}>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your thoughts or advice..."
            className="h-32 w-full rounded-lg border border-gray-300 bg-white p-3 dark:border-gray-600 dark:bg-navy-800"
            rows="4"
          />
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Be respectful and helpful. Remember, this is a support community.
            </div>
            <button
              type="submit"
              className="linear flex items-center rounded-lg bg-brand-500 px-4 py-2 text-white hover:bg-brand-600"
            >
              <MdSend className="mr-2 h-4 w-4" />
              Post Comment
            </button>
          </div>
        </form>
      </Card>

      {/* Comments Section */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-navy-700 dark:text-white">
            Comments ({comments.length})
          </h3>
          <select className="rounded-lg border border-gray-300 bg-white px-3 py-1 text-sm dark:border-gray-600 dark:bg-navy-800">
            <option>Newest First</option>
            <option>Oldest First</option>
            <option>Most Liked</option>
          </select>
        </div>

        <div className="space-y-6">
          {comments.length === 0 ? (
            <Card extra="p-6 text-center">
              <MdComment className="mx-auto h-12 w-12 text-gray-400" />
              <h4 className="mt-4 text-lg font-bold text-navy-700 dark:text-white">
                No comments yet
              </h4>
              <p className="mt-2 text-gray-600">
                Be the first to share your thoughts!
              </p>
            </Card>
          ) : (
            comments.map((comment) => (
              <CommentItem key={comment.id} comment={comment} />
            ))
          )}
        </div>
      </div>

      {/* Community Guidelines Reminder */}
      <div className="mt-6">
        <Card extra="p-4">
          <div className="flex items-start">
            <MdWarning className="mr-3 h-5 w-5 text-yellow-500" />
            <div>
              <h5 className="font-bold text-yellow-700 dark:text-yellow-300">
                Remember Our Community Guidelines
              </h5>
              <p className="mt-1 text-sm text-yellow-600 dark:text-yellow-400">
                This is a supportive community. Please keep comments respectful
                and helpful. Medical advice should come from professionals only.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CommunityPost;
