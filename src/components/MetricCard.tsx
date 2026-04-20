import React from "react";

interface MetricCardProps {
  title: string;
  metric: string | number;
  subtext?: string;
  trend?: "up" | "down" | "neutral";
  progress?: number;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  metric,
  subtext,
  trend,
  progress,
}) => {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/5 bg-white/5 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:bg-white/10 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:border-white/10">
      <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-blue-500 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-10" />
      
      <div className="relative z-10">
        <p className="text-sm font-medium text-gray-400">{title}</p>
        <div className="mt-2 flex items-baseline gap-2">
          <h3 className="text-4xl font-bold tracking-tight text-white">
            {metric}
          </h3>
          {trend && (
            <span
              className={`text-sm font-medium ${
                trend === "down"
                  ? "text-green-400"
                  : trend === "up"
                  ? "text-red-400"
                  : "text-gray-400"
              }`}
            >
              {trend === "down" ? "↓" : trend === "up" ? "↑" : "-"}
            </span>
          )}
        </div>
        {progress !== undefined && (
          <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-gray-800">
            <div
              className={`h-full rounded-full transition-all duration-1000 ease-out ${
                progress > 80
                  ? "bg-red-500"
                  : progress > 50
                  ? "bg-yellow-500"
                  : "bg-green-500"
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
        {subtext && <p className="mt-4 text-xs text-gray-500">{subtext}</p>}
      </div>
    </div>
  );
};
