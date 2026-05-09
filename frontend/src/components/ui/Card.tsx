import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

export interface CardProps extends HTMLMotionProps<"div"> {
  glass?: boolean;
  glow?: boolean;
  gradientBorder?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className = '', glass = false, glow = false, gradientBorder = false, children, ...props }, ref) => {
    
    const baseStyles = "rounded-xl relative";
    
    // Core background styling
    const bgStyles = glass 
      ? "bg-white/60 backdrop-blur-xl border border-slate-200/50 shadow-sm" 
      : "bg-white border border-slate-200 shadow-sm";
      
    // Optional glow effect on hover
    const glowStyles = glow 
      ? "hover:shadow-[0_0_30px_rgba(56,189,248,0.15)] transition-shadow duration-300" 
      : "";

    if (gradientBorder) {
      return (
        <motion.div
          ref={ref}
          className={`${baseStyles} p-[1px] bg-gradient-to-b from-blue-500/30 to-purple-500/10 ${glowStyles} ${className}`}
          {...props}
        >
          <div className={`h-full w-full rounded-[11px] ${bgStyles} p-6`}>
            {children as React.ReactNode}
          </div>
        </motion.div>
      );
    }

    return (
      <motion.div
        ref={ref}
        className={`${baseStyles} ${bgStyles} ${glowStyles} p-6 ${className}`}
        {...props}
      >
        {children as React.ReactNode}
      </motion.div>
    );
  }
);
Card.displayName = 'Card';
