import React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightElement?: React.ReactNode;
  promptPrefix?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, leftIcon, rightElement, promptPrefix = false, className = "", ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="block text-xs font-mono font-medium text-slate-400 uppercase tracking-wider">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {promptPrefix && (
            <span className="absolute left-3 font-mono text-lime-accent text-sm pointer-events-none select-none font-bold">
              &gt;
            </span>
          )}
          {leftIcon && !promptPrefix && (
            <span className="absolute left-3 text-slate-500 pointer-events-none select-none">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            className={`w-full bg-navy-900 border text-slate-100 placeholder-slate-500 rounded-lg px-3 py-2 text-sm font-sans transition-all duration-150 focus:outline-none focus:border-lime-accent focus:ring-1 focus:ring-lime-accent ${
              promptPrefix ? "pl-9" : leftIcon ? "pl-9" : "pl-3"
            } ${rightElement ? "pr-9" : "pr-3"} ${
              error ? "border-red-600 focus:border-red-500 focus:ring-red-500" : "border-navy-700"
            } ${className}`}
            {...props}
          />
          {rightElement && <div className="absolute right-3">{rightElement}</div>}
        </div>
        {error && <p className="text-xs font-mono text-red-400 mt-1">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
