import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-display font-semibold uppercase tracking-[0.2em] text-[0.8rem] transition-[filter,background-color,color,box-shadow] duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-gold text-void hover:bg-gold-bright",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "bg-transparent text-gold shadow-[inset_0_0_0_1px_hsl(var(--gold-dim))] hover:text-gold-bright hover:shadow-[inset_0_0_0_1px_hsl(var(--gold))]",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "text-bone hover:bg-ash-raised hover:text-gold-bright",
        link: "text-gold underline-offset-4 hover:underline",
        hero: "bg-gold text-void shadow-[0_10px_30px_-12px_hsl(var(--fire-deep))] hover:bg-gold-bright",
        heroOutline: "bg-transparent text-gold shadow-[inset_0_0_0_1px_hsl(var(--gold-dim))] hover:text-gold-bright hover:shadow-[inset_0_0_0_1px_hsl(var(--gold))]",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3 text-xs",
        lg: "h-12 px-7 text-sm",
        xl: "h-14 px-9 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
