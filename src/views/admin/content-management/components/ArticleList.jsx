import React from "react";
import { FaDownload } from "react-icons/fa";
import Card from "components/card";
import ArticleCard from "./ArticleCard";

const ArticleList = ({ articles, onEdit, onDelete, onPublish, onPreview }) => {
  return (
    <Card extra="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h4 className="text-lg font-bold text-navy-700 dark:text-white">
            Health Education Articles
          </h4>
          <p className="text-sm text-gray-600">
            {articles.length} articles found
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm dark:border-gray-600 dark:bg-navy-700">
            <option>Sort by: Most Recent</option>
            <option>Most Viewed</option>
            <option>Alphabetical</option>
          </select>
          <button className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium transition-all duration-200 hover:scale-105 hover:bg-gray-50 dark:border-gray-600">
            <FaDownload className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Articles List */}
      <div className="space-y-4">
        {articles.map((article) => (
          <ArticleCard
            key={article.id}
            article={article}
            onEdit={onEdit}
            onDelete={onDelete}
            onPublish={onPublish}
            onPreview={onPreview}
          />
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-6 flex items-center justify-between">
        <div className="text-sm text-gray-600 dark:text-gray-300">
          Showing 1-6 of {articles.length} articles
        </div>
        <div className="flex items-center space-x-2">
          <button className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm transition-all duration-200 hover:scale-105 hover:bg-gray-50 dark:border-gray-600">
            Previous
          </button>
          <button className="rounded-lg bg-brand-500 px-3 py-1.5 text-sm text-white transition-all duration-200 hover:scale-105 hover:bg-brand-600">
            1
          </button>
          <button className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm transition-all duration-200 hover:scale-105 hover:bg-gray-50 dark:border-gray-600">
            2
          </button>
          <button className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm transition-all duration-200 hover:scale-105 hover:bg-gray-50 dark:border-gray-600">
            Next
          </button>
        </div>
      </div>
    </Card>
  );
};

export default ArticleList;
