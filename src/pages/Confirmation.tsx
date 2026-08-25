import { loadOrder } from "../lib/order";
import { Link } from "../lib/router";
import { cx, formatPrice } from "../lib/utils";
import { useToast } from "../state/ToastContext";
import { Reveal } from "../components/Reveal";
import { CheckRing } from "../components/illustrations";
import { Button } from "../components/ui";
import { IconArrowRight, IconCopy } from "../components/icons";

export function Confirmation({ refId }: { refId: string | undefined }) {
  const { push } = useToast();
  const order = refId ? loadOrder(refId) : null;

  if (!order) {
    return (
      <div className="mx-auto max-w-lg px-4 py-28 text-center">
        <p className="font-display text-6xl font-semibold text-caramel/60">Hmm.</p>
        <h1 className="mt-4 font-display text-3xl font-semibold text-ink">We can't find that order.</h1>
        <p className="mt-3 text-sm leading-relaxed text-cocoa">
          The reference doesn't match anything in this browser. If you just placed it, try reloading —
          or head back to the shelf.
        </p>
        <Link to="/shop" className="mt-8 inline-flex">
          <Button variant="primary" tabIndex={-1}>
            Back to the shelf
            <IconArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    );
  }

  const firstName = order.name.split(" ")[0] || "friend";

  const copyRef = async () => {
    try {
      await navigator.clipboard.writeText(order.ref);
      push({ title: "Reference copied", message: order.ref, tone: "success" });
    } catch {
      push({ title: "Couldn't copy automatically", message: `Your reference is ${order.ref}`, tone: "error" });
    }
  };

  const timeline = [
    { label: "Roasted Tuesday", sub: "Your lot was in this week's drum.", state: "done" as const },
    { label: "Resting & packing", sub: "Queued for dispatch within 48 hours.", state: "now" as const },
    {
      label: order.delivery === "express" ? "At your door — tomorrow" : `At your door — ${order.eta}`,
      sub: "You'll get a note when it ships.",
      state: "todo" as const,
    },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 pb-20 pt-14 sm:px-6">
      <Reveal className="text-center">
        <CheckRing className="mx-auto h-28 w-28" />
        <h1 className="mt-6 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
          Thanks, {firstName}<span className="text-ember">.</span>
        </h1>
        <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-cocoa">
          Your order is in the queue. We'll roast-report to <span className="font-semibold text-ink">{order.email}</span> the
          moment your beans leave the drum.
        </p>

        <button
          type="button"
          onClick={copyRef}
          className="mx-auto mt-6 inline-flex items-center gap-2.5 rounded-full border border-line bg-cream px-5 py-2.5 font-mono text-sm font-bold tracking-wider text-ink transition-all hover:border-ember hover:shadow-lift active:scale-95"
          aria-label={`Copy order reference ${order.ref}`}
        >
          {order.ref}
          <IconCopy className="h-4 w-4 text-latte" />
        </button>
      </Reveal>

      <div className="mt-12 grid gap-6 md:grid-cols-[1fr_1.1fr]">
        {/* timeline */}
        <Reveal delay={80}>
          <div className="h-full rounded-xl border border-line bg-cream p-6">
            <h2 className="font-display text-lg font-semibold text-ink">What happens next</h2>
            <ol className="mt-5 space-y-6">
              {timeline.map((step, i) => (
                <li key={step.label} className="relative flex gap-4">
                  {i < timeline.length - 1 ? (
                    <span className="absolute left-[9px] top-6 h-[calc(100%+0.6rem)] w-px bg-line" aria-hidden="true" />
                  ) : null}
                  <span
                    className={cx(
                      "relative z-10 mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2",
                      step.state === "done" && "border-success bg-success text-cream",
                      step.state === "now" && "border-ember bg-cream",
                      step.state === "todo" && "border-line bg-parchment",
                    )}
                    aria-hidden="true"
                  >
                    {step.state === "done" ? (
                      <svg viewBox="0 0 12 12" className="h-2.5 w-2.5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                        <path d="M2.5 6.5 5 9l4.5-6" />
                      </svg>
                    ) : step.state === "now" ? (
                      <span className="anim-pulse-dot h-2 w-2 rounded-full bg-ember" />
                    ) : null}
                  </span>
                  <div>
                    <p className="text-sm font-bold text-ink">{step.label}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-latte">{step.sub}</p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="mt-6 rounded-lg bg-parchment px-4 py-3 text-xs leading-relaxed text-cocoa">
              Shipping to <span className="font-semibold text-ink">{order.city}, {order.country}</span> via{" "}
              {order.delivery === "express" ? "express (next business day)" : "standard post"}.
            </p>
          </div>
        </Reveal>

        {/* summary */}
        <Reveal delay={140}>
          <div className="h-full rounded-xl border border-line bg-cream p-6">
            <h2 className="font-display text-lg font-semibold text-ink">Your beans</h2>
            <ul className="mt-4 divide-y divide-line">
              {order.items.map((item) => (
                <li key={item.slug} className="flex items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-ink">{item.name}</p>
                    <p className="text-xs text-latte">
                      {item.qty} × {formatPrice(item.price)} · 250 g
                    </p>
                  </div>
                  <span className="text-sm font-bold tabular-nums text-ink">{formatPrice(item.price * item.qty)}</span>
                </li>
              ))}
            </ul>
            <dl className="mt-2 space-y-2 border-t border-line pt-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-cocoa">Subtotal</dt>
                <dd className="font-semibold tabular-nums text-ink">{formatPrice(order.subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-cocoa">Shipping</dt>
                <dd className={cx("font-semibold tabular-nums", order.shipping === 0 ? "text-success" : "text-ink")}>
                  {order.shipping === 0 ? "Free" : formatPrice(order.shipping)}
                </dd>
              </div>
              <div className="flex items-baseline justify-between border-t border-line pt-3">
                <dt className="font-semibold text-ink">Total</dt>
                <dd className="font-display text-2xl font-semibold tabular-nums text-ink">{formatPrice(order.total)}</dd>
              </div>
            </dl>
          </div>
        </Reveal>
      </div>

      <Reveal delay={200}>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link to="/shop" className="inline-flex">
            <Button variant="ember" size="lg" tabIndex={-1}>
              Continue shopping
              <IconArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link to="/" className="inline-flex">
            <Button variant="ghost" size="lg" tabIndex={-1}>
              Back to the roastery
            </Button>
          </Link>
        </div>
        <p className="mt-6 text-center text-xs text-latte">
          Demo storefront — this order was simulated. The beans, sadly, are imaginary.
        </p>
      </Reveal>
    </div>
  );
}
