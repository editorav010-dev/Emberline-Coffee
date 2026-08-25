import { useState } from "react";
import type { FormEvent } from "react";
import { Link, scrollToSection } from "../lib/router";
import { IconBean, IconCheck } from "./icons";
import { CoffeeRings, TinyCup } from "./illustrations";
import { Button } from "./ui";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function Footer() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "error" | "done">("idle");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!EMAIL_RE.test(email.trim())) {
      setState("error");
      return;
    }
    setState("done");
  };

  return (
    <footer className="relative overflow-hidden bg-coal text-cream">
      <CoffeeRings className="pointer-events-none absolute -right-24 -top-24 h-[420px] w-[420px] text-bark opacity-40" />
      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr_1fr_1.2fr]">
          {/* brand */}
          <div>
            <Link to="/" className="flex items-center gap-2.5" aria-label="Emberline home">
              <IconBean className="h-8 w-8 text-ember" />
              <span className="font-display text-2xl font-semibold">
                Emberline<span className="text-ember">.</span>
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-cream/55">
              A small-batch roastery in Portland, OR. Six coffees on the shelf at a time — roasted every Tuesday,
              shipped within 48 hours, gone by Friday.
            </p>
            <TinyCup className="mt-8 h-20 w-24 text-caramel/60" />
          </div>

          {/* shop links */}
          <nav aria-label="Shop">
            <p className="tick-label text-caramel">The shelf</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li><Link to="/shop" className="text-cream/65 transition-colors hover:text-cream">All coffees</Link></li>
              <li><Link to="/shop?cat=filter" className="text-cream/65 transition-colors hover:text-cream">Filter roasts</Link></li>
              <li><Link to="/shop?cat=espresso" className="text-cream/65 transition-colors hover:text-cream">Espresso roasts</Link></li>
              <li><Link to="/shop?cat=decaf" className="text-cream/65 transition-colors hover:text-cream">Decaf</Link></li>
            </ul>
          </nav>

          {/* roastery links */}
          <nav aria-label="Roastery">
            <p className="tick-label text-caramel">Roastery</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <button type="button" onClick={() => scrollToSection("story")} className="text-cream/65 transition-colors hover:text-cream">
                  Our story
                </button>
              </li>
              <li>
                <button type="button" onClick={() => scrollToSection("origins")} className="text-cream/65 transition-colors hover:text-cream">
                  The origins
                </button>
              </li>
              <li>
                <button type="button" onClick={() => scrollToSection("brew")} className="text-cream/65 transition-colors hover:text-cream">
                  Brew guide
                </button>
              </li>
              <li>
                <button type="button" onClick={() => scrollToSection("process")} className="text-cream/65 transition-colors hover:text-cream">
                  How we roast
                </button>
              </li>
            </ul>
          </nav>

          {/* newsletter */}
          <div>
            <p className="tick-label text-caramel">The Tuesday letter</p>
            <p className="mt-4 text-sm leading-relaxed text-cream/55">
              One short email on roast day: what's on the shelf, what's in the roaster, one brewing trick.
            </p>
            {state === "done" ? (
              <p className="anim-slideup mt-5 flex items-center gap-2.5 rounded-xl border border-sage/50 bg-sage/15 px-4 py-3 text-sm font-semibold text-cream">
                <IconCheck className="h-4 w-4 text-caramel" />
                You're in — first pour's on us.
              </p>
            ) : (
              <form onSubmit={submit} className="mt-5" noValidate>
                <div className="flex gap-2">
                  <label htmlFor="newsletter-email" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="newsletter-email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (state === "error") setState("idle");
                    }}
                    placeholder="you@example.com"
                    className="min-w-0 flex-1 rounded-[0.65rem] border border-seam bg-soot px-3.5 py-2.5 text-sm text-cream placeholder:text-cream/30 focus:border-caramel focus:outline-none"
                    aria-invalid={state === "error"}
                    aria-describedby={state === "error" ? "newsletter-err" : undefined}
                  />
                  <Button type="submit" variant="ember" size="md">
                    Join
                  </Button>
                </div>
                {state === "error" ? (
                  <p id="newsletter-err" role="alert" className="anim-fadein mt-2 text-xs font-medium text-ember">
                    That email doesn't look right — try again?
                  </p>
                ) : null}
              </form>
            )}
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-seam pt-6 text-xs text-cream/40 sm:flex-row sm:items-center">
          <p>© 2026 Emberline Roasting Co. All beans accounted for.</p>
          <p>Demo storefront — no real orders, charges, or beans are harmed.</p>
        </div>
      </div>
    </footer>
  );
}
