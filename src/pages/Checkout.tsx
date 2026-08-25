import { useState } from "react";
import type { FormEvent } from "react";
import { getProduct } from "../data/products";
import { Link, navigate } from "../lib/router";
import { EXPRESS_SHIPPING, FREE_SHIPPING_AT, STANDARD_SHIPPING, useCart } from "../state/CartContext";
import { cx, etaLabel, formatPrice, makeOrderRef, sleep } from "../lib/utils";
import { saveOrder } from "../lib/order";
import type { Order } from "../lib/order";
import { Reveal } from "../components/Reveal";
import { Button, Field } from "../components/ui";
import { IconArrowLeft, IconBag, IconCheck, IconLock } from "../components/icons";
import { TinyCup } from "../components/illustrations";

interface FormValues {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zip: string;
  country: string;
  cardName: string;
  cardNumber: string;
  cardExpiry: string;
  cardCvc: string;
}

type Errors = Partial<Record<keyof FormValues, string>>;

const INITIAL: FormValues = {
  name: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  zip: "",
  country: "United States",
  cardName: "",
  cardNumber: "",
  cardExpiry: "",
  cardCvc: "",
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^[+\d][\d\s\-().]{6,18}$/;
const ZIP_RE = /^[A-Za-z0-9][A-Za-z0-9\- ]{2,9}$/;

function validateField(field: keyof FormValues, v: FormValues): string | undefined {
  const value = v[field].trim();
  switch (field) {
    case "name":
      if (!value) return "We need a name for the label.";
      if (value.length < 2) return "That looks a little short.";
      return undefined;
    case "email":
      if (!value) return "We'll send the roast report here.";
      if (!EMAIL_RE.test(value)) return "That email doesn't look right.";
      return undefined;
    case "phone":
      if (value && !PHONE_RE.test(value)) return "That phone number doesn't look right.";
      return undefined;
    case "address":
      if (!value) return "The courier needs a street address.";
      if (value.length < 5) return "Add a street number and name.";
      return undefined;
    case "city":
      if (!value) return "Which city are we shipping to?";
      return undefined;
    case "zip":
      if (!value) return "Postal code is required.";
      if (!ZIP_RE.test(value)) return "That postal code doesn't look right.";
      return undefined;
    case "country":
      return value ? undefined : "Pick a country.";
    case "cardName":
      if (!value) return "Name as printed on the card.";
      return undefined;
    case "cardNumber": {
      const digits = value.replace(/\s/g, "");
      if (!digits) return "Card number is required.";
      if (!/^\d{16}$/.test(digits)) return "A card number has 16 digits.";
      return undefined;
    }
    case "cardExpiry": {
      const m = value.match(/^(\d{2})\/(\d{2})$/);
      if (!m) return "Use MM/YY.";
      const month = Number(m[1]);
      const year = 2000 + Number(m[2]);
      if (month < 1 || month > 12) return "Month must be 01–12.";
      const now = new Date();
      if (year < now.getFullYear() || (year === now.getFullYear() && month < now.getMonth() + 1)) return "That card has expired.";
      return undefined;
    }
    case "cardCvc":
      if (!/^\d{3,4}$/.test(value)) return "3–4 digits.";
      return undefined;
  }
}

function validateAll(v: FormValues): Errors {
  const errors: Errors = {};
  (Object.keys(v) as (keyof FormValues)[]).forEach((field) => {
    const err = validateField(field, v);
    if (err) errors[field] = err;
  });
  return errors;
}

const FIELD_ORDER: (keyof FormValues)[] = [
  "name", "email", "phone", "address", "city", "zip", "country", "cardName", "cardNumber", "cardExpiry", "cardCvc",
];

export function Checkout() {
  const { lines, subtotal, clear } = useCart();
  const [values, setValues] = useState<FormValues>(INITIAL);
  const [errors, setErrors] = useState<Errors>({});
  const [delivery, setDelivery] = useState<"standard" | "express">("standard");
  const [submitting, setSubmitting] = useState(false);
  const [placed, setPlaced] = useState(false);

  const shipping = delivery === "express" ? EXPRESS_SHIPPING : subtotal >= FREE_SHIPPING_AT ? 0 : STANDARD_SHIPPING;
  const total = subtotal + shipping;

  const setValue = (field: keyof FormValues, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const onBlur = (field: keyof FormValues) => {
    const err = validateField(field, values);
    setErrors((prev) => ({ ...prev, [field]: err }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const next = validateAll(values);
    setErrors(next);
    const firstBad = FIELD_ORDER.find((f) => next[f]);
    if (firstBad) {
      document.getElementById(`co-${firstBad}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
      document.getElementById(`co-${firstBad}`)?.focus({ preventScroll: true });
      return;
    }
    setSubmitting(true);
    await sleep(1900);

    const ref = makeOrderRef();
    const order: Order = {
      ref,
      placedAt: new Date().toISOString(),
      name: values.name.trim(),
      email: values.email.trim(),
      city: values.city.trim(),
      country: values.country,
      delivery,
      items: lines.flatMap((line) => {
        const p = getProduct(line.slug);
        return p ? [{ slug: p.slug, name: p.name, qty: line.qty, price: p.price }] : [];
      }),
      subtotal,
      shipping,
      total,
      eta: etaLabel(),
    };
    saveOrder(order);
    setPlaced(true);
    clear();
    navigate(`/order/${ref}`);
  };

  /* ------- empty cart guard ------- */
  if (lines.length === 0 && !submitting && !placed) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <TinyCup className="mx-auto h-24 w-28 text-latte" />
        <h1 className="mt-6 font-display text-3xl font-semibold text-ink">Nothing to check out yet</h1>
        <p className="mt-3 text-sm leading-relaxed text-cocoa">
          Your cart is empty, and a checkout without coffee is just a form. Fill the bag first.
        </p>
        <Link to="/shop" className="mt-8 inline-flex">
          <Button variant="ember" size="lg" tabIndex={-1}>
            <IconBag className="h-4 w-4" />
            Browse the shelf
          </Button>
        </Link>
      </div>
    );
  }

  const inputCls = (field: keyof FormValues) => cx("input-base", errors[field] && "input-error");

  return (
    <div className="mx-auto max-w-6xl px-4 pb-28 pt-10 sm:px-6 lg:pb-20 lg:px-8">
      {/* steps */}
      <Reveal>
        <nav aria-label="Checkout progress" className="flex items-center gap-3 text-xs font-bold uppercase tracking-wider">
          <span className="flex items-center gap-2 text-success">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-success text-cream">
              <IconCheck className="h-3.5 w-3.5" />
            </span>
            Bag
          </span>
          <span className="h-px w-8 bg-line" aria-hidden="true" />
          <span className="flex items-center gap-2 text-ember">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border-2 border-ember bg-cream font-display text-[11px]">2</span>
            Details
          </span>
          <span className="h-px w-8 bg-line" aria-hidden="true" />
          <span className="flex items-center gap-2 text-latte">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-line bg-cream font-display text-[11px]">3</span>
            Confirmation
          </span>
        </nav>

        <h1 className="mt-6 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
          Almost brewing<span className="text-ember">.</span>
        </h1>
        <p className="mt-3 max-w-lg text-[15px] text-cocoa">
          Tell us where the beans are headed. This is a demo checkout — nothing is charged and no card data leaves your browser.
        </p>
      </Reveal>

      <form id="checkout-form" onSubmit={handleSubmit} noValidate className="mt-10 grid gap-10 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-10">
          {/* contact */}
          <Reveal>
            <fieldset disabled={submitting} className="space-y-5">
              <legend className="flex items-center gap-3 font-display text-xl font-semibold text-ink">
                <span className="font-sans text-xs font-bold uppercase tracking-wider text-ember">01</span>
                Contact
              </legend>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field id="co-name" label="Full name" error={errors.name}>
                  <input
                    id="co-name"
                    type="text"
                    autoComplete="name"
                    className={inputCls("name")}
                    placeholder="Ada Bloom"
                    value={values.name}
                    onChange={(e) => setValue("name", e.target.value)}
                    onBlur={() => onBlur("name")}
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? "co-name-err" : undefined}
                  />
                </Field>
                <Field id="co-email" label="Email" error={errors.email} hint="Roast report and updates land here.">
                  <input
                    id="co-email"
                    type="email"
                    autoComplete="email"
                    className={inputCls("email")}
                    placeholder="ada@example.com"
                    value={values.email}
                    onChange={(e) => setValue("email", e.target.value)}
                    onBlur={() => onBlur("email")}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "co-email-err" : undefined}
                  />
                </Field>
                <Field id="co-phone" label="Phone" optional error={errors.phone}>
                  <input
                    id="co-phone"
                    type="tel"
                    autoComplete="tel"
                    className={inputCls("phone")}
                    placeholder="+1 503 555 0117"
                    value={values.phone}
                    onChange={(e) => setValue("phone", e.target.value)}
                    onBlur={() => onBlur("phone")}
                    aria-invalid={!!errors.phone}
                    aria-describedby={errors.phone ? "co-phone-err" : undefined}
                  />
                </Field>
              </div>
            </fieldset>
          </Reveal>

          {/* shipping */}
          <Reveal>
            <fieldset disabled={submitting} className="space-y-5">
              <legend className="flex items-center gap-3 font-display text-xl font-semibold text-ink">
                <span className="font-sans text-xs font-bold uppercase tracking-wider text-ember">02</span>
                Shipping address
              </legend>
              <Field id="co-address" label="Street address" error={errors.address}>
                <input
                  id="co-address"
                  type="text"
                  autoComplete="street-address"
                  className={inputCls("address")}
                  placeholder="1234 Alder Street, Apt 5"
                  value={values.address}
                  onChange={(e) => setValue("address", e.target.value)}
                  onBlur={() => onBlur("address")}
                  aria-invalid={!!errors.address}
                  aria-describedby={errors.address ? "co-address-err" : undefined}
                />
              </Field>
              <div className="grid gap-5 sm:grid-cols-3">
                <Field id="co-city" label="City" error={errors.city}>
                  <input
                    id="co-city"
                    type="text"
                    autoComplete="address-level2"
                    className={inputCls("city")}
                    placeholder="Portland"
                    value={values.city}
                    onChange={(e) => setValue("city", e.target.value)}
                    onBlur={() => onBlur("city")}
                    aria-invalid={!!errors.city}
                    aria-describedby={errors.city ? "co-city-err" : undefined}
                  />
                </Field>
                <Field id="co-zip" label="Postal code" error={errors.zip}>
                  <input
                    id="co-zip"
                    type="text"
                    autoComplete="postal-code"
                    className={inputCls("zip")}
                    placeholder="97204"
                    value={values.zip}
                    onChange={(e) => setValue("zip", e.target.value)}
                    onBlur={() => onBlur("zip")}
                    aria-invalid={!!errors.zip}
                    aria-describedby={errors.zip ? "co-zip-err" : undefined}
                  />
                </Field>
                <Field id="co-country" label="Country" error={errors.country}>
                  <select
                    id="co-country"
                    autoComplete="country-name"
                    className={cx(inputCls("country"), "cursor-pointer")}
                    value={values.country}
                    onChange={(e) => setValue("country", e.target.value)}
                    aria-invalid={!!errors.country}
                  >
                    {["United States", "Canada", "United Kingdom", "Germany", "Netherlands", "Australia", "Japan"].map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </Field>
              </div>

              {/* delivery method */}
              <div>
                <p className="mb-2 text-[13px] font-semibold text-ink">Delivery speed</p>
                <div className="grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Delivery speed">
                  {(
                    [
                      { id: "standard", label: "Standard", sub: "3–5 business days", price: subtotal >= FREE_SHIPPING_AT ? 0 : STANDARD_SHIPPING },
                      { id: "express", label: "Express", sub: "Next business day", price: EXPRESS_SHIPPING },
                    ] as const
                  ).map((opt) => (
                    <label
                      key={opt.id}
                      className={cx(
                        "flex cursor-pointer items-center justify-between gap-3 rounded-xl border-2 px-4 py-3.5 transition-all duration-200",
                        delivery === opt.id ? "border-ember bg-ember/8 shadow-lift" : "border-line bg-cream hover:border-caramel",
                      )}
                    >
                      <span className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="delivery"
                          value={opt.id}
                          checked={delivery === opt.id}
                          onChange={() => setDelivery(opt.id)}
                          className="sr-only"
                        />
                        <span
                          className={cx(
                            "inline-flex h-[18px] w-[18px] items-center justify-center rounded-full border-2 transition-colors",
                            delivery === opt.id ? "border-ember" : "border-line",
                          )}
                          aria-hidden="true"
                        >
                          {delivery === opt.id ? <span className="h-2 w-2 rounded-full bg-ember" /> : null}
                        </span>
                        <span>
                          <span className="block text-sm font-bold text-ink">{opt.label}</span>
                          <span className="block text-xs text-latte">{opt.sub}</span>
                        </span>
                      </span>
                      <span className={cx("text-sm font-bold tabular-nums", opt.price === 0 ? "text-success" : "text-ink")}>
                        {opt.price === 0 ? "Free" : formatPrice(opt.price)}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </fieldset>
          </Reveal>

          {/* payment */}
          <Reveal>
            <fieldset disabled={submitting} className="space-y-5">
              <legend className="flex items-center gap-3 font-display text-xl font-semibold text-ink">
                <span className="font-sans text-xs font-bold uppercase tracking-wider text-ember">03</span>
                Payment
                <span className="ml-1 inline-flex items-center gap-1.5 rounded-full bg-success/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-success">
                  <IconLock className="h-3 w-3" />
                  Simulated
                </span>
              </legend>
              <Field id="co-cardName" label="Name on card" error={errors.cardName}>
                <input
                  id="co-cardName"
                  type="text"
                  autoComplete="cc-name"
                  className={inputCls("cardName")}
                  placeholder="Ada Bloom"
                  value={values.cardName}
                  onChange={(e) => setValue("cardName", e.target.value)}
                  onBlur={() => onBlur("cardName")}
                  aria-invalid={!!errors.cardName}
                  aria-describedby={errors.cardName ? "co-cardName-err" : undefined}
                />
              </Field>
              <Field id="co-cardNumber" label="Card number" error={errors.cardNumber} hint="Demo — try any 16 digits, e.g. 4242 4242 4242 4242.">
                <input
                  id="co-cardNumber"
                  type="text"
                  inputMode="numeric"
                  autoComplete="cc-number"
                  className={cx(inputCls("cardNumber"), "tabular-nums")}
                  placeholder="4242 4242 4242 4242"
                  value={values.cardNumber}
                  onChange={(e) => {
                    const digits = e.target.value.replace(/\D/g, "").slice(0, 16);
                    setValue("cardNumber", digits.replace(/(\d{4})(?=\d)/g, "$1 "));
                  }}
                  onBlur={() => onBlur("cardNumber")}
                  aria-invalid={!!errors.cardNumber}
                  aria-describedby={errors.cardNumber ? "co-cardNumber-err" : undefined}
                />
              </Field>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field id="co-cardExpiry" label="Expiry" error={errors.cardExpiry}>
                  <input
                    id="co-cardExpiry"
                    type="text"
                    inputMode="numeric"
                    autoComplete="cc-exp"
                    className={cx(inputCls("cardExpiry"), "tabular-nums")}
                    placeholder="08/27"
                    value={values.cardExpiry}
                    onChange={(e) => {
                      const digits = e.target.value.replace(/\D/g, "").slice(0, 4);
                      setValue("cardExpiry", digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits);
                    }}
                    onBlur={() => onBlur("cardExpiry")}
                    aria-invalid={!!errors.cardExpiry}
                    aria-describedby={errors.cardExpiry ? "co-cardExpiry-err" : undefined}
                  />
                </Field>
                <Field id="co-cardCvc" label="CVC" error={errors.cardCvc}>
                  <input
                    id="co-cardCvc"
                    type="text"
                    inputMode="numeric"
                    autoComplete="cc-csc"
                    className={cx(inputCls("cardCvc"), "tabular-nums")}
                    placeholder="123"
                    value={values.cardCvc}
                    onChange={(e) => setValue("cardCvc", e.target.value.replace(/\D/g, "").slice(0, 4))}
                    onBlur={() => onBlur("cardCvc")}
                    aria-invalid={!!errors.cardCvc}
                    aria-describedby={errors.cardCvc ? "co-cardCvc-err" : undefined}
                  />
                </Field>
              </div>
            </fieldset>
          </Reveal>
        </div>

        {/* summary */}
        <aside className="h-fit lg:sticky lg:top-32">
          <Reveal delay={80}>
            <div className="rounded-xl border border-line bg-cream p-6">
              <h2 className="font-display text-xl font-semibold text-ink">Order summary</h2>
              <ul className="mt-4 divide-y divide-line">
                {lines.map((line) => {
                  const p = getProduct(line.slug);
                  if (!p) return null;
                  return (
                    <li key={line.slug} className="flex items-center justify-between gap-3 py-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-ink">{p.name}</p>
                        <p className="text-xs text-latte">
                          {line.qty} × {formatPrice(p.price)}
                        </p>
                      </div>
                      <span className="shrink-0 text-sm font-bold tabular-nums text-ink">{formatPrice(p.price * line.qty)}</span>
                    </li>
                  );
                })}
              </ul>
              <dl className="mt-2 space-y-2 border-t border-line pt-4 text-sm">
                <div className="flex justify-between">
                  <dt className="text-cocoa">Subtotal</dt>
                  <dd className="font-semibold tabular-nums text-ink">{formatPrice(subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-cocoa">Shipping — {delivery}</dt>
                  <dd className={cx("font-semibold tabular-nums", shipping === 0 ? "text-success" : "text-ink")}>
                    {shipping === 0 ? "Free" : formatPrice(shipping)}
                  </dd>
                </div>
                <div className="flex items-baseline justify-between border-t border-line pt-3">
                  <dt className="font-semibold text-ink">Total</dt>
                  <dd key={total} className="anim-fadein font-display text-2xl font-semibold tabular-nums text-ink">{formatPrice(total)}</dd>
                </div>
              </dl>
              <Button type="submit" variant="ember" size="lg" full loading={submitting} className="mt-5">
                {submitting ? "Brewing your order…" : `Place order — ${formatPrice(total)}`}
              </Button>
              <p className="mt-3 flex items-start gap-2 text-xs leading-relaxed text-latte">
                <IconLock className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                Demo checkout. No payment is processed and no data leaves your browser.
              </p>
              <Link
                to="/shop"
                className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-cocoa transition-colors hover:text-ember"
              >
                <IconArrowLeft className="h-3.5 w-3.5" />
                Back to the shelf
              </Link>
            </div>
          </Reveal>
        </aside>
      </form>

      {/* sticky submit bar — mobile */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-cream/95 px-4 py-3 backdrop-blur-sm lg:hidden">
        <div className="mx-auto flex max-w-lg items-center justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-latte">
              Total · {delivery === "express" ? "express" : "standard"}
            </p>
            <p key={total} className="anim-fadein font-display text-xl font-semibold tabular-nums text-ink">
              {formatPrice(total)}
            </p>
          </div>
          <Button type="submit" form="checkout-form" variant="ember" loading={submitting}>
            {submitting ? "Brewing…" : "Place order"}
          </Button>
        </div>
      </div>
    </div>
  );
}
