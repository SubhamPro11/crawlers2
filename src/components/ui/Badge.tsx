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
    let colorStyle = "bg-navy-800 text-slate-300 border border-navy-700";
    let formattedLabel = pricingModel.toUpperCase();

    switch (pricingModel) {
      case "free":
        colorStyle = "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30";
        formattedLabel = "FREE";
        break;
      case "freemium":
        colorStyle = "bg-slate-800/90 text-slate-300 border border-slate-700";
        formattedLabel = "FREEMIUM";
        break;
      case "paid":
        colorStyle = "bg-amber-500/10 text-amber-400 border border-amber-500/30";
        formattedLabel = "PAID";
        break;
      case "open-source":
        colorStyle = "bg-lime-accent/10 text-lime-accent border border-lime-accent/30";
        formattedLabel = "OPEN-SOURCE";
        break;
    }

    return (
      <span className={`inline-flex items-center font-mono font-bold tracking-wider uppercase px-2 py-0.5 rounded ${sizeStyles[size]} ${colorStyle} ${className}`}>
        {formattedLabel}
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
