import React from "react";
import { PricingModel } from "@/types/database";

export interface BadgeProps {
  children: React.ReactNode;
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
  const baseStyles =
    "inline-flex items-center font-mono rounded tracking-tight uppercase border transition-colors";

  const sizeStyles = {
    sm: "px-2 py-0.5 text-[10px]",
    md: "px-2.5 py-1 text-xs",
  };

  let variantStyle = "bg-navy-850 text-slate-300 border-navy-700";

  if (pricingModel) {
    switch (pricingModel) {
      case "free":
        variantStyle = "bg-emerald-950/40 text-emerald-400 border-emerald-800/60";
        break;
      case "freemium":
        variantStyle = "bg-cyan-950/40 text-cyan-400 border-cyan-800/60";
        break;
      case "paid":
        variantStyle = "bg-amber-950/40 text-amber-400 border-amber-800/60";
        break;
      case "open-source":
        variantStyle = "bg-lime-accent/10 text-lime-accent border-lime-accent/30";
        break;
    }
  } else {
    switch (variant) {
      case "lime":
        variantStyle = "bg-lime-accent/10 text-lime-accent border-lime-accent/40";
        break;
      case "outline":
        variantStyle = "bg-transparent text-slate-400 border-navy-700 hover:border-slate-500";
        break;
      case "subtle":
        variantStyle = "bg-navy-900 text-slate-400 border-navy-800";
        break;
      case "default":
      default:
        variantStyle = "bg-navy-850 text-slate-300 border-navy-700";
        break;
    }
  }

  return (
    <span className={`${baseStyles} ${sizeStyles[size]} ${variantStyle} ${className}`}>
      {children}
    </span>
  );
};
