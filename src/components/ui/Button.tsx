import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", icon, children, className = "", ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-mono font-medium rounded-full transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-lime-accent/50 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]";

    const sizeStyles = {
      sm: "px-3.5 py-1.5 text-xs gap-1.5",
      md: "px-5 py-2.5 text-sm gap-2",
      lg: "px-6 py-3 text-base gap-2.5",
    };

    const variantStyles = {
      primary:
        "bg-lime-accent text-navy-950 hover:bg-lime-hover font-semibold shadow-sm shadow-lime-accent/10 border border-lime-accent",
      secondary:
        "bg-navy-850 text-slate-100 border border-navy-700 hover:bg-navy-800 hover:border-slate-500",
      outline:
        "bg-transparent text-lime-accent border border-lime-accent/50 hover:bg-lime-accent/10 hover:border-lime-accent",
      ghost:
        "bg-transparent text-slate-300 hover:bg-navy-850 hover:text-slate-100",
      danger:
        "bg-red-950/40 text-red-400 border border-red-800/60 hover:bg-red-900/40 hover:border-red-600",
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
        {...props}
      >
        {icon && <span className="shrink-0">{icon}</span>}
        <span>{children}</span>
      </button>
    );
  }
);

Button.displayName = "Button";
