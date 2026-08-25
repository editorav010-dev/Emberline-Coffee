import { useEffect } from "react";
import { getProduct } from "../data/products";
import { Link } from "../lib/router";
import { formatPrice, cx } from "../lib/utils";
import { FREE_SHIPPING_AT, MAX_QTY, useCart } from "../state/CartContext";
import { useToast } from "../state/ToastContext";
import { Button, Stepper } from "./ui";
import { IconArrowRight, IconClose, IconTrash } from "./icons";
import { BagArt, TinyCup } from "./illustrations";

export function CartDrawer() {
  const { lines, count, subtotal, isOpen, closeCart, setQty, remove } = useCart();
  const { push } = useToast();

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, closeCart]);

  const toFree = FREE_SHIPPING_AT - subtotal;
  const progress = Math.min(1, subtotal / FREE_SHIPPING_AT);

  return (
    <div
      className={cx("fixed inset-0 z-[70]", !isOpen && "pointer-events-none")}
      aria-hidden={!isOpen}
    >
      {/* backdrop */}
      <button
        type="button"
        aria-label="Close cart"
        onClick={closeCart}
        tabIndex={isOpen ? 0 : -1}
        className={cx(
          "absolute inset-0 h-full w-full cursor-default bg-espresso/60 transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0",
        )}
      />

      {/* panel — visibility:hidden after slide-out so closed items leave the tab order */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className={cx(
          "absolute inset-y-0 right-0 flex w-full max-w-[420px] flex-col bg-parchment shadow-warm transition-[transform,visibility] duration-500 ease-[cubic-bezier(0.22,0.68,0.28,1)]",
          isOpen ? "visible translate-x-0" : "invisible translate-x-full",
        )}
      >
        <header className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="font-display text-xl font-semibold text-ink">
            Your bag
            {count > 0 ? <span className="ml-2 text-sm font-sans font-semibold text-latte">{count} item{count === 1 ? "" : "s"}</span> : null}
          </h2>
          <button
            type="button"
            onClick={closeCart}
            tabIndex={isOpen ? 0 : -1}
            aria-label="Close cart"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line bg-cream text-ink transition-all hover:border-cocoa active:scale-90"
          >
            <IconClose className="h-4.5 w-4.5" />
          </button>
        </header>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
            <TinyCup className="h-24 w-28 text-latte" />
            <p className="font-display text-2xl font-semibold text-ink">Your bag is empty</p>
            <p className="text-sm leading-relaxed text-cocoa">
              Six coffees are resting on the shelf right now. Go find the one with your name on it.
            </p>
            <Link to="/shop" className="mt-2 inline-flex" onClick={closeCart}>
              <Button variant="ember" tabIndex={isOpen ? 0 : -1}>
                Browse the shelf
                <IconArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        ) : (
          <>
            {/* free shipping progress */}
            <div className="border-b border-line bg-cream px-5 py-3.5">
              <p className="text-xs font-semibold text-cocoa">
                {toFree > 0 ? (
                  <>
                    <span className="text-ember">{formatPrice(toFree)}</span> away from free shipping
                  </>
                ) : (
                  <span className="text-success">Free standard shipping unlocked ✓</span>
                )}
              </p>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-line" role="presentation">
                <div
                  className={cx("h-full rounded-full transition-all duration-500", toFree > 0 ? "bg-ember" : "bg-success")}
                  style={{ width: `${progress * 100}%` }}
                />
              </div>
            </div>

            <ul className="flex-1 divide-y divide-line overflow-y-auto px-5">
              {lines.map((line) => {
                const product = getProduct(line.slug);
                if (!product) return null;
                return (
                  <li key={line.slug} className="anim-fadein flex gap-4 py-5">
                    <div
                      className="flex h-20 w-16 shrink-0 items-end justify-center overflow-hidden rounded-lg border border-line"
                      style={{ backgroundColor: product.tint }}
                      aria-hidden="true"
                    >
                      <BagArt product={product} withShadow={false} className="h-[96%] w-auto" />
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <Link
                            to={`/coffee/${product.slug}`}
                            onClick={closeCart}
                            tabIndex={isOpen ? 0 : -1}
                            className="block truncate font-display text-[1.05rem] font-semibold text-ink transition-colors hover:text-ember"
                          >
                            {product.name}
                          </Link>
                          <p className="mt-0.5 text-xs text-latte">
                            {product.weight} · {formatPrice(product.price)} each
                          </p>
                        </div>
                        <button
                          type="button"
                          tabIndex={isOpen ? 0 : -1}
                          onClick={() => {
                            remove(line.slug);
                            push({ title: `${product.name} removed`, tone: "default" });
                          }}
                          aria-label={`Remove ${product.name} from cart`}
                          className="rounded-full p-1.5 text-latte transition-all hover:bg-error/10 hover:text-error active:scale-90"
                        >
                          <IconTrash className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="mt-auto flex items-center justify-between pt-2">
                        <Stepper
                          size="sm"
                          qty={line.qty}
                          max={MAX_QTY}
                          label={`${product.name} quantity`}
                          onDecrement={() => setQty(line.slug, line.qty - 1)}
                          onIncrement={() => {
                            const { clamped } = setQty(line.slug, line.qty + 1);
                            if (clamped) push({ title: `Max ${MAX_QTY} bags per coffee`, tone: "default" });
                          }}
                        />
                        <span key={line.qty} className="anim-fadein font-display text-lg font-semibold tabular-nums text-ink">
                          {formatPrice(line.qty * product.price)}
                        </span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            <footer className="border-t border-line bg-cream px-5 py-5">
              <dl className="space-y-1.5 text-sm">
                <div className="flex justify-between text-cocoa">
                  <dt>Subtotal</dt>
                  <dd className="tabular-nums font-semibold text-ink">{formatPrice(subtotal)}</dd>
                </div>
                <div className="flex justify-between text-cocoa">
                  <dt>Shipping</dt>
                  <dd className={cx("tabular-nums font-semibold", toFree > 0 ? "text-ink" : "text-success")}>
                    {toFree > 0 ? "at checkout" : "Free"}
                  </dd>
                </div>
              </dl>
              <Link to="/checkout" onClick={closeCart} className="mt-4 block">
                <Button variant="ember" size="lg" full tabIndex={isOpen ? 0 : -1}>
                  Checkout — {formatPrice(subtotal)}
                  <IconArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <button
                type="button"
                tabIndex={isOpen ? 0 : -1}
                onClick={closeCart}
                className="mt-3 w-full text-center text-xs font-bold uppercase tracking-wider text-cocoa transition-colors hover:text-ember"
              >
                Continue shopping
              </button>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}
