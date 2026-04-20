"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export interface ZoneData {
  id: string;
  name: string;
  crowdDensity: number; // percentage 0-100
  estimatedWaitTime: number; // in minutes
}

interface EventContextProps {
  zones: ZoneData[];
  updateZone: (id: string, data: Partial<ZoneData>) => void;
  isLoading: boolean;
}

const defaultZones: ZoneData[] = [
  { id: "z1", name: "Main Entrance", crowdDensity: 85, estimatedWaitTime: 12 },
  { id: "z2", name: "Food Court A", crowdDensity: 40, estimatedWaitTime: 5 },
  { id: "z3", name: "Restrooms North", crowdDensity: 20, estimatedWaitTime: 2 },
  { id: "z4", name: "VIP Lounge", crowdDensity: 15, estimatedWaitTime: 0 },
  { id: "z5", name: "Merchandise Stand", crowdDensity: 95, estimatedWaitTime: 25 },
];

const EventContext = createContext<EventContextProps | undefined>(undefined);

export const EventProvider = ({ children }: { children: React.ReactNode }) => {
  const [zones, setZones] = useState<ZoneData[]>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("event_zones");
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (e) {
          console.error("Failed to parse zones from localStorage", e);
        }
      }
    }
    return defaultZones;
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const updateZone = (id: string, data: Partial<ZoneData>) => {
    setZones((prev) => {
      const updated = prev.map((zone) =>
        zone.id === id ? { ...zone, ...data } : zone
      );
      localStorage.setItem("event_zones", JSON.stringify(updated));
      return updated;
    });
  };

  // Simulate real-time updates every 30 seconds
  useEffect(() => {
    if (isLoading) return;
    const interval = setInterval(() => {
      setZones((prev) => {
        const updated = prev.map((z) => ({
          ...z,
          // Randomly fluctuate crowd density by -5% to +5%
          crowdDensity: Math.max(0, Math.min(100, z.crowdDensity + Math.floor(Math.random() * 11) - 5)),
          // Fluctuating wait times based on density
          estimatedWaitTime: Math.max(0, z.estimatedWaitTime + Math.floor(Math.random() * 5) - 2)
        }));
        localStorage.setItem("event_zones", JSON.stringify(updated));
        return updated;
      });
    }, 30000);
    return () => clearInterval(interval);
  }, [isLoading]);

  return (
    <EventContext.Provider value={{ zones, updateZone, isLoading }}>
      {children}
    </EventContext.Provider>
  );
};

export const useEventContext = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error("useEventContext must be used within an EventProvider");
  }
  return context;
};
