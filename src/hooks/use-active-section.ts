import { useState, useEffect } from "react";

const sectionIds = ["home", "about", "skills", "portfolio", "certificates", "contact"];

/**
 * Tracks which section is currently in the viewport using Intersection Observer.
 * Returns the active section ID (e.g., "home", "about", etc.).
 */
export function useActiveSection() {
  const [active, setActive] = useState("home");

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActive(id);
          }
        },
        { rootMargin: "-40% 0px -55% 0px" }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return active;
}
