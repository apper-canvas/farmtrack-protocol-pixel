import React from "react";
import { motion } from "framer-motion";
import { format, isToday, isPast } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ActionDropdown from "@/components/molecules/ActionDropdown";
import { cn } from "@/utils/cn";

const TaskCard = ({ task, farm, crop, onEdit, onDelete, onComplete }) => {
  const dueDate = new Date(task.dueDate);
  const isOverdue = isPast(dueDate) && !task.completed;
  const isDueToday = isToday(dueDate);
  
  const actions = [
    { label: "Edit Task", icon: "Edit", onClick: () => onEdit(task) },
    { 
      label: task.completed ? "Mark Incomplete" : "Mark Complete", 
      icon: task.completed ? "Circle" : "CheckCircle", 
      onClick: () => onComplete(task.Id) 
    },
    { label: "Delete Task", icon: "Trash2", onClick: () => onDelete(task.Id) }
  ];
  
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high": return "high";
      case "medium": return "medium";
      case "low": return "low";
      default: return "default";
    }
  };
  
  const getPriorityIcon = (priority) => {
    switch (priority) {
      case "high": return "AlertTriangle";
      case "medium": return "AlertCircle";
      case "low": return "Info";
      default: return "Circle";
    }
  };
  
  return (
    <Card 
      hover 
      className={cn(
        "relative",
        task.completed && "opacity-75",
        isOverdue && !task.completed && "border-red-200 bg-red-50"
      )}
    >
      <div className="absolute top-4 right-4">
        <ActionDropdown actions={actions} buttonIcon="MoreHorizontal" />
      </div>
      
      <div className="space-y-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 mt-1">
            <button
              onClick={() => onComplete(task.Id)}
              className={cn(
                "w-5 h-5 rounded border-2 flex items-center justify-center transition-colors",
                task.completed
                  ? "bg-green-500 border-green-500 text-white"
                  : "border-gray-300 hover:border-green-500"
              )}
            >
              {task.completed && <ApperIcon name="Check" className="h-3 w-3" />}
            </button>
          </div>
          
          <div className="flex-1">
            <h3 className={cn(
              "text-lg font-semibold",
              task.completed ? "text-gray-500 line-through" : "text-gray-900"
            )}>
              {task.title}
            </h3>
            {task.description && (
              <p className="text-sm text-gray-600 mt-1">{task.description}</p>
            )}
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Badge variant={getPriorityColor(task.priority)} className="flex items-center space-x-1">
              <ApperIcon name={getPriorityIcon(task.priority)} className="h-3 w-3" />
              <span>{task.priority}</span>
            </Badge>
            
            {isOverdue && !task.completed && (
              <Badge variant="danger">Overdue</Badge>
            )}
            
            {isDueToday && !task.completed && (
              <Badge variant="warning">Due Today</Badge>
            )}
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <ApperIcon name="Calendar" className="h-4 w-4" />
            <span>{format(dueDate, "MMM d, yyyy")}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-medium text-gray-700">Farm</p>
            <p className="text-gray-600">{farm?.name || "Unknown"}</p>
          </div>
          <div>
            <p className="font-medium text-gray-700">Crop</p>
            <p className="text-gray-600">{crop?.name || "General"}</p>
          </div>
        </div>
        
        {task.completed && task.completedAt && (
          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <ApperIcon name="CheckCircle" className="h-4 w-4 text-green-500" />
              <span>Completed on {format(new Date(task.completedAt), "MMM d, yyyy")}</span>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default TaskCard;