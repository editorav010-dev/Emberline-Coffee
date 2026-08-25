import { forwardRef, useEffect, useState } from "react";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import { prefersReducedMotion } from "./utils";

export interface Route {
  path: string;
  parts: string[];
  query: URLSearchParams;
}

function parseHash(): Route {
  const raw = window.location.hash.replace(/^#/, "") || "/";
  const [pathPart, queryPart = ""] = raw.split("?");
  const path = pathPart.startsWith("/") ? pathPart : `/${pathPart}`;
  return { path, parts: path.split("/").filter(Boolean), query: new URLSearchParams(queryPart) };
}

export function useRoute(): Route {
  const [route, setRoute] = useState<Route>(parseHash);
  useEffect(() => {
    const onChange = () => setRoute(parseHash());
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);
  return route;
}

export function navigate(to: string): void {
  const target = to.startsWith("#") ? to : `#${to}`;
  if (window.location.hash === target) return;
  window.location.hash = target;
}

/** Navigate to the homepage and scroll to a section id (e.g. "brew"). */
export function scrollToSection(id: string): void {
  const scroll = () => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
  };
  if (parseHash().path !== "/") {
    navigate("/");
    setTimeout(scroll, 100);
  } else {
    scroll();
  }
}

interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  to: string;
  children: ReactNode;
}

export function Link({ to, children, ...rest }: LinkProps) {
  return (
    <a href={`#${to}`} {...rest}>
      {children}
    </a>
  );
}
