import React from "react";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "circular" | "rectangular";
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = "text",
  className = "",
  ...props
}) => {
  const baseClasses = "animate-pulse bg-navy-850 border border-navy-800/50";

  const variantClasses = {
    text: "h-4 w-full rounded-sm",
    circular: "rounded-full",
    rectangular: "rounded",
  };

  return <div className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...props} />;
};
