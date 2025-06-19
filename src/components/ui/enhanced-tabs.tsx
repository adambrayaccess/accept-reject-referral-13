
import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { cn } from "@/lib/utils"

const EnhancedTabs = TabsPrimitive.Root

const EnhancedTabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> & {
    variant?: "default" | "compact" | "pills" | "grid"
    size?: "sm" | "md" | "lg"
    enableDynamicSizing?: boolean
  }
>(({ className, variant = "default", size = "md", enableDynamicSizing = false, children, ...props }, ref) => {
  const [tabCount, setTabCount] = React.useState(0)

  // Count tabs on mount and when children change
  React.useEffect(() => {
    const count = React.Children.count(children)
    setTabCount(count)
  }, [children])

  const shouldUseDynamicSizing = enableDynamicSizing && tabCount > 4

  const variants = {
    default: "inline-flex items-center justify-start rounded-lg bg-muted/30 p-1 text-muted-foreground border",
    compact: "inline-flex items-center justify-start rounded-md bg-muted/20 p-0.5 text-muted-foreground",
    pills: "inline-flex items-center justify-start gap-1 text-muted-foreground",
    grid: shouldUseDynamicSizing 
      ? "flex items-center justify-start gap-1 p-1 bg-muted/20 rounded-lg text-muted-foreground"
      : "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 p-1 bg-muted/20 rounded-lg text-muted-foreground"
  }
  
  const sizes = {
    sm: "h-7 text-xs",
    md: "h-9 text-sm", 
    lg: "h-11 text-base"
  }

  return (
    <TabsPrimitive.List
      ref={ref}
      className={cn(
        "w-full overflow-x-auto scrollbar-hide",
        variants[variant],
        variant !== "grid" && sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </TabsPrimitive.List>
  )
})
EnhancedTabsList.displayName = TabsPrimitive.List.displayName

const EnhancedTabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> & {
    variant?: "default" | "compact" | "pills" | "grid"
    size?: "sm" | "md" | "lg"
    enableDynamicSizing?: boolean
    tabCount?: number
  }
>(({ className, variant = "default", size = "md", enableDynamicSizing = false, tabCount = 0, ...props }, ref) => {
  const shouldUseDynamicSizing = enableDynamicSizing && tabCount > 4 && variant === "grid"

  const variants = {
    default: cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium",
      "ring-offset-background transition-all duration-200",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      "disabled:pointer-events-none disabled:opacity-50",
      "data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
      "hover:bg-muted/60 data-[state=active]:hover:bg-background"
    ),
    compact: cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded font-medium",
      "ring-offset-background transition-all duration-200",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
      "disabled:pointer-events-none disabled:opacity-50",
      "data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
      "hover:bg-muted/60 data-[state=active]:hover:bg-background"
    ),
    pills: cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-full font-medium border",
      "ring-offset-background transition-all duration-200",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      "disabled:pointer-events-none disabled:opacity-50",
      "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary",
      "hover:bg-muted/60 data-[state=active]:hover:bg-primary/90"
    ),
    grid: cn(
      "flex items-center justify-center rounded-md font-medium flex-shrink-0",
      "ring-offset-background transition-all duration-200",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      "disabled:pointer-events-none disabled:opacity-50",
      "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm",
      "hover:bg-muted/60 data-[state=active]:hover:bg-primary/90",
      "min-h-[2.5rem] text-center",
      shouldUseDynamicSizing 
        ? "whitespace-nowrap text-ellipsis overflow-hidden" 
        : "whitespace-nowrap"
    )
  }
  
  const sizes = {
    sm: "px-2 py-1 text-xs min-w-[60px]",
    md: "px-3 py-1.5 text-sm min-w-[80px]",
    lg: "px-4 py-2 text-base min-w-[100px]"
  }

  const gridSizes = {
    sm: "px-2 py-1.5 text-xs",
    md: "px-3 py-2 text-sm",
    lg: "px-4 py-2.5 text-base"
  }

  // Dynamic sizing for grid variant when many tabs - optimize for horizontal space
  const getDynamicSizing = () => {
    if (!shouldUseDynamicSizing) {
      return variant === "grid" ? gridSizes[size] : sizes[size]
    }

    // Compact sizing to fit more tabs on one line
    const compactSizes = {
      sm: "px-1.5 py-1.5 text-xs",
      md: "px-2 py-2 text-xs", 
      lg: "px-2.5 py-2.5 text-sm"
    }

    return `${compactSizes[size]} min-w-0 max-w-[120px]`
  }

  return (
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn(
        variants[variant],
        getDynamicSizing(),
        className
      )}
      {...props}
    />
  )
})
EnhancedTabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const EnhancedTabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-3 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      "animate-in fade-in-0 slide-in-from-bottom-1 duration-200",
      className
    )}
    {...props}
  />
))
EnhancedTabsContent.displayName = TabsPrimitive.Content.displayName

export { EnhancedTabs, EnhancedTabsList, EnhancedTabsTrigger, EnhancedTabsContent }
