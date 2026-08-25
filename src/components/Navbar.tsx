import { useEffect, useRef, useState } from "react";
import { Link, scrollToSection, useRoute } from "../lib/router";
import { useCart } from "../state/CartContext";
import { cx } from "../lib/utils";
import { IconBag, IconBean, IconClose } from "./icons";

const TICKER = [
  "Roasted every Tuesday",
  "Free shipping over $45",
  "Whole bean · 250 g",
  "Ships within 48 hours",
  "Six coffees. Never more.",
];

export function Navbar() {
  const { count, bumpKey, openCart } = useCart();
  const route = useRoute();
  const [menuOpen, setMenuOpen] = useState(false);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => setMenuOpen(false), [route.path, route.query.toString()]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    if (menuOpen) firstLinkRef.current?.focus();
  }, [menuOpen]);

  const linkBase = "text-sm font-semibold transition-colors duration-200";
  const active = route.path.startsWith("/shop") || route.parts[0] === "coffee";

  return (
    <>
      <div className="overflow-hidden border-b border-seam bg-[#100a06] py-1.5 text-center" aria-hidden="true">
        <p className="tick-label whitespace-nowrap text-caramel/75">
          {TICKER.join("  ·  ")}
        </p>
      </div>

      <header className="sticky top-0 z-[60] border-b border-seam bg-coal/95 backdrop-blur-sm">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8" aria-label="Main">
          <Link to="/" className="group flex items-center gap-2.5" aria-label="Emberline home">
            <IconBean className="h-7 w-7 text-ember transition-transform duration-300 group-hover:rotate-[18deg]" />
            <span className="font-display text-[1.35rem] font-semibold leading-none text-cream">
              Emberline<span className="text-ember">.</span>
            </span>
          </Link>

          <div className="hidden items-center gap-7 md:flex">
            <Link to="/shop" className={cx(linkBase, active ? "text-caramel" : "text-cream/65 hover:text-cream")}>
              The shelf
            </Link>
            <button type="button" onClick={() => scrollToSection("story")} className={cx(linkBase, "text-cream/65 hover:text-cream")}>
              Roastery
            </button>
            <button type="button" onClick={() => scrollToSection("origins")} className={cx(linkBase, "text-cream/65 hover:text-cream")}>
              Origins
            </button>
            <button type="button" onClick={() => scrollToSection("brew")} className={cx(linkBase, "text-cream/65 hover:text-cream")}>
              Brew guide
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={openCart}
              className="relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-seam bg-soot text-cream transition-all duration-200 hover:border-caramel hover:text-caramel active:scale-90"
              aria-label={`Open cart, ${count} item${count === 1 ? "" : "s"}`}
            >
              <IconBag className="h-5 w-5" />
              {count > 0 ? (
                <span
                  key={bumpKey}
                  className="anim-bump absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-ember px-1 text-[11px] font-bold text-cream"
                >
                  {count > 99 ? "99+" : count}
                </span>
              ) : null}
            </button>

            <button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-seam bg-soot text-cream transition-all duration-200 hover:border-caramel active:scale-90 md:hidden"
              aria-expanded={menuOpen}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMenuOpen((v) => !v)}
            >
              {menuOpen ? (
                <IconClose className="h-5 w-5" />
              ) : (
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                  <path d="M4 7h16M4 12h16M4 17h10" />
                </svg>
              )}
            </button>
          </div>
        </nav>

        {/* mobile menu */}
        {menuOpen ? (
          <div className="anim-fadein border-t border-seam bg-coal md:hidden">
            <nav className="mx-auto flex max-w-7xl flex-col px-4 py-4 sm:px-6" aria-label="Mobile">
              <a ref={firstLinkRef} href="#/shop" className={cx("py-3 font-display text-2xl font-semibold", active ? "text-caramel" : "text-cream")}>
                The shelf
              </a>
              <div className="flex flex-wrap gap-2 pb-4 pl-1">
                {[
                  ["Filter roasts", "/shop?cat=filter"],
                  ["Espresso", "/shop?cat=espresso"],
                  ["Decaf", "/shop?cat=decaf"],
                ].map(([label, to]) => (
                  <Link key={to} to={to} className="rounded-full border border-seam px-3 py-1 text-xs font-semibold text-cream/55">
                    {label}
                  </Link>
                ))}
              </div>
              {[
                ["Roastery", "story"],
                ["Origins", "origins"],
                ["Brew guide", "brew"],
                ["How we roast", "process"],
              ].map(([label, id]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    scrollToSection(id);
                  }}
                  className="border-t border-seam py-3 text-left font-display text-2xl font-semibold text-cream/85"
                >
                  {label}
                </button>
              ))}
            </nav>
          </div>
        ) : null}
      </header>
    </>
  );
}
