import React from "react";
import { render, screen } from "@testing-library/react";
import { MetricCard } from "./MetricCard";

describe("MetricCard component", () => {
  it("renders metric and title properly", () => {
    render(
      <MetricCard
        title="Test Metric"
        metric="42%"
        subtext="Everything fine"
      />
    );

    expect(screen.getByText("Test Metric")).toBeInTheDocument();
    expect(screen.getByText("42%")).toBeInTheDocument();
    expect(screen.getByText("Everything fine")).toBeInTheDocument();
  });

  it("renders trend indicator when provided", () => {
    render(
      <MetricCard
        title="Trend Test"
        metric="100"
        trend="down"
      />
    );

    expect(screen.getByText("↓")).toBeInTheDocument();
  });
});
