import { useEffect, useRef, useState } from "react";
import type { CSSProperties, RefObject } from "react";
import type { Product } from "../data/products";
import { getProduct, relatedProducts, ROAST_LABELS } from "../data/products";
import { Link } from "../lib/router";
import { formatPrice, roastDayLabel, prefersReducedMotion } from "../lib/utils";
import { MAX_QTY, useCart } from "../state/CartContext";
import { useToast } from "../state/ToastContext";
import { Parallax } from "../lib/scrollMotion";
import { Reveal } from "../components/Reveal";
import { ProductCard } from "../components/ProductCard";
import { BagArt, Bean, Motif } from "../components/illustrations";
import { Button, ProductBadge, RoastMeter, Stepper } from "../components/ui";
import { IconArrowLeft, IconArrowRight, IconBag, IconCheck } from "../components/icons";

export function ProductDetail({ slug }: { slug: string | undefined }) {
  const product = getProduct(slug);

  if (!product) {
    return (
      <div className="mx-auto max-w-lg px-4 py-28 text-center">
        <p className="font-display text-6xl font-semibold text-caramel/60">404</p>
        <h1 className="mt-4 font-display text-3xl font-semibold text-ink">This page got over-extracted.</h1>
        <p className="mt-3 text-sm leading-relaxed text-cocoa">
          The coffee you're looking for isn't on the shelf — it may have rotated out this week.
        </p>
        <Link to="/shop" className="mt-8 inline-flex">
          <Button variant="primary" tabIndex={-1}>
            <IconArrowLeft className="h-4 w-4" />
            Back to the shelf
          </Button>
        </Link>
      </div>
    );
  }

  return <Detail product={product} />;
}

/* the bag leans gently with scroll position — direct DOM, cheap */
function useBagTiltFx(): { panelRef: RefObject<HTMLDivElement>; bagRef: RefObject<HTMLDivElement> } {
  const panelRef = useRef<HTMLDivElement>(null);
  const bagRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (prefersReducedMotion()) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const panel = panelRef.current;
      const bag = bagRef.current;
      if (!panel || !bag) return;
      const rect = panel.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      const centerOffset = rect.top + rect.height / 2 - window.innerHeight / 2;
      const rot = Math.max(-6, Math.min(6, (centerOffset / window.innerHeight) * 9));
      bag.style.transform = `rotate(${rot.toFixed(2)}deg)`;
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
  return { panelRef, bagRef };
}

