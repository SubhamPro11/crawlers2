import React from "react";
import { PricingModel } from "@/types/database";

export interface BadgeProps {
  children?: React.ReactNode;
  variant?: "default" | "lime" | "pricing" | "outline" | "subtle";
  pricingModel?: PricingModel;
  size?: "sm" | "md";
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "default",
  pricingModel,
  size = "md",
  className = "",
}) => {
  const baseStyles = "inline-flex items-center font-mono font-bold tracking-tight uppercase";

  const sizeStyles = {
    sm: "text-[10px]",
    md: "text-xs",
  };

  if (pricingModel) {
    let colorStyle = "text-slate-400";
    let formattedLabel = pricingModel.toUpperCase();

    switch (pricingModel) {
      case "free":
        colorStyle = "text-emerald-400";
        formattedLabel = "FREE";
        break;
      case "freemium":
        colorStyle = "text-cyan-400";
        formattedLabel = "FREEMIUM";
        break;
      case "paid":
        colorStyle = "text-amber-400";
        formattedLabel = "PAID";
        break;
      case "open-source":
        colorStyle = "text-lime-accent";
        formattedLabel = "OPEN-SOURCE";
        break;
    }

    return (
      <span className={`${baseStyles} ${sizeStyles[size]} ${colorStyle} ${className}`}>
        [{formattedLabel}]
      </span>
    );
  }

  let variantStyle = "text-slate-400";

  switch (variant) {
    case "lime":
      variantStyle = "text-lime-accent";
      break;
    case "outline":
      variantStyle = "text-slate-400";
      break;
    case "subtle":
      variantStyle = "text-slate-500";
      break;
    case "default":
    default:
      variantStyle = "text-slate-300";
      break;
  }

  return (
    <span className={`${baseStyles} ${sizeStyles[size]} ${variantStyle} ${className}`}>
      [{children}]
    </span>
  );
};
