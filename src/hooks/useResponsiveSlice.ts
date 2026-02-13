import { useEffect, useState } from "react";

export const useResponsiveSlice = <T>(
  array: T[] = [],
  smallCount: number,
  largeCount: number,
  lgBreakpoint = 1024
): T[] => {
  const [windowWidth, setWindowWidth] = useState<number | null>(null);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    handleResize(); // initial width
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const count =
    windowWidth && windowWidth >= lgBreakpoint ? largeCount : smallCount;
  return array.slice(0, count) || [];
};
