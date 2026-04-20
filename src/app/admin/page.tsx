"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { useEventContext } from "@/store/EventContext";

export default function AdminDashboard() {
  const { zones, updateZone, isLoading } = useEventContext();
  const [insight, setInsight] = useState<string>("Analyzing current stadium load...");
  const [insightLoading, setInsightLoading] = useState<boolean>(false);

  useEffect(() => {
    if (isLoading || zones.length === 0) return;

    const fetchInsight = async () => {
      setInsightLoading(true);
      try {
        const response = await fetch("/api/insights", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ zones }),
        });
        const data = await response.json();
        setInsight(data.insight || "No actionable insights generated.");
      } catch (error) {
        setInsight("AI Assistant offline. Unable to fetch real-time insights.");
      } finally {
        setInsightLoading(false);
      }
    };

    // Auto-fetch insight periodically
    fetchInsight();
    const interval = setInterval(fetchInsight, 30000);
    return () => clearInterval(interval);
  }, [zones, isLoading]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center" aria-busy="true" role="status">
        <span className="sr-only">Loading dashboard...</span>
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-slate-800 border-t-blue-500" />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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
            aria-disabled="true"
            className="rounded-full bg-blue-600/10 px-4 py-2 text-sm font-semibold text-blue-400 opacity-50 ring-1 ring-inset ring-blue-600/20 cursor-not-allowed"
            title="Database requires configuration. Coming soon."
          >
            Export to Database
          </button>
        </header>

        <section aria-labelledby="ai-insight-heading" className="mb-8 overflow-hidden rounded-2xl border border-blue-500/20 bg-blue-900/10 p-6 backdrop-blur-md">
          <h2 id="ai-insight-heading" className="text-xl font-semibold text-blue-400 flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
            </span>
            Gemini AI Event Assistant
          </h2>
          <p 
            className={`mt-3 text-lg font-medium transition-opacity ${insightLoading ? 'opacity-50 text-blue-300' : 'text-blue-100'}`}
            aria-live="polite"
          >
            {insight}
          </p>
        </section>

        <section aria-label="Zone Controls" className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {zones.map((zone) => (
            <article
              key={zone.id}
              className="relative overflow-hidden rounded-2xl border border-white/5 bg-white/5 p-6 backdrop-blur-sm transition-all focus-within:border-white/20"
            >
              <h3 className="text-xl font-semibold text-white">{zone.name}</h3>

              <div className="mt-6 flex flex-col gap-6">
                {/* Density Control */}
                <div>
                  <div className="flex justify-between text-sm">
                    <label htmlFor={`density-${zone.id}`} className="font-medium text-gray-400">Crowd Density Override</label>
                    <span className="font-bold text-white tracking-widest">{zone.crowdDensity}%</span>
                  </div>
                  <input
                    id={`density-${zone.id}`}
                    type="range"
                    min="0"
                    max="100"
                    value={zone.crowdDensity}
                    onChange={(e) =>
                      updateZone(zone.id, { crowdDensity: parseInt(e.target.value) })
                    }
                    className="mt-3 w-full accent-blue-500 cursor-pointer"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={zone.crowdDensity}
                  />
                </div>

                {/* Wait Time Control */}
                <div>
                  <div className="flex justify-between text-sm">
                    <label htmlFor={`wait-${zone.id}`} className="font-medium text-gray-400">Queue Wait Time (mins)</label>
                    <span className="font-mono text-white text-lg">{zone.estimatedWaitTime}m</span>
                  </div>
                  <div className="mt-3 flex items-center gap-4">
                    <button
                      onClick={() =>
                        updateZone(zone.id, {
                          estimatedWaitTime: Math.max(0, zone.estimatedWaitTime - 5),
                        })
                      }
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white font-bold transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none"
                      aria-label={`Decrease wait time for ${zone.name}`}
                    >
                      -
                    </button>
                    <input
                      id={`wait-${zone.id}`}
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
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white font-bold transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none"
                      aria-label={`Increase wait time for ${zone.name}`}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </section>
      </main>
    </>
  );
}
