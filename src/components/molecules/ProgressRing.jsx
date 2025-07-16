import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

const ProgressRing = ({ 
  progress = 0, 
  size = 80, 
  strokeWidth = 8,
  color = "forest",
  className 
}) => {
  const normalizedRadius = (size - strokeWidth) / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  
  const colorStyles = {
    forest: "stroke-forest-500",
    orange: "stroke-orange-500",
    blue: "stroke-blue-500",
    green: "stroke-green-500",
    red: "stroke-red-500"
  };
  
  return (
    <div className={cn("relative", className)}>
      <svg
        height={size}
        width={size}
        className="progress-ring"
      >
        <circle
          stroke="#e5e7eb"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={normalizedRadius}
          cx={size / 2}
          cy={size / 2}
        />
        <motion.circle
          stroke="currentColor"
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference + " " + circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={size / 2}
          cy={size / 2}
          className={cn("progress-ring-circle", colorStyles[color])}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: "easeInOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-semibold text-gray-700">{Math.round(progress)}%</span>
      </div>
    </div>
  );
};

export default ProgressRing;