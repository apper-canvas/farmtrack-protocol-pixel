import React from "react";
import { motion } from "framer-motion";
import Card from "@/components/atoms/Card";
import { cn } from "@/utils/cn";

const Loading = ({ type = "cards", count = 6, className }) => {
  const renderSkeletonCard = (index) => (
    <Card key={index} className="animate-pulse">
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gray-200 rounded-lg shimmer"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded shimmer"></div>
            <div className="h-3 bg-gray-200 rounded w-3/4 shimmer"></div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded shimmer"></div>
            <div className="h-4 bg-gray-200 rounded shimmer"></div>
          </div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded shimmer"></div>
            <div className="h-4 bg-gray-200 rounded shimmer"></div>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="w-16 h-6 bg-gray-200 rounded-full shimmer"></div>
          <div className="w-20 h-8 bg-gray-200 rounded shimmer"></div>
        </div>
      </div>
    </Card>
  );
  
  const renderSkeletonList = (index) => (
    <div key={index} className="flex items-center space-x-4 p-4 bg-white rounded-lg border border-gray-200 animate-pulse">
      <div className="w-10 h-10 bg-gray-200 rounded-full shimmer"></div>
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-200 rounded shimmer"></div>
        <div className="h-3 bg-gray-200 rounded w-2/3 shimmer"></div>
      </div>
      <div className="w-16 h-6 bg-gray-200 rounded-full shimmer"></div>
    </div>
  );
  
  const renderSkeletonStats = (index) => (
    <Card key={index} className="animate-pulse">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-24 shimmer"></div>
          <div className="h-8 bg-gray-200 rounded w-16 shimmer"></div>
        </div>
        <div className="w-12 h-12 bg-gray-200 rounded-full shimmer"></div>
      </div>
    </Card>
  );
  
  const renderSkeletonTable = () => (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden animate-pulse">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="h-6 bg-gray-200 rounded w-48 shimmer"></div>
      </div>
      <div className="divide-y divide-gray-200">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="px-6 py-4">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gray-200 rounded shimmer"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded shimmer"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4 shimmer"></div>
              </div>
              <div className="w-20 h-6 bg-gray-200 rounded-full shimmer"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
  
  const renderContent = () => {
    switch (type) {
      case "cards":
        return (
          <div className="grid-responsive">
            {Array.from({ length: count }).map((_, index) => renderSkeletonCard(index))}
          </div>
        );
      case "list":
        return (
          <div className="space-y-4">
            {Array.from({ length: count }).map((_, index) => renderSkeletonList(index))}
          </div>
        );
      case "stats":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, index) => renderSkeletonStats(index))}
          </div>
        );
      case "table":
        return renderSkeletonTable();
      default:
        return (
          <div className="space-y-4">
            {Array.from({ length: count }).map((_, index) => renderSkeletonCard(index))}
          </div>
        );
    }
  };
  
  return (
    <div className={cn("", className)}>
      {renderContent()}
    </div>
  );
};

export default Loading;