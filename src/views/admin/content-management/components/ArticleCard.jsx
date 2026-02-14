import React from "react";
import { MdEdit, MdDelete, MdPublic, MdVisibility } from "react-icons/md";
import { getStatusBadge } from "./contentUtils";
import LanguageBadges from "./LanguageBadges";

const ArticleCard = ({ article, onEdit, onDelete, onPublish, onPreview }) => {
  return (
    <div className="rounded-lg border border-gray-200 p-4 transition-all duration-300 hover:scale-[1.005] hover:border-brand-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-navy-700">
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
                  <span className="font-medium">{article.category}</span>
                </span>
                <span className="mr-4">
                  Author: <span className="font-medium">{article.author}</span>
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
            onClick={() => onEdit(article)}
            className="flex items-center rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-all duration-200 hover:scale-105 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300"
          >
            <MdEdit className="mr-2 h-4 w-4" />
            Edit
          </button>
          <button
            onClick={() => onDelete(article)}
            className="flex items-center rounded-lg border border-red-300 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 transition-all duration-200 hover:scale-105 hover:bg-red-100 dark:border-red-700 dark:bg-red-900/20 dark:text-red-300"
          >
            <MdDelete className="mr-2 h-4 w-4" />
            Delete
          </button>
          {article.status !== "published" && (
            <button
              onClick={() => onPublish(article)}
              className="flex items-center rounded-lg bg-green-500 px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:scale-105 hover:bg-green-600"
            >
              <MdPublic className="mr-2 h-4 w-4" />
              Publish
            </button>
          )}
          <button
            onClick={() => onPreview(article)}
            className="flex items-center rounded-lg border border-brand-300 bg-brand-50 px-4 py-2 text-sm font-medium text-brand-700 transition-all duration-200 hover:scale-105 hover:bg-brand-100 dark:border-brand-700 dark:bg-brand-900/20 dark:text-brand-300"
          >
            <MdVisibility className="mr-2 h-4 w-4" />
            Preview
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;
