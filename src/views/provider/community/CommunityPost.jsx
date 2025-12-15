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
  MdVerifiedUser,
  MdScience,
  MdAttachFile,
} from "react-icons/md";
import { FaReply, FaUserMd, FaStethoscope } from "react-icons/fa";
import Card from "components/card";
import Modal from "components/modal/Modal";
import { useToast } from "hooks/useToast";

const ProviderCommunityPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([
    {
      id: 1,
      author: "Dr. James Wilson",
      credentials: "Cardiologist",
      verified: true,
      avatar: "👨‍⚕️",
      time: "2 hours ago",
      content:
        "I'd consider renal denervation given the resistant profile. Recent trial data shows good efficacy in diabetic patients. Check patient's renal function first.",
      likes: 15,
      references: ["NEJM 2023;389:123-135"],
      replies: [],
    },
    {
      id: 2,
      author: "Dr. Amina Patel",
      credentials: "Nephrologist",
      verified: true,
      avatar: "👩‍⚕️",
      time: "1 hour ago",
      content:
        "Before denervation, ensure proper diuretic regimen. Consider chlorthalidone 25mg if not already tried. Also check for primary aldosteronism.",
      likes: 12,
      references: ["Lancet 2022;399:1403-1414"],
      replies: [],
    },
    {
      id: 3,
      author: "Nurse Practitioner",
      credentials: "Family Practice",
      verified: true,
      avatar: "👨",
      time: "45 minutes ago",
      content:
        "Patient compliance is key. Have you checked pill count? Consider once-daily combinations to improve adherence.",
      likes: 8,
      references: ["J Clin Hypertens 2023;25:456-462"],
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

  // Mock post data
  const post = {
    id: id,
    title: "Managing resistant hypertension in type 2 diabetes",
    author: "Dr. Sarah Johnson",
    credentials: "Cardiologist, Johannesburg Hospital",
    verified: true,
    specialty: "Cardiology",
    category: "case-discussions",
    content:
      "Patient: 58-year-old male, BMI 32, HbA1c 8.5%, BP consistently 150/95 mmHg despite optimal doses of:\n• Amlodipine 10mg daily\n• Perindopril 8mg daily\n• Indapamide 2.5mg daily\n\nPatient adherent per pill count. No secondary causes identified. Considering adding spironolactone 25mg vs. referral for renal denervation. Any experience with this approach?",
    patientData: {
      age: "58",
      gender: "Male",
      conditions: ["Type 2 DM", "Resistant HTN", "Obesity"],
      medications: [
        "Metformin 1000mg BD",
        "Amlodipine 10mg",
        "Perindopril 8mg",
        "Indapamide 2.5mg",
      ],
      labs: {
        HbA1c: "8.5%",
        Creatinine: "98 μmol/L",
        eGFR: "68 mL/min",
        "K+": "4.2 mmol/L",
      },
    },
    likes: 42,
    commentsCount: 18,
    time: "3 hours ago",
    views: 245,
  };

  const handleBack = () => {
    navigate("/provider/community");
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
      author: "Dr. You",
      credentials: "Verified Professional",
      verified: true,
      avatar: "👤",
      time: "Just now",
      content: comment,
      likes: 0,
      references: [],
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

  const CommentItem = ({ comment }) => (
    <div className="border-l-2 border-blue-200 pl-4 dark:border-blue-800">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-xl dark:bg-blue-900/30">
            {comment.avatar}
          </div>
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-medium text-navy-700 dark:text-white">
                {comment.author}
              </span>
              <span className="ml-2 text-xs text-gray-500">
                {comment.credentials}
              </span>
              {comment.verified && (
                <span className="ml-2 rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-800 dark:bg-green-900 dark:text-green-300">
                  <MdVerifiedUser className="mr-1 inline h-3 w-3" />
                  Verified
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
          {comment.references && comment.references.length > 0 && (
            <div className="mt-2">
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                References:
              </p>
              <ul className="mt-1 space-y-1">
                {comment.references.map((ref, idx) => (
                  <li
                    key={idx}
                    className="text-xs text-blue-600 dark:text-blue-400"
                  >
                    [{idx + 1}] {ref}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="mt-2 flex gap-4">
            <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-500">
              <FaReply className="h-3 w-3" />
              Reply
            </button>
            <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-500">
              <MdAttachFile className="h-3 w-3" />
              Attach Reference
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
      {/* Report Modal */}
      <Modal
        isOpen={modalState.report}
        onClose={() => setModalState({ ...modalState, report: false })}
        title="Report Professional Concern"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300">
            Please specify your concern about this post:
          </p>
          <div className="space-y-2">
            {[
              "Patient confidentiality breach",
              "Inaccurate medical information",
              "Unprofessional conduct",
              "Spam or advertising",
              "Ethical violation",
              "Other concern",
            ].map((reason) => (
              <label key={reason} className="flex items-center">
                <input
                  type="radio"
                  name="report-reason"
                  className="mr-3 h-4 w-4"
                />
                <span className="text-sm">{reason}</span>
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
              Report to Ethics Committee
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
          Back to Professional Forum
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
            onClick={() =>
              showToast(
                "Professional content can only be shared within the platform",
                "info"
              )
            }
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
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-2xl dark:bg-blue-900/30">
            👩‍⚕️
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-navy-700 dark:text-white">
                    {post.author}
                  </h4>
                  {post.verified && (
                    <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-800 dark:bg-green-900 dark:text-green-300">
                      <MdVerifiedUser className="mr-1 inline h-3 w-3" />
                      Verified
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <MdPerson className="h-3 w-3" />
                  <span>{post.credentials}</span>
                  <span>•</span>
                  <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                    {post.specialty}
                  </span>
                  <span>•</span>
                  <MdAccessTime className="h-3 w-3" />
                  {post.time}
                  <span>•</span>
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

        {/* Patient Data Summary */}
        <div className="mb-6 rounded-lg border border-gray-200 p-4 dark:border-gray-700">
          <h4 className="mb-3 font-bold text-navy-700 dark:text-white">
            <FaStethoscope className="mr-2 inline h-4 w-4" />
            Case Summary (De-identified)
          </h4>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div>
              <p className="text-xs text-gray-500">Age/Sex</p>
              <p className="font-medium">
                {post.patientData.age}y / {post.patientData.gender}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Conditions</p>
              <div className="flex flex-wrap gap-1">
                {post.patientData.conditions.map((cond, idx) => (
                  <span
                    key={idx}
                    className="rounded-full bg-red-50 px-2 py-0.5 text-xs text-red-700 dark:bg-red-900/30 dark:text-red-300"
                  >
                    {cond}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500">Current Meds</p>
              <p className="text-sm">
                {post.patientData.medications.length} medications
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Latest HbA1c</p>
              <p className="font-medium text-red-600 dark:text-red-400">
                {post.patientData.labs["HbA1c"]}
              </p>
            </div>
          </div>
        </div>

        {/* Post Content */}
        <div className="mb-6 whitespace-pre-line text-gray-700 dark:text-gray-300">
          {post.content}
        </div>

        {/* Lab Results Table */}
        <div className="mb-6">
          <h5 className="mb-2 font-bold text-navy-700 dark:text-white">
            Recent Lab Results
          </h5>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse rounded-lg border border-gray-200 dark:border-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="border border-gray-200 px-4 py-2 text-left dark:border-gray-700">
                    Test
                  </th>
                  <th className="border border-gray-200 px-4 py-2 text-left dark:border-gray-700">
                    Result
                  </th>
                  <th className="border border-gray-200 px-4 py-2 text-left dark:border-gray-700">
                    Reference
                  </th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(post.patientData.labs).map(([test, result]) => (
                  <tr key={test}>
                    <td className="border border-gray-200 px-4 py-2 dark:border-gray-700">
                      {test}
                    </td>
                    <td className="border border-gray-200 px-4 py-2 font-medium dark:border-gray-700">
                      {result}
                    </td>
                    <td className="border border-gray-200 px-4 py-2 text-sm text-gray-500 dark:border-gray-700">
                      {test === "HbA1c"
                        ? "<6.5%"
                        : test === "Creatinine"
                        ? "64-104 μmol/L"
                        : test === "eGFR"
                        ? ">60 mL/min"
                        : test === "K+"
                        ? "3.5-5.1 mmol/L"
                        : "Normal"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
              <span>
                {post.likes + (liked ? 1 : 0)} professional endorsements
              </span>
            </button>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
              <MdComment className="h-4 w-4" />
              <span>{comments.length} professional comments</span>
            </div>
            <div className="text-gray-600 dark:text-gray-300">
              <span>{post.views} views</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Professional Comment Form */}
      <Card extra="p-6 mb-6">
        <h3 className="mb-4 text-lg font-bold text-navy-700 dark:text-white">
          <MdComment className="mr-2 inline h-5 w-5" />
          Add Professional Comment
        </h3>
        <form onSubmit={handleCommentSubmit}>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your professional opinion, cite references, or suggest management..."
            className="h-32 w-full rounded-lg border border-gray-300 bg-white p-3 dark:border-gray-600 dark:bg-navy-800"
            rows="4"
          />
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              <MdScience className="mr-1 inline h-4 w-4" />
              Please cite references where appropriate. Maintain patient
              confidentiality.
            </div>
            <button
              type="submit"
              className="linear flex items-center rounded-lg bg-brand-500 px-4 py-2 text-white hover:bg-brand-600"
            >
              <MdSend className="mr-2 h-4 w-4" />
              Post Professional Comment
            </button>
          </div>
        </form>
      </Card>

      {/* Comments Section */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-navy-700 dark:text-white">
            Professional Comments ({comments.length})
          </h3>
          <select className="rounded-lg border border-gray-300 bg-white px-3 py-1 text-sm dark:border-gray-600 dark:bg-navy-800">
            <option>Most Relevant (Evidence-based)</option>
            <option>Newest First</option>
            <option>Most Endorsed</option>
            <option>By Specialty</option>
          </select>
        </div>

        <div className="space-y-6">
          {comments.length === 0 ? (
            <Card extra="p-6 text-center">
              <MdComment className="mx-auto h-12 w-12 text-gray-400" />
              <h4 className="mt-4 text-lg font-bold text-navy-700 dark:text-white">
                No professional comments yet
              </h4>
              <p className="mt-2 text-gray-600">
                Be the first to provide expert insight!
              </p>
            </Card>
          ) : (
            comments.map((comment) => (
              <CommentItem key={comment.id} comment={comment} />
            ))
          )}
        </div>
      </div>

      {/* Professional Ethics Reminder */}
      <div className="mt-6">
        <Card extra="p-4">
          <div className="flex items-start">
            <MdWarning className="mr-3 h-5 w-5 text-yellow-500" />
            <div>
              <h5 className="font-bold text-yellow-700 dark:text-yellow-300">
                Professional Ethics & Guidelines
              </h5>
              <ul className="mt-1 text-sm text-yellow-600 dark:text-yellow-400">
                <li>• All patient information must be de-identified</li>
                <li>
                  • Cite peer-reviewed sources for clinical recommendations
                </li>
                <li>• Respect differing professional opinions</li>
                <li>• This forum does not replace formal consultation</li>
                <li>• Report any ethical concerns to forum moderators</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ProviderCommunityPost;
