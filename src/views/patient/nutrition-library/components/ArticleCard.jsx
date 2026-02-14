import React from "react";
import {
  MdAccessTime,
  MdDownload,
  MdShare,
  MdBookmark,
  MdBookmarkBorder,
} from "react-icons/md";
import Card from "components/card";

const ArticleCard = ({
  article,
  isBookmarked,
  onToggleBookmark,
  onViewArticle,
  onSaveOffline,
  onDownload,
  onShare,
}) => {
  return (
    <Card extra="p-6 hover:shadow-lg transition-shadow">
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
                onClick={() => onDownload(article)}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-300"
                title="Download"
              >
                <MdDownload className="h-5 w-5" />
              </button>
              <button
                onClick={() => onShare(article)}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-300"
                title="Share"
              >
                <MdShare className="h-5 w-5" />
              </button>
              <button
                onClick={() => onToggleBookmark(article.id)}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-300"
                title="Bookmark"
              >
                {isBookmarked ? (
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
              onClick={() => onViewArticle(article)}
              className="linear flex-1 rounded-lg bg-brand-500 py-2 font-medium text-white hover:bg-brand-600"
            >
              Read Full Guide
            </button>
            <button
              onClick={() => onSaveOffline(article)}
              className="rounded-lg border border-gray-300 px-4 py-2 font-medium hover:bg-gray-50 dark:border-gray-600"
            >
              Save for Offline
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ArticleCard;
