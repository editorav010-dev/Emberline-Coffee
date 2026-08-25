import type { CSSProperties } from "react";
import type { MotifKind, Product } from "../data/products";

/* ------------------------------------------------------------------ */
/*  Reusable motif shapes — the per-coffee visual signature            */
/* ------------------------------------------------------------------ */

export function MotifShapes({ kind }: { kind: MotifKind }) {
  const s = { fill: "none", stroke: "currentColor", strokeWidth: 3.2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (kind) {
    case "rings":
      return (
        <g {...s}>
          <circle cx="40" cy="40" r="10" />
          <circle cx="40" cy="40" r="19" />
          <circle cx="40" cy="40" r="28" />
        </g>
      );
    case "rays":
      return (
        <g {...s}>
          <circle cx="40" cy="40" r="10" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
            <line
              key={deg}
              x1={40 + 18 * Math.cos((deg * Math.PI) / 180)}
              y1={40 + 18 * Math.sin((deg * Math.PI) / 180)}
              x2={40 + 28 * Math.cos((deg * Math.PI) / 180)}
              y2={40 + 28 * Math.sin((deg * Math.PI) / 180)}
            />
          ))}
        </g>
      );
    case "peaks":
      return (
        <g {...s}>
          <path d="M8 62 L26 30 L36 46 L48 22 L60 46 L66 38 L74 62 Z" />
          <circle cx="60" cy="16" r="6" />
        </g>
      );
    case "flame":
      return (
        <g {...s}>
          <path d="M18 66 C18 44 28 40 28 26 C28 36 40 38 40 22 C40 38 52 36 52 26 C52 40 62 44 62 66" />
          <line x1="12" y1="66" x2="68" y2="66" />
        </g>
      );
    case "berries":
      return (
        <g {...s}>
          <circle cx="28" cy="34" r="9" />
          <circle cx="48" cy="28" r="9" />
          <circle cx="38" cy="50" r="9" />
          <circle cx="58" cy="48" r="9" />
          <path d="M52 12 C60 8 66 10 68 16 C60 18 54 18 52 12 Z" />
        </g>
      );
    case "leaves":
      return (
        <g {...s}>
          <path d="M40 70 C20 56 22 28 40 12 C58 28 60 56 40 70 Z" />
          <path d="M40 62 L40 20 M40 44 L30 34 M40 44 L50 34 M40 54 L32 46 M40 54 L48 46" strokeWidth="2.4" />
        </g>
      );
  }
}

