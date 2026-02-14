import React from "react";
import Card from "components/card";

const CategorySidebar = ({
  categories,
  selectedCategory,
  setSelectedCategory,
  languages,
}) => {
  return (
    <Card extra="p-6">
      <h4 className="mb-4 text-lg font-bold text-navy-700 dark:text-white">
        Categories
      </h4>
      <div className="space-y-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`flex w-full items-center justify-between rounded-lg p-3 text-left transition-all duration-200 hover:scale-[1.02] ${
              selectedCategory === category.id
                ? "bg-brand-50 text-brand-600 dark:bg-brand-500/20 dark:text-brand-300"
                : "hover:bg-gray-50 dark:hover:bg-navy-700"
            }`}
          >
            <div className="flex items-center">
              <span className="mr-3 text-gray-600 dark:text-gray-300">
                {category.icon}
              </span>
              <span className="font-medium text-gray-700 dark:text-gray-300">
                {category.name}
              </span>
            </div>
            <span className="rounded-full bg-gray-100 px-2 py-1 text-xs dark:bg-navy-700">
              {category.count}
            </span>
          </button>
        ))}
      </div>

      {/* Language Distribution */}
      <div className="mt-8">
        <h5 className="mb-3 text-sm font-medium text-gray-600">
          Language Distribution
        </h5>
        <div className="space-y-3">
          {languages.map((lang) => (
            <div key={lang.code} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray-700 dark:text-gray-300">
                  {lang.name}
                </span>
                <span className="font-medium">{lang.articles}</span>
              </div>
              <div className="h-1 w-full rounded-full bg-gray-200">
                <div
                  className="h-1 rounded-full bg-blue-500 transition-all duration-500"
                  style={{
                    width: `${(lang.articles / 1245) * 100}%`,
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default CategorySidebar;
