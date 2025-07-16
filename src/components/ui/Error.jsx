import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";

const Error = ({ 
  title = "Something went wrong",
  message = "We encountered an error while loading the data. Please try again.",
  onRetry,
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
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center">
            <ApperIcon name="AlertTriangle" className="h-8 w-8 text-red-500" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="text-gray-600 max-w-md mx-auto">{message}</p>
        </div>
        
        <div className="flex justify-center space-x-4">
          {onRetry && (
            <Button onClick={onRetry} className="flex items-center space-x-2">
              <ApperIcon name="RefreshCw" className="h-4 w-4" />
              <span>Try Again</span>
            </Button>
          )}
          
          <Button
            variant="outline"
            onClick={() => window.location.reload()}
            className="flex items-center space-x-2"
          >
            <ApperIcon name="RotateCcw" className="h-4 w-4" />
            <span>Reload Page</span>
          </Button>
        </div>
        
        <div className="text-sm text-gray-500">
          <p>If the problem persists, please contact support.</p>
        </div>
      </motion.div>
    </Card>
  );
};

export default Error;