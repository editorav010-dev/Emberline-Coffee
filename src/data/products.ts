export type Category = "filter" | "espresso" | "decaf";
export type MotifKind = "rings" | "rays" | "peaks" | "flame" | "berries" | "leaves";

export interface BrewTip {
  method: string;
  ratio: string;
  temp: string;
  time: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  story: string[];
  price: number;
  weight: string;
  category: Category;
  origin: { country: string; region: string; producer: string };
  process: string;
  variety: string;
  altitude: string;
  harvest: string;
  roast: number; // 1 (lightest) – 5 (darkest)
  notes: string[];
  brew: BrewTip[];
  badge?: string;
  accent: string;
  accentDeep: string;
  tint: string;
  motif: MotifKind;
}

export const ROAST_LABELS = ["", "Light", "Light", "Medium", "Medium-dark", "Dark"] as const;

export const CATEGORIES: { id: Category | "all"; label: string; blurb: string }[] = [
  { id: "all", label: "All coffees", blurb: "Everything on the shelf this week." },
  { id: "filter", label: "Filter roasts", blurb: "Bright, articulate cups for pour over and batch brew." },
  { id: "espresso", label: "Espresso roasts", blurb: "Syrupy and structured — built for the machine and milk." },
  { id: "decaf", label: "Decaf", blurb: "All of the craft, none of the caffeine." },
];

