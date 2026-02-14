import React from "react";

const CategoryGrid = ({
  categories,
  selectedCategory,
  setSelectedCategory,
}) => {
  return (
    <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => setSelectedCategory(category.id)}
          className={`flex flex-col items-center rounded-lg p-4 transition-all duration-200 hover:scale-105 ${
            selectedCategory === category.id
              ? "bg-brand-500 text-white shadow-lg"
              : "border border-gray-200 bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-navy-800"
          }`}
        >
          <div
            className={`text-3xl ${
              selectedCategory === category.id ? "text-white" : "text-brand-500"
            }`}
          >
            {category.icon}
          </div>
          <span className="mt-2 text-sm font-medium">{category.name}</span>
          <span
            className={`mt-1 text-xs ${
              selectedCategory === category.id
                ? "text-white/80"
                : "text-gray-500"
            }`}
          >
            {category.count} guides
          </span>
        </button>
      ))}
    </div>
  );
};

export default CategoryGrid;
