# House of Grails

> A cinematic digital experience for diecast collectors — built around rare finds, limited editions, automotive culture, events, and grail pieces.

House of Grails is a premium diecast collector storefront designed to feel more like an automotive brand and digital museum than a conventional ecommerce website.

The experience combines an interactive Porsche 911 3D hero, immersive product discovery, collector-focused collections, event showcases, community content, and a dedicated administrative CMS.

---

## ✨ Highlights

- Interactive 3D Porsche 911 hero experience
- Cinematic loading and page transitions
- Premium dark automotive-inspired UI
- Latest Drops
- Limited Editions
- Grail Vault
- Collector's Shelf
- Brand Showcase
- Daily Drop / scarcity experience
- Collector Community Wall
- Events & event-specific product collections
- Product galleries with multiple images
- Product search and search overlay
- Shopping cart
- Checkout interface
- Collector testimonials
- Responsive mobile-first experience
- Dedicated `/admin` management portal
- Product, event, brand and collection management
- Homepage CMS
- Media Library
- Persistent local data storage
- Persistent uploaded media
- SEO and OpenGraph metadata
- Product structured data
- Accessibility-focused interactions
- Reduced-motion support

---

## 🖥️ Experience

The storefront is designed around the idea that a diecast model is more than a product — it is a collectible object with history, rarity, and identity.

The visual direction combines:

- Premium automotive design
- Luxury museum aesthetics
- Modern editorial layouts
- Glassmorphism
- Cinematic motion
- Interactive 3D
- Collector culture

The Porsche 911 acts as the visual centerpiece of the homepage and introduces the site's automotive identity.

---

## 🛠️ Tech Stack

### Frontend

- **Next.js 15**
- **React**
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui**

### Animation & Interaction

- **Framer Motion**
- **GSAP**
- **Lenis**
- **Swiper**

### 3D

- **Three.js**
- **React Three Fiber**
- **Drei**
- GLB / glTF assets

### State & Data

- **Zustand**
- Server Actions
- JSON-based persistence layer
- Service/repository architecture

### Testing & QA

- Production `next build`
- `next start`
- Browser-based testing
- Playwright / Puppeteer where applicable
- Accessibility testing with axe-core

---

# 📁 Project Structure

A simplified overview:

```text
.
├── public/
│   ├── models/
│   │   └── Porsche_911.glb
│   ├── uploads/
│   └── ...
│
├── src/
│   ├── app/
│   │   ├── (site)/
│   │   │   ├── page.tsx
│   │   │   ├── product/
│   │   │   └── events/
│   │   │
│   │   └── admin/
│   │
│   ├── components/
│   │   ├── Hero3D/
│   │   ├── ProductCard/
│   │   ├── Events/
│   │   ├── GrailVault/
│   │   ├── DailyDrop/
│   │   ├── Community/
│   │   └── ...
│   │
│   ├── lib/
│   │   ├── admin/
│   │   ├── data/
│   │   ├── server/
│   │   └── ...
│   │
│   └── ...
│
├── data/
│   ├── products.json
│   ├── events.json
│   ├── brands.json
│   └── ...
│
├── .env.example
├── package.json
├── next.config.*
├── tailwind.config.*
└── README.md
