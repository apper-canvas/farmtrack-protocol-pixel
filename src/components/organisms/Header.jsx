import React, { useContext } from "react";
import { useSelector } from "react-redux";
import ApperIcon from "@/components/ApperIcon";
import SearchBar from "@/components/molecules/SearchBar";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";
import { AuthContext } from "../../App";

const Header = ({ onMenuClick, searchValue, onSearchChange, className }) => {
  const { user } = useSelector((state) => state.user);
  const { logout } = useContext(AuthContext);
  
  return (
    <header className={cn("bg-white border-b border-gray-200 px-4 py-3", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
          >
            <ApperIcon name="Menu" className="h-5 w-5" />
          </button>
          
          <div className="hidden sm:block">
            <SearchBar
              value={searchValue}
              onChange={onSearchChange}
              placeholder="Search farms, crops, tasks..."
              className="w-64"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            className="hidden sm:flex items-center space-x-2"
          >
            <ApperIcon name="Bell" className="h-4 w-4" />
            <span>Notifications</span>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="hidden sm:flex items-center space-x-2"
          >
            <ApperIcon name="Settings" className="h-4 w-4" />
            <span>Settings</span>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={logout}
            className="flex items-center space-x-2"
          >
            <ApperIcon name="LogOut" className="h-4 w-4" />
            <span>Logout</span>
          </Button>
          
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
              <ApperIcon name="User" className="h-4 w-4 text-white" />
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-gray-900">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-gray-500">{user?.emailAddress}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="sm:hidden mt-3">
        <SearchBar
          value={searchValue}
          onChange={onSearchChange}
          placeholder="Search farms, crops, tasks..."
        />
      </div>
    </header>
  );
};

export default Header;