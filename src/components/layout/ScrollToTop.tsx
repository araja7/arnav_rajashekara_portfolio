import { useLayoutEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

/** Starts each newly visited page at the top; back/forward keeps the browser's position. */
export function ScrollToTop() {
  const { pathname } = useLocation();
  const navigationType = useNavigationType();

  useLayoutEffect(() => {
    if (navigationType === "POP") return;
    // "instant" overrides the smooth scroll-behavior set on <html>.
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname, navigationType]);

  return null;
}