function Detail({ product }: { product: Product }) {
  const { add, openCart } = useCart();
  const { push } = useToast();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const { panelRef, bagRef } = useBagTiltFx();

  const handleAdd = () => {
    const { clamped } = add(product.slug, qty);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
    push({
      title: `${qty} × ${product.name} added`,
      message: clamped ? "You've hit the limit of 10 bags per coffee." : undefined,
      tone: "success",
      action: { label: "View cart", onClick: openCart },
    });
  };

  const related = relatedProducts(product);

  const meta: [string, string][] = [
    ["Origin", product.origin.country],
    ["Region", product.origin.region],
    ["Producer", product.origin.producer],
    ["Process", product.process],
    ["Variety", product.variety],
    ["Altitude", product.altitude],
    ["Harvest", product.harvest],
  ];

  return (
    <div className="pb-24 lg:pb-20">
      {/* breadcrumb */}
      <nav aria-label="Breadcrumb" className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <ol className="flex flex-wrap items-center gap-2 text-xs font-semibold text-latte">
          <li>
            <Link to="/shop" className="transition-colors hover:text-ember">
              The shelf
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link to={`/shop?cat=${product.category}`} className="capitalize transition-colors hover:text-ember">
              {product.category === "decaf" ? "Decaf" : `${product.category} roasts`}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-ink">{product.name}</li>
        </ol>
      </nav>

      <div className="mx-auto mt-6 grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_1.05fr] lg:gap-14 lg:px-8">
        {/* ---------- visual — dark gradient stage ---------- */}
        <Reveal variant="scale">
          <div
            ref={panelRef}
            className="relative overflow-hidden rounded-xl border border-seam"
            style={{
              background: `radial-gradient(130% 110% at 22% 0%, ${product.accent}3d 0%, transparent 58%), linear-gradient(165deg, ${product.accentDeep}2c 0%, #150e08 72%)`,
            }}
          >
            <Parallax speed={0.12} className="pointer-events-none absolute -left-16 -top-16 h-64 w-64">
              <Motif kind={product.motif} className="h-full w-full opacity-[0.16]" style={{ color: product.accent }} />
            </Parallax>
            <Parallax speed={-0.08} className="pointer-events-none absolute -bottom-20 -right-14 h-72 w-72">
              <Motif kind={product.motif} className="h-full w-full opacity-[0.1]" style={{ color: product.accentDeep }} />
            </Parallax>
            <svg viewBox="-50 -50 100 100" className="pointer-events-none absolute right-[10%] top-10 hidden h-14 w-14 text-caramel/80 sm:block" aria-hidden="true">
              <Bean x={0} y={0} rotate={30} delay={0.5} />
            </svg>

            {product.badge ? (
              <div className="absolute left-5 top-5 z-10">
                <ProductBadge accent={product.accent}>{product.badge}</ProductBadge>
              </div>
            ) : null}

            <div className="flex items-center justify-center px-6 pb-12 pt-14 sm:pt-16">
              <div className="anim-floaty-slow w-[240px] sm:w-[280px]" style={{ "--fl-rot": "-2deg" } as CSSProperties}>
                <div
                  className="anim-glow pointer-events-none absolute bottom-8 left-1/2 h-12 w-3/4 rounded-[100%]"
                  style={{ background: `radial-gradient(closest-side, ${product.accent}59, transparent 72%)` }}
                  aria-hidden="true"
                />
                <div ref={bagRef} className="will-change-transform">
                  <BagArt product={product} className="h-auto w-full drop-shadow-[0_26px_32px_rgba(0,0,0,0.55)]" />
                </div>
              </div>
            </div>

            <div className="relative border-t border-seam bg-coal/85 px-5 py-3.5 text-center text-xs font-semibold text-cream/60">
              Roasted <span className="text-cream">{roastDayLabel()}</span> · ships within 48 hours · {product.weight} whole bean
            </div>
          </div>
        </Reveal>

        {/* ---------- info ---------- */}
        <div>
          <Reveal>
            <p className="tick-label" style={{ color: product.accent }}>
              {product.category === "decaf" ? "Decaf" : `${product.category} roast`} · {ROAST_LABELS[product.roast]} · {product.process}
            </p>
            <h1 className="mt-3 font-display text-4xl font-semibold leading-[1.02] tracking-tight text-ink sm:text-5xl">
              {product.name}
            </h1>
            <p className="mt-4 text-[15px] leading-relaxed text-cocoa sm:text-base">{product.tagline}</p>

            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
              <p className="font-display text-3xl font-semibold tabular-nums text-ink">
                {formatPrice(product.price)}
                <span className="ml-2 font-sans text-sm font-medium text-latte">/ {product.weight}</span>
              </p>
              <p className="flex items-center gap-2 text-xs font-bold text-success">
                <span className="anim-pulse-dot inline-block h-2 w-2 rounded-full bg-success" aria-hidden="true" />
                In stock — ships Thursday
              </p>
            </div>
          </Reveal>

          {/* tasting notes */}
          <Reveal delay={60}>
            <div className="mt-7 rounded-xl border border-line bg-cream p-5">
              <p className="tick-label text-latte">In the cup</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {product.notes.map((note) => (
                  <li
                    key={note}
                    className="rounded-full border px-4 py-1.5 text-sm font-semibold transition-transform duration-200 hover:scale-105"
                    style={{ color: product.accentDeep, borderColor: `${product.accent}55`, backgroundColor: product.tint }}
                  >
                    {note}
                  </li>
                ))}
              </ul>
              <RoastMeter roast={product.roast} className="mt-4" />
            </div>
          </Reveal>

          {/* buy controls */}
          <Reveal delay={100}>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <Stepper
                qty={qty}
                max={MAX_QTY}
                label={`${product.name} quantity`}
                onDecrement={() => setQty((v) => Math.max(1, v - 1))}
                onIncrement={() => {
                  if (qty >= MAX_QTY) {
                    push({ title: `Max ${MAX_QTY} bags per coffee`, message: "The shelf is small — let someone else have some." });
                    return;
                  }
                  setQty((v) => v + 1);
                }}
              />
              <Button
                variant="ember"
                size="lg"
                className="min-w-[220px] flex-1 sm:flex-none"
                style={added ? { backgroundColor: "var(--color-success)" } : undefined}
                onClick={handleAdd}
              >
                {added ? (
                  <>
                    <IconCheck className="h-4 w-4" />
                    Added to cart
                  </>
                ) : (
                  <>
                    <IconBag className="h-4 w-4" />
                    Add {qty > 1 ? `${qty} bags` : "to cart"} — {formatPrice(product.price * qty)}
                  </>
                )}
              </Button>
            </div>
          </Reveal>

          {/* meta */}
          <Reveal delay={140}>
            <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-line pt-6 sm:grid-cols-3">
              {meta.map(([label, value]) => (
                <div key={label}>
                  <dt className="tick-label text-latte">{label}</dt>
                  <dd className="mt-1 text-sm font-semibold text-ink">{value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>

          {/* brew */}
          <Reveal delay={180}>
            <div className="mt-8">
              <h2 className="font-display text-xl font-semibold text-ink">How we'd brew it</h2>
              <div className="mt-3 overflow-x-auto rounded-xl border border-line">
                <table className="w-full min-w-[440px] text-left text-sm">
                  <thead>
                    <tr className="bg-parchment-deep/70 text-[11px] uppercase tracking-wider text-cocoa">
                      <th scope="col" className="px-4 py-2.5 font-bold">Method</th>
                      <th scope="col" className="px-4 py-2.5 font-bold">Ratio</th>
                      <th scope="col" className="px-4 py-2.5 font-bold">Water</th>
                      <th scope="col" className="px-4 py-2.5 font-bold">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line bg-cream">
                    {product.brew.map((b) => (
                      <tr key={b.method} className="transition-colors hover:bg-parchment/70">
                        <th scope="row" className="px-4 py-3 font-semibold text-ink">{b.method}</th>
                        <td className="px-4 py-3 tabular-nums text-cocoa">{b.ratio}</td>
                        <td className="px-4 py-3 text-cocoa">{b.temp}</td>
                        <td className="px-4 py-3 tabular-nums text-cocoa">{b.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Reveal>

          {/* story */}
          <Reveal delay={220}>
            <div className="mt-8">
              <h2 className="font-display text-xl font-semibold text-ink">From the roaster</h2>
              <div className="mt-3 space-y-4">
                {product.story.map((para, i) => (
                  <p key={i} className="text-[15px] leading-relaxed text-cocoa">
                    {i === 0 ? <span className="font-display text-lg font-semibold italic text-ink">{para.split(". ")[0]}. </span> : null}
                    {i === 0 ? para.split(". ").slice(1).join(". ") : para}
                  </p>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      {/* related */}
      <div className="mx-auto mt-20 max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="flex items-end justify-between gap-4">
            <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">Pairs well with</h2>
            <Link to="/shop" className="inline-flex items-center gap-1.5 text-sm font-bold uppercase tracking-wider text-ember transition-colors hover:text-ember-deep">
              Full shelf
              <IconArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((p, i) => (
            <Reveal key={p.slug} delay={i * 70}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      </div>

      {/* sticky mobile buy bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-cream/95 px-4 py-3 backdrop-blur-sm lg:hidden">
        <div className="mx-auto flex max-w-lg items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="truncate font-display text-base font-semibold text-ink">{product.name}</p>
            <p className="text-xs text-latte">
              {qty} × {formatPrice(product.price)} = <span className="font-bold text-ink">{formatPrice(product.price * qty)}</span>
            </p>
          </div>
          <Button
            variant="ember"
            style={added ? { backgroundColor: "var(--color-success)" } : undefined}
            onClick={handleAdd}
          >
            {added ? <IconCheck className="h-4 w-4" /> : <IconBag className="h-4 w-4" />}
            {added ? "Added" : "Add to cart"}
          </Button>
        </div>
      </div>
    </div>
  );
}
