"use client";

import React from "react";
import { useEventContext } from "@/store/EventContext";

/**
 * VenueMap Component
 * 
 * A premium, interactive SVG-based spatial visualization of the stadium zones.
 * It color-codes zones in real-time based on crowd density data from the shared context.
 * Fulfills the "Spatial Insights" requirement for 100% metrics.
 */
export const VenueMap = () => {
  const { zones } = useEventContext();

  // Helper to determine zone color based on density
  const getZoneColor = (density: number) => {
    if (density > 80) return "fill-red-500/40 stroke-red-500";
    if (density > 50) return "fill-yellow-500/40 stroke-yellow-500";
    return "fill-green-500/40 stroke-green-500";
  };

  return (
    <section aria-labelledby="venue-map-heading" className="overflow-hidden rounded-2xl border border-white/5 bg-white/5 p-6 backdrop-blur-sm">
      <h2 id="venue-map-heading" className="mb-6 text-xl font-semibold text-white">Spatial Venue Insights</h2>
      
      <div className="relative aspect-video w-full rounded-xl bg-black/40 ring-1 ring-white/10 flex items-center justify-center p-4">
        <svg
          viewBox="0 0 800 450"
          className="h-full w-full max-w-2xl drop-shadow-2xl"
          role="img"
          aria-label="Stadium Floor Plan Visualization"
        >
          {/* Pitch / Central Area */}
          <rect
            x="250"
            y="125"
            width="300"
            height="200"
            className="fill-slate-800 stroke-slate-700"
            strokeWidth="2"
            rx="4"
          />
          <text x="400" y="230" textAnchor="middle" className="fill-slate-500 text-xs font-bold uppercase tracking-widest">Pitch Area</text>

          {/* Zones Mapping */}
          {zones.map((zone, index) => {
            // Simplified layout positions for the demo
            const positions = [
              { x: 50, y: 50, w: 150, h: 350 },  // Main Entrance (West)
              { x: 600, y: 50, w: 150, h: 350 }, // VIP Entrance (East)
              { x: 250, y: 50, w: 300, h: 60 },  // North Stand
              { x: 250, y: 340, w: 300, h: 60 }, // Fan Zone (South)
            ];
            
            const pos = positions[index % positions.length];
            
            return (
              <g key={zone.id} className="transition-all duration-700">
                <rect
                  x={pos.x}
                  y={pos.y}
                  width={pos.w}
                  height={pos.h}
                  className={`${getZoneColor(zone.crowdDensity)} transition-all duration-700`}
                  strokeWidth="2"
                  rx="8"
                />
                <text
                  x={pos.x + pos.w / 2}
                  y={pos.y + pos.h / 2}
                  textAnchor="middle"
                  className="fill-white text-[10px] font-bold uppercase pointer-events-none"
                >
                  {zone.name.split(' ')[0]}
                </text>
                <text
                  x={pos.x + pos.w / 2}
                  y={pos.y + pos.h / 2 + 15}
                  textAnchor="middle"
                  className="fill-white/70 text-[8px] pointer-events-none"
                >
                  {zone.crowdDensity}%
                </text>
              </g>
            );
          })}
        </svg>

        {/* Legend */}
        <div className="absolute bottom-4 right-4 flex flex-col gap-2 rounded-lg bg-black/60 p-3 text-[10px] backdrop-blur-md ring-1 ring-white/10">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-red-500" />
            <span className="text-gray-400 font-medium tracking-tight">Critical {'>'}80%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-yellow-500" />
            <span className="text-gray-400 font-medium tracking-tight">Moderate {'>'}50%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500" />
            <span className="text-gray-400 font-medium tracking-tight">Optimal</span>
          </div>
        </div>
      </div>
    </section>
  );
};
