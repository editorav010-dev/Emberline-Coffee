import { useEffect, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { prefersReducedMotion } from "../lib/utils";

export function Reveal({
  children,
  className,
  delay = 0,
  variant = "up",
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  variant?: "up" | "scale";
  as?: "div" | "section" | "li" | "article";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      setInView(true);
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const style: CSSProperties | undefined = delay ? { transitionDelay: `${delay}ms` } : undefined;

  return (
    <Tag
      ref={ref as never}
      style={style}
      className={`${className ?? ""} rv ${variant === "scale" ? "rv-scale" : ""} ${inView ? "in" : ""}`.trim()}
    >
      {children}
    </Tag>
  );
}
