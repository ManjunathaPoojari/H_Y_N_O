import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-emerald-600 text-white hover:bg-emerald-700",
        destructive: "bg-red-600 text-white hover:bg-red-700",
        outline: "border border-slate-200 bg-white text-slate-900 hover:bg-slate-50",
        secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200",
        ghost: "hover:bg-slate-100 text-slate-700",
        link: "text-emerald-600 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-md px-3",
        lg: "h-11 rounded-lg px-6",
        icon: "h-10 w-10 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

// Base inline styles to ensure visibility (overrides CSS reset)
const variantStyles: Record<string, React.CSSProperties> = {
  default: { backgroundColor: '#059669', color: '#ffffff' },
  destructive: { backgroundColor: '#dc2626', color: '#ffffff' },
  outline: { backgroundColor: '#ffffff', color: '#0f172a', borderColor: '#e2e8f0' },
  secondary: { backgroundColor: '#f1f5f9', color: '#0f172a' },
  ghost: { backgroundColor: 'transparent', color: '#334155' },
  link: { backgroundColor: 'transparent', color: '#059669' },
};

const Button = React.forwardRef<
  React.ElementRef<"button">,
  React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }
>(({ className, variant = "default", size, asChild = false, style, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";

  const baseStyle = variantStyles[variant || "default"] || variantStyles.default;
  const mergedStyle = { ...baseStyle, ...style };

  return (
    <Comp
      ref={ref}
      data-slot="button"
      className={cn(buttonVariants({ variant, size }), className)}
      style={mergedStyle}
      {...props}
    />
  );
});

Button.displayName = "Button";

export { Button, buttonVariants };
