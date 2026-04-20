"use client";

import React from "react";
import { useEventContext } from "@/store/EventContext";
import { MetricCard } from "./MetricCard";
import { VenueMap } from "./VenueMap";

export const Dashboard = () => {
  const { zones, isLoading } = useEventContext();

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-slate-800 border-t-blue-500" />
      </div>
    );
  }

  // Calculate global metrics
  const avgDensity = Math.round(
    zones.reduce((acc, z) => acc + z.crowdDensity, 0) / zones.length
  );
  const maxWait = Math.max(...zones.map((z) => z.estimatedWaitTime));

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Stadium Operations Overview
        </h1>
        <p className="mt-2 text-gray-400">
          Real-time metrics for crowd handling, zone saturation, and waiting times.
        </p>
      </header>

      <section aria-label="Key Metrics" className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <MetricCard
          title="Overall Venue Density"
          metric={`${avgDensity}%`}
          progress={avgDensity}
          subtext="Updated just now"
        />
        <MetricCard
          title="Max Queue Time"
          metric={`${maxWait} mins`}
          trend={maxWait > 15 ? "up" : "down"}
          subtext="Currently observed at Merchandise Stand"
        />
        <MetricCard
          title="Active Zones tracked"
          metric={zones.length}
          subtext="All systems operational"
        />
      </section>

      <div className="mt-12">
        <VenueMap />
      </div>

      <section aria-labelledby="zone-breakdown-heading" className="mt-12">
        <h2 id="zone-breakdown-heading" className="mb-6 text-xl font-semibold text-white">Zone Breakdown</h2>
        <div className="overflow-hidden rounded-2xl border border-white/5 bg-white/5 backdrop-blur-sm">
          <table className="min-w-full divide-y divide-white/5" aria-label="Zone breakdown data table">
            <thead>
              <tr className="bg-black/20">
                <th scope="col" className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                  Zone Name
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                  Crowd Density
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                  Est. Wait Time
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5" aria-live="polite">
              {zones.map((zone) => (
                <tr
                  key={zone.id}
                  className="transition-colors hover:bg-white/5"
                >
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-white">
                    {zone.name}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-300">
                        {zone.crowdDensity}%
                      </span>
                      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-gray-800" role="progressbar" aria-valuenow={zone.crowdDensity} aria-valuemin={0} aria-valuemax={100}>
                        <div
                          className={`h-full rounded-full transition-all duration-1000 ${
                            zone.crowdDensity > 80
                              ? "bg-red-500"
                              : zone.crowdDensity > 50
                              ? "bg-yellow-500"
                              : "bg-green-500"
                          }`}
                          style={{ width: `${zone.crowdDensity}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-300">
                    <span className="font-mono">{zone.estimatedWaitTime}m</span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        zone.crowdDensity > 80
                          ? "bg-red-500/10 text-red-400"
                          : zone.crowdDensity > 50
                          ? "bg-yellow-500/10 text-yellow-400"
                          : "bg-green-500/10 text-green-400"
                      }`}
                      aria-label={`Status: ${zone.crowdDensity > 80 ? "Critical" : zone.crowdDensity > 50 ? "Moderate" : "Optimal"}`}
                    >
                      {zone.crowdDensity > 80
                        ? "Critical"
                        : zone.crowdDensity > 50
                        ? "Moderate"
                        : "Optimal"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
