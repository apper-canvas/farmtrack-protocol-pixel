import React from "react";
import Label from "@/components/atoms/Label";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Textarea from "@/components/atoms/Textarea";
import { cn } from "@/utils/cn";

const FormField = ({ 
  label, 
  type = "text",
  error,
  helperText,
  required = false,
  className,
  children,
  ...props 
}) => {
  const renderInput = () => {
    if (type === "select") {
      return (
        <Select error={!!error} {...props}>
          {children}
        </Select>
      );
    }
    
    if (type === "textarea") {
      return <Textarea error={!!error} {...props} />;
    }
    
    return <Input type={type} error={!!error} {...props} />;
  };
  
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label required={required} htmlFor={props.id}>
          {label}
        </Label>
      )}
      {renderInput()}
{error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
      {helperText && !error && (
        <p className="text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
};

export default FormField;