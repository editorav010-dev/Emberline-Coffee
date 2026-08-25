import { useRef, useState } from "react";
import type { CSSProperties, PointerEvent } from "react";
import type { Product } from "../data/products";
import { ROAST_LABELS } from "../data/products";
import { useCart } from "../state/CartContext";
import { useToast } from "../state/ToastContext";
import { formatPrice, prefersReducedMotion } from "../lib/utils";
import { IconCheck, IconPlus } from "./icons";
import { BagArt, Motif } from "./illustrations";
import { ProductBadge } from "./ui";

export function ProductCard({ product }: { product: Product }) {
  const { add, openCart } = useCart();
  const { push } = useToast();
  const [added, setAdded] = useState(false);
  const tiltRef = useRef<HTMLDivElement>(null);

  const handleAdd = () => {
    const { clamped } = add(product.slug);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1300);
    push({
      title: `${product.name} added to cart`,
      message: clamped ? "You've hit the limit of 10 bags per coffee." : `${formatPrice(product.price)} · ${product.weight}`,
      tone: "success",
      action: { label: "View cart", onClick: openCart },
    });
  };

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const el = tiltRef.current;
    if (!el || prefersReducedMotion()) return;
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(700px) rotateY(${(px * 8).toFixed(2)}deg) rotateX(${(-py * 8).toFixed(2)}deg)`;
  };

  const onLeave = () => {
    if (tiltRef.current) tiltRef.current.style.transform = "";
  };

  return (
    <article
      className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-seam bg-soot transition-all duration-300 hover:-translate-y-1.5 hover:border-caramel/60 hover:shadow-night"
      style={{ "--acc": product.accent } as CSSProperties}
    >
      {/* stretched link to the product page */}
      <a
        href={`#/coffee/${product.slug}`}
        className="absolute inset-0 z-0 rounded-xl"
        aria-label={`View ${product.name} — ${formatPrice(product.price)}`}
      />

      {/* visual — per-coffee gradient stage */}
      <div
        className="relative h-56 overflow-hidden sm:h-60"
        style={{
          background: `radial-gradient(130% 100% at 50% -12%, ${product.accent}4d 0%, transparent 62%), linear-gradient(180deg, ${product.accentDeep}30 0%, #140d07 90%)`,
        }}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
      >
        <Motif
          kind={product.motif}
          className="absolute -right-8 -top-8 h-36 w-36 opacity-[0.22] transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110"
          style={{ color: product.accent }}
        />
        {/* glow pool under the bag */}
        <div
          className="anim-glow pointer-events-none absolute bottom-5 left-1/2 h-10 w-3/5 rounded-[100%]"
          style={{ background: `radial-gradient(closest-side, ${product.accent}59, transparent 72%)` }}
          aria-hidden="true"
        />
        <div ref={tiltRef} className="absolute inset-0 flex items-end justify-center" style={{ willChange: "transform" }}>
          <div className="h-[94%] transition-transform duration-500 ease-[cubic-bezier(0.22,0.68,0.28,1)] group-hover:-translate-y-2 group-hover:rotate-[-2.5deg]">
            <BagArt product={product} className="h-full w-auto drop-shadow-[0_18px_24px_rgba(0,0,0,0.5)]" />
          </div>
        </div>
        {product.badge ? (
          <div className="pointer-events-none absolute left-3 top-3 z-10">
            <ProductBadge accent={product.accent}>{product.badge}</ProductBadge>
          </div>
        ) : null}
      </div>

      {/* info */}
      <div className="pointer-events-none relative z-10 flex flex-1 flex-col p-5">
        <div className="flex items-baseline justify-between gap-3">
          <p className="tick-label text-cream/40">
            {ROAST_LABELS[product.roast]} · {product.process}
          </p>
          <p className="font-display text-lg font-semibold tabular-nums text-cream">{formatPrice(product.price)}</p>
        </div>
        <h3 className="acc-hover mt-1.5 font-display text-[1.4rem] font-semibold leading-tight text-cream">
          {product.name}
        </h3>
        <p className="mt-1 text-xs font-medium text-cream/50">
          {product.origin.country}
          {product.origin.region ? ` · ${product.origin.region}` : ""}
        </p>

        <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Tasting notes">
          {product.notes.slice(0, 3).map((note) => (
            <li key={note} className="rounded-full border border-seam bg-coal/70 px-2.5 py-0.5 text-[11px] font-semibold text-cream/70">
              {note}
            </li>
          ))}
        </ul>

        <div className="mt-auto flex items-center justify-between pt-4">
          <span className="text-xs text-cream/35">{product.weight} whole bean</span>
          <button
            type="button"
            onClick={handleAdd}
            className="pointer-events-auto inline-flex h-11 items-center gap-1.5 rounded-full px-4 text-xs font-bold uppercase tracking-wider text-cream shadow-night transition-all duration-300 hover:brightness-110 active:scale-90"
            style={
              added
                ? { backgroundColor: "var(--color-success)" }
                : { backgroundImage: `linear-gradient(120deg, ${product.accent}, ${product.accentDeep})` }
            }
            aria-label={`Add ${product.name} to cart`}
          >
            {added ? (
              <>
                <IconCheck className="h-4 w-4" /> Added
              </>
            ) : (
              <>
                <IconPlus className="h-4 w-4" /> Add
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
