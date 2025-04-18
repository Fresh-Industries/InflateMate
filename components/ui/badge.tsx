import * as React from "react"
import { cva } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-4 py-1 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 shadow-sm",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-blue-100 text-blue-700",
        secondary:
          "border-transparent bg-gray-100 text-gray-700",
        destructive:
          "border-transparent bg-red-100 text-red-700",
        outline: "text-foreground",
        success:
          "border-transparent bg-green-100 text-green-800",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

// Define the variant type explicitly including 'success'
type BadgeVariant = "default" | "secondary" | "destructive" | "outline" | "success";

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>{
    variant?: BadgeVariant; // Use the explicitly defined type
  }

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant: variant ?? 'default' }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