export const PRODUCTS: Product[] = [
  {
    id: "p1",
    slug: "kiamugumu-aa",
    name: "Kiamugumo AA",
    tagline: "A bright Kenyan with a blackcurrant heart and a long, sugared finish.",
    story: [
      "Kiamugumo is one of the older factories in the Gichugu region, drawing cherry from smallholder farms planted on the red volcanic slopes above the riverbed. The AA lot is hand-sorted twice, then washed with spring water and sun-dried on raised beds for two weeks.",
      "We roast it gently, dropping just after first crack finishes, to keep the acidity luminous without tipping into sharpness. It is the cup we reach for when we want to remember why we fell for East African coffee in the first place.",
    ],
    price: 21.5,
    weight: "250 g",
    category: "filter",
    origin: { country: "Kenya", region: "Nyeri County", producer: "Kiamugumu Factory" },
    process: "Washed",
    variety: "SL28 · SL34",
    altitude: "1,750 – 1,900 m",
    harvest: "Main crop 2025",
    roast: 2,
    notes: ["Blackcurrant", "Grapefruit", "Raw honey"],
    brew: [
      { method: "V60 pour over", ratio: "1 : 16", temp: "93 °C", time: "2:45" },
      { method: "Batch brew", ratio: "1 : 17", temp: "92 °C", time: "5:30" },
      { method: "AeroPress", ratio: "1 : 13", temp: "88 °C", time: "1:30" },
    ],
    badge: "New harvest",
    accent: "#a83e52",
    accentDeep: "#7c2a3d",
    tint: "#f0dfd8",
    motif: "rings",
  },
  {
    id: "p2",
    slug: "idido-heirloom",
    name: "Idido Heirloom",
    tagline: "An Ethiopian heirloom that pours like jasmine tea and finishes like peach.",
    story: [
      "Idido sits just outside Gedeb, where heirloom cultivars still grow wild between backyard plots and river forest. The cherries arrive small and uneven — and entirely worth it. After a careful wash, the beans rest on raised tables under shade cloth.",
      "In the roaster we treat it almost like a tea: low charge, slow middle, early drop. What lands in your cup is floral and weightless, with a bergamot lift that holds through the second and third sip.",
    ],
    price: 19.75,
    weight: "250 g",
    category: "filter",
    origin: { country: "Ethiopia", region: "Gedeb, Yirgacheffe", producer: "Idido washing station" },
    process: "Washed",
    variety: "Local heirloom",
    altitude: "1,950 – 2,100 m",
    harvest: "Winter 2025",
    roast: 2,
    notes: ["Jasmine", "Bergamot", "White peach"],
    brew: [
      { method: "V60 pour over", ratio: "1 : 16.5", temp: "92 °C", time: "2:40" },
      { method: "Origami", ratio: "1 : 15", temp: "91 °C", time: "2:20" },
      { method: "Cold brew", ratio: "1 : 9", temp: "Cold", time: "14 h" },
    ],
    accent: "#d69c3f",
    accentDeep: "#a9731f",
    tint: "#f2e5c8",
    motif: "rays",
  },
  {
    id: "p3",
    slug: "el-mirador",
    name: "El Mirador",
    tagline: "A Huila workhorse — panela sweetness, red apple snap, cocoa depth.",
    story: [
      "The Rojas family has farmed the same ridgeline above Garzón for three generations. Their caturra trees sit on a narrow band of volcanic soil that seems designed for coffee: deep drainage, constant cloud, cool nights.",
      "Roasted to a confident medium, El Mirador is our all-rounder. It pulls a syrupy shot with tangerine acidity, sits happily under milk, and still shows structure when you run it through a pour over.",
    ],
    price: 18.25,
    weight: "250 g",
    category: "espresso",
    origin: { country: "Colombia", region: "Huila, Garzón", producer: "Familia Rojas" },
    process: "Washed",
    variety: "Caturra",
    altitude: "1,650 m",
    harvest: "Fly crop 2025",
    roast: 3,
    notes: ["Panela", "Red apple", "Cocoa"],
    brew: [
      { method: "Espresso", ratio: "1 : 2", temp: "94 °C", time: "0:28" },
      { method: "Moka pot", ratio: "1 : 10", temp: "Stovetop", time: "4:00" },
      { method: "V60 pour over", ratio: "1 : 15", temp: "93 °C", time: "2:50" },
    ],
    badge: "House favourite",
    accent: "#bc6b33",
    accentDeep: "#8f4b1f",
    tint: "#f1e2cd",
    motif: "peaks",
  },
  {
    id: "p4",
    slug: "ember-blend",
    name: "Ember Blend",
    tagline: "Our signature — dark chocolate and toasted hazelnut with a brown-sugar tail.",
    story: [
      "The Ember Blend is the roast this shop was built around: a Brazil natural for body and base note, folded into a Colombia washed for sweetness and structure. We rebalance the ratio every season as the components change.",
      "Taken a touch darker than our single origins, it is engineered for milk — a cortado made with this tastes like toasted marshmallow — but stays clean enough for a straight double. This is the bag our regulars never let run out.",
    ],
    price: 16.5,
    weight: "250 g",
    category: "espresso",
    origin: { country: "Brazil + Colombia", region: "Cerrado · Huila", producer: "Blend — two farms" },
    process: "Natural + washed",
    variety: "Mundo Novo · Caturra",
    altitude: "1,100 – 1,650 m",
    harvest: "Seasonal",
    roast: 4,
    notes: ["Dark chocolate", "Toasted hazelnut", "Brown sugar"],
    brew: [
      { method: "Espresso", ratio: "1 : 2", temp: "93 °C", time: "0:30" },
      { method: "French press", ratio: "1 : 14", temp: "96 °C", time: "4:00" },
      { method: "Cold brew", ratio: "1 : 8", temp: "Cold", time: "16 h" },
    ],
    badge: "Signature",
    accent: "#d4552a",
    accentDeep: "#a33a17",
    tint: "#f2dfcb",
    motif: "flame",
  },
  {
    id: "p5",
    slug: "alto-mayo-anaerobic",
    name: "Alto Mayo Anaerobic",
    tagline: "A wild Peruvian natural — blueberry fruit, vanilla, a cacao-nib edge.",
    story: [
      "This lot comes from a cooperative of twelve families around Nueva Cajamarca. After picking, whole cherry is sealed in tanks and left to ferment without oxygen for four days before a slow shade-dry. It is risky, exacting work — and it produces coffee unlike anything else on our shelf.",
      "Expect jammy, unmistakable fruit: blueberry compote up front, a vanilla-cream middle, and a drying cacao finish. We keep the roast light and let the fermentation do the talking.",
    ],
    price: 23,
    weight: "250 g",
    category: "filter",
    origin: { country: "Peru", region: "Alto Mayo, San Martín", producer: "12-family co-op" },
    process: "Anaerobic natural",
    variety: "Caturra",
    altitude: "1,800 m",
    harvest: "Autumn 2025",
    roast: 2,
    notes: ["Blueberry", "Vanilla", "Cacao nib"],
    brew: [
      { method: "V60 pour over", ratio: "1 : 15.5", temp: "90 °C", time: "2:50" },
      { method: "AeroPress", ratio: "1 : 12", temp: "86 °C", time: "1:45" },
      { method: "Espresso", ratio: "1 : 2.2", temp: "92 °C", time: "0:32" },
    ],
    badge: "Limited lot",
    accent: "#7c4e6e",
    accentDeep: "#5a3550",
    tint: "#ede2d6",
    motif: "berries",
  },
  {
    id: "p6",
    slug: "la-loma-decaf",
    name: "La Loma Decaf",
    tagline: "Sugarcane decaf that drinks like milk chocolate — nobody ever guesses.",
    story: [
      "La Loma is decaffeinated in Colombia, close to where it is grown, using ethyl acetate derived from sugarcane. The gentle process keeps the sugars intact instead of stripping them out, which is exactly why it still tastes like coffee.",
      "We roast it to a soft medium and treat it like any other espresso on the bar. Soft date sweetness, an almond-skin dryness, milk chocolate throughout — it is the cup we pour for the 4 pm regulars.",
    ],
    price: 17.75,
    weight: "250 g",
    category: "decaf",
    origin: { country: "Colombia", region: "Cauca", producer: "Smallholder group" },
    process: "Sugarcane E.A. decaf",
    variety: "Castillo · Caturra",
    altitude: "1,500 – 1,800 m",
    harvest: "Year-round",
    roast: 3,
    notes: ["Milk chocolate", "Almond", "Soft date"],
    brew: [
      { method: "Espresso", ratio: "1 : 2", temp: "94 °C", time: "0:30" },
      { method: "V60 pour over", ratio: "1 : 15", temp: "93 °C", time: "2:50" },
      { method: "French press", ratio: "1 : 13", temp: "95 °C", time: "4:00" },
    ],
    accent: "#75703c",
    accentDeep: "#544f27",
    tint: "#ebe6ce",
    motif: "leaves",
  },
];

export function getProduct(slug: string | undefined): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function relatedProducts(product: Product, count = 3): Product[] {
  const sameCat = PRODUCTS.filter((p) => p.id !== product.id && p.category === product.category);
  const rest = PRODUCTS.filter((p) => p.id !== product.id && p.category !== product.category);
  return [...sameCat, ...rest].slice(0, count);
}
