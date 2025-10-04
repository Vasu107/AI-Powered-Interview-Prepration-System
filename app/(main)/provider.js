"use client"; // Next.js App Router me zaroori hai

import { createContext, useContext, useState } from "react";

const DashboardContext = createContext();

export function useUser() {
  return useContext(DashboardContext);
}

export function DashboardProvider({ children }) {
  const [user, setUser] = useState(null);

  return (
    <DashboardContext.Provider value={{ user, setUser }}>
      {children}
    </DashboardContext.Provider>
  );
}
