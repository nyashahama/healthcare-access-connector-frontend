import React from "react";
import Card from "components/card";

const MealPlannerCard = ({ onGenerateMeal }) => {
  const ingredients = [
    "Rice",
    "Beans",
    "Eggs",
    "Tomatoes",
    "Onions",
    "Spinach",
  ];

  return (
    <Card extra="p-6">
      <h4 className="mb-4 text-lg font-bold text-navy-700 dark:text-white">
        🍽️ Quick Meal Idea Generator
      </h4>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Available Ingredients
          </label>
          <div className="flex flex-wrap gap-2">
            {ingredients.map((ingredient) => (
              <span
                key={ingredient}
                className="rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
              >
                {ingredient}
              </span>
            ))}
          </div>
          <button className="linear mt-4 w-full rounded-lg bg-brand-50 py-2 text-sm font-medium text-brand-600 hover:bg-brand-100 dark:bg-brand-900/30">
            + Add Ingredients
          </button>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Suggested Meal
          </label>
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-navy-700">
            <h5 className="font-bold text-navy-700 dark:text-white">
              Bean & Spinach Rice Bowl
            </h5>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Cook rice. Sauté onions and tomatoes, add beans and spinach.
              Season and serve over rice.
            </p>
            <p className="mt-2 text-xs text-gray-500">
              Prep time: 20 mins • Serves: 4
            </p>
          </div>
          <button
            onClick={onGenerateMeal}
            className="linear mt-4 w-full rounded-lg bg-green-500 py-2 text-sm font-medium text-white hover:bg-green-600"
          >
            Generate Another Idea
          </button>
        </div>
      </div>
    </Card>
  );
};

export default MealPlannerCard;
