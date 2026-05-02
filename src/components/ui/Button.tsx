import React from "react";
import { cn } from "@/src/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-bold uppercase tracking-widest transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-400 disabled:pointer-events-none disabled:opacity-50 cursor-pointer text-[11px]",
          {
            "bg-white text-black hover:bg-neutral-200": variant === 'primary',
            "bg-neutral-900 text-white hover:bg-neutral-800": variant === 'secondary',
            "border border-neutral-700 bg-transparent hover:bg-neutral-900 text-white": variant === 'outline',
            "hover:bg-neutral-900 text-white": variant === 'ghost',
            "px-6 py-2": size === 'sm',
            "px-8 py-3": size === 'md',
            "px-12 py-4": size === 'lg',
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
