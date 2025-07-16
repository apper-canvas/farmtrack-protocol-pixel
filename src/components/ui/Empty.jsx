import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";

const Empty = ({ 
  title = "No data found",
  message = "There's nothing here yet. Get started by adding some data.",
  icon = "Package",
  actionLabel = "Add New",
  onAction,
  className 
}) => {
  return (
    <Card className={cn("text-center py-12", className)}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-gradient-to-br from-forest-50 to-forest-100 rounded-full flex items-center justify-center">
            <ApperIcon name={icon} className="h-8 w-8 text-forest-600" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="text-gray-600 max-w-md mx-auto">{message}</p>
        </div>
        
        {onAction && (
          <div className="flex justify-center">
            <Button onClick={onAction} className="flex items-center space-x-2">
              <ApperIcon name="Plus" className="h-4 w-4" />
              <span>{actionLabel}</span>
            </Button>
          </div>
        )}
        
        <div className="text-sm text-gray-500">
          <p>Start managing your farm operations efficiently.</p>
        </div>
      </motion.div>
    </Card>
  );
};

export default Empty;