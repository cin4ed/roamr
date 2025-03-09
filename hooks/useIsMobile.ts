"use client";

import { useState, useEffect } from "react";

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if window is defined (client-side)
    if (typeof window === "undefined") return;

    // Create the media query
    const mediaQuery = window.matchMedia("(max-width: 768px)");

    // Set initial value
    setIsMobile(mediaQuery.matches);

    // Define callback
    const handleResize = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
    };

    // Add listener
    mediaQuery.addEventListener("change", handleResize);

    // Cleanup
    return () => mediaQuery.removeEventListener("change", handleResize);
  }, []);

  return isMobile;
} 