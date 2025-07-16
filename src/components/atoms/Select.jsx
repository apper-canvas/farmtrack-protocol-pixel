import React from "react";
import { cn } from "@/utils/cn";

const Select = React.forwardRef(({ 
  className, 
  error = false,
  children,
  ...props 
}, ref) => {
  const baseStyles = "form-select";
  const errorStyles = error ? "border-red-500 focus:ring-red-500" : "";
  
  return (
    <select
      ref={ref}
      className={cn(baseStyles, errorStyles, className)}
      {...props}
    >
      {children}
    </select>
  );
});

Select.displayName = "Select";

export default Select;