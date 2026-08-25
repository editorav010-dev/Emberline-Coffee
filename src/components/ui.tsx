import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cx } from "../lib/utils";
import { IconMinus, IconPlus, IconSpinner } from "./icons";
import { ROAST_LABELS } from "../data/products";

/* ---------------- Button ---------------- */

type Variant = "primary" | "ember" | "ghost" | "cream";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  full?: boolean;
}

const variantClass: Record<Variant, string> = {
  primary: "bg-espresso text-cream hover:bg-roast shadow-lift hover:-translate-y-px",
  ember: "bg-ember text-cream hover:bg-ember-deep shadow-lift hover:-translate-y-px",
  ghost: "border border-ink/25 text-ink hover:border-ink/60 hover:bg-ink/5",
  cream: "bg-cream text-espresso hover:bg-parchment-deep shadow-lift hover:-translate-y-px",
};

const sizeClass: Record<Size, string> = {
  sm: "text-xs px-3.5 py-2",
  md: "text-sm px-5 py-2.5",
  lg: "text-[15px] px-7 py-3.5",
};

export function Button({ variant = "primary", size = "md", loading, full, className, children, disabled, ...rest }: ButtonProps) {
  return (
    <button
      className={cx(
        "inline-flex select-none items-center justify-center gap-2 rounded-[0.65rem] font-semibold tracking-wide transition-all duration-200 active:scale-[0.97]",
        variantClass[variant],
        sizeClass[size],
        full && "w-full",
        (disabled || loading) && "pointer-events-none opacity-55",
        className,
      )}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? <IconSpinner className="h-4 w-4" /> : null}
      {children}
    </button>
  );
}

/* ---------------- Chip (filter pill — dark theme) ---------------- */

export function Chip({
  active,
  onClick,
  children,
  count,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
  count?: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cx(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-2 text-[13px] font-semibold transition-all duration-200 active:scale-95",
        active
          ? "border-cream bg-cream text-espresso shadow-night"
          : "border-seam bg-soot/70 text-cream/60 hover:border-caramel/70 hover:text-cream",
      )}
    >
      {children}
      {typeof count === "number" ? (
        <span className={cx("text-[11px] font-bold", active ? "text-ember-deep" : "text-cream/35")}>{count}</span>
      ) : null}
    </button>
  );
}

/* ---------------- Quantity stepper ---------------- */

export function Stepper({
  qty,
  max,
  onDecrement,
  onIncrement,
  label,
  size = "md",
}: {
  qty: number;
  max: number;
  onDecrement: () => void;
  onIncrement: () => void;
  label: string;
  size?: "sm" | "md";
}) {
  const btn = cx(
    "inline-flex items-center justify-center rounded-full border border-line bg-cream text-ink transition-all duration-150",
    "hover:border-cocoa hover:bg-parchment-deep active:scale-90 disabled:pointer-events-none disabled:opacity-35",
    size === "sm" ? "h-8 w-8" : "h-10 w-10",
  );
  return (
    <div className="inline-flex items-center gap-2" role="group" aria-label={label}>
      <button type="button" className={btn} onClick={onDecrement} disabled={qty <= 1} aria-label={`Decrease ${label}`}>
        <IconMinus className={size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4"} />
      </button>
      <span
        key={qty}
        className={cx("anim-fadein min-w-7 text-center font-bold tabular-nums", size === "sm" ? "text-sm" : "text-base")}
        aria-live="polite"
      >
        {qty}
      </span>
      <button type="button" className={btn} onClick={onIncrement} disabled={qty >= max} aria-label={`Increase ${label}`}>
        <IconPlus className={size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4"} />
      </button>
    </div>
  );
}

/* ---------------- Section heading ---------------- */

export function SectionHead({
  overline,
  title,
  copy,
  dark,
  className,
}: {
  overline: string;
  title: ReactNode;
  copy?: ReactNode;
  dark?: boolean;
  className?: string;
}) {
  return (
    <div className={cx("max-w-2xl", className)}>
      <p className={cx("tick-label flex items-center gap-2.5", dark ? "text-caramel" : "text-ember")}>
        <span className="inline-block h-px w-8 bg-current" aria-hidden="true" />
        {overline}
      </p>
      <h2
        className={cx(
          "mt-4 font-display text-3xl font-semibold leading-[1.05] tracking-tight sm:text-4xl lg:text-[2.75rem]",
          dark ? "text-cream" : "text-ink",
        )}
      >
        {title}
      </h2>
      {copy ? <p className={cx("mt-4 text-[15px] leading-relaxed", dark ? "text-cream/60" : "text-cocoa")}>{copy}</p> : null}
    </div>
  );
}

/* ---------------- Roast meter ---------------- */

export function RoastMeter({ roast, className }: { roast: number; className?: string }) {
  return (
    <div className={cx("flex items-center gap-2.5", className)}>
      <span className="flex items-center gap-1" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((i) => (
          <span key={i} className={cx("h-2.5 w-2.5 rounded-full transition-colors", i <= roast ? "bg-ember" : "bg-ink/15")} />
        ))}
      </span>
      <span className="text-xs font-semibold uppercase tracking-wider text-cocoa">{ROAST_LABELS[roast]} roast</span>
      <span className="sr-only">{`Roast level ${roast} of 5, ${ROAST_LABELS[roast]}`}</span>
    </div>
  );
}

/* ---------------- Form field wrapper ---------------- */

export function Field({
  id,
  label,
  error,
  hint,
  optional,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  optional?: boolean;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 flex items-baseline justify-between text-[13px] font-semibold text-ink">
        <span>{label}</span>
        {optional ? <span className="text-[11px] font-medium text-latte">optional</span> : null}
      </label>
      {children}
      {error ? (
        <p id={`${id}-err`} role="alert" className="anim-fadein mt-1.5 flex items-center gap-1.5 text-xs font-medium text-error">
          <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.6">
            <circle cx="8" cy="8" r="6.5" />
            <path d="M8 5v3.5M8 11h.01" strokeLinecap="round" />
          </svg>
          {error}
        </p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-latte">{hint}</p>
      ) : null}
    </div>
  );
}

/* ---------------- Product badge ---------------- */

export function ProductBadge({ accent, children }: { accent: string; children: ReactNode }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-wider"
      style={{ color: "#150e08", backgroundColor: "#faf4e6", borderColor: `${accent}66` }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: accent }} aria-hidden="true" />
      {children}
    </span>
  );
}
