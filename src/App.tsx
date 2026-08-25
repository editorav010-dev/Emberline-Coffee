import { useEffect, useState } from "react";
import { Link, useRoute } from "./lib/router";
import { prefersReducedMotion } from "./lib/utils";
import { ScrollProgressBar } from "./lib/scrollMotion";
import { ToastProvider } from "./state/ToastContext";
import { CartProvider } from "./state/CartContext";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { CartDrawer } from "./components/CartDrawer";
import { LoadingScreen } from "./components/LoadingScreen";
import { Button } from "./components/ui";
import { Home } from "./pages/Home";
import { Shop } from "./pages/Shop";
import { ProductDetail } from "./pages/ProductDetail";
import { Checkout } from "./pages/Checkout";
import { Confirmation } from "./pages/Confirmation";

type Boot = "show" | "leave" | "done";

export default function App() {
  const route = useRoute();
  const [boot, setBoot] = useState<Boot>("show");

  // brief branded loading pass — never artificially long
  useEffect(() => {
    const reduced = prefersReducedMotion();
    const t1 = window.setTimeout(() => setBoot("leave"), reduced ? 300 : 1200);
    const t2 = window.setTimeout(() => setBoot("done"), reduced ? 450 : 1750);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, []);

  // scroll to top on page change + document titles
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
    const titles: Record<string, string> = {
      "/": "Emberline — Small-Batch Specialty Coffee",
      "/shop": "The Coffee Shelf — Emberline",
      "/coffee": "Coffee — Emberline",
      "/checkout": "Checkout — Emberline",
      "/order": "Order Confirmed — Emberline",
    };
    document.title = titles[`/${route.parts[0] ?? ""}`] ?? titles["/"];
  }, [route.path, route.parts]);

  const page = (() => {
    switch (route.parts[0] ?? "") {
      case "":
        return <Home />;
      case "shop":
        return <Shop />;
      case "coffee":
        return <ProductDetail slug={route.parts[1]} />;
      case "checkout":
        return <Checkout />;
      case "order":
        return <Confirmation refId={route.parts[1]} />;
      default:
        return <NotFound />;
    }
  })();

  return (
    <ToastProvider>
      <CartProvider>
        {boot !== "done" ? <LoadingScreen leaving={boot === "leave"} /> : null}
        <ScrollProgressBar />
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main key={route.path} id="main" className="page-enter flex-1">
            {page}
          </main>
          <Footer />
        </div>
        <CartDrawer />
      </CartProvider>
    </ToastProvider>
  );
}

function NotFound() {
  return (
    <div className="mx-auto max-w-lg px-4 py-28 text-center">
      <p className="font-display text-6xl font-semibold text-caramel/60">404</p>
      <h1 className="mt-4 font-display text-3xl font-semibold text-ink">This page got over-extracted.</h1>
      <p className="mt-3 text-sm leading-relaxed text-cocoa">Whatever was here has been composted. The shelf, however, is very much alive.</p>
      <Link to="/" className="mt-8 inline-flex">
        <Button variant="primary" tabIndex={-1}>
          Back to the roastery
        </Button>
      </Link>
    </div>
  );
}
