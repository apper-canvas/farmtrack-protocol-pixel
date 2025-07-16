import React from "react";
import { motion } from "framer-motion";
import { format, differenceInDays } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ActionDropdown from "@/components/molecules/ActionDropdown";
import ProgressRing from "@/components/molecules/ProgressRing";
import { cn } from "@/utils/cn";

const CropCard = ({ crop, farm, onEdit, onDelete, onHarvest }) => {
  const plantingDate = new Date(crop.plantingDate);
  const expectedHarvestDate = new Date(crop.expectedHarvestDate);
  const today = new Date();
  
  const totalDays = differenceInDays(expectedHarvestDate, plantingDate);
  const daysPassed = differenceInDays(today, plantingDate);
  const daysToHarvest = differenceInDays(expectedHarvestDate, today);
  const progress = Math.min(Math.max((daysPassed / totalDays) * 100, 0), 100);
  
  const actions = [
    { label: "Edit Crop", icon: "Edit", onClick: () => onEdit(crop) },
    { label: "Mark as Harvested", icon: "CheckCircle", onClick: () => onHarvest(crop.Id) },
    { label: "Delete Crop", icon: "Trash2", onClick: () => onDelete(crop.Id) }
  ];
  
  const getStatusColor = (status) => {
    switch (status) {
      case "seedling": return "seedling";
      case "growing": return "growing";
      case "ready": return "ready";
      case "harvested": return "harvested";
      default: return "default";
    }
  };
  
  const getStatusIcon = (status) => {
    switch (status) {
      case "seedling": return "Sprout";
      case "growing": return "TreePine";
      case "ready": return "Wheat";
      case "harvested": return "Package";
      default: return "Sprout";
    }
  };
  
return (
    <Card hover className="relative">
      <div className="absolute top-4 right-4 z-20">
        <ActionDropdown actions={actions} buttonIcon="MoreHorizontal" />
      </div>
      
      <div className="space-y-4 pr-16">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-forest-50 rounded-lg">
              <ApperIcon name={getStatusIcon(crop.status)} className="h-6 w-6 text-forest-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">{crop.name}</h3>
              <p className="text-sm text-gray-600">{crop.variety}</p>
              <p className="text-sm text-gray-500">{farm?.name}</p>
            </div>
          </div>
          
          <div className="flex flex-col items-center space-y-2">
            <ProgressRing progress={progress} size={60} strokeWidth={6} />
            <Badge variant={getStatusColor(crop.status)} className="text-xs">
              {crop.status}
            </Badge>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-700">Planted</p>
            <p className="text-sm text-gray-900">{format(plantingDate, "MMM d, yyyy")}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">
              {daysToHarvest > 0 ? "Days to Harvest" : "Ready to Harvest"}
            </p>
            <p className="text-sm text-gray-900">
              {daysToHarvest > 0 ? `${daysToHarvest} days` : "Now"}
            </p>
          </div>
        </div>
        
        <div>
          <p className="text-sm font-medium text-gray-700">Area</p>
          <p className="text-sm text-gray-900">{crop.area} acres</p>
        </div>
        
        {crop.notes && (
          <div>
            <p className="text-sm font-medium text-gray-700">Notes</p>
            <p className="text-sm text-gray-600 truncate">{crop.notes}</p>
          </div>
        )}
        
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <ApperIcon name="Calendar" className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-500">
              {format(expectedHarvestDate, "MMM d, yyyy")}
            </span>
          </div>
          
          {crop.status === "ready" && (
            <Button
              variant="success"
              size="sm"
              onClick={() => onHarvest(crop.Id)}
            >
              Harvest
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default CropCard;