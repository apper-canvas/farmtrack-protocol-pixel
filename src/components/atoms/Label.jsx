import React from "react";
import { cn } from "@/utils/cn";

const Label = React.forwardRef(({ 
  className,
  required = false,
  children,
  ...props 
}, ref) => {
  return (
    <label
      ref={ref}
      className={cn("form-label", className)}
      {...props}
    >
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );
});

Label.displayName = "Label";

export default Label;