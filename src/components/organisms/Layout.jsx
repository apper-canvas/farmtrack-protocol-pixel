import React, { useState } from "react";
import Sidebar from "@/components/organisms/Sidebar";
import Header from "@/components/organisms/Header";

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  
  const handleMenuClick = () => {
    setIsSidebarOpen(true);
  };
  
  const handleSidebarClose = () => {
    setIsSidebarOpen(false);
  };
  
  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };
  
  return (
    <div className="h-screen flex bg-gray-50">
      <Sidebar isOpen={isSidebarOpen} onClose={handleSidebarClose} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          onMenuClick={handleMenuClick}
          searchValue={searchValue}
          onSearchChange={handleSearchChange}
        />
        
        <main className="flex-1 overflow-auto p-4">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;