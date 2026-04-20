"use client";

import React from "react";
import { Navbar } from "@/components/Navbar";
import { useEventContext } from "@/store/EventContext";

export default function AdminDashboard() {
  const { zones, updateZone, isLoading } = useEventContext();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-slate-800 border-t-blue-500" />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Admin Control Center
            </h1>
            <p className="mt-2 text-gray-400">
              Manually override crowd mechanics and sync to live dashboard.
            </p>
          </div>
          <button
            disabled
            className="rounded-full bg-blue-600/10 px-4 py-2 text-sm font-semibold text-blue-400 opacity-50 ring-1 ring-inset ring-blue-600/20 cursor-not-allowed"
            title="Database requires configuration. Coming soon."
          >
            Export to Database
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {zones.map((zone) => (
            <div
              key={zone.id}
              className="relative overflow-hidden rounded-2xl border border-white/5 bg-white/5 p-6 backdrop-blur-sm transition-all"
            >
              <h3 className="text-xl font-semibold text-white">{zone.name}</h3>

              <div className="mt-6 flex flex-col gap-6">
                {/* Density Control */}
                <div>
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-gray-400">Crowd Density Override</span>
                    <span className="font-bold text-white tracking-widest">{zone.crowdDensity}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={zone.crowdDensity}
                    onChange={(e) =>
                      updateZone(zone.id, { crowdDensity: parseInt(e.target.value) })
                    }
                    className="mt-3 w-full accent-blue-500"
                  />
                </div>

                {/* Wait Time Control */}
                <div>
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-gray-400">Queue Wait Time (mins)</span>
                    <span className="font-mono text-white text-lg">{zone.estimatedWaitTime}m</span>
                  </div>
                  <div className="mt-3 flex items-center gap-4">
                    <button
                      onClick={() =>
                        updateZone(zone.id, {
                          estimatedWaitTime: Math.max(0, zone.estimatedWaitTime - 5),
                        })
                      }
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white font-bold transition-colors"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="0"
                      value={zone.estimatedWaitTime}
                      onChange={(e) =>
                        updateZone(zone.id, {
                          estimatedWaitTime: Math.max(0, parseInt(e.target.value) || 0),
                        })
                      }
                      className="flex-1 rounded-lg border border-white/10 bg-black/50 p-2 text-center text-white focus:border-blue-500 focus:outline-none"
                    />
                    <button
                      onClick={() =>
                        updateZone(zone.id, {
                          estimatedWaitTime: zone.estimatedWaitTime + 5,
                        })
                      }
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white font-bold transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
