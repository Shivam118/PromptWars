import React from "react";
import { Navbar } from "@/components/Navbar";
import { Dashboard } from "@/components/Dashboard";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Dashboard />
      </main>
    </>
  );
}
