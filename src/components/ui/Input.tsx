import React from "react";
import { cn } from "@/src/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full rounded-none border-b border-neutral-800 bg-transparent px-3 py-2 text-sm text-white placeholder:text-neutral-600 focus-visible:outline-none focus-visible:border-white disabled:cursor-not-allowed disabled:opacity-50 transition-colors font-light",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";
