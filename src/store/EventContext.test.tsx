import React from "react";
import { render, screen, act } from "@testing-library/react";
import { EventProvider, useEventContext } from "./EventContext";

const TestComponent = () => {
  const { zones, updateZone, isLoading } = useEventContext();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <div data-testid="zone-count">{zones.length}</div>
      <div data-testid="first-zone-name">{zones[0]?.name}</div>
      <div data-testid="first-zone-density">{zones[0]?.crowdDensity}</div>
      <button
        onClick={() => updateZone(zones[0].id, { crowdDensity: 10 })}
        data-testid="update-btn"
      >
        Update Zone
      </button>
    </div>
  );
};

describe("EventContext", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should initialize with default zones and render correctly", () => {
    render(
      <EventProvider>
        <TestComponent />
      </EventProvider>
    );

    // Initial loading might pass instantly depending on microtasks, so we check for the values
    expect(screen.getByTestId("zone-count")).toHaveTextContent("5");
    expect(screen.getByTestId("first-zone-name")).toHaveTextContent("Main Entrance");
  });

  it("should update zone data and persist to localStorage", () => {
    render(
      <EventProvider>
        <TestComponent />
      </EventProvider>
    );

    const updateBtn = screen.getByTestId("update-btn");
    
    act(() => {
      updateBtn.click();
    });

    expect(screen.getByTestId("first-zone-density")).toHaveTextContent("10");

    // Verify localStorage
    const saved = JSON.parse(localStorage.getItem("event_zones") || "[]");
    expect(saved[0].crowdDensity).toBe(10);
  });
});
