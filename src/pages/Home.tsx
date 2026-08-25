import { useEffect, useRef, useState } from "react";
import type { CSSProperties, RefObject } from "react";
import { CATEGORIES, PRODUCTS } from "../data/products";
import { Link, scrollToSection } from "../lib/router";
import { roastDayLabel, prefersReducedMotion } from "../lib/utils";
import { Parallax, useCountUp, useElementProgress, useInViewOnce } from "../lib/scrollMotion";
import { Reveal } from "../components/Reveal";
import { ProductCard } from "../components/ProductCard";
import { Lineup } from "../components/Lineup";
import { Button, SectionHead } from "../components/ui";
import { IconArrowRight, IconArrowLeft, IconFlame, IconLeaf, IconPackage } from "../components/icons";
import { Bean, CoffeeRings, HeroScene, Motif } from "../components/illustrations";

const HERO_LINES = ["Six coffees.", "Roasted Tuesday.", "Gone by Friday."];

const MARQUEE_NOTES = PRODUCTS.flatMap((p) => p.notes);

const BREW_METHODS = [
  { id: "v60", name: "V60 pour over", ratio: "1 : 16", grind: "Medium-fine", temp: "92–94 °C", time: "2:30 – 3:00", note: "Bloom with twice the coffee weight in water for 35 seconds, then pour in slow spirals." },
  { id: "espresso", name: "Espresso", ratio: "1 : 2", grind: "Fine", temp: "93–94 °C", time: "0:25 – 0:32", note: "18 g in, 36 g out. If it runs fast, grind finer before you change the dose." },
  { id: "aeropress", name: "AeroPress", ratio: "1 : 13", grind: "Medium", temp: "85–90 °C", time: "1:30 – 2:00", note: "Inverted or not — press gently over 30 seconds and stop at the first hiss." },
  { id: "press", name: "French press", ratio: "1 : 14", grind: "Coarse", temp: "96 °C", time: "4:00", note: "Break the crust, skim the foam, and give it a full four minutes before plunging." },
  { id: "cold", name: "Cold brew", ratio: "1 : 8", grind: "Extra coarse", temp: "Cold", time: "12 – 18 h", note: "Steep on the counter, not the fridge. Dilute 1 : 1 over ice when it's ready." },
];

const STEPS = [
  {
    n: "01",
    title: "Sourced close",
    icon: IconLeaf,
    copy: "We buy from six farms and washing stations we can name, at prices we publish each season. Relationships over auctions, every time.",
  },
  {
    n: "02",
    title: "Roasted slow",
    icon: IconFlame,
    copy: "Small twelve-kilo batches on Tuesday mornings. Every roast is logged, cupped the next day, and scored before a single bag is sealed.",
  },
  {
    n: "03",
    title: "Shipped fast",
    icon: IconPackage,
    copy: "Bags leave the roastery within 48 hours of the drum stopping. Rest date on every label — we never ship anything older than two weeks.",
  },
];

