# Emberline Coffee - Small-Batch Specialty Coffee E-commerce

A modern, responsive e-commerce web application for Emberline Roasting Co., showcasing their specialty coffee offerings. Built with React, TypeScript, and Vite, featuring smooth animations, intuitive navigation, and a seamless shopping experience.

## 🌟 Features

- **Product Catalog**: Browse six expertly curated specialty coffees with detailed origin stories, tasting notes, and brewing guides
- **Interactive Shopping Cart**: Add/remove items, view cart totals, and persistent cart state
- **Product Detail Pages**: Deep-dive views for each coffee with origin information, roast level, and brewing recommendations
- **Checkout Flow**: Multi-step checkout with form validation and order confirmation
- **Responsive Design**: Optimized for mobile, tablet, and desktop viewing
- **Smooth Animations**: Framer Motion-powered transitions and micro-interactions
- **Loading Screen**: Branded initial load experience with progress indication
- **Scroll Progress Bar**: Visual indicator of page scroll position
- **Toast Notifications**: User feedback for cart actions and system messages
- **SEO Friendly**: Proper meta tags, titles, and semantic HTML structure

## 🛠️ Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion
- **Routing**: Custom lightweight router
- **State Management**: React Context API (Cart, Toast)
- **Icons**: Lucide React
- **Data Visualization**: Recharts (for potential future analytics)
- **Drag & Drop**: @dnd-kit (for potential future features)
- **Confetti**: Canvas-confetti (for celebration effects)
- **Date Handling**: date-fns
- **UUID**: uuid (for product and order IDs)
- **Backend**: Supabase (configured but not fully implemented in this preview)

## 📁 Project Structure

```
emberline-coffee/
├── src/
│   ├── App.tsx          # Main application component with routing
│   ├── main.tsx         # React entry point
│   ├── index.css        # Global styles and Tailwind directives
│   │
│   ├── components/      # Reusable UI components
│   │   ├── Navbar.tsx           # Site navigation
│   │   ├── Footer.tsx           # Site footer
│   │   ├── CartDrawer.tsx       # Slide-out cart panel
│   │   ├── ProductCard.tsx      # Product display card
│   │   ├── LoadingScreen.tsx    # Initial load animation
│   │   ├── ui.tsx               # Shared UI primitives (Button, etc.)
│   │   ├── illustrations.tsx    # Decorative SVG illustrations
│   │   ├── Lineup.tsx           # Product showcase component
│   │   ├── Reveal.tsx           # Scroll-reveal animation wrapper
│   │   └── icons.tsx            # Custom SVG icons
│   │
│   ├── pages/           # Page components
│   │   ├── Home.tsx         # Landing page with hero and featured products
│   │   ├── Shop.tsx         # Full product catalog with filtering
│   │   ├── ProductDetail.tsx# Individual product detail view
│   │   ├── Checkout.tsx     # Checkout form and processing
│   │   └── Confirmation.tsx # Order confirmation page
│   │
│   ├── data/            # Product data and types
│   │   └── products.ts    # Coffee product catalog with rich metadata
│   │
│   ├── lib/             # Utilities and helpers
│   │   ├── router.tsx     # Custom client-side router
│   │   ├── utils.ts       # Helper functions (prefersReducedMotion, etc.)
│   │   ├── scrollMotion.ts# Scroll progress bar logic
│   │   └── order.ts       # Order processing utilities
│   │
│   └── state/           # React Context providers
│       ├── CartContext.tsx    # Shopping cart state management
│       └── ToastContext.tsx   # Global toast notification system
│
├── dist/                # Production build output
├── public/              # Static assets (none in this version)
├── node_modules/        # Dependencies
├── .gitignore           # Git ignore rules
├── package.json         # Project dependencies and scripts
├── tsconfig.json        # TypeScript configuration
├── vite.config.js       # Vite configuration
├── vercel.json          # Vercel deployment configuration
└── README.md            # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn or pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/editorav010-dev/Emberline-Coffee.git
   cd Emberline-Coffee
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser to `http://localhost:5173` (or the URL shown in the terminal)

### Building for Production

```bash
npm run build
```

The production-ready files will be generated in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## 📦 Deployment

This project is configured for easy deployment to Vercel:

1. Install Vercel CLI (if not already installed):
   ```bash
   npm i -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   vercel
   ```

   Or for direct production deployment:
   ```bash
   vercel --prod
   ```

Alternatively, you can deploy to any static hosting service by uploading the contents of the `dist/` folder after running `npm run build`.

## ☕ About Emberline Coffee

Emberline Roasting Co. is a fictional small-batch specialty coffee roaster based in Portland, OR. This prototype showcases:
- Six distinct coffee offerings from different origins
- Detailed product information including altitude, process, variety, and harvest
- Custom brewing guides for each coffee
- Brand-focused design with earthy color palette and thoughtful typography
- Educational storytelling about coffee origins and craftsmanship

## 🎨 Design Notes

- **Color Palette**: Inspired by coffee beans and roasting - deep blacks, rich browns, and caramel accents
- **Typography**: 
  - Headings: Fraunces (display-friendly, high contrast)
  - Body: Space Grotesk (clean, highly readable)
- **Motion**: Purposeful animations that enhance rather than distract
- **Accessibility**: Semantic HTML, proper contrast ratios, and keyboard navigation considerations

## 🔧 Development

### Linting & Formatting

This project relies on editor configuration and manual code quality. Consider adding ESLint and Prettier for team development.

### Type Checking

```bash
npm run typecheck
```

## 📱 Responsive Breakpoints

- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## 🙏 Acknowledgments

- Coffee knowledge and terminology inspired by specialty coffee industry standards
- Product information crafted to represent realistic specialty coffee offerings
- Icons provided by [Lucide](https://lucide.dev)
- Animations powered by [Framer Motion](https://www.framer.com/motion/)
- Styling with [Tailwind CSS](https://tailwindcss.com)
- Build tooling with [Vite](https://vitejs.dev)

## 📄 License

This project is a prototype/preview and currently private. For any reuse or adaptation, please contact the repository owner.

---

*Built with ☕ and code by the Emberline development team.*
