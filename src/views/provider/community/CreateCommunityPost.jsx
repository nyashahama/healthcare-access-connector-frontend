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
  MdScience,
  MdAttachFile,
  MdVerifiedUser,
  MdLocalHospital,
} from "react-icons/md";
import {
  FaStethoscope,
  FaUserMd,
  FaPills,
  FaFlask,
  FaNotesMedical,
} from "react-icons/fa";
import Card from "components/card";
import Modal from "components/modal/Modal";
import { useToast } from "hooks/useToast";

const CreateProviderCommunityPost = () => {
  const navigate = useNavigate();
  const [postData, setPostData] = useState({
    title: "",
    content: "",
    category: "",
    caseType: "",
    urgency: "routine",
    patientAge: "",
    patientGender: "",
    conditions: [],
    medications: [],
    tags: [],
    privacy: "verified-only",
    references: [],
  });
  const [tagInput, setTagInput] = useState("");
  const [conditionInput, setConditionInput] = useState("");
  const [medicationInput, setMedicationInput] = useState("");
  const [referenceInput, setReferenceInput] = useState("");
  const [modalState, setModalState] = useState({
    cancel: false,
    preview: false,
    ethics: false,
  });
  const { showToast } = useToast();

  const categories = [
    {
      id: "case-discussions",
      name: "Case Discussion",
      icon: <FaStethoscope />,
      description: "Share de-identified cases for peer consultation",
    },
    {
      id: "clinical-guidelines",
      name: "Guidelines",
      icon: <MdLocalHospital />,
      description: "Discuss treatment protocols and guidelines",
    },
    {
      id: "pharmacology",
      name: "Pharmacology",
      icon: <FaPills />,
      description: "Medication questions, interactions, dosing",
    },
    {
      id: "diagnostics",
      name: "Diagnostics",
      icon: <FaFlask />,
      description: "Test interpretation and diagnostic dilemmas",
    },
    {
      id: "research",
      name: "Research Updates",
      icon: <MdScience />,
      description: "Latest studies and evidence updates",
    },
    {
      id: "practice-management",
      name: "Practice Management",
      icon: <FaUserMd />,
      description: "Administrative and operational topics",
    },
  ];

  const caseTypes = [
    "Diagnostic dilemma",
    "Treatment options",
    "Management advice",
    "Second opinion",
    "Interesting case",
    "Complication management",
  ];

  const specialties = [
    "Cardiology",
    "Endocrinology",
    "Gastroenterology",
    "Neurology",
    "Pediatrics",
    "Psychiatry",
    "Surgery",
    "Obstetrics/Gynecology",
    "Emergency Medicine",
    "Family Medicine",
    "Internal Medicine",
  ];

  const handleBack = () => {
    if (postData.title || postData.content || postData.category) {
      setModalState({ ...modalState, cancel: true });
    } else {
      navigate("/provider/community");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!postData.title.trim()) {
      showToast("Please enter a title", "warning");
      return;
    }

    if (!postData.content.trim()) {
      showToast("Please enter case content", "warning");
      return;
    }

    if (!postData.category) {
      showToast("Please select a category", "warning");
      return;
    }

    if (postData.category === "case-discussions" && !postData.caseType) {
      showToast("Please select case type", "warning");
      return;
    }

    // Ensure patient data is de-identified
    if (postData.patientAge || postData.patientGender) {
      if (
        !confirm(
          "Have you ensured all patient information is completely de-identified?"
        )
      ) {
        showToast("Please review patient anonymity", "warning");
        return;
      }
    }

    console.log("Creating professional post:", postData);
    showToast("Professional discussion posted!", "success");
    setTimeout(() => {
      navigate("/provider/community");
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

  const handleAddCondition = () => {
    if (
      conditionInput.trim() &&
      !postData.conditions.includes(conditionInput.trim())
    ) {
      setPostData({
        ...postData,
        conditions: [...postData.conditions, conditionInput.trim()],
      });
      setConditionInput("");
    }
  };

  const handleAddReference = () => {
    if (
      referenceInput.trim() &&
      !postData.references.includes(referenceInput.trim())
    ) {
      setPostData({
        ...postData,
        references: [...postData.references, referenceInput.trim()],
      });
      setReferenceInput("");
    }
  };

  const confirmCancel = () => {
    setModalState({ ...modalState, cancel: false });
    navigate("/provider/community");
    showToast("Discussion discarded", "info");
  };

  const PreviewModal = () => (
    <Modal
      isOpen={modalState.preview}
      onClose={() => setModalState({ ...modalState, preview: false })}
      title="Professional Post Preview"
      size="xl"
    >
      <div className="space-y-6">
        <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
          <h3 className="text-xl font-bold text-navy-700 dark:text-white">
            {postData.title || "(No title)"}
          </h3>

          {postData.category && (
            <div className="mt-2 flex gap-2">
              <span className="rounded-full bg-gray-100 px-3 py-1 text-sm dark:bg-gray-800">
                {categories.find((c) => c.id === postData.category)?.name}
              </span>
              {postData.caseType && (
                <span className="rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                  {postData.caseType}
                </span>
              )}
              {postData.urgency !== "routine" && (
                <span className="rounded-full bg-yellow-50 px-3 py-1 text-sm text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300">
                  {postData.urgency} urgency
                </span>
              )}
            </div>
          )}

          {postData.conditions.length > 0 && (
            <div className="mt-3">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Conditions:
              </p>
              <div className="mt-1 flex flex-wrap gap-1">
                {postData.conditions.map((condition) => (
                  <span
                    key={condition}
                    className="rounded-full bg-red-50 px-2 py-1 text-xs text-red-700 dark:bg-red-900/30 dark:text-red-300"
                  >
                    {condition}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-4">
            <p className="whitespace-pre-line text-gray-700 dark:text-gray-300">
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

          <div className="mt-4 rounded-lg bg-green-50 p-3 dark:bg-green-900/20">
            <p className="text-sm text-green-700 dark:text-green-300">
              This post will only be visible to verified healthcare
              professionals.
            </p>
          </div>
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
        title="Discard Professional Discussion?"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300">
            You have unsaved changes to your professional discussion. Discard?
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
              Discard Discussion
            </button>
          </div>
        </div>
      </Modal>

      <PreviewModal />

      <Modal
        isOpen={modalState.ethics}
        onClose={() => setModalState({ ...modalState, ethics: false })}
        title="Professional Ethics Guidelines"
        size="lg"
      >
        <div className="space-y-4">
          <div className="rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
            <h4 className="font-bold text-red-800 dark:text-red-300">
              ⚠️ Critical Requirements
            </h4>
            <ul className="mt-2 space-y-2 text-sm text-red-700 dark:text-red-300">
              <li>
                • <strong>Patient confidentiality is non-negotiable.</strong>{" "}
                Remove all identifying information.
              </li>
              <li>
                • Do not include names, dates, locations, or unique identifiers.
              </li>
              <li>
                • Change non-essential details while preserving clinical
                relevance.
              </li>
            </ul>
          </div>

          <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
            <h4 className="font-bold text-blue-800 dark:text-blue-300">
              📋 Best Practices
            </h4>
            <ul className="mt-2 space-y-2 text-sm text-blue-700 dark:text-blue-300">
              <li>• Be specific about clinical findings and timelines</li>
              <li>• Include relevant investigations and results</li>
              <li>• Cite current guidelines or literature where applicable</li>
              <li>• State clear question or dilemma for discussion</li>
              <li>• Tag with appropriate specialties for relevant responses</li>
            </ul>
          </div>

          <div className="rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
            <h4 className="font-bold text-green-800 dark:text-green-300">
              ✅ Remember
            </h4>
            <p className="mt-2 text-sm text-green-700 dark:text-green-300">
              This forum is for professional discussion and peer learning only.
              It does not constitute formal consultation or establish
              doctor-patient relationships.
            </p>
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => setModalState({ ...modalState, ethics: false })}
              className="rounded-lg border border-gray-300 px-6 py-2 hover:bg-gray-50 dark:border-gray-600"
            >
              I Accept & Will Comply
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
        <button
          onClick={() => setModalState({ ...modalState, ethics: true })}
          className="flex items-center text-sm text-red-500 hover:text-red-600"
        >
          <MdWarning className="mr-2 h-4 w-4" />
          Review Ethics Guidelines
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column - Form */}
        <div className="lg:col-span-2">
          <Card extra="p-6">
            <div className="mb-6 flex items-center">
              <FaNotesMedical className="mr-3 h-6 w-6 text-brand-500" />
              <h3 className="text-2xl font-bold text-navy-700 dark:text-white">
                Create Professional Discussion
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <label className="mb-2 flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                  <MdTitle className="mr-2 h-4 w-4" />
                  Discussion Title *
                </label>
                <input
                  type="text"
                  value={postData.title}
                  onChange={(e) =>
                    setPostData({ ...postData, title: e.target.value })
                  }
                  placeholder="Summarize the clinical question or case"
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 dark:border-gray-600 dark:bg-navy-800"
                  maxLength="150"
                  required
                />
                <div className="mt-1 text-right text-xs text-gray-500">
                  {postData.title.length}/150 characters
                </div>
              </div>

              {/* Category & Case Type */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                    <MdCategory className="mr-2 h-4 w-4" />
                    Category *
                  </label>
                  <select
                    value={postData.category}
                    onChange={(e) =>
                      setPostData({ ...postData, category: e.target.value })
                    }
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 dark:border-gray-600 dark:bg-navy-800"
                    required
                  >
                    <option value="">Select category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {postData.category === "case-discussions" && (
                  <div>
                    <label className="mb-2 flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                      <FaStethoscope className="mr-2 h-4 w-4" />
                      Case Type *
                    </label>
                    <select
                      value={postData.caseType}
                      onChange={(e) =>
                        setPostData({ ...postData, caseType: e.target.value })
                      }
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 dark:border-gray-600 dark:bg-navy-800"
                      required
                    >
                      <option value="">Select case type</option>
                      {caseTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Patient Information (De-identified) */}
              {postData.category === "case-discussions" && (
                <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                  <h4 className="mb-3 font-medium text-navy-700 dark:text-white">
                    Case Information (De-identified)
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1 block text-xs text-gray-500">
                        Approximate Age
                      </label>
                      <input
                        type="text"
                        value={postData.patientAge}
                        onChange={(e) =>
                          setPostData({
                            ...postData,
                            patientAge: e.target.value,
                          })
                        }
                        placeholder="e.g., 50s, elderly"
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-navy-800"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs text-gray-500">
                        Gender
                      </label>
                      <select
                        value={postData.patientGender}
                        onChange={(e) =>
                          setPostData({
                            ...postData,
                            patientGender: e.target.value,
                          })
                        }
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-navy-800"
                      >
                        <option value="">Select</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-3">
                    <label className="mb-1 block text-xs text-gray-500">
                      Conditions (Optional)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={conditionInput}
                        onChange={(e) => setConditionInput(e.target.value)}
                        placeholder="Add relevant conditions"
                        className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-navy-800"
                      />
                      <button
                        type="button"
                        onClick={handleAddCondition}
                        className="rounded-lg border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50 dark:border-gray-600"
                      >
                        Add
                      </button>
                    </div>
                    {postData.conditions.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {postData.conditions.map((condition) => (
                          <span
                            key={condition}
                            className="flex items-center gap-1 rounded-full bg-red-50 px-2 py-1 text-xs text-red-700 dark:bg-red-900/30 dark:text-red-300"
                          >
                            {condition}
                            <button
                              type="button"
                              onClick={() =>
                                setPostData({
                                  ...postData,
                                  conditions: postData.conditions.filter(
                                    (c) => c !== condition
                                  ),
                                })
                              }
                              className="ml-1 text-red-500 hover:text-red-700"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="mt-3">
                    <label className="mb-1 block text-xs text-gray-500">
                      Urgency Level
                    </label>
                    <div className="flex gap-2">
                      {["routine", "urgent", "emergent"].map((level) => (
                        <button
                          key={level}
                          type="button"
                          onClick={() =>
                            setPostData({ ...postData, urgency: level })
                          }
                          className={`rounded-lg px-3 py-1 text-sm ${
                            postData.urgency === level
                              ? level === "routine"
                                ? "bg-gray-200 text-gray-800 dark:bg-gray-700"
                                : level === "urgent"
                                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30"
                                : "bg-red-100 text-red-800 dark:bg-red-900/30"
                              : "border border-gray-300 dark:border-gray-600"
                          }`}
                        >
                          {level.charAt(0).toUpperCase() + level.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Content */}
              <div>
                <label className="mb-2 flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                  <MdDescription className="mr-2 h-4 w-4" />
                  Clinical Content *
                </label>
                <textarea
                  value={postData.content}
                  onChange={(e) =>
                    setPostData({ ...postData, content: e.target.value })
                  }
                  placeholder={`Describe the case, question, or topic. Include:\n• Relevant history and findings\n• Investigations and results\n• Current management\n• Specific questions for discussion`}
                  className="h-64 w-full rounded-lg border border-gray-300 bg-white p-4 dark:border-gray-600 dark:bg-navy-800"
                  rows="10"
                  required
                />
                <div className="mt-1 text-sm text-gray-500">
                  Be thorough but ensure all patient information is
                  de-identified.
                </div>
              </div>

              {/* References */}
              <div>
                <label className="mb-2 flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                  <MdScience className="mr-2 h-4 w-4" />
                  References (Optional)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={referenceInput}
                    onChange={(e) => setReferenceInput(e.target.value)}
                    placeholder="e.g., Lancet 2023;401:123-135"
                    className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 dark:border-gray-600 dark:bg-navy-800"
                  />
                  <button
                    type="button"
                    onClick={handleAddReference}
                    className="rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-50 dark:border-gray-600"
                  >
                    Add
                  </button>
                </div>
                {postData.references.length > 0 && (
                  <div className="mt-3 space-y-1">
                    {postData.references.map((ref, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between rounded-lg bg-gray-50 p-2 dark:bg-gray-800"
                      >
                        <span className="text-sm">
                          [{idx + 1}] {ref}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setPostData({
                              ...postData,
                              references: postData.references.filter(
                                (_, i) => i !== idx
                              ),
                            })
                          }
                          className="text-gray-500 hover:text-red-500"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Tags */}
              <div>
                <label className="mb-2 flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                  <MdTag className="mr-2 h-4 w-4" />
                  Specialty Tags
                </label>
                <div className="flex flex-wrap gap-2">
                  {specialties.slice(0, 8).map((specialty) => (
                    <button
                      key={specialty}
                      type="button"
                      onClick={() => {
                        if (!postData.tags.includes(specialty)) {
                          setPostData({
                            ...postData,
                            tags: [...postData.tags, specialty],
                          });
                        }
                      }}
                      className={`rounded-full px-3 py-1 text-xs ${
                        postData.tags.includes(specialty)
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
                      }`}
                    >
                      {specialty}
                    </button>
                  ))}
                </div>
                <div className="mt-3 flex gap-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                    placeholder="Add custom tags"
                    className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm dark:border-gray-600 dark:bg-navy-800"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50 dark:border-gray-600"
                  >
                    Add Tag
                  </button>
                </div>
                {postData.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {postData.tags.map((tag) => (
                      <span
                        key={tag}
                        className="flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() =>
                            setPostData({
                              ...postData,
                              tags: postData.tags.filter((t) => t !== tag),
                            })
                          }
                          className="ml-1 text-blue-500 hover:text-blue-700"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Privacy */}
              <div>
                <label className="mb-2 flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                  <MdVisibility className="mr-2 h-4 w-4" />
                  Privacy Setting
                </label>
                <div className="space-y-3">
                  <label className="flex items-start">
                    <input
                      type="radio"
                      name="privacy"
                      checked={postData.privacy === "verified-only"}
                      onChange={() =>
                        setPostData({ ...postData, privacy: "verified-only" })
                      }
                      className="mr-3 mt-1 h-4 w-4"
                    />
                    <div>
                      <div className="font-medium">
                        Verified Professionals Only
                      </div>
                      <div className="text-sm text-gray-500">
                        Visible only to verified healthcare providers
                      </div>
                    </div>
                  </label>
                  <label className="flex items-start">
                    <input
                      type="radio"
                      name="privacy"
                      checked={postData.privacy === "specialty-only"}
                      onChange={() =>
                        setPostData({ ...postData, privacy: "specialty-only" })
                      }
                      className="mr-3 mt-1 h-4 w-4"
                    />
                    <div>
                      <div className="font-medium">
                        Specific Specialties Only
                      </div>
                      <div className="text-sm text-gray-500">
                        Limit to selected specialty groups
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
                  Preview Discussion
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
                    className="linear flex items-center rounded-lg bg-brand-500 px-6 py-2 text-white hover:bg-brand-600"
                    disabled={
                      !postData.title || !postData.content || !postData.category
                    }
                  >
                    <MdSend className="mr-2 h-4 w-4" />
                    Post to Professional Forum
                  </button>
                </div>
              </div>
            </form>
          </Card>
        </div>

        {/* Right Column - Guidelines */}
        <div className="space-y-6">
          <Card extra="p-6">
            <h4 className="mb-4 flex items-center text-lg font-bold text-navy-700 dark:text-white">
              <MdVerifiedUser className="mr-2 h-5 w-5 text-green-500" />
              Professional Standards
            </h4>
            <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
              <li className="flex items-start">
                <div className="mr-3 flex h-6 w-6 items-center justify-center rounded-full bg-red-100 text-red-600">
                  ⚠️
                </div>
                <span>
                  <strong>Patient confidentiality</strong> is mandatory. Remove
                  ALL identifying details.
                </span>
              </li>
              <li className="flex items-start">
                <div className="mr-3 flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  1
                </div>
                <span>Be specific about clinical findings and timeline</span>
              </li>
              <li className="flex items-start">
                <div className="mr-3 flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-green-600">
                  2
                </div>
                <span>Include relevant test results and imaging findings</span>
              </li>
              <li className="flex items-start">
                <div className="mr-3 flex h-6 w-6 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                  3
                </div>
                <span>State clear clinical questions for discussion</span>
              </li>
              <li className="flex items-start">
                <div className="mr-3 flex h-6 w-6 items-center justify-center rounded-full bg-yellow-100 text-yellow-600">
                  4
                </div>
                <span>Cite guidelines or literature when available</span>
              </li>
            </ul>
          </Card>

          <Card extra="p-6">
            <h4 className="mb-4 flex items-center text-lg font-bold text-navy-700 dark:text-white">
              <MdWarning className="mr-2 h-5 w-5 text-red-500" />
              Important Reminders
            </h4>
            <div className="space-y-3 text-sm">
              <div className="rounded-lg bg-red-50 p-3 dark:bg-red-900/20">
                <p className="text-red-700 dark:text-red-300">
                  <strong>This is not a consultation service.</strong> All
                  advice is for educational purposes only.
                </p>
              </div>
              <div className="rounded-lg bg-yellow-50 p-3 dark:bg-yellow-900/20">
                <p className="text-yellow-700 dark:text-yellow-300">
                  <strong>No patient identifiers.</strong> Even seemingly
                  harmless details can identify patients.
                </p>
              </div>
              <div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
                <p className="text-blue-700 dark:text-blue-300">
                  <strong>Respect professional differences.</strong> Clinical
                  practice varies appropriately.
                </p>
              </div>
            </div>
          </Card>

          <Card extra="p-6">
            <h4 className="mb-4 text-lg font-bold text-navy-700 dark:text-white">
              🏥 Popular Topics
            </h4>
            <div className="flex flex-wrap gap-2">
              {[
                "Antibiotic Stewardship",
                "Pain Management",
                "Diabetes Guidelines",
                "Hypertension",
                "Mental Health",
                "Geriatrics",
                "Palliative Care",
                "Vaccination",
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

export default CreateProviderCommunityPost;
