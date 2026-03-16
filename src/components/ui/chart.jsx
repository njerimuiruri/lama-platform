"use client";
import * as React from "react";
import * as RechartsPrimitive from "recharts";
import { cn } from "@/lib/utils";

const ChartContext = React.createContext(null);

function useChart() {
  const context = React.useContext(ChartContext);
  if (!context) throw new Error("useChart must be used within a ChartContainer");
  return context;
}

const ChartContainer = React.forwardRef(({ id, className, children, config = {}, ...props }, ref) => {
  const uniqueId = React.useId();
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`;
  return (
    <ChartContext.Provider value={{ config }}>
      <div data-chart={chartId} ref={ref} className={cn("flex w-full justify-center text-xs", className)} {...props}>
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer width="100%" height="100%">
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
});
ChartContainer.displayName = "ChartContainer";

const ChartStyle = ({ id, config }) => {
  const colorConfig = Object.entries(config).filter(([_, c]) => c.color);
  if (!colorConfig.length) return null;
  return (
    <style dangerouslySetInnerHTML={{
      __html: `[data-chart=${id}] { ${colorConfig.map(([key, c]) => `--color-${key}: ${c.color};`).join(" ")} }`
    }} />
  );
};

const ChartTooltip = RechartsPrimitive.Tooltip;

const ChartTooltipContent = React.forwardRef(({ active, payload, label, className, labelFormatter, formatter, unit = "" }, ref) => {
  if (!active || !payload?.length) return null;
  return (
    <div ref={ref} className={cn("grid min-w-[9rem] gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm shadow-xl", className)}>
      {label && (
        <p className="font-semibold text-gray-800 border-b border-gray-100 pb-1 mb-0.5">
          {labelFormatter ? labelFormatter(label) : label}
        </p>
      )}
      <div className="grid gap-1">
        {payload.map((entry, i) => (
          <div key={i} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 shrink-0 rounded-sm" style={{ backgroundColor: entry.color }} />
              <span className="text-gray-600">{formatter ? formatter(entry.name) : entry.name}</span>
            </div>
            <span className="font-bold tabular-nums text-gray-900">
              {typeof entry.value === "number" ? entry.value.toLocaleString() : entry.value}{unit}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
});
ChartTooltipContent.displayName = "ChartTooltipContent";

const ChartLegend = RechartsPrimitive.Legend;

const ChartLegendContent = React.forwardRef(({ payload, className }, ref) => {
  if (!payload?.length) return null;
  return (
    <div ref={ref} className={cn("flex flex-wrap items-center justify-center gap-4 pt-3", className)}>
      {payload.map((item) => (
        <div key={item.value} className="flex items-center gap-1.5">
          <div className="h-2.5 w-2.5 shrink-0 rounded-sm" style={{ backgroundColor: item.color }} />
          <span className="text-xs text-gray-600 font-medium">{item.value}</span>
        </div>
      ))}
    </div>
  );
});
ChartLegendContent.displayName = "ChartLegendContent";

export { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent };
