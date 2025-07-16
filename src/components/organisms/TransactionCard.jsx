import React from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import ActionDropdown from "@/components/molecules/ActionDropdown";
import { cn } from "@/utils/cn";

const TransactionCard = ({ transaction, farm, crop, onEdit, onDelete }) => {
  const actions = [
    { label: "Edit Transaction", icon: "Edit", onClick: () => onEdit(transaction) },
    { label: "Delete Transaction", icon: "Trash2", onClick: () => onDelete(transaction.Id) }
  ];
  
  const isIncome = transaction.type === "income";
  const amount = Math.abs(transaction.amount);
  
  const getTypeIcon = (type) => {
    return type === "income" ? "TrendingUp" : "TrendingDown";
  };
  
  const getTypeColor = (type) => {
    return type === "income" ? "text-green-600" : "text-red-600";
  };
  
  const getCategoryIcon = (category) => {
    const icons = {
      "seeds": "Sprout",
      "fertilizer": "Beaker",
      "equipment": "Wrench",
      "fuel": "Fuel",
      "labor": "Users",
      "sale": "ShoppingCart",
      "subsidy": "Gift",
      "other": "Package"
    };
    return icons[category] || "Package";
  };
  
return (
    <Card hover className="relative">
      <div className="absolute top-4 right-4 z-20">
<ActionDropdown actions={actions} buttonIcon="MoreHorizontal" />
      </div>
      
<div className="space-y-4 pr-24">
        <div className="flex items-start space-x-3">
          <div className={cn(
            "p-2 rounded-lg",
            isIncome ? "bg-green-50" : "bg-red-50"
          )}>
            <ApperIcon 
              name={getCategoryIcon(transaction.category)} 
              className={cn("h-6 w-6", isIncome ? "text-green-600" : "text-red-600")} 
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {transaction.category.charAt(0).toUpperCase() + transaction.category.slice(1)}
              </h3>
              <div className="flex items-center space-x-2 flex-shrink-0">
                <ApperIcon 
                  name={getTypeIcon(transaction.type)} 
                  className={cn("h-5 w-5", getTypeColor(transaction.type))} 
                />
                <span className={cn("text-xl font-bold", getTypeColor(transaction.type))}>
                  {isIncome ? "+" : "-"}${amount.toFixed(2)}
                </span>
              </div>
            </div>
            
            {transaction.description && (
              <p className="text-sm text-gray-600 mt-1">{transaction.description}</p>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-medium text-gray-700">Farm</p>
            <p className="text-gray-600">{farm?.name || "General"}</p>
          </div>
          <div>
            <p className="font-medium text-gray-700">Crop</p>
            <p className="text-gray-600">{crop?.name || "General"}</p>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <Badge variant={isIncome ? "success" : "danger"}>
            {isIncome ? "Income" : "Expense"}
          </Badge>
          
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <ApperIcon name="Calendar" className="h-4 w-4" />
            <span>{format(new Date(transaction.date), "MMM d, yyyy")}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TransactionCard;