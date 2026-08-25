import { IconBean } from "./icons";
import { SteamGroup } from "./illustrations";
import { cx } from "../lib/utils";

const WORD = "EMBERLINE";

export function LoadingScreen({ leaving }: { leaving: boolean }) {
  return (
    <div
      role="status"
      aria-label="Emberline is loading"
      className={cx(
        "fixed inset-0 z-[120] flex flex-col items-center justify-center gap-7 bg-coal transition-opacity duration-500",
        leaving && "pointer-events-none opacity-0",
      )}
    >
      <div className="relative">
        <IconBean className="h-14 w-14 text-ember" />
        <svg viewBox="-40 -50 80 54" className="absolute -top-10 left-1/2 h-12 w-24 -translate-x-1/2 text-cream/50" aria-hidden="true">
          <SteamGroup />
        </svg>
      </div>

      <div className="flex items-end" aria-hidden="true">
        {WORD.split("").map((letter, i) => (
          <span
            key={i}
            className="load-letter font-display text-4xl font-semibold tracking-[0.14em] text-cream sm:text-5xl"
            style={{ animationDelay: `${0.08 + i * 0.045}s` }}
          >
            {letter}
          </span>
        ))}
      </div>

      <p className="tick-label load-letter text-cream/45" style={{ animationDelay: "0.55s" }}>
        Small-batch roastery — Portland, OR
      </p>

      <div className="h-[3px] w-44 overflow-hidden rounded-full bg-cream/15" aria-hidden="true">
        <div className="load-bar h-full rounded-full bg-ember" />
      </div>
    </div>
  );
}
