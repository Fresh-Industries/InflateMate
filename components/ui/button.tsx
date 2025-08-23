import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // Solid pill
        default: "rounded-full border border-transparent shadow",
        // Outline pill
        outline: "rounded-full border-2 bg-transparent",
        // Minimal
        ghost: "rounded-full bg-transparent",
        // Keep existing for compatibility
        destructive: "rounded-full bg-red-600 text-white shadow-sm hover:bg-red-600/90",
        secondary: "rounded-full bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        link: "rounded-full text-primary underline-offset-4 hover:underline",
        "primary-gradient": "rounded-full",
      },
      size: {
        default: "h-10 px-6 py-2 rounded-full",
        sm: "h-9 rounded-full px-4",
        lg: "h-11 rounded-full px-8",
        xs: "h-7 rounded-full px-2 text-xs",
        icon: "h-10 w-10 rounded-full",
      },
      // Brand color variants using CSS variables
      brand: {
        indigo: "",
        coral: "",
        teal: "",
        yellow: "",
        white: "",
        slate: "",
      },
    },
    compoundVariants: [
      // Solid (default)
      { variant: "default", brand: "indigo", className: "bg-[var(--brand-indigo)] text-white hover:opacity-90" },
      { variant: "default", brand: "coral", className: "bg-[var(--brand-coral)] text-white hover:opacity-90" },
      { variant: "default", brand: "teal", className: "bg-[var(--brand-teal)] text-black hover:opacity-90" },
      { variant: "default", brand: "yellow", className: "bg-[var(--brand-yellow)] text-black hover:opacity-90" },
      { variant: "default", brand: "white", className: "bg-white text-black hover:opacity-90" },
      { variant: "default", brand: "slate", className: "bg-[var(--brand-slate)] text-white hover:opacity-90" },

      // Outline
      { variant: "outline", brand: "indigo", className: "border-[var(--brand-indigo)] text-[var(--brand-indigo)] hover:bg-white/10" },
      { variant: "outline", brand: "coral", className: "border-[var(--brand-coral)] text-[var(--brand-coral)] hover:bg-white/10" },
      { variant: "outline", brand: "teal", className: "border-[var(--brand-teal)] text-[var(--brand-teal)] hover:bg-white/10" },
      { variant: "outline", brand: "yellow", className: "border-[var(--brand-yellow)] text-[var(--brand-yellow)] hover:bg-white/10" },
      { variant: "outline", brand: "white", className: "border-white text-white hover:bg-white/10" },
      { variant: "outline", brand: "slate", className: "border-[var(--brand-slate)] text-[var(--brand-slate)] hover:bg-black/5" },

      // Ghost
      { variant: "ghost", brand: "indigo", className: "text-[var(--brand-indigo)] hover:bg-black/5" },
      { variant: "ghost", brand: "coral", className: "text-[var(--brand-coral)] hover:bg-black/5" },
      { variant: "ghost", brand: "teal", className: "text-[var(--brand-teal)] hover:bg-black/5" },
      { variant: "ghost", brand: "yellow", className: "text-[var(--brand-yellow)] hover:bg-black/5" },
      { variant: "ghost", brand: "white", className: "text-white hover:bg-white/10" },
      { variant: "ghost", brand: "slate", className: "text-[var(--brand-slate)] hover:bg-black/5" },
    ],
    defaultVariants: {
      variant: "default",
      size: "default",
      brand: "indigo",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, brand, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, brand }), className)}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
