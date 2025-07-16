import React from "react";
import { cn } from "@/utils/cn";

const Badge = React.forwardRef(({ 
  className,
  variant = "default",
  size = "md",
  children,
  ...props 
}, ref) => {
  const baseStyles = "status-badge";
  
  const variants = {
    default: "bg-gray-100 text-gray-800",
    seedling: "status-badge-seedling",
    growing: "status-badge-growing",
    ready: "status-badge-ready",
    harvested: "status-badge-harvested",
    low: "priority-badge-low",
    medium: "priority-badge-medium",
    high: "priority-badge-high",
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    danger: "bg-red-100 text-red-800",
    info: "bg-blue-100 text-blue-800"
  };
  
  const sizes = {
    sm: "text-xs px-2 py-0.5",
    md: "text-xs px-2.5 py-0.5",
    lg: "text-sm px-3 py-1"
  };
  
  return (
    <span
      ref={ref}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = "Badge";

export default Badge;