/* hero copy drifts down and fades as you scroll; the scene floats up — direct DOM, no re-renders */
function useHeroScrollFx(): { headRef: RefObject<HTMLDivElement>; sceneRef: RefObject<HTMLDivElement> } {
  const headRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (prefersReducedMotion()) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      if (y > window.innerHeight * 1.4) return;
      if (headRef.current) {
        headRef.current.style.transform = `translate3d(0, ${(y * 0.15).toFixed(1)}px, 0)`;
        headRef.current.style.opacity = Math.max(0, 1 - y / 640).toFixed(3);
      }
      if (sceneRef.current) {
        sceneRef.current.style.transform = `translate3d(0, ${(y * -0.055).toFixed(1)}px, 0)`;
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
  return { headRef, sceneRef };
}

export function Home() {
  const shelfRef = useRef<HTMLDivElement>(null);
  const { headRef, sceneRef } = useHeroScrollFx();

  const scrollShelf = (dir: 1 | -1) => {
    shelfRef.current?.scrollBy({
      left: dir * 340,
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
  };

  return (
    <div>
      {/* ============================== HERO (dark stage) ============================== */}
      <section className="relative overflow-hidden bg-coal text-cream">
        {/* ember glows */}
        <div className="pointer-events-none absolute -top-44 right-[-12%] h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle,rgba(212,85,42,0.17),transparent_64%)]" aria-hidden="true" />
        <div className="pointer-events-none absolute -bottom-52 left-[-14%] h-[560px] w-[560px] rounded-full bg-[radial-gradient(circle,rgba(200,144,72,0.13),transparent_64%)]" aria-hidden="true" />
        <div className="pointer-events-none absolute -left-40 top-24 h-[520px] w-[520px] text-caramel opacity-[0.13]">
          <Parallax speed={0.22} className="h-full w-full">
            <CoffeeRings className="h-full w-full" />
          </Parallax>
        </div>

        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 pb-16 pt-12 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:gap-6 lg:px-8 lg:pb-24 lg:pt-16">
          <div ref={headRef} className="relative will-change-transform">
            <p className="tick-label flex items-center gap-2.5 text-caramel">
              <span className="inline-block h-px w-8 bg-current" aria-hidden="true" />
              Small-batch roastery — Portland, OR
            </p>
            <h1 className="mt-5 font-display text-[2.7rem] font-semibold leading-[1.02] tracking-tight text-cream sm:text-6xl lg:text-[4.4rem]">
              {HERO_LINES.map((line, i) => (
                <span key={line} className="line-mask">
                  <span style={{ animationDelay: `${0.15 + i * 0.12}s` }}>
                    {i === 2 ? <em className="not-italic text-ember">{line}</em> : line}
                  </span>
                </span>
              ))}
            </h1>
            <p className="mt-6 max-w-md text-[15px] leading-relaxed text-cream/60 sm:text-base">
              Emberline keeps exactly six coffees on the shelf — never more. Roasted Tuesday, cupped Wednesday,
              at your door before the weekend.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link to="/shop" className="inline-flex">
                <Button variant="ember" size="lg" tabIndex={-1}>
                  Shop the shelf
                  <IconArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <button type="button" onClick={() => scrollToSection("lineup")} className="inline-flex">
                <Button variant="ghost" size="lg" className="border-cream/25 text-cream hover:border-cream/60 hover:bg-cream/10">
                  Meet the six
                </Button>
              </button>
            </div>
            <dl className="mt-12 grid max-w-md grid-cols-3 divide-x divide-seam border-y border-seam py-5">
              {[
                ["06", "coffees on the shelf"],
                ["48h", "from drum to door"],
                ["Tue", "roast day, weekly"],
              ].map(([v, l]) => (
                <div key={l} className="px-4 first:pl-0">
                  <dt className="sr-only">{l}</dt>
                  <dd className="font-display text-3xl font-semibold text-cream sm:text-4xl">{v}</dd>
                  <dd className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-cream/40">{l}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div ref={sceneRef} className="relative mx-auto w-full max-w-[560px] will-change-transform">
            <div
              className="pointer-events-none absolute left-1/2 top-1/2 h-[78%] w-[78%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(200,144,72,0.20),transparent_62%)]"
              aria-hidden="true"
            />
            <HeroScene className="relative h-auto w-full" tone="dark" />
            <div
              className="anim-floaty-slow absolute bottom-6 left-0 hidden items-center gap-3 rounded-xl border border-line bg-cream px-4 py-3 text-ink shadow-night sm:flex"
              style={{ "--fl-rot": "-2deg" } as CSSProperties}
            >
              <span className="anim-pulse-dot inline-block h-2.5 w-2.5 rounded-full bg-success" aria-hidden="true" />
              <div>
                <p className="text-xs font-bold">Last roast — {roastDayLabel()}</p>
                <p className="text-[11px] text-latte">resting now, ships in 48h</p>
              </div>
            </div>
          </div>
        </div>

        {/* tasting-note marquee */}
        <div className="marquee border-y border-seam bg-[#100a06] py-3" aria-hidden="true">
          <div className="marquee-track">
            {[0, 1].map((dup) => (
              <div key={dup} className="flex shrink-0 items-center">
                {MARQUEE_NOTES.map((note, i) => (
                  <span key={`${dup}-${i}`} className="flex items-center gap-4 pr-4 font-display text-lg italic text-cream/75">
                    {note}
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-ember" />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================== SHELF PREVIEW (light) ============================== */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHead
              overline="Quick add"
              title={<>Roasted Tuesday,<br />ready to ship.</>}
            />
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => scrollShelf(-1)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line bg-cream text-ink transition-all hover:border-cocoa hover:shadow-lift active:scale-90"
                aria-label="Scroll shelf left"
              >
                <IconArrowLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => scrollShelf(1)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line bg-cream text-ink transition-all hover:border-cocoa hover:shadow-lift active:scale-90"
                aria-label="Scroll shelf right"
              >
                <IconArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </Reveal>

        <div
          ref={shelfRef}
          className="no-scrollbar -mx-4 mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-4 pb-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8"
        >
          {PRODUCTS.slice(0, 4).map((product, i) => (
            <Reveal key={product.slug} delay={i * 80} className="w-[280px] shrink-0 snap-start sm:w-[320px]">
              <ProductCard product={product} />
            </Reveal>
          ))}
          <Reveal delay={320} className="w-[280px] shrink-0 snap-start sm:w-[320px]">
            <Link
              to="/shop"
              className="group flex h-full min-h-[400px] flex-col items-start justify-between rounded-xl border-2 border-dashed border-line bg-parchment-deep/50 p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-ember/60 hover:shadow-warm"
            >
              <Motif kind="rings" className="h-20 w-20 text-caramel/50 transition-transform duration-500 group-hover:rotate-45" />
              <div>
                <p className="font-display text-2xl font-semibold leading-tight text-ink">
                  All six coffees,<br />one shelf.
                </p>
                <p className="mt-3 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-ember">
                  Browse everything
                  <IconArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </p>
              </div>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ============================== THE LINEUP (dark, scroll-driven) ============================== */}
      <Lineup />

      {/* ============================== STORY (light) ============================== */}
      <section id="story" className="scroll-mt-28 border-b border-line bg-cream/60">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_1.15fr] lg:gap-20 lg:px-8 lg:py-28">
          <div className="lg:sticky lg:top-36 lg:self-start">
            <Reveal>
              <SectionHead
                overline="The roastery"
                title={<>Small on purpose,<br />hot on detail.</>}
                copy="Most roasteries scale up until the drum decides the menu. We did the opposite — six slots on the shelf, and every one of them has to be earned each season."
              />
            </Reveal>
            <Reveal delay={120}>
              <div className="mt-10 grid grid-cols-2 gap-4">
                {[
                  ["12 kg", "roast batches"],
                  ["2×", "hand-sorted lots"],
                  ["6", "named producers"],
                  ["2 wk", "max shelf age"],
                ].map(([v, l]) => (
                  <div key={l} className="rounded-xl border border-line bg-parchment p-5">
                    <p className="font-display text-3xl font-semibold text-ember">{v}</p>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-cocoa">{l}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          <div className="space-y-8">
            {[
              {
                title: "A shelf with six chairs",
                copy: "Every coffee we take on displaces another one. That constraint keeps us honest: if a lot can't beat what's already sitting on the shelf, it doesn't come in. The result is a short menu where nothing is filler and everything has a reason to be there this week.",
              },
              {
                title: "Roast day is a ritual",
                copy: "Tuesday starts at 6 a.m. with the drum already warm. Each batch is roasted to a profile we cupped and argued about the season before, logged to the second, and cupped blind the next morning. If a roast misses, it becomes staff espresso — never your bag.",
              },
              {
                title: "Fresh is a number, not a feeling",
                copy: "We print the roast date, the rest window, and the brew recipes we actually use on the bar. Coffee peaks days after roasting, not minutes, so we ship on Thursday — rested just enough, and never older than two weeks when it reaches your grinder.",
              },
            ].map((block, i) => (
              <Reveal key={block.title} delay={i * 60}>
                <article className="rounded-xl border border-line bg-parchment p-6 transition-shadow duration-300 hover:shadow-lift sm:p-8">
                  <div className="flex items-center gap-4">
                    <span className="font-display text-4xl font-semibold text-caramel/70">{String(i + 1).padStart(2, "0")}</span>
                    <h3 className="font-display text-xl font-semibold text-ink sm:text-2xl">{block.title}</h3>
                  </div>
                  <p className="mt-4 text-[15px] leading-relaxed text-cocoa">{block.copy}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============================== ROAST LOG (dark scrollytelling) ============================== */}
      <RoastLog />

      {/* ============================== ORIGINS (light ledger) ============================== */}
      <section id="origins" className="mx-auto max-w-7xl scroll-mt-28 px-4 py-16 sm:px-6 lg:px-8 lg:py-28">
        <Reveal>
          <SectionHead
            overline="On the menu this season"
            title="Six origins, six personalities."
            copy="Every coffee below is a working relationship, not a spot purchase. Follow a row for the full story, the cup profile, and the recipes we use on the bar."
          />
        </Reveal>

        <div className="mt-12 overflow-hidden rounded-xl border border-line bg-cream">
          {PRODUCTS.map((p, i) => (
            <Reveal key={p.slug} delay={i * 50}>
              <a
                href={`#/coffee/${p.slug}`}
                className="group relative flex items-center gap-4 border-b border-line px-4 py-5 transition-colors duration-300 last:border-b-0 hover:bg-[var(--row-tint)] sm:gap-6 sm:px-6 lg:px-8"
                style={{ "--row-tint": p.tint, "--acc": p.accent } as CSSProperties}
              >
                <span className="hidden w-8 shrink-0 font-display text-lg font-semibold text-latte sm:block">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className="h-3 w-3 shrink-0 rounded-full transition-transform duration-300 group-hover:scale-125"
                  style={{ backgroundColor: p.accent }}
                  aria-hidden="true"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <h3 className="acc-hover font-display text-xl font-semibold text-ink sm:text-2xl">{p.name}</h3>
                    <p className="text-xs font-semibold uppercase tracking-wider text-latte">
                      {p.origin.country}
                      {p.origin.region ? ` · ${p.origin.region}` : ""}
                    </p>
                  </div>
                  <p className="mt-1 hidden text-sm text-cocoa md:block">{p.notes.join(" · ")}</p>
                </div>
                <p className="hidden shrink-0 text-right text-xs font-semibold text-cocoa lg:block">
                  {p.altitude}
                  <br />
                  <span className="text-latte">{p.process}</span>
                </p>
                <span
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line bg-parchment text-ink transition-all duration-300 group-hover:border-transparent group-hover:bg-espresso group-hover:text-cream"
                  aria-hidden="true"
                >
                  <IconArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                </span>
              </a>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ============================== PROCESS (light) ============================== */}
      <section id="process" className="scroll-mt-28 border-y border-line bg-parchment-deep/60">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-28">
          <Reveal>
            <SectionHead overline="From cherry to ember" title="Three steps. No shortcuts." />
          </Reveal>
          <ol className="mt-14 space-y-6">
            {STEPS.map((step, i) => (
              <Reveal key={step.n} delay={i * 100}>
                <li
                  className={`group grid items-center gap-6 rounded-xl border border-line bg-parchment p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-warm sm:grid-cols-[auto_auto_1fr] sm:gap-10 sm:p-8 ${
                    i === 1 ? "lg:ml-16" : i === 2 ? "lg:ml-32" : ""
                  }`}
                >
                  <span className="font-display text-5xl font-semibold text-caramel/60 transition-colors duration-300 group-hover:text-ember sm:text-6xl">
                    {step.n}
                  </span>
                  <span className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-line bg-cream text-ember">
                    <step.icon className="h-6 w-6" />
                  </span>
                  <div>
                    <h3 className="font-display text-2xl font-semibold text-ink">{step.title}</h3>
                    <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-cocoa">{step.copy}</p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* ============================== BREW GUIDE (light) ============================== */}
      <section id="brew" className="mx-auto max-w-7xl scroll-mt-28 px-4 py-16 sm:px-6 lg:px-8 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:gap-16">
          <Reveal>
            <div>
              <SectionHead
                overline="Brew guide"
                title="Dial it in the way we do on the bar."
                copy="The same recipes our baristas use every morning. Pick a method and we'll show you the numbers that matter."
              />
            </div>
          </Reveal>
          <BrewPanel />
        </div>
      </section>

      {/* ============================== CTA (dark) ============================== */}
      <section className="relative overflow-hidden bg-espresso text-cream">
        <div className="marquee border-b border-seam bg-[#100a06] py-3" aria-hidden="true">
          <div className="marquee-track marquee-track-reverse">
            {[0, 1].map((dup) => (
              <div key={dup} className="flex shrink-0 items-center">
                {["Roast day Tuesday", "First crack", "Rested & ready", "Whole bean", "Small batch", "Portland OR"].map((t, i) => (
                  <span key={`${dup}-${i}`} className="tick-label flex items-center gap-4 pr-4 text-cream/50">
                    {t}
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-caramel" />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="pointer-events-none absolute -right-28 -top-28 h-[460px] w-[460px] text-bark">
          <Parallax speed={-0.12} className="h-full w-full">
            <CoffeeRings className="h-full w-full" />
          </Parallax>
        </div>
        <svg viewBox="-50 -50 100 100" className="pointer-events-none absolute left-[8%] top-24 hidden h-16 w-16 text-bark lg:block" aria-hidden="true">
          <Bean x={0} y={0} rotate={28} delay={0.4} />
        </svg>
        <svg viewBox="-50 -50 100 100" className="pointer-events-none absolute bottom-14 right-[14%] hidden h-12 w-12 text-copper lg:block" aria-hidden="true">
          <Bean x={0} y={0} rotate={-20} delay={1.2} />
        </svg>
        <div className="relative mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 lg:py-28">
          <Reveal>
            <p className="tick-label text-caramel">The shelf restocks Tuesday</p>
            <h2 className="mt-5 font-display text-4xl font-semibold leading-[1.05] tracking-tight text-cream sm:text-5xl lg:text-6xl">
              Your next favourite cup is <em className="not-italic text-ember">48 hours</em> from the drum.
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-[15px] leading-relaxed text-cream/60">
              {CATEGORIES.find((c) => c.id === "all")?.blurb} Roasted this week: {PRODUCTS.slice(0, 3).map((p) => p.name).join(", ")} and three more.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <Link to="/shop" className="inline-flex">
                <Button variant="ember" size="lg" tabIndex={-1}>
                  Shop the shelf
                  <IconArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <button type="button" onClick={() => scrollToSection("origins")} className="inline-flex">
                <Button variant="ghost" size="lg" className="border-cream/25 text-cream hover:border-cream/60 hover:bg-cream/5">
                  Meet the origins
                </Button>
              </button>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

/* ---------------- roast log: curve drawn by scroll + counters ---------------- */

const CURVE = "M 24 296 C 90 294 128 238 176 200 C 224 162 258 150 306 118 C 348 90 400 60 456 36";
const STAGES = [
  { at: 0.02, name: "Charge", note: "196 °C drum, beans drop in" },
  { at: 0.3, name: "Turning point", note: "the bean gives its heat back" },
  { at: 0.66, name: "First crack", note: "we ride it, never rush it" },
  { at: 0.98, name: "Drop & cool", note: "four minutes to room temp" },
];

function RoastLog() {
  const [wrapRef, raw] = useElementProgress<HTMLDivElement>(1);
  const pathRef = useRef<SVGPathElement>(null);
  const [len, setLen] = useState(0);
  const reduced = prefersReducedMotion();
  const p = reduced ? 1 : 1 - Math.pow(1 - raw, 2);
  const activeIdx = reduced ? STAGES.length - 1 : Math.min(STAGES.length - 1, Math.floor(p * STAGES.length));

  useEffect(() => {
    if (pathRef.current) setLen(pathRef.current.getTotalLength());
  }, []);

  const point = len && pathRef.current ? pathRef.current.getPointAtLength(len * p) : null;
  const temp = Math.round(96 + (196 - 96) * Math.pow(p, 0.9));
  const secs = Math.round(p * 660);
  const clock = `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, "0")}`;

  return (
    <section className="border-y border-seam bg-coal text-cream">
      <div ref={wrapRef} className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-[1.25fr_1fr] lg:gap-16">
          {/* chart */}
          <div className="relative overflow-hidden rounded-xl border border-seam bg-soot p-5 sm:p-7">
            <div className="flex items-center justify-between gap-4">
              <p className="tick-label flex items-center gap-2 text-ember">
                <span className="anim-pulse-dot inline-block h-2 w-2 rounded-full bg-ember" aria-hidden="true" />
                Drum 01 — Wednesday's log
              </p>
              <p className="font-mono text-sm tabular-nums text-caramel">
                {temp} °C <span className="text-cream/40">· {clock}</span>
              </p>
            </div>
            <svg viewBox="0 0 480 320" className="mt-5 h-auto w-full" role="img" aria-label="Roast temperature curve climbing from 96 to 196 degrees as the roast progresses">
              <defs>
                <linearGradient id="roast-grad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#c89048" />
                  <stop offset="100%" stopColor="#d4552a" />
                </linearGradient>
              </defs>
              {[60, 120, 180, 240].map((y) => (
                <line key={y} x1="16" y1={y} x2="464" y2={y} stroke="#faf4e6" strokeOpacity="0.07" strokeDasharray="2 6" />
              ))}
              <text x="16" y="52" fontFamily="var(--font-sans)" fontSize="10" fill="#faf4e6" opacity="0.3">200°</text>
              <text x="16" y="172" fontFamily="var(--font-sans)" fontSize="10" fill="#faf4e6" opacity="0.3">150°</text>
              <text x="16" y="292" fontFamily="var(--font-sans)" fontSize="10" fill="#faf4e6" opacity="0.3">100°</text>
              <path d={CURVE} fill="none" stroke="#faf4e6" strokeOpacity="0.12" strokeWidth="3" strokeLinecap="round" />
              <path
                ref={pathRef}
                d={CURVE}
                fill="none"
                stroke="url(#roast-grad)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={len || 1000}
                strokeDashoffset={(len || 1000) * (1 - p)}
              />
              {len && pathRef.current
                ? STAGES.map((s) => {
                    const pt = pathRef.current!.getPointAtLength(len * s.at);
                    return <circle key={s.name} cx={pt.x} cy={pt.y} r="4.5" fill={p >= s.at ? "#d4552a" : "#3a2b1c"} stroke="#150e08" strokeWidth="2" />;
                  })
                : null}
              {point ? (
                <g>
                  <circle cx={point.x} cy={point.y} r="10" fill="none" stroke="#d4552a" strokeOpacity="0.4" strokeWidth="2" />
                  <circle cx={point.x} cy={point.y} r="5" fill="#d4552a" stroke="#150e08" strokeWidth="2" />
                </g>
              ) : null}
            </svg>
          </div>

          {/* stages */}
          <div>
            <SectionHead
              dark
              overline="Read the roast"
              title={<>Scroll, and watch<br />the curve climb.</>}
              copy="Every batch is a temperature story. This one is Wednesday's Ember Blend — keep scrolling and the drum will tell it to you."
            />
            <ol className="mt-8">
              {STAGES.map((s, i) => (
                <li key={s.name} className="relative flex gap-4 pb-7 last:pb-0">
                  {i < STAGES.length - 1 ? <span className="absolute left-[7px] top-5 h-full w-px bg-seam" aria-hidden="true" /> : null}
                  <span
                    className={`relative z-10 mt-1 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-300 ${
                      i <= activeIdx ? "border-ember bg-ember" : "border-seam bg-coal"
                    }`}
                    aria-hidden="true"
                  />
                  <div>
                    <p className={`font-display text-lg font-semibold transition-colors duration-300 ${i <= activeIdx ? "text-cream" : "text-cream/35"}`}>
                      {s.name}
                    </p>
                    <p className="text-sm text-cream/45">{s.note}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>

      <StatsBand />
    </section>
  );
}

const STATS: [number, string, string][] = [
  [11, "min", "average roast time"],
  [96, "°C", "charge temperature"],
  [196, "°C", "drop temperature"],
  [12, "kg", "batch size"],
];

function StatItem({ value, unit, label }: { value: number; unit: string; label: string }) {
  const [ref, inView] = useInViewOnce<HTMLDivElement>(0.4);
  const v = useCountUp(value, inView, 1400);
  return (
    <div ref={ref} className="px-6 py-8 text-center sm:py-10">
      <p className="font-display text-4xl font-semibold tabular-nums text-cream sm:text-5xl">
        {Math.round(v)}
        <span className="text-caramel">{unit}</span>
      </p>
      <p className="tick-label mt-2 text-cream/40">{label}</p>
    </div>
  );
}

function StatsBand() {
  return (
    <div className="border-t border-seam bg-espresso">
      <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-seam lg:grid-cols-4">
        {STATS.map(([v, u, l]) => (
          <StatItem key={l} value={v} unit={u} label={l} />
        ))}
      </div>
    </div>
  );
}

/* ---------------- brew guide interactive (tabs + animated panel) ---------------- */

function BrewTab({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`rounded-full border px-4 py-2 text-[13px] font-semibold transition-all duration-200 active:scale-95 ${
        active
          ? "border-espresso bg-espresso text-cream shadow-lift"
          : "border-line bg-cream text-cocoa hover:border-cocoa/60 hover:text-ink"
      }`}
    >
      {label}
    </button>
  );
}

function BrewPanel() {
  const [activeId, setActiveId] = useState(BREW_METHODS[0].id);
  const method = BREW_METHODS.find((m) => m.id === activeId) ?? BREW_METHODS[0];

  return (
    <Reveal delay={100}>
      <div className="rounded-xl border border-line bg-cream p-6 sm:p-8">
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Brew methods">
          {BREW_METHODS.map((m) => (
            <BrewTab key={m.id} active={m.id === activeId} label={m.name} onClick={() => setActiveId(m.id)} />
          ))}
        </div>

        <div key={method.id} className="anim-slideup mt-8" role="tabpanel" aria-label={method.name}>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4">
            {[
              ["Ratio", method.ratio],
              ["Grind", method.grind],
              ["Water", method.temp],
              ["Time", method.time],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="tick-label text-latte">{label}</dt>
                <dd className="mt-2 font-display text-2xl font-semibold text-ink">{value}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-8 rounded-lg border border-dashed border-caramel/60 bg-parchment px-4 py-3.5 text-sm leading-relaxed text-cocoa">
            <span className="font-bold text-ember">Bar note — </span>
            {method.note}
          </p>
        </div>
      </div>
    </Reveal>
  );
}
