import React from "react";
import Card from "components/card";

const ContentInsights = ({ articles, languages }) => {
  const sortedByViews = [...articles].sort(
    (a, b) =>
      parseInt(b.views.replace(/,/g, "")) - parseInt(a.views.replace(/,/g, ""))
  );

  return (
    <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
      {/* Most Popular Articles */}
      <Card extra="p-6">
        <h4 className="mb-4 text-lg font-bold text-navy-700 dark:text-white">
          📊 Most Popular Articles
        </h4>
        <div className="space-y-4">
          {sortedByViews.slice(0, 3).map((article) => (
            <div
              key={article.id}
              className="flex items-center justify-between transition-all duration-300 hover:scale-[1.02]"
            >
              <div className="flex-1">
                <div className="font-medium text-navy-700 dark:text-white">
                  {article.title}
                </div>
                <div className="text-sm text-gray-500">{article.category}</div>
              </div>
              <div className="text-right">
                <div className="font-bold">{article.views}</div>
                <div className="text-xs text-gray-500">views</div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Translation Progress */}
      <Card extra="p-6">
        <h4 className="mb-4 text-lg font-bold text-navy-700 dark:text-white">
          🌍 Translation Progress
        </h4>
        <div className="space-y-3">
          {languages.map((lang) => (
            <div key={lang.code} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray-700 dark:text-gray-300">
                  {lang.name}
                </span>
                <span className="font-medium">
                  {Math.round((lang.articles / 1245) * 100)}%
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-200">
                <div
                  className="h-2 rounded-full bg-purple-500 transition-all duration-1000"
                  style={{
                    width: `${(lang.articles / 1245) * 100}%`,
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default ContentInsights;
