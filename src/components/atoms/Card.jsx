import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

const Card = React.forwardRef(({ 
  className, 
  hover = false,
  gradient = false,
  children,
  ...props 
}, ref) => {
  const baseStyles = "bg-white rounded-lg border border-gray-200 p-6 transition-all duration-200";
  const elevationStyles = hover ? "card-elevation hover:card-elevation-hover" : "card-elevation";
  const gradientStyles = gradient ? "bg-gradient-to-br from-white to-gray-50" : "";
  
  return (
    <motion.div
      ref={ref}
      whileHover={hover ? { y: -2 } : {}}
      className={cn(baseStyles, elevationStyles, gradientStyles, className)}
      {...props}
    >
      {children}
    </motion.div>
  );
});

Card.displayName = "Card";

export default Card;