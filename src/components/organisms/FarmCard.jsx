import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ActionDropdown from "@/components/molecules/ActionDropdown";
import { cn } from "@/utils/cn";

const FarmCard = ({ farm, onEdit, onDelete, onViewDetails }) => {
  const actions = [
    { label: "Edit Farm", icon: "Edit", onClick: () => onEdit(farm) },
    { label: "View Details", icon: "Eye", onClick: () => onViewDetails(farm) },
    { label: "Delete Farm", icon: "Trash2", onClick: () => onDelete(farm.Id) }
  ];
  
return (
    <Card hover className="relative">
      <div className="absolute top-4 right-4 z-20">
        <ActionDropdown actions={actions} buttonIcon="MoreHorizontal" />
      </div>
      
      <div className="space-y-4 pr-16">
        <div className="flex items-start space-x-3">
          <div className="p-2 bg-forest-50 rounded-lg">
            <ApperIcon name="MapPin" className="h-6 w-6 text-forest-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">{farm.name}</h3>
            <p className="text-sm text-gray-600">{farm.location}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-700">Size</p>
            <p className="text-lg font-semibold text-gray-900">
              {farm.size} {farm.sizeUnit}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">Active Crops</p>
            <p className="text-lg font-semibold text-gray-900">
              {farm.activeCrops || 0}
            </p>
          </div>
        </div>
        
<div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <Badge variant="success">Active</Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails(farm)}
          >
            <ApperIcon name="MoreHorizontal" className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default FarmCard;