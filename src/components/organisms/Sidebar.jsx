import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import { cn } from "@/utils/cn";
import { taskService } from "@/services/api/taskService";
const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const [overdueCount, setOverdueCount] = useState(0);
  
  const navigationItems = [
    { path: "/", label: "Dashboard", icon: "BarChart3" },
    { path: "/farms", label: "Farms", icon: "MapPin" },
    { path: "/crops", label: "Crops", icon: "Sprout" },
    { path: "/tasks", label: "Tasks", icon: "CheckSquare", badge: overdueCount > 0 ? overdueCount : null },
    { path: "/finance", label: "Finance", icon: "DollarSign" },
    { path: "/weather", label: "Weather", icon: "CloudSun" }
  ];

  // Load overdue task count
  useEffect(() => {
    const loadOverdueCount = async () => {
      try {
        const overdueTasks = await taskService.getOverdueTasks();
        setOverdueCount(overdueTasks.length);
      } catch (err) {
        console.error("Failed to load overdue tasks:", err);
      }
    };

    loadOverdueCount();
    
    // Refresh every minute to keep count current
    const interval = setInterval(loadOverdueCount, 60000);
    return () => clearInterval(interval);
  }, []);
  // Desktop sidebar - static
  const DesktopSidebar = () => (
    <div className="hidden lg:block w-64 bg-white border-r border-gray-200 h-full">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-primary rounded-lg">
            <ApperIcon name="Wheat" className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gradient">FarmTrack Pro</h1>
            <p className="text-sm text-gray-600">Agriculture Management</p>
          </div>
        </div>
      </div>
      
      <nav className="p-4 space-y-2">
        {navigationItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200",
                isActive
                  ? "bg-forest-50 text-forest-700 border-l-4 border-forest-500"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )
            }
>
            <div className="flex items-center space-x-3">
              <ApperIcon name={item.icon} className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
              {item.badge && (
                <Badge 
                  variant="danger" 
                  size="sm"
                  className="bg-red-500 text-white font-semibold"
                >
                  {item.badge}
                </Badge>
              )}
            </div>
          </NavLink>
        ))}
      </nav>
    </div>
  );
  
  // Mobile sidebar - overlay
  const MobileSidebar = () => (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="lg:hidden fixed left-0 top-0 h-full w-64 bg-white z-50 border-r border-gray-200"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-primary rounded-lg">
                    <ApperIcon name="Wheat" className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-gradient">FarmTrack Pro</h1>
                    <p className="text-sm text-gray-600">Agriculture Management</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <ApperIcon name="X" className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <nav className="p-4 space-y-2">
              {navigationItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200",
                      isActive
                        ? "bg-forest-50 text-forest-700 border-l-4 border-forest-500"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    )
                  }
>
                  <div className="flex items-center space-x-3">
                    <ApperIcon name={item.icon} className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                    {item.badge && (
                      <Badge 
                        variant="danger" 
                        size="sm"
                        className="bg-red-500 text-white font-semibold"
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </div>
                </NavLink>
              ))}
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
  
  return (
    <>
      <DesktopSidebar />
      <MobileSidebar />
    </>
  );
};

export default Sidebar;