export function Motif({ kind, className, style }: { kind: MotifKind; className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 80 80" className={className} style={style} aria-hidden="true">
      <MotifShapes kind={kind} />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Floating coffee bean                                               */
/* ------------------------------------------------------------------ */

export function Bean({
  x,
  y,
  size = 1,
  rotate = 0,
  delay = 0,
  float = true,
}: {
  x: number;
  y: number;
  size?: number;
  rotate?: number;
  delay?: number;
  float?: boolean;
}) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${size})`}>
      <g
        className={float ? "anim-floaty" : undefined}
        style={{ animationDelay: `${delay}s`, transformBox: "fill-box", transformOrigin: "center" } as CSSProperties}
      >
        <ellipse cx="0" cy="0" rx="11" ry="14" fill="currentColor" />
        <path d="M0 -13 C-4 -6 4 -2 0 4 C-3 8 3 10 0 13" fill="none" stroke="#f2e9d8" strokeOpacity="0.85" strokeWidth="2.2" strokeLinecap="round" />
      </g>
    </g>
  );
}

/* ------------------------------------------------------------------ */
/*  Steam wisps                                                        */
/* ------------------------------------------------------------------ */

export function SteamGroup({ className, scale = 1 }: { className?: string; scale?: number }) {
  const wisp = "M0 36 C-8 26 8 18 0 8 C-5 2 3 -4 0 -10";
  return (
    <g className={className} transform={`scale(${scale})`} fill="none" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round">
      <path d={wisp} transform="translate(-30 0) scale(0.82)" className="steam-wisp" style={{ animationDelay: "0s" }} />
      <path d={wisp} className="steam-wisp" style={{ animationDelay: "1.2s" }} />
      <path d={wisp} transform="translate(30 4) scale(0.7)" className="steam-wisp" style={{ animationDelay: "2.3s" }} />
    </g>
  );
}

/* ------------------------------------------------------------------ */
/*  The stand-up pouch — one component, six personalities              */
/* ------------------------------------------------------------------ */

const CATEGORY_LABEL: Record<Product["category"], string> = {
  filter: "Filter roast",
  espresso: "Espresso roast",
  decaf: "Decaf",
};

function splitName(name: string): [string, string?] {
  const words = name.split(" ");
  if (name.length <= 12 || words.length === 1) return [name];
  const mid = Math.ceil(words.length / 2);
  return [words.slice(0, mid).join(" "), words.slice(mid).join(" ")];
}

export function BagArt({ product, className, withShadow = true }: { product: Product; className?: string; withShadow?: boolean }) {
  const uid = product.slug;
  const [line1, line2] = splitName(product.name);
  const nameY = line2 ? 146 : 156;
  return (
    <svg viewBox="0 0 260 340" className={className} role="img" aria-label={`${product.name} coffee bag`}>
      <defs>
        <linearGradient id={`kraft-${uid}`} x1="0" y1="0" x2="1" y2="0.2">
          <stop offset="0%" stopColor="#eee1c2" />
          <stop offset="55%" stopColor="#e0cda3" />
          <stop offset="100%" stopColor="#d2bd92" />
        </linearGradient>
        <linearGradient id={`band-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={product.accent} />
          <stop offset="100%" stopColor={product.accentDeep} />
        </linearGradient>
        <clipPath id={`clip-${uid}`}>
          <path d="M48 64 L212 64 C216 64 218.5 67 218.7 71 L224 294 C224.6 311 213 320 197 320 L63 320 C47 320 35.4 311 36 294 L41.3 71 C41.5 67 44 64 48 64 Z" />
        </clipPath>
      </defs>

      {withShadow ? <ellipse cx="130" cy="326" rx="88" ry="9" fill="#000000" opacity="0.35" /> : null}

      {/* pouch body */}
      <path
        d="M48 64 L212 64 C216 64 218.5 67 218.7 71 L224 294 C224.6 311 213 320 197 320 L63 320 C47 320 35.4 311 36 294 L41.3 71 C41.5 67 44 64 48 64 Z"
        fill={`url(#kraft-${uid})`}
      />
      <g clipPath={`url(#clip-${uid})`}>
        <rect x="30" y="60" width="200" height="266" fill={product.accent} opacity="0.07" />
        <rect x="50" y="70" width="16" height="248" rx="8" fill="#ffffff" opacity="0.14" />
        <rect x="196" y="70" width="22" height="250" fill="#271a0e" opacity="0.06" />
        <path d="M64 66 L58 318" stroke="#b9a377" strokeWidth="1.4" opacity="0.6" />
        <path d="M196 66 L202 318" stroke="#b9a377" strokeWidth="1.4" opacity="0.6" />
      </g>

      {/* top seal */}
      <rect x="40" y="40" width="180" height="26" rx="6" fill="#c9b283" />
      <line x1="46" y1="48" x2="214" y2="48" stroke="#a8905f" strokeWidth="1.4" opacity="0.7" />
      <line x1="46" y1="56" x2="214" y2="56" stroke="#a8905f" strokeWidth="1.4" opacity="0.7" />
      <circle cx="40" cy="53" r="3" fill="#a8905f" opacity="0.8" />
      <circle cx="220" cy="53" r="3" fill="#a8905f" opacity="0.8" />
      <rect x="36" y="62" width="188" height="6" fill="#271a0e" opacity="0.08" />

      {/* brand */}
      <g transform="translate(130 86) rotate(-24)">
        <ellipse rx="7" ry="9" fill={product.accent} />
        <path d="M0 -8 C-3 -3 3 0 0 4 C-2 6.5 2 7.5 0 8.5" fill="none" stroke="#f2e9d8" strokeWidth="1.6" strokeLinecap="round" />
      </g>
      <text x="130" y="114" textAnchor="middle" fontFamily="var(--font-sans)" fontSize="11" fontWeight="700" letterSpacing="3.4" fill="#4a3421">
        EMBERLINE
      </text>

      {/* name */}
      <text x="130" y={nameY} textAnchor="middle" fontFamily="var(--font-display)" fontSize="25" fontWeight="600" fill="#271a0e">
        {line1}
      </text>
      {line2 ? (
        <text x="130" y={nameY + 30} textAnchor="middle" fontFamily="var(--font-display)" fontSize="25" fontWeight="600" fill="#271a0e">
          {line2}
        </text>
      ) : null}

      <text
        x="130"
        y={line2 ? 202 : 188}
        textAnchor="middle"
        fontFamily="var(--font-sans)"
        fontSize="9.5"
        fontWeight="600"
        letterSpacing="2.4"
        fill="#6b533b"
      >
        {`${CATEGORY_LABEL[product.category].toUpperCase()} · ${product.weight.toUpperCase()}`}
      </text>
      <line x1="82" y1={line2 ? 214 : 200} x2="178" y2={line2 ? 214 : 200} stroke="#b9a377" strokeWidth="1.2" />

      {/* accent band */}
      <g clipPath={`url(#clip-${uid})`}>
        <rect x="30" y="228" width="200" height="96" fill={`url(#band-${uid})`} />
        <svg x="150" y="240" width="66" height="66" viewBox="0 0 80 80" style={{ color: "#faf4e6" }} opacity="0.5">
          <MotifShapes kind={product.motif} />
        </svg>
        {[0, 1, 2, 3, 4].map((i) => (
          <circle key={i} cx={60 + i * 15} cy="262" r="4" fill="#faf4e6" opacity={i < product.roast ? 0.95 : 0.28} />
        ))}
        <text x="60" y="290" fontFamily="var(--font-sans)" fontSize="7.5" fontWeight="700" letterSpacing="2" fill="#faf4e6" opacity="0.85">
          ROAST
        </text>
        <text x="60" y="306" fontFamily="var(--font-sans)" fontSize="7.5" fontWeight="600" letterSpacing="2" fill="#faf4e6" opacity="0.6">
          ROASTED WEEKLY · PDX
        </text>
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Hero scene — cup, orbiting type, steam, beans                      */
/* ------------------------------------------------------------------ */

export function HeroScene({ className, tone = "light" }: { className?: string; tone?: "light" | "dark" }) {
  const dark = tone === "dark";
  return (
    <svg
      viewBox="0 0 560 560"
      className={className}
      role="img"
      aria-label="Illustration of a steaming cup of Emberline coffee surrounded by orbiting coffee beans"
    >
      {/* rotating type ring */}
      <g className="anim-rot-slow">
        <path id="ember-orbit" d="M280 280 m -214 0 a 214 214 0 1 1 428 0 a 214 214 0 1 1 -428 0" fill="none" />
        <text fontFamily="var(--font-sans)" fontSize="15" fontWeight="600" letterSpacing="5.6" fill={dark ? "#faf4e6" : "#6b533b"} opacity={dark ? 0.5 : 1}>
          <textPath href="#ember-orbit">
            EMBERLINE ROASTING CO — SMALL BATCH — ROASTED WEEKLY — SINCE 2019 — EMBERLINE ROASTING CO — SMALL BATCH —
          </textPath>
        </text>
      </g>
      {/* dashed brew circle */}
      <circle
        cx="280"
        cy="280"
        r="182"
        fill="none"
        stroke="#c89048"
        strokeWidth="2"
        strokeDasharray="1 11"
        strokeLinecap="round"
        opacity={dark ? 0.55 : 0.75}
        className="anim-rot-slower"
      />
      {/* ring stains */}
      <circle cx="392" cy="158" r="46" fill="none" stroke="#b0652f" strokeWidth="7" opacity={dark ? 0.22 : 0.12} />
      <circle cx="388" cy="163" r="46" fill="none" stroke="#b0652f" strokeWidth="2.5" opacity={dark ? 0.18 : 0.1} />
      <circle cx="150" cy="416" r="30" fill="none" stroke="#b0652f" strokeWidth="5" opacity={dark ? 0.2 : 0.1} />

      {/* cup */}
      <g transform="translate(280 316)">
        <ellipse cx="0" cy="66" rx="128" ry="20" fill="#e8dcc2" />
        <ellipse cx="0" cy="62" rx="128" ry="20" fill="#efe4cc" stroke="#ddd0b3" strokeWidth="1.5" />
        <path
          d="M-86 -6 C-86 46 -50 68 0 68 C50 68 86 46 86 -6 L86 -14 L-86 -14 Z"
          fill="#2b1a0d"
          stroke={dark ? "#6a4423" : "none"}
          strokeWidth={dark ? 2 : 0}
        />
        <path d="M-86 -14 A86 17 0 0 0 86 -14 A86 17 0 0 0 -86 -14" fill="#3d2716" />
        <path d="M-76 -13 A76 14 0 0 0 76 -13 A76 14 0 0 0 -76 -13" fill="#4e2f16" />
        <path d="M-46 -12 A48 9 0 0 1 34 -16" fill="none" stroke="#c89048" strokeWidth="3" strokeLinecap="round" opacity="0.7" />
        <path d="M86 -4 C118 -4 120 38 82 42" fill="none" stroke="#2b1a0d" strokeWidth="11" strokeLinecap="round" />
        <SteamGroup className={dark ? "text-cream/60" : "text-latte"} scale={1.15} />
      </g>

      {/* floating beans */}
      <g className={dark ? "text-caramel" : "text-bark"}>
        <Bean x={128} y={170} rotate={24} delay={0} />
        <Bean x={440} y={210} size={0.8} rotate={-30} delay={1.4} />
      </g>
      <g className="text-copper">
        <Bean x={156} y={392} size={0.85} rotate={-18} delay={0.8} />
        <Bean x={428} y={388} rotate={38} delay={2} />
      </g>
      {/* sparks */}
      <g stroke="#c89048" strokeWidth="2.4" strokeLinecap="round" opacity="0.8">
        <path d="M204 120 v12 M198 126 h12" />
        <path d="M468 300 v10 M463 305 h10" />
        <path d="M104 300 v10 M99 305 h10" />
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Animated confirmation ring                                         */
/* ------------------------------------------------------------------ */

export function CheckRing({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true">
      <circle cx="60" cy="60" r="55" fill="none" stroke="#c89048" strokeWidth="1.5" strokeDasharray="1 7" strokeLinecap="round" opacity="0.7" />
      <circle cx="60" cy="60" r="45" fill="none" stroke="#d4552a" strokeWidth="3.5" strokeLinecap="round" className="draw-circle" transform="rotate(-90 60 60)" />
      <path d="M41 62 L55 76 L81 46" fill="none" stroke="#d4552a" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" className="draw-check" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Small line-art cup — empty states                                  */
/* ------------------------------------------------------------------ */

export function TinyCup({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 110" className={className} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden="true">
      <g transform="translate(60 46)">
        <path d="M-30 -14 C-30 10 -16 20 0 20 C16 20 30 10 30 -14" />
        <path d="M-30 -14 L30 -14" />
        <path d="M30 -8 C42 -8 42 6 28 8" />
        <path d="M-38 28 L38 28" opacity="0.6" />
      </g>
      <g transform="translate(60 26)" opacity="0.8">
        <path d="M-12 10 C-16 4 -8 2 -12 -4" className="steam-wisp" style={{ animationDelay: "0s" }} />
        <path d="M0 12 C-4 5 4 2 0 -6" className="steam-wisp" style={{ animationDelay: "1.1s" }} />
        <path d="M12 10 C8 4 16 2 12 -4" className="steam-wisp" style={{ animationDelay: "2.1s" }} />
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Coffee-ring stains for section backgrounds                         */
/* ------------------------------------------------------------------ */

export function CoffeeRings({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 400" className={className} fill="none" aria-hidden="true">
      <circle cx="200" cy="200" r="150" stroke="currentColor" strokeWidth="22" opacity="0.5" />
      <circle cx="192" cy="210" r="150" stroke="currentColor" strokeWidth="6" opacity="0.35" />
      <circle cx="290" cy="330" r="52" stroke="currentColor" strokeWidth="10" opacity="0.4" />
    </svg>
  );
}
