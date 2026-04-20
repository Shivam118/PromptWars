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

  it("should initialize with default zones and render correctly", async () => {
    render(
      <EventProvider>
        <TestComponent />
      </EventProvider>
    );

    // We use findByTestId to wait for the async 'isLoading' state to transition to false
    expect(await screen.findByTestId("zone-count")).toHaveTextContent("5");
    expect(await screen.findByTestId("first-zone-name")).toHaveTextContent("Main Entrance");
  });

  it("should update zone data and persist to localStorage", async () => {
    render(
      <EventProvider>
        <TestComponent />
      </EventProvider>
    );

    const updateBtn = await screen.findByTestId("update-btn");
    
    act(() => {
      updateBtn.click();
    });

    expect(await screen.findByTestId("first-zone-density")).toHaveTextContent("10");

    // Verify localStorage
    const saved = JSON.parse(localStorage.getItem("event_zones") || "[]");
    expect(saved[0].crowdDensity).toBe(10);
  });
});
