import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import { cn } from "@/utils/cn";

const StatCard = ({ 
  title, 
  value, 
  change, 
  icon, 
  color = "forest",
  className,
  gradient = false
}) => {
  const colorStyles = {
    forest: "text-forest-600 bg-forest-50",
    orange: "text-orange-600 bg-orange-50",
    blue: "text-blue-600 bg-blue-50",
    green: "text-green-600 bg-green-50",
    red: "text-red-600 bg-red-50"
  };
  
  const changeColor = change && change > 0 ? "text-green-600" : "text-red-600";
  
  return (
    <Card className={cn("", className)} hover gradient={gradient}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <div className="flex items-center space-x-2 mt-2">
            <p className="text-2xl font-bold text-gray-900 count-up">{value}</p>
            {change && (
              <span className={cn("text-sm font-medium", changeColor)}>
                {change > 0 ? "+" : ""}{change}%
              </span>
            )}
          </div>
        </div>
        <div className={cn("p-3 rounded-full", colorStyles[color])}>
          <ApperIcon name={icon} className="h-6 w-6" />
        </div>
      </div>
    </Card>
  );
};

export default StatCard;