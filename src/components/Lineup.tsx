import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { PRODUCTS, ROAST_LABELS } from "../data/products";
import { Link } from "../lib/router";
import { formatPrice, prefersReducedMotion } from "../lib/utils";
import { getElementProgress } from "../lib/scrollMotion";
import { useCart } from "../state/CartContext";
import { useToast } from "../state/ToastContext";
import { BagArt, Motif } from "./illustrations";
import { IconArrowRight, IconCheck, IconPlus } from "./icons";

export function Lineup() {
  const pinRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const slideInnerRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [reduced] = useState(() => prefersReducedMotion());
  const [addedId, setAddedId] = useState<string | null>(null);
  const { add, openCart } = useCart();
  const { push } = useToast();

  useEffect(() => {
    if (reduced) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const pin = pinRef.current;
      const track = trackRef.current;
      const view = viewRef.current;
      if (!pin || !track || !view) return;
      const rect = pin.getBoundingClientRect();
      if (rect.bottom < -100 || rect.top > window.innerHeight + 100) return;

      const p = getElementProgress(pin);
      const max = track.scrollWidth - view.clientWidth;
      track.style.transform = `translate3d(${(-p * max).toFixed(1)}px,0,0)`;

      const vw = window.innerWidth;
      slideInnerRefs.current.forEach((el) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        const n = (r.left + r.width / 2 - vw / 2) / vw;
        const c = Math.max(-1.4, Math.min(1.4, n));
        el.style.transform = `translate3d(${(-c * 64).toFixed(1)}px,0,0) scale(${(1 - Math.min(1, Math.abs(c)) * 0.07).toFixed(3)})`;
        el.style.opacity = (1 - Math.min(1, Math.abs(c)) * 0.45).toFixed(3);
      });

      if (counterRef.current) {
        const idx = Math.min(PRODUCTS.length, Math.max(1, Math.round(p * (PRODUCTS.length - 1)) + 1));
        counterRef.current.textContent = String(idx).padStart(2, "0");
      }
      if (barRef.current) barRef.current.style.transform = `scaleX(${p.toFixed(4)})`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reduced]);

  const handleAdd = (slug: string, name: string, price: number) => {
    const { clamped } = add(slug);
    setAddedId(slug);
    window.setTimeout(() => setAddedId((cur) => (cur === slug ? null : cur)), 1300);
    push({
      title: `${name} added to cart`,
      message: clamped ? "You've hit the limit of 10 bags per coffee." : formatPrice(price),
      tone: "success",
      action: { label: "View cart", onClick: openCart },
    });
  };

  return (
    <section id="lineup" className="scroll-mt-24 border-y border-seam bg-coal text-cream">
      <div ref={pinRef} style={reduced ? undefined : { height: "540vh" }}>
        <div className={reduced ? "" : "sticky top-0 flex h-screen flex-col overflow-hidden"}>
          {/* header row */}
          <div className="mx-auto flex w-full max-w-[1600px] items-end justify-between gap-4 px-4 pb-2 pt-6 sm:px-6 lg:px-8">
            <div>
              <p className="tick-label flex items-center gap-2.5 text-caramel">
                <span className="inline-block h-px w-8 bg-current" aria-hidden="true" />
                The lineup — this week's drum
              </p>
              <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-cream sm:text-3xl">
                Six bags, six gradients, one shelf.
              </h2>
            </div>
            <div className="hidden items-center gap-4 sm:flex">
              <p className="font-display text-lg tabular-nums text-cream/80">
                <span ref={counterRef}>01</span>
                <span className="text-cream/35"> / {String(PRODUCTS.length).padStart(2, "0")}</span>
              </p>
              {!reduced ? (
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cream/45">
                  Scroll
                  <svg viewBox="0 0 24 24" className="anim-hint h-4 w-4 text-caramel" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M4 12h16M13 5l7 7-7 7" />
                  </svg>
                </p>
              ) : null}
            </div>
          </div>

          {/* track */}
          <div
            ref={viewRef}
            className={
              reduced
                ? "no-scrollbar mt-4 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-6 sm:px-6 lg:px-8"
                : "mt-2 flex-1 overflow-hidden"
            }
          >
            <div
              ref={trackRef}
              className={reduced ? "flex gap-5" : "flex h-full items-stretch gap-5 px-4 will-change-transform sm:px-6 lg:px-8"}
            >
              {PRODUCTS.map((p, i) => (
                <article
                  key={p.slug}
                  className={reduced ? "w-[86vw] shrink-0 snap-start sm:w-[440px]" : "flex max-h-full w-[86vw] shrink-0 items-center sm:w-[64vw] lg:w-[52vw]"}
                >
                  <div
                    ref={(el) => {
                      slideInnerRefs.current[i] = el;
                    }}
                    className="no-scrollbar relative max-h-full w-full overflow-y-auto rounded-xl border border-seam will-change-transform"
                    style={{
                      background: `radial-gradient(120% 130% at 16% 0%, ${p.accent}33 0%, transparent 56%), linear-gradient(160deg, ${p.accentDeep}26 0%, #171009 72%)`,
                    }}
                  >
                    <div className="grid lg:grid-cols-[1.05fr_1fr]">
                      {/* copy */}
                      <div className="relative z-10 flex flex-col px-6 pb-6 pt-7 sm:px-9 lg:py-12">
                        <p
                          className="font-display text-[3.4rem] font-semibold leading-[0.9] sm:text-[5.2rem]"
                          style={{ WebkitTextStroke: `1.5px ${p.accent}`, color: "transparent" }}
                          aria-hidden="true"
                        >
                          {String(i + 1).padStart(2, "0")}
                        </p>
                        <p className="tick-label mt-4" style={{ color: p.accent }}>
                          {p.origin.country} · {ROAST_LABELS[p.roast]} roast
                        </p>
                        <h3 className="mt-2 font-display text-3xl font-semibold leading-[1.05] tracking-tight text-cream sm:text-4xl">
                          {p.name}
                        </h3>
                        <p className="mt-3 max-w-sm text-sm leading-relaxed text-cream/60">{p.tagline}</p>

                        <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Tasting notes">
                          {p.notes.map((note) => (
                            <li
                              key={note}
                              className="rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-wider"
                              style={{ borderColor: `${p.accent}55`, color: "#faf4e6", backgroundColor: `${p.accent}1f` }}
                            >
                              {note}
                            </li>
                          ))}
                        </ul>

                        <div className="mt-auto flex flex-wrap items-center gap-3 pt-7">
                          <p className="mr-1 font-display text-2xl font-semibold tabular-nums text-cream">
                            {formatPrice(p.price)}
                            <span className="ml-1.5 font-sans text-xs font-medium text-cream/45">/ {p.weight}</span>
                          </p>
                          <button
                            type="button"
                            onClick={() => handleAdd(p.slug, p.name, p.price)}
                            className="inline-flex h-11 items-center gap-1.5 rounded-full px-5 text-xs font-bold uppercase tracking-wider text-cream shadow-night transition-all duration-300 hover:brightness-110 active:scale-90"
                            style={{ backgroundImage: `linear-gradient(120deg, ${p.accent}, ${p.accentDeep})` }}
                            aria-label={`Add ${p.name} to cart`}
                          >
                            {addedId === p.slug ? (
                              <>
                                <IconCheck className="h-4 w-4" /> Added
                              </>
                            ) : (
                              <>
                                <IconPlus className="h-4 w-4" /> Add
                              </>
                            )}
                          </button>
                          <Link
                            to={`/coffee/${p.slug}`}
                            className="inline-flex h-11 items-center gap-1.5 rounded-full border border-cream/25 px-5 text-xs font-bold uppercase tracking-wider text-cream/85 transition-all duration-200 hover:border-cream/70 hover:text-cream"
                          >
                            Details
                            <IconArrowRight className="h-3.5 w-3.5" />
                          </Link>
                        </div>
                      </div>

                      {/* visual stage */}
                      <div className="relative flex min-h-[220px] items-end justify-center overflow-hidden sm:min-h-[300px] lg:min-h-[460px]">
                        <Motif
                          kind={p.motif}
                          className="anim-rot-slow pointer-events-none absolute right-4 top-6 h-36 w-36 opacity-[0.22] sm:h-44 sm:w-44"
                          style={{ color: p.accent }}
                        />
                        <div
                          className="anim-glow pointer-events-none absolute bottom-8 left-1/2 h-12 w-2/3 rounded-[100%]"
                          style={{ background: `radial-gradient(closest-side, ${p.accent}66, transparent 72%)` }}
                          aria-hidden="true"
                        />
                        <div className="anim-floaty-slow relative h-[82%] max-h-[400px]" style={{ "--fl-rot": "-2deg" } as CSSProperties}>
                          <BagArt product={p} className="h-full w-auto drop-shadow-[0_26px_30px_rgba(0,0,0,0.55)]" />
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* progress rail */}
          <div className="mx-auto w-full max-w-[1600px] px-4 pb-6 pt-3 sm:px-6 lg:px-8">
            <div className="h-[3px] w-full overflow-hidden rounded-full bg-cream/12">
              <div
                ref={barRef}
                className="h-full w-full origin-left rounded-full bg-ember"
                style={{ transform: reduced ? "scaleX(1)" : "scaleX(0)" }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
