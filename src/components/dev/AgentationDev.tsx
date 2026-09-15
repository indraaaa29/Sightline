"use client";

import dynamic from "next/dynamic";

// Dynamically import Agentation with SSR disabled to prevent hydration errors
// or issues if the library uses the window object immediately upon import.
const Agentation = dynamic(
  () => import("agentation").then((mod) => mod.Agentation),
  { ssr: false }
);

export default function AgentationDev() {
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return <Agentation />;
}
