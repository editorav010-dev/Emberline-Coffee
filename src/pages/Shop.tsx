import { useEffect, useMemo, useState } from "react";
import type { Category, Product } from "../data/products";
import { CATEGORIES, PRODUCTS } from "../data/products";
import { useRoute } from "../lib/router";
import { cx } from "../lib/utils";
import { Parallax } from "../lib/scrollMotion";
import { Reveal } from "../components/Reveal";
import { ProductCard } from "../components/ProductCard";
import { Chip } from "../components/ui";
import { CoffeeRings, TinyCup } from "../components/illustrations";
import { IconChevronDown, IconClose, IconSearch } from "../components/icons";
import { Button } from "../components/ui";

type Sort = "featured" | "price-asc" | "price-desc" | "roast";

function normalize(s: string): string {
  return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function matches(p: Product, q: string): boolean {
  const hay = normalize([p.name, p.origin.country, p.origin.region, p.process, p.category, ...p.notes].join(" "));
  return q
    .split(/\s+/)
    .filter(Boolean)
    .every((token) => hay.includes(token));
}

export function Shop() {
  const route = useRoute();
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<Sort>("featured");

  const catParam = route.query.get("cat");
  const cat: Category | "all" =
    catParam === "filter" || catParam === "espresso" || catParam === "decaf" ? catParam : "all";
  const setCat = (next: Category | "all") => {
    const q = route.query.get("q");
    window.location.hash = next === "all" ? (q ? `/shop?q=${encodeURIComponent(q)}` : "/shop") : `/shop?cat=${next}`;
  };

  useEffect(() => {
    setQuery(route.query.get("q") ?? "");
  }, [route.query]);

  const results = useMemo(() => {
    let list = PRODUCTS.filter((p) => (cat === "all" ? true : p.category === cat));
    if (query.trim()) list = list.filter((p) => matches(p, query.trim()));
    switch (sort) {
      case "price-asc":
        return [...list].sort((a, b) => a.price - b.price);
      case "price-desc":
        return [...list].sort((a, b) => b.price - a.price);
      case "roast":
        return [...list].sort((a, b) => a.roast - b.roast);
      default:
        return list;
    }
  }, [cat, query, sort]);

  const submitSearch = (value: string) => {
    const params = new URLSearchParams();
    if (cat !== "all") params.set("cat", cat);
    if (value.trim()) params.set("q", value.trim());
    window.location.hash = params.toString() ? `/shop?${params.toString()}` : "/shop";
  };

  return (
    <div className="relative bg-coal">
      <div className="relative mx-auto max-w-7xl overflow-x-clip px-4 pb-20 pt-12 sm:px-6 lg:px-8 lg:pt-16">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-[radial-gradient(70%_100%_at_50%_0%,rgba(212,85,42,0.09),transparent_70%)]" aria-hidden="true" />
        <div className="pointer-events-none absolute -right-40 -top-10 hidden h-[380px] w-[380px] text-caramel/20 lg:block">
          <Parallax speed={0.18} className="h-full w-full">
            <CoffeeRings className="h-full w-full" />
          </Parallax>
        </div>

        {/* header */}
        <Reveal>
          <div className="max-w-2xl">
            <p className="tick-label flex items-center gap-2.5 text-caramel">
              <span className="inline-block h-px w-8 bg-current" aria-hidden="true" />
              Roasted this Tuesday
            </p>
            <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight text-cream sm:text-5xl lg:text-6xl">
              The coffee shelf<span className="text-ember">.</span>
            </h1>
            <p className="mt-4 text-[15px] leading-relaxed text-cream/55">
              {CATEGORIES.find((c) => c.id === cat)?.blurb} Every bag is 250 g of whole bean, stamped with its roast
              date, and shipped within 48 hours of the drum stopping.
            </p>
          </div>
        </Reveal>

        {/* controls */}
        <Reveal delay={80}>
          <div className="mt-10 space-y-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="relative w-full max-w-md">
                <IconSearch className="pointer-events-none absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-cream/35" />
                <input
                  type="search"
                  role="searchbox"
                  aria-label="Search coffees by name, origin or tasting note"
                  placeholder="Search origin, note, name…"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    submitSearch(e.target.value);
                  }}
                  className="w-full rounded-xl border border-seam bg-soot py-3 pl-11 pr-11 text-sm text-cream placeholder:text-cream/30 transition-colors focus:border-ember focus:outline-none [&::-webkit-search-cancel-button]:hidden"
                />
                {query ? (
                  <button
                    type="button"
                    onClick={() => {
                      setQuery("");
                      submitSearch("");
                    }}
                    aria-label="Clear search"
                    className="absolute right-3 top-1/2 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full border border-seam bg-coal text-cream/60 transition-all hover:text-cream active:scale-90"
                  >
                    <IconClose className="h-3.5 w-3.5" />
                  </button>
                ) : null}
              </div>

              <div className="flex items-center gap-3">
                <label htmlFor="sort" className="text-xs font-semibold uppercase tracking-wider text-cream/45">
                  Sort
                </label>
                <div className="relative">
                  <select
                    id="sort"
                    value={sort}
                    onChange={(e) => setSort(e.target.value as Sort)}
                    className="cursor-pointer appearance-none rounded-lg border border-seam bg-soot py-2 pl-3.5 pr-9 text-sm font-semibold text-cream transition-colors focus:border-ember focus:outline-none"
                  >
                    <option value="featured">Featured</option>
                    <option value="price-asc">Price — low to high</option>
                    <option value="price-desc">Price — high to low</option>
                    <option value="roast">Roast — light to dark</option>
                  </select>
                  <IconChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-cream/45" />
                </div>
              </div>
            </div>

            <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0" role="group" aria-label="Filter by category">
              {CATEGORIES.map((c) => (
                <Chip
                  key={c.id}
                  active={cat === c.id}
                  onClick={() => setCat(c.id)}
                  count={PRODUCTS.filter((p) => (c.id === "all" ? true : p.category === c.id)).length}
                >
                  {c.label}
                </Chip>
              ))}
            </div>
          </div>
        </Reveal>

        {/* results meta */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-3" aria-live="polite">
          <p className="text-sm text-cream/45">
            <span className="font-bold text-cream">{results.length}</span>{" "}
            coffee{results.length === 1 ? "" : "s"}
            {query.trim() ? (
              <>
                {" "}for “<span className="font-semibold text-caramel">{query.trim()}</span>”
              </>
            ) : null}
          </p>
          {cat !== "all" ? (
            <button
              type="button"
              onClick={() => setCat("all")}
              className="text-sm font-semibold text-caramel underline-offset-4 hover:underline"
            >
              Show all categories
            </button>
          ) : null}
        </div>

        {/* grid / empty state */}
        {results.length > 0 ? (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {results.map((p, i) => (
              <Reveal key={`${cat}-${sort}-${p.slug}`} delay={(i % 3) * 70}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="anim-fadein mt-10 flex flex-col items-center rounded-xl border border-seam bg-soot/60 px-6 py-16 text-center">
            <TinyCup className="h-24 w-28 text-caramel/70" />
            <h2 className="mt-6 font-display text-2xl font-semibold text-cream">No beans match that pour.</h2>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-cream/50">
              Nothing on this week's shelf matches {query.trim() ? `“${query.trim()}”` : "those filters"}. Try a
              tasting note like “chocolate”, or clear the search and browse everything.
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              {query.trim() ? (
                <Button
                  variant="cream"
                  onClick={() => {
                    setQuery("");
                    submitSearch("");
                  }}
                >
                  Clear search
                </Button>
              ) : null}
              <Button
                variant="ghost"
                className="border-seam text-cream/70 hover:border-caramel hover:bg-transparent hover:text-cream"
                onClick={() => setCat("all")}
              >
                Show all coffees
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
