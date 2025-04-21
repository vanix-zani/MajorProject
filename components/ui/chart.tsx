import * as React from "react"

import { cn } from "@/lib/utils"

const Chart = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => {
  return <div className={cn("grid w-full gap-4", className)} ref={ref} {...props}></div>
})
Chart.displayName = "Chart"

const ChartContainer = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <div className={cn("relative", className)} ref={ref} {...props}></div>
  },
)
ChartContainer.displayName = "ChartContainer"

interface ChartTooltipContentProps {
  children: React.ReactNode
}

const ChartTooltipContent = React.forwardRef<HTMLDivElement, ChartTooltipContentProps>(
  ({ children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-md border bg-popover p-4 text-sm text-popover-foreground shadow-sm outline-none",
          props.className,
        )}
        {...props}
      >
        {children}
      </div>
    )
  },
)
ChartTooltipContent.displayName = "ChartTooltipContent"

interface ChartTooltipItemProps {
  label: string
  value: string | number
}

const ChartTooltipItem = React.forwardRef<HTMLDivElement, ChartTooltipItemProps>(({ label, value }, ref) => {
  return (
    <div ref={ref} className="flex items-center justify-between space-x-2">
      <span className="text-gray-500 dark:text-gray-400">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  )
})
ChartTooltipItem.displayName = "ChartTooltipItem"

const ChartLegend = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <div className={cn("flex justify-center pt-4", className)} ref={ref} {...props}></div>
  },
)
ChartLegend.displayName = "ChartLegend"

const ChartTooltip = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <div className={cn("z-50", className)} ref={ref} {...props}></div>
  },
)
ChartTooltip.displayName = "ChartTooltip"

export { Chart, ChartContainer, ChartTooltip, ChartTooltipContent, ChartTooltipItem, ChartLegend }
