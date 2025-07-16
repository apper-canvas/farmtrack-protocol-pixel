import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

const FilterTabs = ({ 
  tabs, 
  activeTab, 
  onTabChange,
  className 
}) => {
  return (
    <div className={cn("flex space-x-1 bg-gray-100 p-1 rounded-lg", className)}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            "relative px-4 py-2 text-sm font-medium rounded-md transition-all duration-200",
            activeTab === tab.id
              ? "text-forest-700 bg-white shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          )}
        >
          {activeTab === tab.id && (
            <motion.div
              layoutId="activeTab"
              className="absolute inset-0 bg-white rounded-md shadow-sm"
              style={{ zIndex: -1 }}
            />
          )}
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default FilterTabs;