import React from "react";
import { cn } from "@/utils/cn";

const Textarea = React.forwardRef(({ 
  className, 
  error = false,
  rows = 3,
  ...props 
}, ref) => {
  const baseStyles = "form-textarea";
  const errorStyles = error ? "border-red-500 focus:ring-red-500" : "";
  
  return (
    <textarea
      ref={ref}
      rows={rows}
      className={cn(baseStyles, errorStyles, className)}
      {...props}
    />
  );
});

Textarea.displayName = "Textarea";

export default Textarea;