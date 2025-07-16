import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";

const ActionDropdown = ({ 
  actions, 
  className,
  buttonText = "Actions",
  buttonIcon = "MoreVertical",
  hideText = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  
  return (
    <div className={cn("relative", className)} ref={dropdownRef}>
<Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center ${!hideText ? 'space-x-2' : ''}`}
      >
        {!hideText && <span>{buttonText}</span>}
        <ApperIcon name={buttonIcon} className="h-4 w-4" />
      </Button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.1 }}
            className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border border-gray-200"
          >
            <div className="py-1">
              {actions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => {
                    action.onClick();
                    setIsOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 flex items-center space-x-2"
                >
                  {action.icon && <ApperIcon name={action.icon} className="h-4 w-4" />}
                  <span>{action.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ActionDropdown;